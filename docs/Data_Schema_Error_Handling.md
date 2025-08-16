# Basic Data Guide for Prototype

## 🎯 Project Context

**Auto Customizer Local Prototype** - Simple data handling for basic 3D car customization. Keep data structures minimal and local.

## 📊 Simple Data Structures

### Basic Vehicle Data

```typescript
// Simple vehicle structure - no complex schemas needed
interface Vehicle {
  id: string; // Simple ID like "car1", "car2"
  name: string; // "Toyota Camry", "Honda Civic"
  modelPath: string; // "/models/camry.glb"
}

// Simple color data
interface Color {
  name: string; // "Red", "Blue", "Green"
  hex: string; // "#ef4444", "#3b82f6"
}

// Simple wheel data
interface Wheel {
  id: string; // "sport", "classic", "racing"
  name: string; // "Sport Wheels", "Classic Wheels"
  modelPath?: string; // "/models/wheel-sport.glb" (if swapping models)
}

// Simple app state
interface AppState {
  selectedVehicle: Vehicle | null;
  selectedColor: string; // hex color
  selectedWheels: string; // wheel ID
}
```

## 📁 Simple Static Data Files

### Static JSON Data (No Database Needed)

Put these in `src/data/` folder:

```typescript
// src/data/vehicles.json
[
  {
    id: 'camry',
    name: 'Toyota Camry',
    modelPath: '/models/camry.glb',
  },
  {
    id: 'civic',
    name: 'Honda Civic',
    modelPath: '/models/civic.glb',
  },
  {
    id: 'mustang',
    name: 'Ford Mustang',
    modelPath: '/models/mustang.glb',
  },
];
```

```typescript
// src/data/colors.json
[
  { name: 'Red', hex: '#ef4444' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#10b981' },
  { name: 'Yellow', hex: '#f59e0b' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'White', hex: '#ffffff' },
];
```

```typescript
// src/data/wheels.json
[
  { id: 'sport', name: 'Sport Wheels' },
  { id: 'classic', name: 'Classic Wheels' },
  { id: 'racing', name: 'Racing Wheels' },
];
```

## 🔄 Simple Data Loading

### Basic Data Loading (No Complex API Needed)

```typescript
// Simple data loading functions
export const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await fetch('/data/vehicles.json');
  return response.json();
};

export const getColors = async (): Promise<Color[]> => {
  const response = await fetch('/data/colors.json');
  return response.json();
};

export const getWheels = async (): Promise<Wheel[]> => {
  const response = await fetch('/data/wheels.json');
  return response.json();
};

// Or even simpler - just hardcode the data:
export const vehicles: Vehicle[] = [
  { id: 'camry', name: 'Toyota Camry', modelPath: '/models/camry.glb' },
  { id: 'civic', name: 'Honda Civic', modelPath: '/models/civic.glb' },
  { id: 'mustang', name: 'Ford Mustang', modelPath: '/models/mustang.glb' },
];
```

## 💾 Simple Local Storage

### Basic Settings Persistence

```typescript
// Simple localStorage functions
export const saveConfiguration = (config: AppState) => {
  localStorage.setItem('carConfig', JSON.stringify(config));
};

export const loadConfiguration = (): AppState | null => {
  const saved = localStorage.getItem('carConfig');
  return saved ? JSON.parse(saved) : null;
};

// Usage in component
const [config, setConfig] = useState<AppState>({
  selectedVehicle: null,
  selectedColor: '#ef4444',
  selectedWheels: 'sport',
});

// Save when config changes
useEffect(() => {
  saveConfiguration(config);
}, [config]);

// Load on app start
useEffect(() => {
  const saved = loadConfiguration();
  if (saved) {
    setConfig(saved);
  }
}, []);
```

## ⚠️ Basic Error Handling

### Simple Error Handling (No Complex Recovery Needed)

```typescript
// Simple try/catch for 3D model loading
const CarModel = ({ modelPath }: { modelPath: string }) => {
  try {
    const { scene } = useGLTF(modelPath);
    return <primitive object={scene} />;
  } catch (error) {
    console.error('Failed to load 3D model:', error);
    return (
      <div className="p-4 text-center">
        <p>Failed to load 3D model</p>
        <p className="text-sm text-gray-500">Check browser console for details</p>
      </div>
    );
  }
};

// Simple error boundary (if you want one)
class SimpleErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  render() {
    if ((this.state as any).hasError) {
      return (
        <div className="p-4 text-center">
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 🎯 What to Skip for Prototype

### Don't Worry About:

- Complex validation schemas
- Database design
- API error handling
- User authentication
- Data migrations
- Caching strategies
- Performance optimization
- Complex state management
- Form validation
- Input sanitization
- Error recovery mechanisms
- Offline support
- Data synchronization
- Real-time updates

### Just Focus On:

- ✅ Basic data structures that work
- ✅ Simple JSON files or hardcoded data
- ✅ Basic localStorage for settings
- ✅ Simple try/catch for 3D loading
- ✅ Console logging for debugging
- ✅ Basic error messages for users

## 🚀 Getting Started

### 1. Create Basic Data

Start with hardcoded data in your components, then move to JSON files if needed:

```typescript
const App = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#ef4444');

  const cars = [
    { id: 'car1', name: 'Car 1', modelPath: '/models/car1.glb' },
    { id: 'car2', name: 'Car 2', modelPath: '/models/car2.glb' }
  ];

  // Just get it working with simple state!
  return (
    <div>
      <VehicleSelector cars={cars} onSelect={setSelectedCar} />
      <ColorPicker color={selectedColor} onChange={setSelectedColor} />
      <CarScene car={selectedCar} color={selectedColor} />
    </div>
  );
};
```

### 2. Add localStorage Later

Once basic functionality works, add simple localStorage to persist settings.

### 3. Keep It Simple

Don't over-engineer the data layer for a prototype. Focus on getting the 3D customization working!

---

**This simplified data guide focuses on minimal, functional data handling for prototype development. Skip all complex validation, error recovery, and database features - just get the basic data flow working!**
