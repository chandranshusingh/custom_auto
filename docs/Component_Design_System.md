# Basic UI Guide for Prototype

## 🎯 Project Context

**Auto Customizer Local Prototype** - Simple UI components for basic 3D car customization. Keep it minimal and functional.

## 🎨 Simple Design Approach

### Design Philosophy for Prototype

- **Functionality First**: Get it working before making it pretty
- **Basic Styling**: Use simple Tailwind CSS classes
- **Desktop Only**: No mobile/responsive design needed
- **No Accessibility Requirements**: Skip for prototype
- **No Complex Patterns**: Just basic HTML elements and simple React components

### Simple User Flow

1. Select car from dropdown
2. Pick color from color buttons
3. Change wheels if time permits
4. See changes in 3D view

## 🎨 Basic Styling (Keep It Simple)

### Simple Color Approach

Just use basic Tailwind classes - no custom CSS variables needed:

```typescript
// Basic color options for car customization
const carColors = [
  { name: 'Red', hex: '#ef4444', class: 'bg-red-500' },
  { name: 'Blue', hex: '#3b82f6', class: 'bg-blue-500' },
  { name: 'Green', hex: '#10b981', class: 'bg-green-500' },
  { name: 'Yellow', hex: '#f59e0b', class: 'bg-yellow-500' },
  { name: 'Purple', hex: '#8b5cf6', class: 'bg-purple-500' },
  { name: 'White', hex: '#ffffff', class: 'bg-white border' }
];

// Simple color picker component
const ColorPicker = ({ selectedColor, onColorChange }: any) => {
  return (
    <div className="flex gap-2">
      {carColors.map(color => (
        <button
          key={color.name}
          className={`w-8 h-8 rounded ${color.class} ${
            selectedColor === color.hex ? 'ring-2 ring-gray-800' : ''
          }`}
          onClick={() => onColorChange(color.hex)}
          title={color.name}
        />
      ))}
    </div>
  );
};
```

### Simple Typography

Just use default system fonts and basic Tailwind classes:

```typescript
// Simple vehicle selector dropdown
const VehicleSelector = ({ onSelect }: any) => {
  const vehicles = [
    { id: '1', name: 'Toyota Camry' },
    { id: '2', name: 'Honda Civic' },
    { id: '3', name: 'Ford Mustang' }
  ];

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        Select Vehicle:
      </label>
      <select
        className="w-full p-2 border border-gray-300 rounded"
        onChange={(e) => onSelect(vehicles[e.target.selectedIndex - 1])}
      >
        <option value="">Choose a car...</option>
        {vehicles.map(vehicle => (
          <option key={vehicle.id} value={vehicle.id}>
            {vehicle.name}
          </option>
        ))}
      </select>
    </div>
  );
};
```

## 🧩 Basic Component Approach

### Simple Component Structure

Keep components in single files with minimal abstraction:

```typescript
// Simple wheel selector
const WheelSelector = ({ selectedWheel, onWheelChange }: any) => {
  const wheels = [
    { id: 'sport', name: 'Sport Wheels' },
    { id: 'classic', name: 'Classic Wheels' },
    { id: 'racing', name: 'Racing Wheels' }
  ];

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        Select Wheels:
      </label>
      <div className="flex gap-2">
        {wheels.map(wheel => (
          <button
            key={wheel.id}
            className={`px-3 py-2 border rounded ${
              selectedWheel === wheel.id
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white border-gray-300'
            }`}
            onClick={() => onWheelChange(wheel.id)}
          >
            {wheel.name}
          </button>
        ))}
        </div>
    </div>
  );
};
```

### Simple Main Layout

Basic two-column layout with controls and 3D view:

```typescript
const App = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#ef4444');
  const [selectedWheel, setSelectedWheel] = useState('sport');

  return (
    <div className="flex h-screen">
      {/* Left panel - controls */}
      <div className="w-80 p-6 bg-gray-50 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Car Customizer</h1>

        <VehicleSelector onSelect={setSelectedCar} />

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select Color:
          </label>
          <ColorPicker
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />
        </div>

        <WheelSelector
          selectedWheel={selectedWheel}
          onWheelChange={setSelectedWheel}
        />

        <button
          className="w-full mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => console.log('Save configuration')}
        >
          Save Configuration
        </button>
      </div>

      {/* Right panel - 3D scene */}
      <div className="flex-1 bg-gray-100">
        <CarScene
          car={selectedCar}
          color={selectedColor}
          wheel={selectedWheel}
        />
      </div>
    </div>
  );
};
```

## 🎯 No Complex UI Requirements

### Skip These for Prototype:

- No design system integration
- No responsive design (desktop only)
- No accessibility requirements
- No complex state management
- No form validation
- No error boundaries
- No loading states
- No animations or transitions
- No dark mode
- No internationalization

### Basic Requirements Only:

- ✅ Simple dropdowns and buttons work
- ✅ Colors can be selected
- ✅ Basic layout shows controls and 3D view
- ✅ Components can pass data between each other
- ✅ Basic styling looks presentable

## 🎯 Getting Started

### 1. Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

### 2. Basic Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 3. Add to CSS

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Start Building

Use the component examples above and just get the basic functionality working. No need for complex design patterns or optimization!

---

**This simplified UI guide focuses on basic, functional components for prototype development. Skip all complex design system features and just build simple, working UI components.**
