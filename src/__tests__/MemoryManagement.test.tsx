import { memoryManager, ManagedResource } from '@/lib/memoryManager';

describe('MemoryManager', () => {
  let mockResource: ManagedResource;

  beforeEach(() => {
    mockResource = {
      id: 'test-resource',
      type: 'texture',
      memorySize: 1024 * 1024, // 1MB
      lastAccessed: Date.now(),
      accessCount: 0,
      isEssential: false,
      dispose: jest.fn(),
    };
  });

  afterEach(() => {
    memoryManager.dispose();
  });

  it('should register and unregister a resource', () => {
    memoryManager.registerResource(mockResource);
    memoryManager.unregisterResource('test-resource');
    expect(mockResource.dispose).not.toHaveBeenCalled();
  });
});
