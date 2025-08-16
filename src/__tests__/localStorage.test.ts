import { saveCustomization, loadCustomization, clearCustomization } from '@/lib/localStorage';
import { IVehicle, IColor, IWheel } from '@/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('localStorage Integration', () => {
  const mockVehicle: IVehicle = {
    id: '1',
    name: 'Swift',
    brand: 'Maruti Suzuki',
    model: 'Swift',
    year: 2024,
    basePrice: 650000,
    modelPath: '/models/maruti-swift.glb',
    thumbnail: '/thumbnails/maruti-swift.jpg',
    category: 'hatchback',
    region: 'india',
    fuelType: 'petrol',
    transmission: 'manual',
  };

  const mockColor: IColor = {
    id: '3',
    name: 'Racing Red',
    hexCode: '#FF0000',
    price: 15000,
    category: 'premium',
    region: 'india',
  };

  const mockWheels: IWheel = {
    id: '1',
    name: 'Alloy Sport',
    brand: 'MRF',
    size: 16,
    width: 205,
    style: 'alloy',
    design: '5-spoke sport',
    finish: 'glossy',
    price: 25000,
    thumbnail: '/thumbnails/mrf-alloy-sport.jpg',
    category: 'sport',
    region: 'india',
  };

  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('saveCustomization', () => {
    it('saves vehicle selection to localStorage', () => {
      saveCustomization('vehicle', mockVehicle);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'auto-customizer-vehicle',
        JSON.stringify(mockVehicle)
      );
    });

    it('saves color selection to localStorage', () => {
      saveCustomization('color', mockColor);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'auto-customizer-color',
        JSON.stringify(mockColor)
      );
    });

    it('saves wheel selection to localStorage', () => {
      saveCustomization('wheel', mockWheels);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'auto-customizer-wheel',
        JSON.stringify(mockWheels)
      );
    });

    it('handles null values by removing from localStorage', () => {
      saveCustomization('vehicle', null);
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auto-customizer-vehicle');
    });
  });

  describe('loadCustomization', () => {
    it('loads vehicle from localStorage', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockVehicle));
      
      const result = loadCustomization('vehicle');
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('auto-customizer-vehicle');
      expect(result).toEqual(mockVehicle);
    });

    it('loads color from localStorage', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockColor));
      
      const result = loadCustomization('color');
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('auto-customizer-color');
      expect(result).toEqual(mockColor);
    });

    it('loads wheels from localStorage', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockWheels));
      
      const result = loadCustomization('wheel');
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('auto-customizer-wheels');
      expect(result).toEqual(mockWheels);
    });

    it('returns null when no data in localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = loadCustomization('vehicle');
      
      expect(result).toBeNull();
    });

    it('handles invalid JSON gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');
      
      const result = loadCustomization('vehicle');
      
      expect(result).toBeNull();
    });
  });

  describe('clearCustomization', () => {
    it('clears all customizations from localStorage', () => {
      clearCustomization();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auto-customizer-vehicle');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auto-customizer-color');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auto-customizer-wheels');
    });
  });

  describe('Integration', () => {
    it('saves and loads complete customization set', () => {
      // Mock the localStorage responses for the load operations
      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify(mockVehicle))  // For vehicle
        .mockReturnValueOnce(JSON.stringify(mockColor))    // For color
        .mockReturnValueOnce(JSON.stringify(mockWheels));  // For wheels
      
      // Save all customizations
      saveCustomization('vehicle', mockVehicle);
      saveCustomization('color', mockColor);
      saveCustomization('wheel', mockWheels);
      
      // Load all customizations
      const loadedVehicle = loadCustomization('vehicle');
      const loadedColor = loadCustomization('color');
      const loadedWheels = loadCustomization('wheel');
      
      expect(loadedVehicle).toEqual(mockVehicle);
      expect(loadedColor).toEqual(mockColor);
      expect(loadedWheels).toEqual(mockWheels);
    });

    it('persists data between operations', () => {
      // Save vehicle
      saveCustomization('vehicle', mockVehicle);
      
      // Verify it was saved
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'auto-customizer-vehicle',
        JSON.stringify(mockVehicle)
      );
      
      // Mock the getItem to return the saved data
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockVehicle));
      
      // Load vehicle
      const loadedVehicle = loadCustomization('vehicle');
      
      // Verify it was loaded
      expect(loadedVehicle).toEqual(mockVehicle);
    });
  });
});
