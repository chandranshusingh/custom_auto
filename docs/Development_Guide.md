# Development Guide - Auto Customizer Local Prototype

**Document Purpose**: Simple development guide for local Windows prototype  
**Last Updated**: January 2025  
**Version**: 1.0  
**Status**: 🚧 **LOCAL PROTOTYPE** - Simple 3D customization prototype

---

## 🚀 **QUICK START (Windows)**

### **Basic Setup**

```bash
# 1. Create project
npx create-next-app@latest auto-customizer --typescript --tailwind --app
cd auto-customizer

# 2. Install 3D dependencies
npm install @react-three/fiber @react-three/drei three

# 3. Start development
npm run dev
```

### **Verify It Works**

1. Open http://localhost:3000 in browser
2. Check console for errors
3. If page loads, you're ready to start!

---

## 🛠️ **SIMPLE DEVELOPMENT ENVIRONMENT**

### **Basic Requirements**

- **OS**: Windows 10/11 (local development only)
- **Node.js**: 18.0+
- **Memory**: 4GB+ RAM (sufficient for prototype)
- **Storage**: 1GB+ free space
- **Browser**: Chrome or Firefox (any modern browser)

### **No Special Hardware Requirements**

- **Any GPU**: Use whatever you have
- **Performance**: Get it working first, optimize never (for prototype)
- **Memory**: No specific constraints

### **Simple Technology Stack**

- **Frontend**: Next.js 14+ (basic setup)
- **3D Engine**: React Three Fiber (minimal setup)
- **Language**: TypeScript (relaxed mode, any types OK)
- **Styling**: Basic Tailwind CSS
- **Testing**: Optional - manual browser testing
- **Build**: Next.js dev server only

### **Development Ports**

