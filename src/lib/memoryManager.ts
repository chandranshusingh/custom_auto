/**
 * Advanced Memory Management System for Auto Customizer
 * Handles automatic cleanup, monitoring, and memory optimization
 */

export interface MemoryMetrics {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
  textureMemoryMB: number;
  geometryMemoryMB: number;
  renderTargetMemoryMB: number;
  totalManagedMemoryMB: number;
  timestamp: number;
}

interface PerformanceWithMemory extends Performance {
  memory?: {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  };
}

export interface MemoryThresholds {
  warningPercentage: number; // 70%
  criticalPercentage: number; // 85%
  emergencyPercentage: number; // 95%
}

export interface ManagedResource {
  id: string;
  type: 'texture' | 'geometry' | 'material' | 'renderTarget';
  memorySize: number; // in bytes
  lastAccessed: number;
  accessCount: number;
  isEssential: boolean; // Cannot be disposed automatically
  dispose: () => void;
}

export class MemoryManager {
  private resources = new Map<string, ManagedResource>();
  private memoryHistory: MemoryMetrics[] = [];
  private maxHistoryLength = 100;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private cleanupInProgress = false;

  private thresholds: MemoryThresholds = {
    warningPercentage: 70,
    criticalPercentage: 85,
    emergencyPercentage: 95,
  };

  private onMemoryWarning?: (metrics: MemoryMetrics) => void;
  private onMemoryCritical?: (metrics: MemoryMetrics) => void;
  private onMemoryEmergency?: (metrics: MemoryMetrics) => void;

  /**
   * Start memory monitoring
   */
  public startMonitoring(intervalMs: number = 5000): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(() => {
      this.checkMemoryStatus();
    }, intervalMs);

