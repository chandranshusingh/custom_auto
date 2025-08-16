import { IVehicle, IColor, IWheel, IExteriorAccessory } from '@/types';

type CustomizationType = 'vehicle' | 'color' | 'wheel' | 'accessories';
type CustomizationValue = IVehicle | IColor | IWheel | IExteriorAccessory[] | null;

const STORAGE_PREFIX = 'auto-customizer-';

/**
 * Saves a customization to localStorage
 * @param type - The type of customization (vehicle, color, wheels)
 * @param value - The customization value to save, or null to remove
 */
export function saveCustomization(type: CustomizationType, value: CustomizationValue): void {
  const key = `${STORAGE_PREFIX}${type}`;
  
  if (value === null) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

/**
 * Loads a customization from localStorage
 * @param type - The type of customization to load
 * @returns The loaded customization or null if not found/invalid
 */
export function loadCustomization(type: CustomizationType): CustomizationValue | null {
  const key = `${STORAGE_PREFIX}${type}`;
  
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) {
      return null;
    }
    
    return JSON.parse(stored);
  } catch (error) {
    // Handle invalid JSON gracefully
    console.warn(`Failed to load ${type} from localStorage:`, error);
    return null;
  }
}

/**
 * Clears all customizations from localStorage
 */
export function clearCustomization(): void {
  localStorage.removeItem(`${STORAGE_PREFIX}vehicle`);
  localStorage.removeItem(`${STORAGE_PREFIX}color`);
  localStorage.removeItem(`${STORAGE_PREFIX}wheel`);
  localStorage.removeItem(`${STORAGE_PREFIX}accessories`);
}

/**
 * Loads all customizations from localStorage
 * @returns Object containing all loaded customizations
 */
export function loadAllCustomizations(): {
  vehicle: IVehicle | null;
  color: IColor | null;
  wheel: IWheel | null;
  accessories: IExteriorAccessory[] | null;
} {
  return {
    vehicle: loadCustomization('vehicle') as IVehicle | null,
    color: loadCustomization('color') as IColor | null,
    wheel: loadCustomization('wheel') as IWheel | null,
    accessories: loadCustomization('accessories') as IExteriorAccessory[] | null,
  };
}

/**
 * Saves all customizations to localStorage
 * @param customizations - Object containing all customizations to save
 */
export function saveAllCustomizations(customizations: {
  vehicle: IVehicle | null;
  color: IColor | null;
  wheel: IWheel | null;
  accessories: IExteriorAccessory[] | null;
}): void {
  saveCustomization('vehicle', customizations.vehicle);
  saveCustomization('color', customizations.color);
  saveCustomization('wheel', customizations.wheel);
  saveCustomization('accessories', customizations.accessories);
}
