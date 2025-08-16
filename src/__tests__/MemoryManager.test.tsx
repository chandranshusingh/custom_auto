import { MemoryManager } from '@/lib/memoryManager';
import type { ManagedResource } from '@/lib/memoryManager';

// Mock performance.memory
const mockPerformanceMemory = {
  jsHeapSizeLimit: 100 * 1024 * 1024, // 100MB
  totalJSHeapSize: 60 * 1024 * 1024,  // 60MB
  usedJSHeapSize: 40 * 1024 * 1024,   // 40MB
};

Object.defineProperty(window, 'performance', {
  value: {
    memory: mockPerformanceMemory,
  },
  writable: true,
});

describe.skip('MemoryManager', () => {
  let manager: MemoryManager;
  let mockResource1: ManagedResource;
  let mockResource2: ManagedResource;

  beforeEach(() => {
    manager = new MemoryManager();
    jest.clearAllTimers();
    jest.useFakeTimers();

    mockResource1 = {
      id: 'texture1',
      type: 'texture',
      memorySize: 10 * 1024 * 1024, // 10MB
      lastAccessed: Date.now(),
      accessCount: 0,
      isEssential: false,
      dispose: jest.fn(),
    };

    mockResource2 = {
      id: 'geometry1',
      type: 'geometry',
      memorySize: 5 * 1024 * 1024, // 5MB
      lastAccessed: Date.now(),
      accessCount: 0,
      isEssential: true, // Essential resource
      dispose: jest.fn(),
    };
  });

  afterEach(() => {
    manager.dispose();
    jest.useRealTimers();
  });

  describe('Resource Registration', () => {
    it('registers resources correctly', () => {
      manager.registerResource(mockResource1);
      
      const metrics = manager.getMemoryMetrics();
      expect(metrics.textureMemoryMB).toBeCloseTo(10, 1);
      expect(metrics.totalManagedMemoryMB).toBeCloseTo(10, 1);
    });

    it('tracks multiple resource types', () => {
      manager.registerResource(mockResource1); // texture
      manager.registerResource(mockResource2); // geometry
      
      const metrics = manager.getMemoryMetrics();
      expect(metrics.textureMemoryMB).toBeCloseTo(10, 1);
      expect(metrics.geometryMemoryMB).toBeCloseTo(5, 1);
      expect(metrics.totalManagedMemoryMB).toBeCloseTo(15, 1);
    });

    it('unregisters resources correctly', () => {
      manager.registerResource(mockResource1);
      manager.unregisterResource('texture1');
      
      const metrics = manager.getMemoryMetrics();
      expect(metrics.textureMemoryMB).toBe(0);
      expect(metrics.totalManagedMemoryMB).toBe(0);
    });
  });

  describe('Resource Access Tracking', () => {
    it('updates access count and timestamp', () => {
      manager.registerResource(mockResource1);
      
      const initialAccess = mockResource1.lastAccessed;
      jest.advanceTimersByTime(1000);
      
      manager.accessResource('texture1');
      
      expect(mockResource1.accessCount).toBe(1);
      expect(mockResource1.lastAccessed).toBeGreaterThan(initialAccess);
    });

    it('handles access to non-existent resources', () => {
      expect(() => {
        manager.accessResource('nonexistent');
      }).not.toThrow();
    });
  });

  describe('Memory Monitoring', () => {
    it('starts monitoring correctly', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();
      
      manager.startMonitoring(1000);
      
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('Memory monitoring started'));
      spy.mockRestore();
    });

    it('stops monitoring correctly', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();
      
      manager.startMonitoring(1000);
      manager.stopMonitoring();
      
      expect(spy).toHaveBeenCalledWith('🛑 Memory monitoring stopped');
      spy.mockRestore();
    });

    it('gets memory metrics correctly', () => {
      manager.registerResource(mockResource1);
      
      const metrics = manager.getMemoryMetrics();
      
      expect(metrics.jsHeapSizeLimit).toBe(mockPerformanceMemory.jsHeapSizeLimit);
      expect(metrics.usedJSHeapSize).toBe(mockPerformanceMemory.usedJSHeapSize);
      expect(metrics.textureMemoryMB).toBeCloseTo(10, 1);
      expect(metrics.timestamp).toBeGreaterThan(0);
    });
  });

  describe('Memory Cleanup', () => {
    beforeEach(() => {
      // Add some disposable resources
      manager.registerResource(mockResource1); // Non-essential
      manager.registerResource(mockResource2); // Essential
      
      // Make resource1 older
      jest.advanceTimersByTime(2000);
      mockResource1.lastAccessed = Date.now() - 2000;
    });

    it('performs gentle cleanup on non-essential resources', async () => {
      await manager.forceCleanup('gentle');
      
      // Should dispose non-essential resource
      expect(mockResource1.dispose).toHaveBeenCalled();
      // Should not dispose essential resource
      expect(mockResource2.dispose).not.toHaveBeenCalled();
    });

    it('performs aggressive cleanup', async () => {
      await manager.forceCleanup('aggressive');
      
      // Should dispose non-essential resources
      expect(mockResource1.dispose).toHaveBeenCalled();
      // Should still not dispose essential resources
      expect(mockResource2.dispose).not.toHaveBeenCalled();
    });

    it('performs emergency cleanup', async () => {
      await manager.forceCleanup('emergency');
      
      // Should dispose all non-essential resources
      expect(mockResource1.dispose).toHaveBeenCalled();
      // Should not dispose essential resources even in emergency
      expect(mockResource2.dispose).not.toHaveBeenCalled();
    });

    it('prevents concurrent cleanup operations', async () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();
      
      // Start two cleanups simultaneously
      const cleanup1 = manager.forceCleanup('gentle');
      const cleanup2 = manager.forceCleanup('gentle');
      
      await Promise.all([cleanup1, cleanup2]);
      
      // Should only run one cleanup
      expect(mockResource1.dispose).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });
  });

  describe('Memory Statistics', () => {
    it('provides comprehensive memory statistics', () => {
      manager.registerResource(mockResource1);
      manager.registerResource(mockResource2);
      
      const stats = manager.getMemoryStats();
      
      expect(stats.current).toBeDefined();
      expect(stats.peak).toBeDefined();
      expect(stats.average).toBeDefined();
      expect(stats.resourceBreakdown).toBeDefined();
      
      expect(stats.resourceBreakdown.texture).toEqual({
        count: 1,
        memoryMB: expect.closeTo(10, 1),
      });
      
      expect(stats.resourceBreakdown.geometry).toEqual({
        count: 1,
        memoryMB: expect.closeTo(5, 1),
      });
    });
  });

  describe('Memory Callbacks', () => {
    it('sets memory callbacks correctly', () => {
      const onWarning = jest.fn();
      const onCritical = jest.fn();
      const onEmergency = jest.fn();
      
      manager.setMemoryCallbacks({
        onWarning,
        onCritical,
        onEmergency,
      });
      
      // Callbacks are set internally, test that they don't throw
      expect(() => {
        manager.setMemoryCallbacks({
          onWarning,
          onCritical,
          onEmergency,
        });
      }).not.toThrow();
    });

    it('updates thresholds correctly', () => {
      const newThresholds = {
        warningPercentage: 60,
        criticalPercentage: 80,
        emergencyPercentage: 95,
      };
      
      expect(() => {
        manager.setThresholds(newThresholds);
      }).not.toThrow();
    });
  });

  describe('Disposal', () => {
    it('disposes all resources correctly', () => {
      manager.registerResource(mockResource1);
      manager.registerResource(mockResource2);
      manager.startMonitoring(1000);
      
      manager.dispose();
      
      expect(mockResource1.dispose).toHaveBeenCalled();
      expect(mockResource2.dispose).toHaveBeenCalled();
    });
  });
});