    console.log(`🧠 Memory monitoring started (${intervalMs}ms interval)`);
    this.checkMemoryStatus(); // Initial check
  }

  /**
   * Stop memory monitoring
   */
  public stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('🛑 Memory monitoring stopped');
    }
  }

  /**
   * Register a resource for memory management
   */
  public registerResource(resource: ManagedResource): void {
    resource.lastAccessed = Date.now();
    resource.accessCount = 0;
    this.resources.set(resource.id, resource);

    console.log(`📝 Registered ${resource.type}: ${resource.id} (${(resource.memorySize / 1024 / 1024).toFixed(2)}MB)`);
  }

  /**
   * Access a resource (updates usage tracking)
   */
  public accessResource(resourceId: string): void {
    const resource = this.resources.get(resourceId);
    if (resource) {
      resource.lastAccessed = Date.now();
      resource.accessCount++;
    }
  }

  /**
   * Unregister a resource
   */
  public unregisterResource(resourceId: string): void {
    const resource = this.resources.get(resourceId);
    if (resource) {
      this.resources.delete(resourceId);
      console.log(`❌ Unregistered ${resource.type}: ${resourceId}`);
    }
  }

  /**
   * Get current memory metrics
   */
  public getMemoryMetrics(): MemoryMetrics {
    // Return default metrics if not in browser environment
    if (typeof window === 'undefined') {
      return {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0,
        textureMemoryMB: 0,
        geometryMemoryMB: 0,
        renderTargetMemoryMB: 0,
        totalManagedMemoryMB: 0,
        timestamp: Date.now(),
      };
    }

    const performance = window.performance as PerformanceWithMemory;
    const memory = performance.memory;

    let textureMemory = 0;
    let geometryMemory = 0;
    let renderTargetMemory = 0;
    let totalManagedMemory = 0;

    Array.from(this.resources.values()).forEach((resource) => {
      totalManagedMemory += resource.memorySize;
      
      switch (resource.type) {
        case 'texture':
          textureMemory += resource.memorySize;
          break;
        case 'geometry':
          geometryMemory += resource.memorySize;
          break;
        case 'renderTarget':
          renderTargetMemory += resource.memorySize;
          break;
      }
    });

    return {
      jsHeapSizeLimit: memory?.jsHeapSizeLimit || 0,
      totalJSHeapSize: memory?.totalJSHeapSize || 0,
      usedJSHeapSize: memory?.usedJSHeapSize || 0,
      textureMemoryMB: textureMemory / 1024 / 1024,
      geometryMemoryMB: geometryMemory / 1024 / 1024,
      renderTargetMemoryMB: renderTargetMemory / 1024 / 1024,
      totalManagedMemoryMB: totalManagedMemory / 1024 / 1024,
      timestamp: Date.now(),
    };
  }

  /**
   * Check current memory status and trigger alerts if needed
   */
  private checkMemoryStatus(): void {
    const metrics = this.getMemoryMetrics();
    this.memoryHistory.push(metrics);

    // Keep history length manageable
    if (this.memoryHistory.length > this.maxHistoryLength) {
      this.memoryHistory.shift();
    }

    // Calculate memory usage percentage
    const usagePercentage = metrics.jsHeapSizeLimit > 0 
      ? (metrics.usedJSHeapSize / metrics.jsHeapSizeLimit) * 100 
      : 0;

    // Trigger alerts based on thresholds
    if (usagePercentage >= this.thresholds.emergencyPercentage) {
      console.error(`🚨 EMERGENCY: Memory usage at ${usagePercentage.toFixed(1)}%`);
      this.onMemoryEmergency?.(metrics);
      this.performEmergencyCleanup();
    } else if (usagePercentage >= this.thresholds.criticalPercentage) {
      console.warn(`⚠️ CRITICAL: Memory usage at ${usagePercentage.toFixed(1)}%`);
      this.onMemoryCritical?.(metrics);
      this.performAggressiveCleanup();
    } else if (usagePercentage >= this.thresholds.warningPercentage) {
      console.warn(`⚡ WARNING: Memory usage at ${usagePercentage.toFixed(1)}%`);
      this.onMemoryWarning?.(metrics);
      this.performGentleCleanup();
    }
  }

  /**
   * Perform gentle cleanup (remove least recently used non-essential resources)
   */
  private async performGentleCleanup(): Promise<void> {
    if (this.cleanupInProgress) return;
    this.cleanupInProgress = true;

    console.log('🧹 Performing gentle memory cleanup...');
    
    const disposableResources = Array.from(this.resources.entries())
      .filter(([, resource]) => !resource.isEssential)
      .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);

    const targetToRemove = Math.min(3, Math.ceil(disposableResources.length * 0.2));
    let removed = 0;
    let freedMemoryMB = 0;

    for (const [id, resource] of disposableResources) {
      if (removed >= targetToRemove) break;

      try {
        resource.dispose();
        freedMemoryMB += resource.memorySize / 1024 / 1024;
        this.resources.delete(id);
        removed++;
        console.log(`🗑️ Gentle cleanup: removed ${resource.type} ${id}`);
      } catch (error) {
        console.warn(`Failed to dispose resource ${id}:`, error);
      }
    }

    console.log(`✅ Gentle cleanup complete: removed ${removed} resources, freed ${freedMemoryMB.toFixed(2)}MB`);
    this.cleanupInProgress = false;
  }

  /**
   * Perform aggressive cleanup (remove more resources, including some recent ones)
   */
  private async performAggressiveCleanup(): Promise<void> {
    if (this.cleanupInProgress) return;
    this.cleanupInProgress = true;

    console.log('🔥 Performing aggressive memory cleanup...');
    
    const disposableResources = Array.from(this.resources.entries())
      .filter(([, resource]) => !resource.isEssential)
      .sort(([, a], [, b]) => {
        // Sort by access score (combines recency and frequency)
        const aScore = a.lastAccessed * 0.7 + a.accessCount * 0.3;
        const bScore = b.lastAccessed * 0.7 + b.accessCount * 0.3;
        return aScore - bScore;
      });

    const targetToRemove = Math.min(10, Math.ceil(disposableResources.length * 0.5));
    let removed = 0;
    let freedMemoryMB = 0;

    for (const [id, resource] of disposableResources) {
      if (removed >= targetToRemove) break;

      try {
        resource.dispose();
        freedMemoryMB += resource.memorySize / 1024 / 1024;
        this.resources.delete(id);
        removed++;
        console.log(`🗑️ Aggressive cleanup: removed ${resource.type} ${id}`);
      } catch (error) {
        console.warn(`Failed to dispose resource ${id}:`, error);
      }
    }

    // Force garbage collection if available
    if (typeof window !== 'undefined' && window.gc) {
      window.gc();
      console.log('♻️ Forced garbage collection');
    }

    console.log(`✅ Aggressive cleanup complete: removed ${removed} resources, freed ${freedMemoryMB.toFixed(2)}MB`);
    this.cleanupInProgress = false;
  }

  /**
   * Perform emergency cleanup (remove all non-essential resources)
   */
  private async performEmergencyCleanup(): Promise<void> {
    if (this.cleanupInProgress) return;
    this.cleanupInProgress = true;

    console.error('🚨 Performing emergency memory cleanup...');
    
    const disposableResources = Array.from(this.resources.entries())
      .filter(([, resource]) => !resource.isEssential);

    let removed = 0;
    let freedMemoryMB = 0;

    for (const [id, resource] of disposableResources) {
      try {
        resource.dispose();
        freedMemoryMB += resource.memorySize / 1024 / 1024;
        this.resources.delete(id);
        removed++;
        console.log(`🚨 Emergency cleanup: removed ${resource.type} ${id}`);
      } catch (error) {
        console.warn(`Failed to dispose resource ${id}:`, error);
      }
    }

    // Multiple garbage collection attempts
    if (typeof window !== 'undefined' && window.gc) {
      for (let i = 0; i < 3; i++) {
        window.gc();
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      console.error('♻️ Multiple forced garbage collections');
    }

    console.error(`🚨 Emergency cleanup complete: removed ${removed} resources, freed ${freedMemoryMB.toFixed(2)}MB`);
    this.cleanupInProgress = false;
  }

  /**
   * Set memory alert callbacks
   */
  public setMemoryCallbacks(callbacks: {
    onWarning?: (metrics: MemoryMetrics) => void;
    onCritical?: (metrics: MemoryMetrics) => void;
    onEmergency?: (metrics: MemoryMetrics) => void;
  }): void {
    this.onMemoryWarning = callbacks.onWarning;
    this.onMemoryCritical = callbacks.onCritical;
    this.onMemoryEmergency = callbacks.onEmergency;
  }

  /**
   * Update memory thresholds
   */
  public setThresholds(thresholds: Partial<MemoryThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
    console.log('🎯 Memory thresholds updated:', this.thresholds);
  }

  /**
   * Get memory usage statistics
   */
  public getMemoryStats(): {
    current: MemoryMetrics;
    peak: MemoryMetrics;
    average: MemoryMetrics;
    resourceBreakdown: Record<string, { count: number; memoryMB: number }>;
  } {
    const current = this.getMemoryMetrics();
    
    if (this.memoryHistory.length === 0) {
      return {
        current,
        peak: current,
        average: current,
        resourceBreakdown: {},
      };
    }

    // Find peak memory usage
    const peak = this.memoryHistory.reduce((max, metrics) => 
      metrics.usedJSHeapSize > max.usedJSHeapSize ? metrics : max
    );

    // Calculate average
    const sum = this.memoryHistory.reduce((acc, metrics) => ({
      jsHeapSizeLimit: acc.jsHeapSizeLimit + metrics.jsHeapSizeLimit,
      totalJSHeapSize: acc.totalJSHeapSize + metrics.totalJSHeapSize,
      usedJSHeapSize: acc.usedJSHeapSize + metrics.usedJSHeapSize,
      textureMemoryMB: acc.textureMemoryMB + metrics.textureMemoryMB,
      geometryMemoryMB: acc.geometryMemoryMB + metrics.geometryMemoryMB,
      renderTargetMemoryMB: acc.renderTargetMemoryMB + metrics.renderTargetMemoryMB,
      totalManagedMemoryMB: acc.totalManagedMemoryMB + metrics.totalManagedMemoryMB,
      timestamp: 0,
    }), {
      jsHeapSizeLimit: 0,
      totalJSHeapSize: 0,
      usedJSHeapSize: 0,
      textureMemoryMB: 0,
      geometryMemoryMB: 0,
      renderTargetMemoryMB: 0,
      totalManagedMemoryMB: 0,
      timestamp: 0,
    });

    const count = this.memoryHistory.length;
    const average: MemoryMetrics = {
      jsHeapSizeLimit: sum.jsHeapSizeLimit / count,
      totalJSHeapSize: sum.totalJSHeapSize / count,
      usedJSHeapSize: sum.usedJSHeapSize / count,
      textureMemoryMB: sum.textureMemoryMB / count,
      geometryMemoryMB: sum.geometryMemoryMB / count,
      renderTargetMemoryMB: sum.renderTargetMemoryMB / count,
      totalManagedMemoryMB: sum.totalManagedMemoryMB / count,
      timestamp: Date.now(),
    };

    // Resource breakdown
    const resourceBreakdown: Record<string, { count: number; memoryMB: number }> = {};
    Array.from(this.resources.values()).forEach((resource) => {
      if (!resourceBreakdown[resource.type]) {
        resourceBreakdown[resource.type] = { count: 0, memoryMB: 0 };
      }
      resourceBreakdown[resource.type].count++;
      resourceBreakdown[resource.type].memoryMB += resource.memorySize / 1024 / 1024;
    });

    return { current, peak, average, resourceBreakdown };
  }

  /**
   * Force manual cleanup
   */
  public forceCleanup(level: 'gentle' | 'aggressive' | 'emergency' = 'gentle'): Promise<void> {
    switch (level) {
      case 'gentle':
        return this.performGentleCleanup();
      case 'aggressive':
        return this.performAggressiveCleanup();
      case 'emergency':
        return this.performEmergencyCleanup();
    }
  }

  /**
   * Clear all resources (for app shutdown)
   */
  public dispose(): void {
    this.stopMonitoring();
    
    Array.from(this.resources.entries()).forEach(([id, resource]) => {
      try {
        resource.dispose();
      } catch (error) {
        console.warn(`Failed to dispose resource ${id}:`, error);
      }
    });
    
    this.resources.clear();
    this.memoryHistory = [];
    
    console.log('🧹 Memory manager disposed');
  }
}

// Export singleton instance
export const memoryManager = new MemoryManager();

// React hook for memory management
import React from 'react';

export const useMemoryManagement = () => {
  React.useEffect(() => {
    memoryManager.startMonitoring(5000);
    
    return () => {
      memoryManager.stopMonitoring();
    };
  }, []);

  return {
    registerResource: memoryManager.registerResource.bind(memoryManager),
    accessResource: memoryManager.accessResource.bind(memoryManager),
    unregisterResource: memoryManager.unregisterResource.bind(memoryManager),
    getMetrics: memoryManager.getMemoryMetrics.bind(memoryManager),
    getStats: memoryManager.getMemoryStats.bind(memoryManager),
    forceCleanup: memoryManager.forceCleanup.bind(memoryManager),
    setCallbacks: memoryManager.setMemoryCallbacks.bind(memoryManager),
    setThresholds: memoryManager.setThresholds.bind(memoryManager),
  };
};
