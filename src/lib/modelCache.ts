/**
 * Model Cache Utility for Auto Customizer
 * Provides localStorage-based caching for 3D models to improve loading performance
 */

interface CacheEntry {
  modelPath: string;
  modelData: unknown; // GLTF model data
  timestamp: number;
  version: string;
  metadata?: {
    fileSize?: number;
    loadTime?: number;
    modelBounds?: {
      min: [number, number, number];
      max: [number, number, number];
    };
    cached?: boolean;
    loadedSuccessfully?: boolean;
  };
}

interface CacheStats {
  totalEntries: number;
  totalSize: number; // in bytes (estimated)
  hitRate: number;
  oldestEntry?: number;
  newestEntry?: number;
}

export type CacheMetadata = {
  fileSize?: number;
  loadTime?: number;
  modelBounds?: {
    min: [number, number, number];
    max: [number, number, number];
  };
};

class ModelCacheManager {
  private readonly CACHE_PREFIX = 'auto-customizer-model-';
  private readonly CACHE_VERSION = '1.0.0';
  private readonly MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
  private readonly MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB estimated
  
  private hitCount = 0;
  private missCount = 0;

  /**
   * Generate cache key for a model path
   */
  private getCacheKey(modelPath: string): string {
    return `${this.CACHE_PREFIX}${modelPath.replace(/[^a-zA-Z0-9]/g, '_')}`;
  }

  /**
   * Check if localStorage is available
   */
  private isStorageAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get cached model data
   */
  public async getCachedModel(modelPath: string): Promise<unknown | null> {
    if (!this.isStorageAvailable()) {
      this.missCount++;
      return null;
    }

    const cacheKey = this.getCacheKey(modelPath);
    
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) {
        this.missCount++;
        return null;
      }

      const entry: CacheEntry = JSON.parse(cached);
      
      // Check cache validity
      if (
        entry.version !== this.CACHE_VERSION ||
        entry.modelPath !== modelPath ||
        Date.now() - entry.timestamp > this.MAX_CACHE_AGE
      ) {
        // Invalid cache entry, remove it
        localStorage.removeItem(cacheKey);
        this.missCount++;
        return null;
      }

