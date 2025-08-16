/**
 * Texture Compression and Optimization System for Auto Customizer
 * Handles dynamic texture quality, compression, and memory management
 */

import { 
  Texture, 
  WebGLRenderer, 
  LinearFilter,
  ClampToEdgeWrapping
} from 'three';

export interface TextureQualitySettings {
  maxWidth: number;
  maxHeight: number;
  format: 'webp' | 'jpeg' | 'png' | 'basis';
  compressionLevel: number; // 0.0 - 1.0
  enableMipmaps: boolean;
  anisotropy: number; // 1, 2, 4, 8, 16
}

export interface TextureMemoryInfo {
  totalTextures: number;
  totalMemoryMB: number;
  compressedTextures: number;
  uncompressedTextures: number;
  largestTextureMB: number;
  oldestTextureAge: number;
}

export const TEXTURE_QUALITY_PRESETS: Record<string, TextureQualitySettings> = {
  ultra: {
    maxWidth: 2048,
    maxHeight: 2048,
    format: 'webp',
    compressionLevel: 0.9,
    enableMipmaps: true,
    anisotropy: 16,
  },
  high: {
    maxWidth: 1024,
    maxHeight: 1024,
    format: 'webp',
    compressionLevel: 0.8,
    enableMipmaps: true,
    anisotropy: 8,
  },
  medium: {
    maxWidth: 512,
    maxHeight: 512,
    format: 'webp',
    compressionLevel: 0.7,
    enableMipmaps: true,
    anisotropy: 4,
  },
  low: {
    maxWidth: 256,
    maxHeight: 256,
    format: 'jpeg',
    compressionLevel: 0.6,
    enableMipmaps: false,
    anisotropy: 2,
  },
  minimal: {
    maxWidth: 128,
    maxHeight: 128,
    format: 'jpeg',
    compressionLevel: 0.4,
    enableMipmaps: false,
    anisotropy: 1,
  },
};

export class TextureOptimizer {
  private renderer: WebGLRenderer | null = null;
  private textureRegistry = new Map<string, {
    texture: Texture;
    originalSize: number;
    compressedSize: number;
    lastAccessed: number;
    quality: keyof typeof TEXTURE_QUALITY_PRESETS;
  }>();
  private memoryBudgetMB: number = 500; // 500MB default budget
  private compressionCanvas: HTMLCanvasElement | undefined;
  private compressionContext: CanvasRenderingContext2D | undefined;

  constructor(memoryBudgetMB: number = 500) {
    this.memoryBudgetMB = memoryBudgetMB;
    
    // Only initialize canvas in browser environment
    if (typeof document !== 'undefined') {
      this.compressionCanvas = document.createElement('canvas');
      this.compressionContext = this.compressionCanvas.getContext('2d')!;
    }
  }

  /**
   * Set the WebGL renderer for hardware-specific optimizations
   */
  public setRenderer(renderer: WebGLRenderer): void {
    this.renderer = renderer;
  }

  /**
   * Optimize texture based on quality settings
   */
  public async optimizeTexture(
    originalTexture: Texture,
    qualityPreset: keyof typeof TEXTURE_QUALITY_PRESETS,
    textureId: string
  ): Promise<Texture> {
    const settings = TEXTURE_QUALITY_PRESETS[qualityPreset];
    const startTime = performance.now();

    try {
      // Check if we already have this texture optimized
      const existing = this.textureRegistry.get(`${textureId}_${qualityPreset}`);
      if (existing) {
        existing.lastAccessed = Date.now();
        console.log(`📦 Using cached optimized texture: ${textureId} (${qualityPreset})`);
        return existing.texture;
      }

      console.log(`🔄 Optimizing texture: ${textureId} for ${qualityPreset} quality`);

      // Get original texture data
      const canvas = this.getTextureCanvas();
      const originalSize = this.calculateTextureMemorySize(canvas.width, canvas.height, 4);

      // Apply quality settings
      const optimizedCanvas = await this.applyCompressionSettings(canvas, settings);
      const optimizedTexture = this.createTextureFromCanvas(optimizedCanvas, settings);

      // Calculate compressed size
      const compressedSize = this.calculateTextureMemorySize(
        optimizedCanvas.width,
        optimizedCanvas.height,
        4
      );

      // Register the optimized texture
      this.textureRegistry.set(`${textureId}_${qualityPreset}`, {
        texture: optimizedTexture,
        originalSize,
        compressedSize,
        lastAccessed: Date.now(),
        quality: qualityPreset,
      });

      const optimizationTime = performance.now() - startTime;
      const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

      console.log(`✅ Texture optimized: ${textureId}`, {
        quality: qualityPreset,
        originalSize: `${(originalSize / 1024 / 1024).toFixed(2)}MB`,
        compressedSize: `${(compressedSize / 1024 / 1024).toFixed(2)}MB`,
        saved: `${compressionRatio}%`,
        time: `${optimizationTime.toFixed(1)}ms`,
      });

      // Check memory budget and cleanup if needed
      await this.enforceMemoryBudget();

      return optimizedTexture;
    } catch (error) {
      console.warn(`⚠️ Texture optimization failed for ${textureId}:`, error);
      return originalTexture; // Fallback to original texture
    }
  }