- **Development Server**: Port 3000 (http://localhost:3000)
- **No Other Ports**: Keep it simple

---

## 📁 **SIMPLE PROJECT STRUCTURE**

### **Basic Folder Layout (Keep It Simple)**

```
src/
├── app/                      # Next.js pages
│   ├── page.tsx              # Main page with all functionality
│   ├── globals.css           # Basic styling
│   └── layout.tsx            # Root layout
├── components/               # Simple components
│   ├── VehicleSelector.tsx   # Dropdown for car selection
│   ├── ColorPicker.tsx       # Color selection buttons
│   ├── WheelSelector.tsx     # Wheel options
│   └── CarScene.tsx          # 3D scene component
├── data/                     # Static JSON files
│   ├── vehicles.json         # List of available cars
│   ├── colors.json           # Available colors
│   └── wheels.json           # Available wheel options
├── public/                   # Static assets
│   └── models/               # .glb 3D model files
│       ├── car1.glb
│       ├── car2.glb
│       ├── wheel1.glb
│       └── wheel2.glb
└── types.ts                  # Basic type definitions
```

---

## 🔧 **TDD DEVELOPMENT APPROACH**

### **1. Test-Driven Development Process**

**Goal**: Build reliable prototype through systematic testing

```bash
# TDD development process:
npm run dev         # Start dev server
npm run test:watch  # Start test watcher (separate terminal)

# TDD Cycle:
# 1. Write failing test (RED)
# 2. Write minimum code to pass (GREEN)
# 3. Refactor while keeping tests green (REFACTOR)
# 4. Verify in browser
# 5. Commit when all tests pass
```

### **2. TDD Setup Commands**

```bash
# Development with TDD
npm run dev         # Development server (terminal 1)
npm run test:watch  # Test watcher (terminal 2)
npm run validate    # Run all quality checks before commit
```

### **3. TDD Code Examples**

```typescript
// Step 1: Define types (simple but strict)
interface Vehicle {
  id: string;
  name: string;
  modelPath: string;
}

interface VehicleSelectorProps {
  onSelect: (vehicle: Vehicle) => void;
  vehicles: Vehicle[];
}

// Step 2: Write failing test first (RED)
describe('VehicleSelector', () => {
  it('should call onSelect when vehicle is chosen', async () => {
    const mockOnSelect = jest.fn();
    const mockVehicles = [
      { id: '1', name: 'Car 1', modelPath: '/models/car1.glb' }
    ];

    render(<VehicleSelector onSelect={mockOnSelect} vehicles={mockVehicles} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '0');

    expect(mockOnSelect).toHaveBeenCalledWith(mockVehicles[0]);
  });
});

// Step 3: Write minimum code to pass test (GREEN)
const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  onSelect,
  vehicles
}) => {
  return (
    <select onChange={(e) => onSelect(vehicles[parseInt(e.target.value)])}>
      <option value="">Select a car</option>
      {vehicles.map((car, i) => (
        <option key={car.id} value={i}>
          {car.name}
        </option>
      ))}
    </select>
  );
};

// Step 4: Refactor while keeping tests green (REFACTOR)
```

### **4. TDD for 3D Components**

```typescript
// Test for 3D components (with proper mocking)
describe('CarScene', () => {
  beforeEach(() => {
    // Mock React Three Fiber components
    jest.mock('@react-three/fiber', () => ({
      Canvas: ({ children }) => <div data-testid="3d-canvas">{children}</div>
    }));
  });

  it('should render 3D canvas with car model when vehicle selected', () => {
    const mockCar = { id: '1', name: 'Car 1', modelPath: '/models/car1.glb' };

    render(<CarScene selectedCar={mockCar} color="#ff0000" />);

    expect(screen.getByTestId('3d-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('car-model')).toBeInTheDocument();
  });
});

// Properly typed 3D component
interface CarSceneProps {
  selectedCar: Vehicle | null;
  color: string;
}

const CarScene: React.FC<CarSceneProps> = ({ selectedCar, color }) => {
  return (
    <Canvas data-testid="3d-canvas">
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {selectedCar && (
        <CarModel
          modelPath={selectedCar.modelPath}
          color={color}
        />
      )}
      <OrbitControls />
    </Canvas>
  );
};

// Testable 3D model component
interface CarModelProps {
  modelPath: string;
  color: string;
}

const CarModel: React.FC<CarModelProps> = ({ modelPath, color }) => {
  const { scene } = useGLTF(modelPath);

  useEffect(() => {
    scene?.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color.set(color);
      }
    });
  }, [scene, color]);

  return scene ? (
    <primitive object={scene} data-testid="car-model" />
  ) : null;
};
```

### **4. Basic Error Handling**

```typescript
// Simple error handling - just try/catch and console.log
const CarModel = ({ modelPath, color }: any) => {
  try {
    const { scene } = useGLTF(modelPath);
    return <primitive object={scene} />;
  } catch (error) {
    console.error('Model loading error:', error);
    return <div>Error loading model</div>;
  }
};
```

---

## 🧪 **TDD TESTING (MANDATORY)**

### **Test-First Development Approach**

```bash
# TDD workflow (required for prototype)
npm run test:watch  # Keep running during development
npm run test        # Run all tests
npm run test:coverage  # Check coverage (aim for >85%)

# Quality validation before commits
npm run validate    # Runs: tsc + eslint + tests
```

### **TDD Testing Checklist**

1. **Write failing test first** (RED)
2. **Write minimum code to pass** (GREEN)
3. **Refactor while keeping tests green** (REFACTOR)
4. **Verify in browser** (visual confirmation)
5. **Commit only when all tests pass**

### **Required Test Types**

- **Component Tests**: Test component behavior and props
- **Integration Tests**: Test feature workflows
- **Mock Tests**: Mock 3D components for faster testing
- **Coverage**: Maintain >85% test coverage on core features

---

## 🎨 **BASIC DESIGN (Keep It Simple)**

### **Simple UI Approach**

- **No Design System**: Just use basic HTML elements
- **Basic Styling**: Simple Tailwind classes or plain CSS
- **Desktop Only**: No responsive design needed
- **No Accessibility**: Not required for prototype

```typescript
// Simple components - no complex patterns
const CustomizerInterface = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#ff0000');

  return (
    <div className="flex">
      {/* Left panel - controls */}
      <div className="w-64 p-4">
        <VehicleSelector onSelect={setSelectedCar} />
        <ColorPicker color={selectedColor} onChange={setSelectedColor} />
        <WheelSelector />
      </div>

      {/* Right panel - 3D scene */}
      <div className="flex-1">
        <CarScene car={selectedCar} color={selectedColor} />
      </div>
    </div>
  );
};
```

### **No Complex UI Requirements**

- No performance optimization needed
- No touch optimization
- No progressive enhancement
- Keep everything simple!

---

## 🔍 **SIMPLE DEBUGGING**

### **Basic Debugging**

```typescript
// Simple debugging - just use console.log
const CarModel = ({ modelPath, color }: any) => {
  console.log('Loading model:', modelPath, 'with color:', color);

  const { scene } = useGLTF(modelPath);
  console.log('Model loaded:', scene);

  return <primitive object={scene} />;
};
```

### **Browser Debugging**

1. **Open Dev Tools**: F12 in browser
2. **Check Console**: Look for error messages
3. **Network Tab**: See if models are loading
4. **Elements Tab**: Check if HTML elements are there

No complex debugging needed for prototype!

---

## 🚀 **LOCAL DEVELOPMENT ONLY**

### **Only Local Development Needed**

```bash
# All you need for prototype
npm run dev                   # Start development server
```

### **No Deployment Required**

- Prototype runs locally only
- No need to deploy anywhere
- No database setup needed
- Keep it simple!

---

## 🎯 **RELAXED PERFORMANCE (Prototype)**

### **Basic Performance Goals**

- **Desktop**: If it works, it's good enough
- **No Mobile**: Don't worry about mobile for prototype
- **Load Time**: As long as it loads eventually
- **No GPU Constraints**: Use whatever works
- **Model Complexity**: Any models that load are fine
- **No Optimization**: Focus on functionality first

### **No Performance Monitoring**

- No lighthouse audits needed
- No performance testing required
- Just check that it works in browser

---

## 🔐 **BASIC SECURITY (Minimal)**

### **Simple Security for Prototype**

- **Local Only**: No external security concerns
- **Basic File Checks**: Just use trusted model files
- **No Authentication**: Not needed for prototype
- **No Validation**: Keep it simple for now

```typescript
// Simple model loading - no complex validation
const CarModel = ({ modelPath }: any) => {
  // Just load the model, assume it's safe for prototype
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} />;
};
```

---

## 🛠️ **BASIC TROUBLESHOOTING**

### **Common Issues & Simple Fixes**

#### **1. 3D Model Not Showing**

- Check console for errors
- Make sure model file exists in `/public/models/`
- Try a different model file
- Check if Canvas component is rendered

#### **2. App Not Starting**

```bash
# Common fixes:
npm install          # Install dependencies
npm run dev          # Start dev server
# Check for port 3000 conflicts
```

#### **3. Console Errors**

- Open F12 developer tools
- Check Console tab for error messages
- Google the error message
- Try commenting out problematic code

#### **4. Dependencies Issues**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### **When Stuck**

1. Check browser console (F12)
2. Try restarting dev server
3. Google the error message
4. Try simplifying the code
5. Start with a working example

---

## 📚 **SIMPLE DOCUMENTATION**

### **Essential Documents**

- **[Project Master Context](./Project_Master_Context.md)** - Basic project overview
- **README.md** - How to run the prototype

### **External Resources (If Needed)**

- **[React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)** - Basic 3D setup
- **[Next.js Docs](https://nextjs.org/docs)** - Basic Next.js usage
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Basic styling

### **No Complex Documentation Needed**

- Keep docs minimal for prototype
- Focus on getting it working

---

## 🎯 **TDD SUCCESS CRITERIA**

### **Test-Driven Development Requirements**

- [ ] All features developed using TDD (RED-GREEN-REFACTOR)
- [ ] Test coverage >85% for core prototype components
- [ ] All tests pass before any commits
- [ ] TypeScript compilation with zero errors
- [ ] ESLint passes with zero warnings
- [ ] Project starts with `npm run dev` and `npm run test:watch`
- [ ] Page loads in browser without errors
- [ ] Vehicle dropdown works - **with component tests**
- [ ] 3D car model displays - **with mocked 3D tests**
- [ ] Color picker changes car color - **with integration tests**
- [ ] Wheel selector changes wheels - **with behavior tests**
- [ ] Settings save to localStorage - **with persistence tests**

### **Quality Gates (All Must Pass)**

- **Tests**: All tests green and coverage >85%
- **Types**: Zero TypeScript compilation errors
- **Linting**: Zero ESLint warnings or errors
- **Visual**: Features work correctly in browser
- **Documentation**: Tests serve as living documentation

### **TDD Benefits for Prototype**

- Faster development through clear requirements
- Fewer bugs and regression issues
- Better component design through testability
- Confidence when refactoring
- Living documentation through tests

---

**This TDD-focused development guide enables rapid, reliable prototyping through systematic testing. Test-first approach ensures quality while maintaining prototype simplicity!**