      this.hitCount++;
      return entry.modelData;
    } catch (error) {
      console.warn(`Model cache error for ${modelPath}:`, error);
      // Clean up corrupted entry
      try {
        localStorage.removeItem(cacheKey);
      } catch {
        // Ignore cleanup errors
      }
      this.missCount++;
      return null;
    }
  }

  /**
   * Cache model data
   */
  public async setCachedModel(
    modelPath: string, 
    modelData: unknown,
    metadata?: {
      fileSize?: number;
      loadTime?: number;
      modelBounds?: { min: [number, number, number]; max: [number, number, number] };
    }
  ): Promise<boolean> {
    if (!this.isStorageAvailable()) {
      return false;
    }

    const cacheKey = this.getCacheKey(modelPath);
    
    try {
      // Don't cache the actual model data due to circular references
      // Instead, cache metadata and mark as loaded
      const entry: CacheEntry = {
        modelPath,
        modelData: null, // Don't store the actual model to avoid circular reference issues
        timestamp: Date.now(),
        version: this.CACHE_VERSION,
        metadata: {
          ...metadata,
          cached: true,
          loadedSuccessfully: true
        }
      };

      const serialized = JSON.stringify(entry);
      
      // Check if we have enough space (rough estimation)
      if (this.getEstimatedCacheSize() + serialized.length > this.MAX_CACHE_SIZE) {
        await this.cleanOldEntries();
      }

      localStorage.setItem(cacheKey, serialized);
      return true;
    } catch (error) {
      console.warn(`Failed to cache model ${modelPath}:`, error);
      
      // If storage is full, try cleaning and retry once
      if (error instanceof DOMException && error.code === 22) {
        await this.cleanOldEntries();
        try {
          const entry: CacheEntry = {
            modelPath,
            modelData,
            timestamp: Date.now(),
            version: this.CACHE_VERSION,
            metadata
          };
          localStorage.setItem(cacheKey, JSON.stringify(entry));
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  }

  /**
   * Remove cached model
   */
  public removeCachedModel(modelPath: string): boolean {
    if (!this.isStorageAvailable()) {
      return false;
    }

    const cacheKey = this.getCacheKey(modelPath);
    
    try {
      localStorage.removeItem(cacheKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Clean old cache entries
   */
  public async cleanOldEntries(): Promise<number> {
    if (!this.isStorageAvailable()) {
      return 0;
    }

    let removedCount = 0;
    const now = Date.now();
    
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(this.CACHE_PREFIX)) {
          continue;
        }

        try {
          const cached = localStorage.getItem(key);
          if (!cached) continue;

          const entry: CacheEntry = JSON.parse(cached);
          
          // Mark for removal if expired or wrong version
          if (
            entry.version !== this.CACHE_VERSION ||
            now - entry.timestamp > this.MAX_CACHE_AGE
          ) {
            keysToRemove.push(key);
          }
        } catch {
          // Corrupted entry, mark for removal
          keysToRemove.push(key);
        }
      }

      // Remove marked entries
      for (const key of keysToRemove) {
        localStorage.removeItem(key);
        removedCount++;
      }
    } catch (error) {
      console.warn('Error cleaning cache entries:', error);
    }

    return removedCount;
  }

  /**
   * Clear all cached models
   */
  public async clearCache(): Promise<number> {
    if (!this.isStorageAvailable()) {
      return 0;
    }

    let removedCount = 0;
    
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.CACHE_PREFIX)) {
          keysToRemove.push(key);
        }
      }

      for (const key of keysToRemove) {
        localStorage.removeItem(key);
        removedCount++;
      }

      // Reset stats
      this.hitCount = 0;
      this.missCount = 0;
    } catch (error) {
      console.warn('Error clearing cache:', error);
    }

    return removedCount;
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): CacheStats {
    let totalEntries = 0;
    let totalSize = 0;
    let oldestEntry: number | undefined;
    let newestEntry: number | undefined;

    if (!this.isStorageAvailable()) {
      return {
        totalEntries: 0,
        totalSize: 0,
        hitRate: 0,
      };
    }

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(this.CACHE_PREFIX)) {
          continue;
        }

        try {
          const cached = localStorage.getItem(key);
          if (!cached) continue;

          const entry: CacheEntry = JSON.parse(cached);
          
          if (entry.version === this.CACHE_VERSION) {
            totalEntries++;
            totalSize += cached.length;
            
            if (!oldestEntry || entry.timestamp < oldestEntry) {
              oldestEntry = entry.timestamp;
            }
            if (!newestEntry || entry.timestamp > newestEntry) {
              newestEntry = entry.timestamp;
            }
          }
        } catch {
          // Ignore corrupted entries
        }
      }
    } catch (error) {
      console.warn('Error getting cache stats:', error);
    }

    const totalRequests = this.hitCount + this.missCount;
    const hitRate = totalRequests > 0 ? this.hitCount / totalRequests : 0;

    return {
      totalEntries,
      totalSize,
      hitRate,
      oldestEntry,
      newestEntry,
    };
  }

  /**
   * Get estimated cache size in bytes
   */
  private getEstimatedCacheSize(): number {
    return this.getCacheStats().totalSize;
  }

  /**
   * Check if a model is cached
   */
  public isModelCached(modelPath: string): boolean {
    if (!this.isStorageAvailable()) {
      return false;
    }

    const cacheKey = this.getCacheKey(modelPath);
    
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return false;

      const entry: CacheEntry = JSON.parse(cached);
      return (
        entry.version === this.CACHE_VERSION &&
        entry.modelPath === modelPath &&
        Date.now() - entry.timestamp <= this.MAX_CACHE_AGE
      );
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const modelCache = new ModelCacheManager();

// Export utility functions
export const getCachedModel = (modelPath: string) => modelCache.getCachedModel(modelPath);
export const setCachedModel = (modelPath: string, modelData: unknown, metadata?: CacheMetadata) => 
  modelCache.setCachedModel(modelPath, modelData, metadata);
export const removeCachedModel = (modelPath: string) => modelCache.removeCachedModel(modelPath);
export const clearModelCache = () => modelCache.clearCache();
export const getModelCacheStats = () => modelCache.getCacheStats();
export const isModelCached = (modelPath: string) => modelCache.isModelCached(modelPath);
