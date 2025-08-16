/**
 * Level of Detail (LOD) System for Auto Customizer
 * Automatically switches between different model quality levels based on camera distance
 */

import { Vector3 } from 'three';

export interface LODLevel {
  id: string;
  name: string;
  distance: number; // Distance threshold
  modelPath?: string; // Optional custom model path for this LOD
  geometryComplexity: number; // 0-1, where 1 is full complexity
  textureResolution: number; // 0-1, where 1 is full resolution
  shadowQuality: 'none' | 'low' | 'medium' | 'high';
  enableReflections: boolean;
  particleCount: number; // For dust, smoke effects
}

export interface LODConfiguration {
  vehicleId: string;
  baseModelPath: string;
  levels: LODLevel[];
  transitionDuration: number; // Smooth transition time in ms
  hysteresis: number; // Distance buffer to prevent thrashing
}

// Default LOD configuration for all vehicles
export const DEFAULT_LOD_CONFIG: Omit<LODConfiguration, 'vehicleId' | 'baseModelPath'> = {
  levels: [
    {
      id: 'ultra',
      name: 'Ultra Detail',
      distance: 0, // Always show when very close
      geometryComplexity: 1.0,
      textureResolution: 1.0,
      shadowQuality: 'high',
      enableReflections: true,
      particleCount: 100,
    },
    {
      id: 'high',
      name: 'High Detail', 
      distance: 5, // Within 5 units
      geometryComplexity: 0.8,
      textureResolution: 0.8,
      shadowQuality: 'medium',
      enableReflections: true,
      particleCount: 50,
    },
    {
      id: 'medium',
      name: 'Medium Detail',
      distance: 10, // 5-10 units
      geometryComplexity: 0.6,
      textureResolution: 0.6,
      shadowQuality: 'low',
      enableReflections: false,
      particleCount: 25,
    },
    {
      id: 'low',
      name: 'Low Detail',
      distance: 15, // 10-15 units
      geometryComplexity: 0.4,
      textureResolution: 0.4,
      shadowQuality: 'none',
      enableReflections: false,
      particleCount: 0,
    },
    {
      id: 'minimal',
      name: 'Minimal Detail',
      distance: Infinity, // Beyond 15 units
      geometryComplexity: 0.2,
      textureResolution: 0.2,
      shadowQuality: 'none',
      enableReflections: false,
      particleCount: 0,
    }
  ],
  transitionDuration: 300,
  hysteresis: 1.0, // 1 unit buffer
};

export class LODManager {
  private configurations = new Map<string, LODConfiguration>();
  private currentLevels = new Map<string, string>(); // vehicleId -> currentLevelId
  private transitionTimers = new Map<string, NodeJS.Timeout>();
  private lastDistances = new Map<string, number>(); // For hysteresis
  
  /**
   * Register LOD configuration for a vehicle
   */
  public registerVehicle(vehicleId: string, baseModelPath: string, customConfig?: Partial<LODConfiguration>): void {
    const config: LODConfiguration = {
      vehicleId,
      baseModelPath,
      ...DEFAULT_LOD_CONFIG,
      ...customConfig,
    };
    
    // Sort levels by distance (ascending)
    config.levels.sort((a, b) => a.distance - b.distance);
    
    this.configurations.set(vehicleId, config);
    
    // Initialize with highest quality level
    this.currentLevels.set(vehicleId, config.levels[0].id);
    
    console.log(`🎯 LOD registered for ${vehicleId}:`, config.levels.map(l => `${l.name}@${l.distance}u`));
  }

  /**
   * Calculate distance between camera and target
   */
  public calculateDistance(cameraPosition: Vector3, targetPosition: Vector3 = new Vector3(0, 0, 0)): number {
    return cameraPosition.distanceTo(targetPosition);
  }

  /**
   * Determine appropriate LOD level based on distance
   */
  public getLODLevel(vehicleId: string, distance: number): LODLevel | null {
    const config = this.configurations.get(vehicleId);
    if (!config) {
      console.warn(`LOD configuration not found for vehicle: ${vehicleId}`);
      return null;
    }

    const lastDistance = this.lastDistances.get(vehicleId) || distance;
    const currentLevelId = this.currentLevels.get(vehicleId);
    
    // Apply hysteresis to prevent rapid switching
    let effectiveDistance = distance;
    if (currentLevelId) {
      const currentLevel = config.levels.find(l => l.id === currentLevelId);
      if (currentLevel) {
        // If moving closer, reduce threshold by hysteresis
        if (distance < lastDistance) {
          effectiveDistance = Math.max(0, distance - config.hysteresis);
        }
        // If moving farther, increase threshold by hysteresis  
        else if (distance > lastDistance) {
          effectiveDistance = distance + config.hysteresis;
        }
      }
    }

    // Find appropriate level - start from lowest quality and work up
    let selectedLevel = config.levels[config.levels.length - 1]; // Default to lowest quality
    
    for (let i = 0; i < config.levels.length; i++) {
      const level = config.levels[i];
      if (effectiveDistance >= level.distance) {
        selectedLevel = level;
        // Continue to find the highest quality level that fits the distance
      }
    }

    this.lastDistances.set(vehicleId, distance);
    
    return selectedLevel;
  }

