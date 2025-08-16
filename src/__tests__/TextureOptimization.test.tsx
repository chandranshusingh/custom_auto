import { TextureOptimizer, TEXTURE_QUALITY_PRESETS } from '@/lib/textureOptimization';
import { Texture } from 'three';

// Mock Three.js
jest.mock('three', () => ({
  Texture: jest.fn().mockImplementation(() => ({
    generateMipmaps: true,
    minFilter: 'LinearFilter',
    magFilter: 'LinearFilter',
    wrapS: 'ClampToEdgeWrapping',
    wrapT: 'ClampToEdgeWrapping',
    anisotropy: 1,
    needsUpdate: false,
    dispose: jest.fn(),
  })),
  LinearFilter: 'LinearFilter',
  ClampToEdgeWrapping: 'ClampToEdgeWrapping',
}));

// Mock WebGL renderer
const mockRenderer = {
  capabilities: {
    getMaxAnisotropy: jest.fn(() => 16),
  },
};

describe.skip('TextureOptimization', () => {
  let optimizer: TextureOptimizer;
  let mockTexture: Texture;

  beforeAll(() => {
    jest.setTimeout(30000); // Set timeout to 30 seconds for this test file
  });

  beforeEach(() => {
    optimizer = new TextureOptimizer(100); // 100MB budget for testing
    (optimizer as any).setRenderer(mockRenderer);
    
    mockTexture = new Texture();
    
    // Mock canvas and context
    const mockCanvas = document.createElement('canvas');
    mockCanvas.width = 512;
    mockCanvas.height = 512;
    
    // Mock the getTextureCanvas method
    (optimizer as any).getTextureCanvas = jest.fn(() => mockCanvas);
  });

  afterEach(() => {
    optimizer.clearCache();
  });

  describe('Quality Presets', () => {
    it('has all required quality levels', () => {
      const expectedLevels = ['ultra', 'high', 'medium', 'low', 'minimal'];
      
      for (const level of expectedLevels) {
        expect(TEXTURE_QUALITY_PRESETS[level]).toBeDefined();
        expect(TEXTURE_QUALITY_PRESETS[level].maxWidth).toBeGreaterThan(0);
        expect(TEXTURE_QUALITY_PRESETS[level].maxHeight).toBeGreaterThan(0);
        expect(TEXTURE_QUALITY_PRESETS[level].compressionLevel).toBeGreaterThan(0);
        expect(TEXTURE_QUALITY_PRESETS[level].compressionLevel).toBeLessThanOrEqual(1);
      }
    });

    it('has decreasing quality from ultra to minimal', () => {
      const levels = ['ultra', 'high', 'medium', 'low', 'minimal'] as const;
      
      for (let i = 1; i < levels.length; i++) {
        const current = TEXTURE_QUALITY_PRESETS[levels[i]];
        const previous = TEXTURE_QUALITY_PRESETS[levels[i - 1]];
        
        expect(current.maxWidth).toBeLessThanOrEqual(previous.maxWidth);
        expect(current.maxHeight).toBeLessThanOrEqual(previous.maxHeight);
        expect(current.compressionLevel).toBeLessThanOrEqual(previous.compressionLevel);
      }
    });
  });

  describe('Texture Optimization', () => {
    it('optimizes texture and returns new texture', async () => {
      const optimized = await optimizer.optimizeTexture(mockTexture, 'medium', 'test-texture');
      
      expect(optimized).toBeDefined();
      expect(optimized).toBeInstanceOf(Texture);
    });

    it('caches optimized textures', async () => {
      const textureId = 'cached-texture';
      
      // First optimization
      const optimized1 = await optimizer.optimizeTexture(mockTexture, 'high', textureId);
      
      // Second optimization should use cache
      const optimized2 = await optimizer.optimizeTexture(mockTexture, 'high', textureId);
      
      // Should return the same cached instance
      expect(optimized1).toBe(optimized2);
    });

    it('creates different textures for different quality levels', async () => {
      const textureId = 'multi-quality-texture';
      
      const ultra = await optimizer.optimizeTexture(mockTexture, 'ultra', textureId);
      const low = await optimizer.optimizeTexture(mockTexture, 'low', textureId);
      
      expect(ultra).not.toBe(low);
    });

    it('handles optimization errors gracefully', async () => {
      // Mock error in compression
      const originalMethod = (optimizer as any).applyCompressionSettings;
      (optimizer as any).applyCompressionSettings = jest.fn().mockRejectedValue(new Error('Compression failed'));
      
      const result = await optimizer.optimizeTexture(mockTexture, 'medium', 'error-texture');
      
      // Should return original texture on error
      expect(result).toBe(mockTexture);
      
      // Restore original method
      (optimizer as any).applyCompressionSettings = originalMethod;
    });
  });

  describe('Memory Management', () => {
    it('reports memory usage correctly', () => {
      const memoryInfo = optimizer.getMemoryInfo();
      
      expect(memoryInfo).toEqual({
        totalTextures: 0,
        totalMemoryMB: 0,
        compressedTextures: 0,
        uncompressedTextures: 0,
        largestTextureMB: 0,
        oldestTextureAge: expect.any(Number),
      });
    });

    it('clears cache correctly', async () => {
      // Add some textures to cache
      await optimizer.optimizeTexture(mockTexture, 'high', 'texture1');
      await optimizer.optimizeTexture(mockTexture, 'medium', 'texture2');
      
      let memoryInfo = optimizer.getMemoryInfo();
      expect(memoryInfo.totalTextures).toBeGreaterThan(0);
      
      optimizer.clearCache();
      
      memoryInfo = optimizer.getMemoryInfo();
      expect(memoryInfo.totalTextures).toBe(0);
      expect(memoryInfo.totalMemoryMB).toBe(0);
    });

    it('updates memory budget', () => {
      optimizer.setMemoryBudget(200);
      // Memory budget is internal, but we can verify it doesn't throw errors
      expect(() => optimizer.setMemoryBudget(200)).not.toThrow();
    });
  });

  describe('Batch Optimization', () => {
    it('optimizes multiple textures in batch', async () => {
      const textures = [
        { texture: mockTexture, id: 'batch1', quality: 'high' as const },
        { texture: mockTexture, id: 'batch2', quality: 'medium' as const },
        { texture: mockTexture, id: 'batch3', quality: 'low' as const },
      ];
      
      const optimized = await optimizer.optimizeTexturesBatch(textures);
      
      expect(optimized).toHaveLength(3);
      expect(optimized.every(tex => tex instanceof Texture)).toBe(true);
    });
  });

  describe('Canvas Utilities', () => {
    it('creates canvas with correct dimensions', () => {
      const canvas = (optimizer as any).getTextureCanvas(mockTexture);
      
      expect(canvas).toBeInstanceOf(HTMLCanvasElement);
      expect(canvas.width).toBeGreaterThan(0);
      expect(canvas.height).toBeGreaterThan(0);
    });
  });
});
