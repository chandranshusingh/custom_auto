/**
 * React Hook for Level of Detail (LOD) Management
 */

import { useEffect, useState, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { LODLevel, LODConfiguration, lodManager, registerVehicleLOD, updateVehicleLOD } from '@/lib/lodSystem';

export interface LODStatistic {
  currentLevel: string;
  distance: number;
  config: LODConfiguration;
}

export interface UseLODOptions {
  vehicleId: string;
  baseModelPath: string;
  customConfig?: Partial<LODConfiguration>;
  onLevelChange?: (newLevel: LODLevel, oldLevelId: string) => void;
  updateInterval?: number; // How often to check LOD (in frames, default: every frame)
  enableDebug?: boolean;
}

export interface LODState {
  currentLevel: LODLevel | null;
  distance: number;
  isTransitioning: boolean;
  statistics: {
    levelChanges: number;
    averageDistance: number;
    lastUpdate: number;
  };
}

export const useLOD = ({
  vehicleId,
  baseModelPath,
  customConfig,
  onLevelChange,
  updateInterval = 1,
  enableDebug = false,
}: UseLODOptions) => {
  const { camera } = useThree();
  const [lodState, setLODState] = useState<LODState>({
    currentLevel: null,
    distance: 0,
    isTransitioning: false,
    statistics: {
      levelChanges: 0,
      averageDistance: 0,
      lastUpdate: 0,
    },
  });

  const [frameCount, setFrameCount] = useState(0);
  const [distanceHistory, setDistanceHistory] = useState<number[]>([]);

  // Register vehicle with LOD system
  useEffect(() => {
    registerVehicleLOD(vehicleId, baseModelPath, customConfig);
    
    if (enableDebug) {
      console.log(`🎯 LOD hook initialized for ${vehicleId}`);
    }

    // Cleanup on unmount
    return () => {
      lodManager.cleanup(vehicleId);
      if (enableDebug) {
        console.log(`🧹 LOD cleanup for ${vehicleId}`);
      }
    };
  }, [vehicleId, baseModelPath, customConfig, enableDebug]);

  // Handle level changes
  const handleLevelChange = useCallback((newLevel: LODLevel, oldLevelId: string) => {
    setLODState(prev => {
      const newStats = {
        ...prev.statistics,
        levelChanges: prev.statistics.levelChanges + 1,
        lastUpdate: Date.now(),
      };

      return {
        ...prev,
        currentLevel: newLevel,
        isTransitioning: false,
        statistics: newStats,
      };
    });

    if (enableDebug) {
      console.log(`🔄 LOD Level Change: ${oldLevelId} → ${newLevel.name}`, {
        distance: lodState.distance,
        complexity: newLevel.geometryComplexity,
        texRes: newLevel.textureResolution,
      });
    }

    onLevelChange?.(newLevel, oldLevelId);
  }, [onLevelChange, enableDebug, lodState.distance]);

  // Update LOD based on camera position
  useFrame(() => {
    setFrameCount(prev => prev + 1);

    // Only update at specified interval
    if (frameCount % updateInterval !== 0) {
      return;
    }

    const cameraPosition = new Vector3();
    camera.getWorldPosition(cameraPosition);
    
    const distance = cameraPosition.distanceTo(new Vector3(0, 0, 0)); // Assume model at origin

    // Update distance history for statistics
    setDistanceHistory(prev => {
      const newHistory = [...prev, distance].slice(-50); // Keep last 50 measurements
      return newHistory;
    });

    // Calculate average distance
    const averageDistance = distanceHistory.length > 0 
      ? distanceHistory.reduce((a, b) => a + b, 0) / distanceHistory.length 
      : distance;

    // Update LOD
    const newLevel = updateVehicleLOD(vehicleId, cameraPosition, handleLevelChange);

    // Update state
    setLODState(prev => ({
      ...prev,
      distance,
      currentLevel: newLevel,
      statistics: {
        ...prev.statistics,
        averageDistance,
      },
    }));
  });

  // Manual LOD level forcing (for debugging)
  const forceLODLevel = useCallback((levelId: string) => {
    const success = lodManager.forceLODLevel(vehicleId, levelId);
    if (success && enableDebug) {
      console.log(`🔧 Forced LOD level: ${levelId} for ${vehicleId}`);
    }
    return success;
  }, [vehicleId, enableDebug]);

  // Get all available LOD levels
  const getAvailableLevels = useCallback(() => {
    const current = lodManager.getCurrentLevel(vehicleId);
    return current?.config.levels || [];
  }, [vehicleId]);

  // Reset statistics
  const resetStatistics = useCallback(() => {
    setLODState(prev => ({
      ...prev,
      statistics: {
        levelChanges: 0,
        averageDistance: prev.distance,
        lastUpdate: Date.now(),
      },
    }));
    setDistanceHistory([]);
  }, []);

  return {
    ...lodState,
    getAvailableLevels,
    forceLODLevel,
    resetStatistics,
    performanceImpact: lodState.currentLevel ? {
      geometryReduction: 1 - lodState.currentLevel.geometryComplexity,
      textureReduction: 1 - lodState.currentLevel.textureResolution,
      estimatedFPSGain: (1 - lodState.currentLevel.geometryComplexity) * 20, // Rough estimate
    } : null,
  };
};

// Hook for monitoring LOD across multiple vehicles
export const useLODMonitor = (vehicleIds: string[]) => {
  const [globalStats, setGlobalStats] = useState<Record<string, LODStatistic>>({});

  useFrame(() => {
    const stats = lodManager.getStatistics();
    const relevantStats = Object.fromEntries(
      Object.entries(stats).filter(([id]) => vehicleIds.includes(id))
    );
    setGlobalStats(relevantStats);
  });

  return {
    statistics: globalStats,
    totalVehicles: vehicleIds.length,
    activeVehicles: Object.keys(globalStats).length,
  };
};