  /**
   * Update LOD based on current camera distance
   */
  public updateLOD(vehicleId: string, cameraPosition: Vector3, onLevelChange?: (newLevel: LODLevel, oldLevel: string) => void): LODLevel | null {
    const config = this.configurations.get(vehicleId);
    if (!config) return null;

    const distance = this.calculateDistance(cameraPosition);
    const newLevel = this.getLODLevel(vehicleId, distance);
    if (!newLevel) return null;

    const currentLevelId = this.currentLevels.get(vehicleId);
    
    // Check if level needs to change
    if (newLevel.id !== currentLevelId) {
      const oldLevel = currentLevelId || 'none';
      
      console.log(`🔄 LOD transition for ${vehicleId}: ${oldLevel} → ${newLevel.name} (distance: ${distance.toFixed(1)}u)`);
      
      // Clear any existing transition timer
      const existingTimer = this.transitionTimers.get(vehicleId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Smooth transition
      if (config.transitionDuration > 0) {
        const timer = setTimeout(() => {
          this.currentLevels.set(vehicleId, newLevel.id);
          onLevelChange?.(newLevel, oldLevel);
          this.transitionTimers.delete(vehicleId);
        }, config.transitionDuration);
        
        this.transitionTimers.set(vehicleId, timer);
      } else {
        // Immediate transition
        this.currentLevels.set(vehicleId, newLevel.id);
        onLevelChange?.(newLevel, oldLevel);
      }
    }

    return newLevel;
  }

  /**
   * Get current LOD level for a vehicle
   */
  public getCurrentLevel(vehicleId: string): { level: LODLevel; config: LODConfiguration } | null {
    const config = this.configurations.get(vehicleId);
    const currentLevelId = this.currentLevels.get(vehicleId);
    
    if (!config || !currentLevelId) return null;
    
    const level = config.levels.find(l => l.id === currentLevelId);
    if (!level) return null;

    return { level, config };
  }

  /**
   * Force a specific LOD level (for debugging)
   */
  public forceLODLevel(vehicleId: string, levelId: string): boolean {
    const config = this.configurations.get(vehicleId);
    if (!config) return false;

    const level = config.levels.find(l => l.id === levelId);
    if (!level) return false;

    this.currentLevels.set(vehicleId, levelId);
    console.log(`🔧 LOD forced for ${vehicleId}: ${level.name}`);
    return true;
  }

  /**
   * Get LOD statistics
   */
  public getStatistics(): Record<string, { currentLevel: string; distance: number; config: LODConfiguration }> {
    const stats: Record<string, { currentLevel: string; distance: number; config: LODConfiguration }> = {};
    
    Array.from(this.configurations.entries()).forEach(([vehicleId, config]) => {
      const currentLevelId = this.currentLevels.get(vehicleId) || 'unknown';
      const distance = this.lastDistances.get(vehicleId) || 0;
      
      stats[vehicleId] = {
        currentLevel: currentLevelId,
        distance,
        config,
      };
    });
    
    return stats;
  }

  /**
   * Cleanup vehicle configuration
   */
  public cleanup(vehicleId: string): void {
    this.configurations.delete(vehicleId);
    this.currentLevels.delete(vehicleId);
    this.lastDistances.delete(vehicleId);
    
    const timer = this.transitionTimers.get(vehicleId);
    if (timer) {
      clearTimeout(timer);
      this.transitionTimers.delete(vehicleId);
    }
  }

  /**
   * Cleanup all configurations
   */
  public cleanupAll(): void {
    Array.from(this.transitionTimers.values()).forEach(timer => {
      clearTimeout(timer);
    });
    
    this.configurations.clear();
    this.currentLevels.clear();
    this.transitionTimers.clear();
    this.lastDistances.clear();
  }
}

// Export singleton instance
export const lodManager = new LODManager();

// Utility functions for React components
export const useLODLevel = (vehicleId: string) => {
  return lodManager.getCurrentLevel(vehicleId);
};

export const registerVehicleLOD = (vehicleId: string, baseModelPath: string, config?: Partial<LODConfiguration>) => {
  lodManager.registerVehicle(vehicleId, baseModelPath, config);
};

export const updateVehicleLOD = (vehicleId: string, cameraPosition: Vector3, onLevelChange?: (newLevel: LODLevel, oldLevel: string) => void) => {
  return lodManager.updateLOD(vehicleId, cameraPosition, onLevelChange);
};
