import { Vector3 } from 'three';
import { LODManager, DEFAULT_LOD_CONFIG } from '@/lib/lodSystem';

// Mock Three.js Vector3
jest.mock('three', () => ({
  Vector3: jest.fn().mockImplementation((x = 0, y = 0, z = 0) => ({
    x, y, z,
    distanceTo: jest.fn().mockImplementation((other) => {
      const dx = x - other.x;
      const dy = y - other.y; 
      const dz = z - other.z;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }),
  })),
}));

describe('LODSystem', () => {
  let manager: LODManager;

  beforeEach(() => {
    manager = new LODManager();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    manager.cleanupAll();
    jest.useRealTimers();
  });

  describe('LODManager', () => {
    it('registers vehicle configuration', () => {
      manager.registerVehicle('test-vehicle', '/models/test.gltf');
      
      const current = manager.getCurrentLevel('test-vehicle');
      expect(current).toBeTruthy();
      expect(current?.config.vehicleId).toBe('test-vehicle');
      expect(current?.config.baseModelPath).toBe('/models/test.gltf');
    });

    it('calculates distance correctly', () => {
      const camera = new Vector3(3, 4, 0);
      const target = new Vector3(0, 0, 0);
      
      const distance = manager.calculateDistance(camera, target);
      expect(distance).toBe(5); // 3-4-5 triangle
    });

    it('determines LOD level based on distance', () => {
      manager.registerVehicle('test-vehicle', '/models/test.gltf');
      
      // Test different distances
      const ultraLevel = manager.getLODLevel('test-vehicle', 2); // Very close
      expect(ultraLevel?.id).toBe('ultra');
      
      const highLevel = manager.getLODLevel('test-vehicle', 7); // Medium distance
      expect(highLevel?.id).toBe('high');
      
      const lowLevel = manager.getLODLevel('test-vehicle', 20); // Far away (in 15u+ range)
      expect(lowLevel?.id).toBe('low'); // 20 falls in 15-Infinity range = 'low' level
    });

    it('applies hysteresis to prevent rapid switching', () => {
      manager.registerVehicle('test-vehicle', '/models/test.gltf');
      
      // Start at medium distance
      const level1 = manager.getLODLevel('test-vehicle', 10);
      expect(level1?.id).toBe('medium');
      
      // Small movement should not trigger change due to hysteresis
      const level2 = manager.getLODLevel('test-vehicle', 10.5);
      expect(level2?.id).toBe('medium');
    });

    it('forces LOD level correctly', () => {
      manager.registerVehicle('test-vehicle', '/models/test.gltf');
      
      const success = manager.forceLODLevel('test-vehicle', 'low');
      expect(success).toBe(true);
      
      const current = manager.getCurrentLevel('test-vehicle');
      expect(current?.level.id).toBe('low');
    });

    it('handles unknown vehicle gracefully', () => {
      const level = manager.getLODLevel('unknown-vehicle', 10);
      expect(level).toBeNull();
    });

    it('cleans up vehicle correctly', () => {
      manager.registerVehicle('test-vehicle', '/models/test.gltf');
      expect(manager.getCurrentLevel('test-vehicle')).toBeTruthy();
      
      manager.cleanup('test-vehicle');
      expect(manager.getCurrentLevel('test-vehicle')).toBeNull();
    });

    it('provides statistics', () => {
      manager.registerVehicle('vehicle1', '/models/car1.gltf');
      manager.registerVehicle('vehicle2', '/models/car2.gltf');
      
      const stats = manager.getStatistics();
      expect(Object.keys(stats)).toHaveLength(2);
      expect(stats['vehicle1']).toBeTruthy();
      expect(stats['vehicle2']).toBeTruthy();
    });
  });

  describe('Default LOD Configuration', () => {
    it('has correct number of levels', () => {
      expect(DEFAULT_LOD_CONFIG.levels).toHaveLength(5);
    });

    it('levels are sorted by distance', () => {
      const distances = DEFAULT_LOD_CONFIG.levels.map(l => l.distance);
      for (let i = 1; i < distances.length; i++) {
        expect(distances[i]).toBeGreaterThanOrEqual(distances[i - 1]);
      }
    });

    it('has decreasing quality with distance', () => {
      const complexities = DEFAULT_LOD_CONFIG.levels.map(l => l.geometryComplexity);
      for (let i = 1; i < complexities.length; i++) {
        expect(complexities[i]).toBeLessThanOrEqual(complexities[i - 1]);
      }
    });
  });

  describe('Performance Impact', () => {
    it('calculates geometry reduction correctly', () => {
      const level = DEFAULT_LOD_CONFIG.levels.find(l => l.id === 'medium');
      expect(level).toBeTruthy();
      
      const geometryReduction = 1 - level!.geometryComplexity;
      expect(geometryReduction).toBeGreaterThan(0);
      expect(geometryReduction).toBeLessThan(1);
    });

    it('configures shadow quality appropriately', () => {
      const ultraLevel = DEFAULT_LOD_CONFIG.levels.find(l => l.id === 'ultra');
      const minimalLevel = DEFAULT_LOD_CONFIG.levels.find(l => l.id === 'minimal');
      
      expect(ultraLevel?.shadowQuality).toBe('high');
      expect(minimalLevel?.shadowQuality).toBe('none');
    });
  });
});
