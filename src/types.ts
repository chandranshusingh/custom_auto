// Vehicle types
export interface IVehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  basePrice: number;
  modelPath: string;
  thumbnail: string;
  category: 'sedan' | 'suv' | 'sports' | 'luxury' | 'hatchback';
  region: 'india' | 'global';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic' | 'cvt';
  specifications?: IVehicleSpecifications;
  features?: string[];
  variants?: IVehicleVariant[] | string[];
}

// Color types
export interface IColor {
  id: string;
  name: string;
  hexCode: string;
  price: number;
  category: 'standard' | 'metallic' | 'premium' | 'special';
  region: 'india' | 'global';
}

// Wheel types
export interface IWheel {
  id: string;
  name: string;
  brand: string;
  size: number; // in inches
  width: number; // in mm
  style: 'alloy' | 'steel' | 'carbon-fiber' | 'forged';
  design: string; // spoke pattern description
  finish: 'glossy' | 'matte' | 'chrome' | 'black' | 'gunmetal';
  price: number;
  thumbnail: string;
  category: 'standard' | 'sport' | 'luxury' | 'performance';
  region: 'india' | 'global';
}

// Exterior Accessory types
export interface IExteriorAccessory {
  id: string;
  name: string;
  brand: string;
  type: 'spoiler' | 'body-kit' | 'side-skirts' | 'front-lip' | 'rear-diffuser' | 'roof-rack' | 'running-boards';
  material: 'abs-plastic' | 'carbon-fiber' | 'fiberglass' | 'aluminum';
  finish: 'painted' | 'carbon' | 'matte-black' | 'chrome';
  price: number;
  thumbnail: string;
  category: 'aesthetic' | 'aerodynamic' | 'functional';
  compatibility: string[]; // vehicle IDs this accessory is compatible with
  region: 'india' | 'global';
  description: string;
}

// Vehicle specifications
export interface IVehicleSpecifications {
  engine: string;
  power: string;
  torque: string;
  mileage: string;
  fuelCapacity: string;
  seatingCapacity: number;
  bootSpace: string;
  groundClearance: string;
  length: string;
  width: string;
  height: string;
  wheelbase: string;
}

// Vehicle variant
export interface IVehicleVariant {
  name: string;
  price: number;
}

// Indian-specific types
export interface IIndianVehicle extends IVehicle {
  region: 'india';
  variants?: IVehicleVariant[] | string[];
  mileage?: number; // km/l
  engineCapacity?: number; // cc
  power?: number; // bhp
  torque?: number; // Nm
  specifications?: IVehicleSpecifications;
  features?: string[];
  colors?: string[];
  thumbnailPath?: string;
}

// Customization state
export interface ICustomizationState {
  selectedVehicle: IVehicle | null;
  selectedColor: IColor | null;
  selectedWheels: IWheel | null;
  selectedAccessories: IExteriorAccessory[];
  totalPrice: number;
  currency: 'INR' | 'USD';
  region: 'india' | 'global';
}

// Error types (specific, not generic)
export interface IValidationError extends Error {
  field: string;
  code: string;
}

export interface IWebGLError extends Error {
  context: string;
  glError?: number;
}

export interface IModelLoadError extends Error {
  modelPath: string;
  fileType: string;
}

// API response types
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

// Event types
export interface ICustomizationEvent {
  type: 'vehicle_change' | 'color_change' | 'wheel_change';
  payload: IVehicle | IColor | IWheel;
  timestamp: Date;
}

// Indian market specific
export interface IIndianMarketData {
  exchangeRate: number; // USD to INR
  taxRates: {
    gst: number;
    roadTax: number;
    insurance: number;
  };
  popularBrands: string[];
  popularCategories: string[];
}