  /**
   * Batch optimize multiple textures
   */
  public async optimizeTexturesBatch(
    textures: Array<{ texture: Texture; id: string; quality: keyof typeof TEXTURE_QUALITY_PRESETS }>
  ): Promise<Texture[]> {
    const optimized: Texture[] = [];
    
    for (const { texture, id, quality } of textures) {
      const optimizedTexture = await this.optimizeTexture(texture, quality, id);
      optimized.push(optimizedTexture);
    }
    
    return optimized;
  }

  /**
   * Get texture from canvas element
   */
  private getTextureCanvas(): HTMLCanvasElement {
    if (typeof document === 'undefined') {
      // Return a minimal canvas-like object for SSR
      return {} as HTMLCanvasElement;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // For now, create a placeholder canvas
    // In a real implementation, you'd extract the image data from the texture
    canvas.width = 512;
    canvas.height = 512;
    
    // Fill with a gradient to simulate texture data
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#cccccc');
    gradient.addColorStop(1, '#ffffff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return canvas;
  }

  /**
   * Apply compression settings to canvas
   */
  private async applyCompressionSettings(
    originalCanvas: HTMLCanvasElement,
    settings: TextureQualitySettings
  ): Promise<HTMLCanvasElement> {
    // Return original canvas if not in browser environment
    if (typeof document === 'undefined' || !this.compressionCanvas || !this.compressionContext) {
      return originalCanvas;
    }

    const { maxWidth, maxHeight, compressionLevel, format } = settings;

    // Calculate new dimensions while maintaining aspect ratio
    const aspectRatio = originalCanvas.width / originalCanvas.height;
    let newWidth = Math.min(originalCanvas.width, maxWidth);
    let newHeight = Math.min(originalCanvas.height, maxHeight);

    if (newWidth / newHeight > aspectRatio) {
      newWidth = newHeight * aspectRatio;
    } else {
      newHeight = newWidth / aspectRatio;
    }

    // Resize canvas
    this.compressionCanvas.width = newWidth;
    this.compressionCanvas.height = newHeight;

    // Use high-quality scaling
    this.compressionContext.imageSmoothingEnabled = true;
    this.compressionContext.imageSmoothingQuality = 'high';
    
    this.compressionContext.drawImage(
      originalCanvas,
      0, 0, originalCanvas.width, originalCanvas.height,
      0, 0, newWidth, newHeight
    );

    // Apply format-specific compression
    if (format === 'webp') {
      // WebP compression (if supported)
      const webpBlob = await this.canvasToBlob(this.compressionCanvas, 'image/webp', compressionLevel);
      if (webpBlob) {
        return this.blobToCanvas(webpBlob);
      }
    } else if (format === 'jpeg') {
      const jpegBlob = await this.canvasToBlob(this.compressionCanvas, 'image/jpeg', compressionLevel);
      if (jpegBlob) {
        return this.blobToCanvas(jpegBlob);
      }
    }

    // Fallback to current canvas
    if (typeof document === 'undefined') {
      return originalCanvas;
    }
    
    const result = document.createElement('canvas');
    const ctx = result.getContext('2d')!;
    result.width = this.compressionCanvas!.width;
    result.height = this.compressionCanvas!.height;
    ctx.drawImage(this.compressionCanvas!, 0, 0);
    
    return result;
  }

  /**
   * Create Three.js texture from canvas
   */
  private createTextureFromCanvas(canvas: HTMLCanvasElement, settings: TextureQualitySettings): Texture {
    const newTexture = new Texture(canvas);
    
    // Apply quality settings
    newTexture.generateMipmaps = settings.enableMipmaps;
    newTexture.minFilter = settings.enableMipmaps ? LinearFilter : LinearFilter;
    newTexture.magFilter = LinearFilter;
    newTexture.wrapS = ClampToEdgeWrapping;
    newTexture.wrapT = ClampToEdgeWrapping;

    // Set anisotropy if renderer is available
    if (this.renderer) {
      const maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();
      newTexture.anisotropy = Math.min(settings.anisotropy, maxAnisotropy);
    }

    newTexture.needsUpdate = true;
    return newTexture;
  }

  /**
   * Calculate texture memory usage
   */
  private calculateTextureMemorySize(width: number, height: number, channels: number): number {
    // Basic calculation: width * height * channels * bytes_per_channel
    // This is simplified - real calculation depends on format, mipmaps, etc.
    return width * height * channels;
  }

  /**
   * Enforce memory budget by cleaning up old textures
   */
  private async enforceMemoryBudget(): Promise<void> {
    const memoryInfo = this.getMemoryInfo();
    
    if (memoryInfo.totalMemoryMB > this.memoryBudgetMB) {
      console.warn(`🧹 Memory budget exceeded: ${memoryInfo.totalMemoryMB.toFixed(1)}MB > ${this.memoryBudgetMB}MB`);
      
      // Sort by last accessed time (oldest first)
      const entries = Array.from(this.textureRegistry.entries())
        .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);
      
      let freedMemoryMB = 0;
      const targetReduction = memoryInfo.totalMemoryMB - this.memoryBudgetMB * 0.8; // Leave 20% buffer
      
      for (const [key, entry] of entries) {
        if (freedMemoryMB >= targetReduction) break;
        
        // Dispose the texture
        entry.texture.dispose();
        
        freedMemoryMB += entry.compressedSize / 1024 / 1024;
        this.textureRegistry.delete(key);
        
        console.log(`🗑️ Freed texture: ${key} (${(entry.compressedSize / 1024 / 1024).toFixed(2)}MB)`);
      }
      
      console.log(`✅ Memory cleanup complete: freed ${freedMemoryMB.toFixed(1)}MB`);
    }
  }

  /**
   * Get current texture memory information
   */
  public getMemoryInfo(): TextureMemoryInfo {
    let totalMemory = 0;
    let compressedCount = 0;
    let largestSize = 0;
    let oldestAccess = Date.now();

    Array.from(this.textureRegistry.values()).forEach((entry) => {
      totalMemory += entry.compressedSize;
      compressedCount++;
      largestSize = Math.max(largestSize, entry.compressedSize);
      oldestAccess = Math.min(oldestAccess, entry.lastAccessed);
    });

    return {
      totalTextures: this.textureRegistry.size,
      totalMemoryMB: totalMemory / 1024 / 1024,
      compressedTextures: compressedCount,
      uncompressedTextures: 0, // We optimize all textures
      largestTextureMB: largestSize / 1024 / 1024,
      oldestTextureAge: Date.now() - oldestAccess,
    };
  }

  /**
   * Clear all cached textures
   */
  public clearCache(): void {
    Array.from(this.textureRegistry.values()).forEach((entry) => {
      entry.texture.dispose();
    });
    this.textureRegistry.clear();
    console.log('🧹 Texture cache cleared');
  }

  /**
   * Update memory budget
   */
  public setMemoryBudget(memoryBudgetMB: number): void {
    this.memoryBudgetMB = memoryBudgetMB;
    this.enforceMemoryBudget(); // Immediately enforce new budget
  }

  /**
   * Utility: Convert canvas to blob
   */
  private canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob | null> {
    return new Promise((resolve) => {
      canvas.toBlob(resolve, type, quality);
    });
  }

  /**
   * Utility: Convert blob to canvas
   */
  private async blobToCanvas(blob: Blob): Promise<HTMLCanvasElement> {
    if (typeof document === 'undefined') {
      // Return a minimal canvas-like object for SSR
      return {} as HTMLCanvasElement;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  }
}

// Export singleton instance
export const textureOptimizer = new TextureOptimizer(500); // 500MB default budget

// React hook for texture optimization  
import React from 'react';

export const useTextureOptimization = (memoryBudgetMB: number = 500) => {
  const optimizer = textureOptimizer;
  
  React.useEffect(() => {
    optimizer.setMemoryBudget(memoryBudgetMB);
  }, [memoryBudgetMB, optimizer]);

  return {
    optimizeTexture: optimizer.optimizeTexture.bind(optimizer),
    optimizeBatch: optimizer.optimizeTexturesBatch.bind(optimizer),
    getMemoryInfo: optimizer.getMemoryInfo.bind(optimizer),
    clearCache: optimizer.clearCache.bind(optimizer),
    setMemoryBudget: optimizer.setMemoryBudget.bind(optimizer),
  };
};
