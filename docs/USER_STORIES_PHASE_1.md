# 🚗 Phase 1 User Stories - Auto Customizer Local MVP

**Document ID:** AC-P1-US-V1.0  
**Last Updated:** January 2025  
**Version:** 1.0.0  
**Status:** 🚧 **IN DEVELOPMENT** - Current Phase  
**Phase Duration:** Weeks 1-2  
**Total User Stories:** 4

---

## 📋 Document Cross-References & Dependencies

| Reference Type     | Document                                                                                                                 | Section                | Purpose                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ | ---------------------- | -------------------------------------------- |
| **Architecture**   | [Project Master Context](./Project_Master_Context.md#phase-1-local-mvp-prototype-weeks-1-2)                              | Phase 1 Details        | System architecture and tech stack           |
| **Development**    | [Development Guide](./Development_Guide.md#tdd-first-development-workflow)                                               | TDD Workflow           | Development methodology                      |
| **Technical**      | [Technical Development Document](../Technical%20Development%20Document.md#phase-1-local-mvp-prototype)                   | Phase 1 Implementation | Technical specifications                     |
| **Product**        | [Detailed Product Development Plan](../Detailed%20Product%20Development%20Plan.md#phase-1-local-mvp-prototype-weeks-1-2) | Phase 1 Features       | Product requirements                         |
| **Performance**    | [3D Asset & Performance Guide](./3D_Asset_Performance_Guide.md)                                                          | Intel UHD Graphics 770 | Hardware-specific performance optimization   |
| **Design System**  | [Component Design System](./Component_Design_System.md)                                                                  | UI Standards           | Design tokens, 3D UI patterns, accessibility |
| **Data Standards** | [Data Schema & Error Handling](./Data_Schema_Error_Handling.md)                                                          | Validation & Errors    | Complete data schemas and error patterns     |

---

## 🎯 Phase 1 Overview & Success Criteria

### **Phase Goal**

Convert validated HTML prototype to scalable Next.js application with 3D customization capabilities.

### **Core Technologies**

- **Frontend**: Next.js 14+, TypeScript, React Three Fiber
- **3D Engine**: React Three Fiber, Drei helpers, Three.js
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Testing**: Jest, React Testing Library
- **Storage**: JSON files, localStorage

### **Success Metrics (Intel UHD Graphics 770 Hardware Constraints)**

| Metric                           | Target                                        | Measurement Method         |
| -------------------------------- | --------------------------------------------- | -------------------------- |
| Vehicle Selection Speed          | <2s                                           | Component render time      |
| 3D Model Load Time               | <3s initial, <0.5s part swap                  | GLTF loading performance   |
| Frame Rate (Integrated Graphics) | 30 FPS min, 45 FPS comfort, 60 FPS optimal    | Performance monitoring     |
| Frame Rate (Mobile)              | 15 FPS min, 24 FPS acceptable, 30 FPS optimal | Mobile performance testing |
| GPU Memory Usage                 | <200 MB total                                 | GPU memory profiling       |
| Model Complexity                 | <15K vertices per car, <50K total             | Asset validation           |
| Test Coverage                    | >90%                                          | Jest coverage reports      |
| TypeScript Errors                | 0                                             | Compilation validation     |

**Performance Reference**: Complete hardware optimization guide in `docs/3D_Asset_Performance_Guide.md`

---

## US-P1-001: Vehicle Make/Model/Year Selection System {#vehicle-selection}

### **User Story**

**As a** car enthusiast  
**I want to** select my car's make, model, year, and trim from cascading dropdowns  
**So that** I can load the correct 3D model for customization

**Priority:** 🔴 Critical  
**Story Points:** 8  
**Sprint:** 1.1  
**Estimated Hours:** 16

### **Detailed Acceptance Criteria**

```gherkin
Feature: Vehicle Make/Model/Year Selection System

  Background:
    Given I am on the Auto Customizer homepage
    And the vehicle selection interface is loaded
    And I can see the vehicle selector panel on the left side

  Scenario: Load popular Indian car makes
    Given the vehicle selector has initialized
    When I click on the "Make" dropdown
    Then I should see exactly 8 popular Indian car makes
    And the makes should include "Maruti Suzuki", "Hyundai", "Tata Motors", "Honda"
    And the makes should be sorted alphabetically
    And each make should have a distinctive brand logo
    And the dropdown should show "Select Make" as placeholder text

  Scenario: Cascading model selection for Maruti Suzuki
    Given I have selected "Maruti Suzuki" from the make dropdown
    When the system processes the selection
    Then the model dropdown should be enabled within 500ms
    And I should see 12+ Maruti models including "Swift", "Baleno", "Dzire", "Alto"
    And each model should show a small thumbnail image
    And the model dropdown should show "Select Model" as placeholder
    And year and trim dropdowns should remain disabled

  Scenario: Year range selection for Swift
    Given I have selected make "Maruti Suzuki" and model "Swift"
    When I click on the year dropdown
    Then I should see years from 2018 to 2025
    And current year (2025) should be selected by default
    And each year should show "(Generation Info)" where applicable
    And trim dropdown should become enabled

  Scenario: Trim level selection
    Given I have selected make "Maruti Suzuki", model "Swift", year "2024"
    When I click on the trim dropdown
    Then I should see available trims: "LXi", "VXi", "ZXi", "ZXi+"
    And each trim should show key features (e.g., "ZXi - Alloy Wheels, ABS")
    And each trim should show price range indication
    And the "Load Vehicle" button should become enabled

  Scenario: Complete vehicle loading
    Given all dropdown selections are complete
    When I click the "Load Vehicle" button
    Then I should see a loading spinner with progress bar
    And loading text should update: "Loading 3D model...", "Applying materials...", "Finalizing scene..."
    And the 3D scene should initialize within 5 seconds
    And the selected vehicle should appear in the 3D viewport
    And vehicle info panel should show complete specifications

  Scenario: Invalid selection handling
    Given I try to select incompatible trim for selected year
    When the validation occurs
    Then I should see error message "This trim is not available for the selected year"
    And the system should suggest compatible alternatives
    And the "Load Vehicle" button should remain disabled
    And error state should clear when valid selection is made
```

### **Technical Implementation Details**

#### **Component Architecture**

```typescript
// Core Data Structures
interface IVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  modelPath: string; // Path to .glb file
  thumbnailPath: string; // Preview image
  specifications: IVehicleSpecs;
  availableParts: string[]; // Compatible customization parts
  priceRange: IPriceRange; // For Phase 3
}

interface IVehicleSpecs {
  engine: string;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic' | 'cvt';
  bodyType: 'hatchback' | 'sedan' | 'suv' | 'coupe';
  seatingCapacity: number;
  fuelEfficiency: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    wheelbase: number;
  };
}

interface IPriceRange {
  min: number;
  max: number;
  currency: 'INR';
}

// Component Props
interface VehicleSelectorProps {
  onVehicleSelect: (vehicle: IVehicle) => void;
  initialVehicle?: Partial<IVehicle>;
  isLoading?: boolean;
  error?: string | null;
}

interface DropdownProps {
  label: string;
  placeholder: string;
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
}
```

#### **State Management (Zustand)**

```typescript
interface VehicleSelectionStore {
  // Selection State
  selectedMake: string | null;
  selectedModel: string | null;
  selectedYear: number | null;
  selectedTrim: string | null;

  // Data State
  makes: IMake[];
  models: IModel[];
  years: number[];
  trims: ITrim[];

  // UI State
  isLoadingVehicle: boolean;
  loadingProgress: number;
  error: string | null;

  // Actions
  setMake: (make: string) => void;
  setModel: (model: string) => void;
  setYear: (year: number) => void;
  setTrim: (trim: string) => void;
  loadVehicleData: () => Promise<void>;
  resetSelection: () => void;
  validateSelection: () => boolean;
}
```

#### **Data Structure (JSON)**

```typescript
// /public/data/vehicles.json structure
{
  "makes": [
    {
      "id": "maruti-suzuki",
      "name": "Maruti Suzuki",
      "logo": "/images/brands/maruti-logo.png",
      "models": [
        {
          "id": "swift",
          "name": "Swift",
          "thumbnail": "/images/models/swift-thumb.jpg",
          "bodyType": "hatchback",
          "years": [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
          "trims": {
            "2024": [
              {
                "id": "lxi",
                "name": "LXi",
                "features": ["Basic Audio", "Manual AC", "Power Steering"],
                "modelPath": "/models/swift-2024-lxi.glb",
                "priceRange": { "min": 599000, "max": 649000 }
              }
            ]
          }
        }
      ]
    }
  ]
}
```

### **User Journey & Test Scenarios**

#### **Primary User Journey**

```typescript
// Jest Test Suite Structure
describe('Vehicle Selection User Journey', () => {
  const validUserData = {
    make: 'Maruti Suzuki',
    model: 'Swift',
    year: 2024,
    trim: 'ZXi'
  };

  beforeEach(() => {
    render(<VehicleSelector onVehicleSelect={mockCallback} />);
  });

  describe('Happy Path Journey', () => {
    it('completes full selection process successfully', async () => {
      // Step 1: Select Make
      const makeDropdown = screen.getByRole('combobox', { name: /make/i });
      await userEvent.click(makeDropdown);
      await userEvent.click(screen.getByText('Maruti Suzuki'));

      // Verify models load
      await waitFor(() => {
        expect(screen.getByRole('combobox', { name: /model/i })).not.toBeDisabled();
      });

      // Step 2: Select Model
      const modelDropdown = screen.getByRole('combobox', { name: /model/i });
      await userEvent.click(modelDropdown);
      await userEvent.click(screen.getByText('Swift'));

      // Continue through year and trim...
      // Assert final vehicle data matches expected
    });
  });
});
```

### **UI Element Specifications**

#### **Design System Components**

```typescript
// Dropdown Component Specifications
const DropdownStyles = {
  container: "relative w-full mb-4",
  trigger: `
    flex items-center justify-between w-full px-4 py-3 text-left
    bg-white border-2 border-gray-200 rounded-lg shadow-sm
    hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200
    transition-all duration-200 ease-in-out
    ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer'}
  `,
  dropdown: `
    absolute top-full left-0 w-full mt-1 bg-white border border-gray-200
    rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto
  `,
  option: `
    flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer
    transition-colors duration-150 ease-in-out
  `,
  optionSelected: "bg-blue-100 text-blue-800"
};

// Loading States
const LoadingSpinner = () => (
  <div className="flex items-center space-x-2">
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
    <span className="text-sm text-gray-600">Loading options...</span>
  </div>
);
```

### **Testing Strategy (TDD Approach)**

#### **Test-First Development Process**

```typescript
// 1. RED: Write failing tests first
describe('VehicleSelector', () => {
  it('should populate make dropdown on mount', async () => {
    render(<VehicleSelector onVehicleSelect={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /make/i })).toBeInTheDocument();
    });

    // This will fail initially - RED phase
    expect(screen.getAllByRole('option').length).toBeGreaterThan(1);
  });
});

// 2. GREEN: Write minimum code to pass
export const VehicleSelector: React.FC<VehicleSelectorProps> = ({ onVehicleSelect }) => {
  const [makes, setMakes] = useState<IMake[]>([]);

  useEffect(() => {
    // Load makes data
    loadMakes().then(setMakes);
  }, []);

  return (
    <Dropdown
      label="Make"
      options={makes.map(make => ({ label: make.name, value: make.id }))}
      // ... other props
    />
  );
};

// 3. REFACTOR: Improve while keeping tests green
```

#### **Test Coverage Requirements**

| Test Type         | Coverage Target | Key Areas                         |
| ----------------- | --------------- | --------------------------------- |
| Unit Tests        | >95%            | Component logic, state management |
| Integration Tests | >90%            | Component interactions, API calls |
| E2E Tests         | Critical paths  | Full selection workflow           |
| Performance Tests | All scenarios   | Load times, memory usage          |

### **Dependencies & Risk Mitigation**

#### **Technical Dependencies**

| Dependency             | Risk Level | Mitigation Strategy                           |
| ---------------------- | ---------- | --------------------------------------------- |
| Vehicle JSON data      | Medium     | Validate data structure, add fallbacks        |
| 3D Model files         | High       | Implement progressive loading, error handling |
| React Three Fiber      | Medium     | Version pinning, backup rendering approach    |
| TypeScript compilation | Low        | Strict configuration, continuous validation   |

#### **Feature Dependencies**

- **Dependent Features**: 3D Scene initialization depends on vehicle selection
- **Affected Features**: All Phase 2 features require vehicle data structure
- **Data Flow**: Vehicle selection → 3D model loading → Customization state

---

## US-P1-002: 3D Scene Initialization & Model Loading {#3d-scene-setup}

### **User Story**

**As a** car enthusiast  
**I want to** see my selected vehicle rendered in a realistic 3D environment  
**So that** I can view it from all angles and prepare for customization

**Priority:** 🔴 Critical  
**Story Points:** 10  
**Sprint:** 1.2  
**Estimated Hours:** 20

### **Detailed Acceptance Criteria**

```gherkin
Feature: 3D Scene Initialization & Model Loading

  Background:
    Given I have selected a complete vehicle configuration
    And the "Load Vehicle" button is enabled
    And I have clicked "Load Vehicle"

  Scenario: Initial 3D scene setup
    Given the 3D loading process has started
    When the scene initializes
    Then I should see a 3D canvas occupy 70% of the screen width
    And the canvas should have a dark gradient background
    And I should see studio-quality lighting setup
    And the camera should be positioned at optimal viewing angle
    And I should see a subtle grid floor reference

  Scenario: Progressive model loading with feedback
    Given a 3D model is being loaded
    When the loading process occurs
    Then I should see progress indicator showing "Loading model: 45%"
    And loading stages should be clearly indicated:
      - "Downloading model..." (0-30%)
      - "Processing geometry..." (30-60%)
      - "Applying materials..." (60-90%)
      - "Finalizing scene..." (90-100%)
    And estimated time remaining should be shown
    And I should be able to cancel loading if needed

  Scenario: Successful model rendering
    Given the 3D model has loaded successfully
    When the model appears in the scene
    Then the car should be centered in the viewport
    And the model should be properly scaled (realistic car size)
    And all materials should render correctly with proper lighting
    And the model should be sharp and detailed
    And I should see smooth reflections on the car surface
    And the model should cast realistic shadows on the ground

  Scenario: Interactive camera controls
    Given the 3D model is fully loaded
    When I interact with the scene
    Then I should be able to orbit around the car with mouse drag
    And I should be able to zoom in/out with mouse wheel
    And I should be able to pan the view with right-click drag
    And camera movement should be smooth with momentum
    And I should not be able to zoom through the model
    And automatic rotation should pause during interaction

  Scenario: Performance optimization
    Given the 3D scene is running
    When I monitor performance metrics
    Then frame rate should maintain 60+ FPS on desktop
    And frame rate should maintain 30+ FPS on mobile
    And memory usage should not exceed 800MB
    And CPU usage should remain below 70%
    And battery drain on mobile should be minimal

  Scenario: Error handling and fallbacks
    Given a 3D model fails to load
    When the error occurs
    Then I should see a clear error message: "Unable to load 3D model"
    And I should see a fallback placeholder car silhouette
    And I should have options to "Retry Loading" or "Select Different Vehicle"
    And error should be logged for debugging
    And the interface should remain functional
```

### **Technical Implementation Details**

#### **3D Scene Architecture**

```typescript
// Core 3D Components Structure
interface Scene3DProps {
  vehicleModel: IVehicle;
  customizationState: ICustomizationState;
  onModelLoaded: (model: Object3D) => void;
  onLoadingProgress: (progress: number) => void;
  onError: (error: Error) => void;
}

interface CameraControlsConfig {
  enableZoom: boolean;
  enablePan: boolean;
  enableRotate: boolean;
  minDistance: number;
  maxDistance: number;
  target: [number, number, number];
  position: [number, number, number];
}

interface LightingConfig {
  ambientIntensity: number;
  directionalIntensity: number;
  shadowMapSize: number;
  enableShadows: boolean;
}

// 3D Scene Component
export const CustomizerScene: React.FC<Scene3DProps> = ({
  vehicleModel,
  customizationState,
  onModelLoaded,
  onLoadingProgress,
  onError
}) => {
  return (
    <Canvas
      shadows
      camera={{ position: [4, 2, 4], fov: 45 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor('#1a1a2e');
        gl.shadowMap.type = PCFSoftShadowMap;
      }}
    >
      <React.Suspense fallback={<LoadingFallback />}>
        <SceneEnvironment />
        <VehicleModel
          modelPath={vehicleModel.modelPath}
          customization={customizationState}
          onLoaded={onModelLoaded}
          onProgress={onLoadingProgress}
          onError={onError}
        />
        <CameraControls />
        <PerformanceMonitor />
      </React.Suspense>
    </Canvas>
  );
};
```

#### **Model Loading System**

```typescript
// GLTF Loader with Progress Tracking
interface ModelLoadingState {
  progress: number;
  stage: 'downloading' | 'processing' | 'materials' | 'finalizing';
  error: Error | null;
  estimatedTime: number;
}

const VehicleModel: React.FC<VehicleModelProps> = ({
  modelPath,
  customization,
  onLoaded,
  onProgress,
  onError
}) => {
  const { scene, error } = useGLTF(modelPath, true, true, (loader) => {
    loader.onProgress = (progressEvent) => {
      const progress = (progressEvent.loaded / progressEvent.total) * 100;
      const stage = getLoadingStage(progress);
      const estimatedTime = calculateEstimatedTime(progress, Date.now() - startTime);

      onProgress({
        progress,
        stage,
        error: null,
        estimatedTime
      });
    };
  });

  // Error handling
  useEffect(() => {
    if (error) {
      console.error('Model loading error:', error);
      onError(new ModelLoadError('Failed to load 3D model', modelPath));
    }
  }, [error]);

  // Model processing and optimization
  useEffect(() => {
    if (scene) {
      optimizeModel(scene);
      applyCustomization(scene, customization);
      onLoaded(scene);
    }
  }, [scene, customization]);

  return scene ? <primitive object={scene} /> : null;
};
```

#### **Performance Optimization**

```typescript
// Performance monitoring and optimization
const PerformanceMonitor: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<IPerformanceData>({
    fps: 0,
    memory: 0,
    drawCalls: 0,
    triangles: 0,
  });

  useFrame((state) => {
    // Monitor performance metrics
    const fps = 1 / state.clock.getDelta();
    const memory = (performance as any).memory?.usedJSHeapSize / 1024 / 1024;

    setPerformanceData((prev) => ({
      ...prev,
      fps: Math.round(fps),
      memory: Math.round(memory),
    }));

    // Auto-optimization based on performance
    if (fps < 30) {
      optimizeForLowPerformance(state);
    }
  });

  return null;
};

// Model optimization utilities
const optimizeModel = (model: Object3D) => {
  model.traverse((child) => {
    if (child instanceof Mesh) {
      // Optimize geometry
      if (child.geometry) {
        child.geometry.computeBoundingSphere();
        if (!child.geometry.attributes.normal) {
          child.geometry.computeVertexNormals();
        }
      }

      // Optimize materials
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => optimizeMaterial(mat));
        } else {
          optimizeMaterial(child.material);
        }
      }
    }
  });
};
```

### **User Journey & Test Scenarios**

#### **3D Scene Loading Journey**

```typescript
describe('3D Scene Initialization User Journey', () => {
  const mockVehicle: IVehicle = {
    id: 'swift-2024-zxi',
    make: 'Maruti Suzuki',
    model: 'Swift',
    year: 2024,
    trim: 'ZXi',
    modelPath: '/models/swift-2024.glb',
    thumbnailPath: '/images/swift-thumb.jpg',
    specifications: mockSpecs,
    availableParts: ['paint', 'wheels', 'interior'],
    priceRange: { min: 799000, max: 899000, currency: 'INR' }
  };

  describe('Model Loading Process', () => {
    it('shows progressive loading feedback', async () => {
      const onProgress = jest.fn();
      render(
        <CustomizerScene
          vehicleModel={mockVehicle}
          onLoadingProgress={onProgress}
        />
      );

      // Verify loading states
      expect(screen.getByText(/loading model/i)).toBeInTheDocument();

      // Simulate loading progress
      await act(async () => {
        fireEvent.progress(screen.getByTestId('model-loader'), {
          loaded: 500000,
          total: 1000000
        });
      });

      expect(onProgress).toHaveBeenCalledWith({
        progress: 50,
        stage: 'processing',
        error: null,
        estimatedTime: expect.any(Number)
      });
    });

    it('handles model loading errors gracefully', async () => {
      const onError = jest.fn();
      const invalidVehicle = { ...mockVehicle, modelPath: '/invalid/path.glb' };

      render(
        <CustomizerScene
          vehicleModel={invalidVehicle}
          onError={onError}
        />
      );

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(
          expect.objectContaining({
            message: expect.stringContaining('Failed to load 3D model')
          })
        );
      });

      expect(screen.getByText(/unable to load 3d model/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry loading/i })).toBeInTheDocument();
    });
  });
});
```

### **UI Element Specifications**

#### **3D Canvas Layout**

```css
/* 3D Scene Container Styles */
.customizer-canvas {
  width: 70%;
  height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 0 12px 12px 0;
  overflow: hidden;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 26, 46, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.progress-container {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  min-width: 320px;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin: 16px 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 4px;
  transition: width 0.3s ease-out;
}
```

#### **Performance Indicators**

```typescript
const PerformanceIndicator: React.FC = () => {
  const performanceData = usePerformanceStore();

  return (
    <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg text-xs">
      <div className="flex space-x-4">
        <span className={`${performanceData.fps >= 60 ? 'text-green-400' : 'text-yellow-400'}`}>
          FPS: {performanceData.fps}
        </span>
        <span>Memory: {performanceData.memory}MB</span>
        <span>Triangles: {performanceData.triangles}K</span>
      </div>
    </div>
  );
};
```

### **Dependencies & Integration Points**

#### **Technical Dependencies**

| Dependency        | Version  | Risk   | Mitigation                              |
| ----------------- | -------- | ------ | --------------------------------------- |
| React Three Fiber | ^8.15.0  | Medium | Pin version, test compatibility         |
| Three.js          | ^0.158.0 | Medium | Regular updates, performance monitoring |
| Drei helpers      | ^9.88.0  | Low    | Helper library for common patterns      |
| GLTF Loader       | Built-in | Low    | Part of Three.js core                   |

#### **Integration Dependencies**

- **Upstream**: Vehicle Selection (US-P1-001) must complete first
- **Downstream**: All customization features depend on 3D scene
- **Data Flow**: Vehicle data → 3D model path → Scene initialization → Customization ready

---

## US-P1-003: Real-time Paint Color Customization {#paint-customization}

### **User Story**

**As a** car enthusiast  
**I want to** change my car's paint color and see the changes instantly in 3D  
**So that** I can explore different color options and find my preferred look

**Priority:** 🔴 Critical  
**Story Points:** 8  
**Sprint:** 1.2  
**Estimated Hours:** 16

### **Detailed Acceptance Criteria**

```gherkin
Feature: Real-time Paint Color Customization

  Background:
    Given I have a vehicle loaded in the 3D scene
    And the customization panel is visible on the right side
    And I can see the "Paint Colors" section

  Scenario: Color palette display and organization
    Given I click on the "Paint Colors" section
    When the color options expand
    Then I should see colors organized by finish type:
      - "Solid Colors" (8 options)
      - "Metallic Colors" (12 options)
      - "Pearl Colors" (6 options)
      - "Matte Colors" (5 options)
    And each color should show a realistic swatch with finish texture
    And popular colors should be marked with a "Popular" badge
    And I should see color names like "Arctic White", "Deep Ocean Blue"

  Scenario: Real-time color application
    Given I hover over a paint color swatch
    When I hover for more than 500ms
    Then the car should preview the color with 50% opacity overlay
    And I should see the color name in a tooltip
    When I click on the color
    Then the car should update to the full color within 300ms
    And the material finish should be visually accurate
    And reflections should update to match the new material properties
    And the selected color swatch should show a blue border

  Scenario: Color finish material properties
    Given I select different finish types
    When I apply a "Metallic Silver" color
    Then the car should show realistic metallic sparkle
    And reflections should be sharp and bright
    When I apply a "Matte Black" color
    Then the surface should have no glossy reflections
    And the material should appear flat and non-reflective
    When I apply a "Pearl White" color
    Then the surface should show subtle color-shifting effects
    And highlights should have a soft, lustrous appearance

  Scenario: Color customization state management
    Given I have selected multiple colors
    When I change the color
    Then the selection should be saved automatically
    And I should be able to undo the last color change
    And the "Recently Used" colors section should update
    And my selection should persist if I switch to other customization categories

  Scenario: Performance during color changes
    Given I rapidly change between different colors
    When I click multiple color swatches quickly
    Then each color change should complete within 300ms
    And the 3D scene should maintain smooth 60 FPS
    And there should be no lag or stuttering
    And memory usage should remain stable
```

### **Technical Implementation Details**

#### **Material System Architecture**

```typescript
// Paint Material Data Structure
interface IPaintMaterial {
  id: string;
  name: string;
  colorHex: string;
  finish: 'solid' | 'metallic' | 'pearl' | 'matte';
  properties: {
    roughness: number; // 0.0-1.0, surface roughness
    metalness: number; // 0.0-1.0, metallic appearance
    clearcoat: number; // 0.0-1.0, clear coat intensity
    clearcoatRoughness: number; // 0.0-1.0, clear coat roughness
    normalScale: number; // Surface normal intensity
    envMapIntensity: number; // Environment reflection intensity
  };
  price?: number; // For Phase 3
  popularity: number; // Sort order
  isPopular: boolean;
}

// Paint material examples
const PAINT_MATERIALS: IPaintMaterial[] = [
  {
    id: 'arctic-white-solid',
    name: 'Arctic White',
    colorHex: '#FFFFFF',
    finish: 'solid',
    properties: {
      roughness: 0.1,
      metalness: 0.0,
      clearcoat: 0.8,
      clearcoatRoughness: 0.05,
      normalScale: 1.0,
      envMapIntensity: 1.0,
    },
    popularity: 1,
    isPopular: true,
  },
  {
    id: 'midnight-black-metallic',
    name: 'Midnight Black',
    colorHex: '#0F0F0F',
    finish: 'metallic',
    properties: {
      roughness: 0.05,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      normalScale: 1.2,
      envMapIntensity: 1.5,
    },
    popularity: 2,
    isPopular: true,
  },
];

// Customization State Store
interface ICustomizationState {
  vehicleId: string;
  selectedPaint: IPaintMaterial;
  recentlyUsedPaints: IPaintMaterial[];
  wheelId: string | null;
  bodyKitId: string | null;
  interiorColorId: string | null;
  isPreviewMode: boolean;
  history: ICustomizationState[];
}
```

#### **3D Material Application System**

```typescript
// Material application component
const PaintMaterialApplicator: React.FC<PaintMaterialProps> = ({
  vehicleModel,
  paintMaterial,
  isPreview = false,
}) => {
  const materialRef = useRef<MeshStandardMaterial>();
  const [textureLoader] = useState(() => new TextureLoader());

  // Apply material properties to the 3D model
  useEffect(() => {
    if (!vehicleModel || !paintMaterial) return;

    vehicleModel.traverse((child) => {
      if (child instanceof Mesh && child.name.includes('Body')) {
        const material = child.material as MeshStandardMaterial;

        // Update material properties
        material.color.setHex(paintMaterial.colorHex);
        material.roughness = paintMaterial.properties.roughness;
        material.metalness = paintMaterial.properties.metalness;
        material.clearcoat = paintMaterial.properties.clearcoat;
        material.clearcoatRoughness =
          paintMaterial.properties.clearcoatRoughness;
        material.envMapIntensity = paintMaterial.properties.envMapIntensity;

        // Apply preview opacity if in preview mode
        if (isPreview) {
          material.transparent = true;
          material.opacity = 0.7;
        } else {
          material.transparent = false;
          material.opacity = 1.0;
        }

        // Add special effects for different finishes
        if (paintMaterial.finish === 'metallic') {
          applyMetallicEffect(material);
        } else if (paintMaterial.finish === 'pearl') {
          applyPearlEffect(material);
        } else if (paintMaterial.finish === 'matte') {
          applyMatteEffect(material);
        }

        material.needsUpdate = true;
      }
    });
  }, [vehicleModel, paintMaterial, isPreview]);

  return null;
};

// Specialized material effects
const applyMetallicEffect = (material: MeshStandardMaterial) => {
  // Add metallic flake normal texture
  const flakeTexture = textureLoader.load('/textures/metallic-flakes.jpg');
  flakeTexture.repeat.set(50, 50);
  flakeTexture.wrapS = RepeatWrapping;
  flakeTexture.wrapT = RepeatWrapping;

  material.normalMap = flakeTexture;
  material.normalScale = new Vector2(0.3, 0.3);
  material.metalness = 0.9;
  material.roughness = 0.1;
};

const applyPearlEffect = (material: MeshStandardMaterial) => {
  // Pearl effect with iridescence
  material.clearcoat = 1.0;
  material.clearcoatRoughness = 0.02;
  material.iridescence = 0.8;
  material.iridescenceIOR = 1.8;
  material.sheen = 0.5;
};
```

#### **Color Selection UI Component**

```typescript
interface ColorSelectorProps {
  materials: IPaintMaterial[];
  selectedMaterial: IPaintMaterial | null;
  onMaterialSelect: (material: IPaintMaterial) => void;
  onMaterialPreview: (material: IPaintMaterial | null) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  materials,
  selectedMaterial,
  onMaterialSelect,
  onMaterialPreview
}) => {
  const [previewTimeout, setPreviewTimeout] = useState<NodeJS.Timeout | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>('solid');

  const materialsByFinish = useMemo(() => {
    return materials.reduce((acc, material) => {
      if (!acc[material.finish]) {
        acc[material.finish] = [];
      }
      acc[material.finish].push(material);
      return acc;
    }, {} as Record<string, IPaintMaterial[]>);
  }, [materials]);

  const handleColorHover = (material: IPaintMaterial) => {
    if (previewTimeout) {
      clearTimeout(previewTimeout);
    }

    const timeout = setTimeout(() => {
      onMaterialPreview(material);
    }, 500);

    setPreviewTimeout(timeout);
  };

  const handleColorLeave = () => {
    if (previewTimeout) {
      clearTimeout(previewTimeout);
      setPreviewTimeout(null);
    }
    onMaterialPreview(null);
  };

  return (
    <div className="paint-color-selector">
      <h3 className="text-lg font-semibold mb-4">Paint Colors</h3>

      {Object.entries(materialsByFinish).map(([finish, finishMaterials]) => (
        <div key={finish} className="mb-6">
          <button
            className="flex items-center justify-between w-full mb-3"
            onClick={() => setExpandedSection(expandedSection === finish ? '' : finish)}
          >
            <span className="font-medium capitalize">{finish} Colors</span>
            <ChevronDownIcon
              className={`w-5 h-5 transition-transform ${
                expandedSection === finish ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedSection === finish && (
            <div className="grid grid-cols-4 gap-3">
              {finishMaterials.map((material) => (
                <div
                  key={material.id}
                  className="relative group"
                  onMouseEnter={() => handleColorHover(material)}
                  onMouseLeave={handleColorLeave}
                >
                  <button
                    className={`
                      w-full aspect-square rounded-lg border-2 transition-all duration-200
                      ${selectedMaterial?.id === material.id
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    style={{
                      background: `linear-gradient(135deg, ${material.colorHex}, ${adjustBrightness(material.colorHex, -20)})`
                    }}
                    onClick={() => onMaterialSelect(material)}
                  >
                    {material.isPopular && (
                      <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1 rounded">
                        Popular
                      </span>
                    )}
                  </button>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                      {material.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
```

### **Testing Strategy**

#### **TDD Test Implementation**

```typescript
describe('Paint Color Customization', () => {
  let mockVehicle: Object3D;
  let mockMaterials: IPaintMaterial[];

  beforeEach(() => {
    mockVehicle = createMockVehicleModel();
    mockMaterials = [
      createMockPaintMaterial('solid', 'Arctic White', '#FFFFFF'),
      createMockPaintMaterial('metallic', 'Silver Storm', '#C0C0C0'),
      createMockPaintMaterial('matte', 'Shadow Black', '#2C2C2C')
    ];
  });

  describe('Color Selection Interface', () => {
    it('displays paint materials organized by finish type', () => {
      render(<ColorSelector materials={mockMaterials} />);

      expect(screen.getByText('Solid Colors')).toBeInTheDocument();
      expect(screen.getByText('Metallic Colors')).toBeInTheDocument();
      expect(screen.getByText('Matte Colors')).toBeInTheDocument();
    });

    it('shows color preview on hover after 500ms', async () => {
      const onPreview = jest.fn();
      render(<ColorSelector materials={mockMaterials} onMaterialPreview={onPreview} />);

      const colorSwatch = screen.getByLabelText('Arctic White');
      fireEvent.mouseEnter(colorSwatch);

      // Should not preview immediately
      expect(onPreview).not.toHaveBeenCalled();

      // Should preview after 500ms
      await waitFor(() => {
        expect(onPreview).toHaveBeenCalledWith(mockMaterials[0]);
      }, { timeout: 600 });
    });
  });

  describe('3D Material Application', () => {
    it('applies material properties correctly to vehicle model', () => {
      const paintMaterial = mockMaterials[1]; // Metallic Silver

      render(
        <PaintMaterialApplicator
          vehicleModel={mockVehicle}
          paintMaterial={paintMaterial}
        />
      );

      const bodyMesh = mockVehicle.getObjectByName('Body') as Mesh;
      const material = bodyMesh.material as MeshStandardMaterial;

      expect(material.color.getHexString()).toBe('C0C0C0');
      expect(material.metalness).toBe(paintMaterial.properties.metalness);
      expect(material.roughness).toBe(paintMaterial.properties.roughness);
    });

    it('applies preview mode with reduced opacity', () => {
      const paintMaterial = mockMaterials[0];

      render(
        <PaintMaterialApplicator
          vehicleModel={mockVehicle}
          paintMaterial={paintMaterial}
          isPreview={true}
        />
      );

      const bodyMesh = mockVehicle.getObjectByName('Body') as Mesh;
      const material = bodyMesh.material as MeshStandardMaterial;

      expect(material.transparent).toBe(true);
      expect(material.opacity).toBe(0.7);
    });
  });

  describe('Performance Requirements', () => {
    it('completes color changes within 300ms', async () => {
      const startTime = performance.now();
      const onComplete = jest.fn();

      render(
        <PaintMaterialApplicator
          vehicleModel={mockVehicle}
          paintMaterial={mockMaterials[0]}
          onComplete={onComplete}
        />
      );

      await waitFor(() => {
        expect(onComplete).toHaveBeenCalled();
      });

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(300);
    });
  });
});
```

### **Dependencies & Integration**

#### **Integration Points**

- **Requires**: 3D Scene Setup (US-P1-002) must be complete
- **Integrates with**: Zustand customization store
- **Affects**: All future customization features
- **Data flow**: UI selection → Store update → 3D material update → Visual feedback

---

## US-P1-004: Basic Wheel Customization {#wheel-customization}

### **User Story**

**As a** car modifier  
**I want to** change the wheel design of my car and see the changes in real-time  
**So that** I can explore different wheel options and find the perfect match for my style

**Priority:** 🟡 High  
**Story Points:** 6  
**Sprint:** 1.3  
**Estimated Hours:** 12

### **Detailed Acceptance Criteria**

```gherkin
Feature: Basic Wheel Customization

  Background:
    Given I have a vehicle with paint customization applied
    And I can see the "Wheels" section in the customization panel
    And I click on the "Wheels" section to expand it

  Scenario: Wheel catalog display
    Given the wheels section is expanded
    When I view the available wheel options
    Then I should see 12 different wheel designs
    And wheels should be categorized as "Sport", "Luxury", "Classic"
    And each wheel should show a clear preview thumbnail
    And wheel names should be descriptive like "Racing Split-5", "Chrome Luxe"
    And popular wheels should be marked with a "Recommended" badge

  Scenario: Real-time wheel replacement
    Given I click on a wheel design
    When the wheel change is applied
    Then all four wheels should update simultaneously within 1 second
    And the new wheels should maintain proper scale and fitment
    And wheel alignment should match the original position
    And the wheels should rotate correctly if the view is animated
    And brake components behind wheels should remain visible

  Scenario: Wheel detail and specifications
    Given I hover over a wheel option
    When the preview appears
    Then I should see wheel specifications:
      - Size (e.g., "17 inch")
      - Style name
      - Material (e.g., "Alloy", "Chrome")
      - Weight class (e.g., "Lightweight")
    And a larger preview image should appear
    And compatible tire options should be mentioned

  Scenario: Wheel fitment validation
    Given I select different wheel designs
    When I apply wheels to various vehicle types
    Then wheels should automatically scale to appropriate size
    And offset should be adjusted to prevent clipping
    And wheel wells should accommodate the new wheels properly
    And performance impact should be noted if applicable

  Scenario: State persistence and undo
    Given I have changed wheels multiple times
    When I navigate away and return
    Then my last wheel selection should be preserved
    And I should be able to undo the last wheel change
    And recently viewed wheels should be easily accessible
    And my selection should integrate with overall build saving
```

### **Technical Implementation Details**

#### **Wheel Data Structure**

```typescript
interface IWheel {
  id: string;
  name: string;
  category: 'sport' | 'luxury' | 'classic' | 'offroad';
  thumbnail: string;
  modelPath: string; // Path to wheel .glb model
  specifications: {
    diameter: number; // In inches
    width: number; // In inches
    offset: number; // ET offset in mm
    material: 'alloy' | 'steel' | 'carbon' | 'chrome';
    weight: 'lightweight' | 'standard' | 'heavy';
    boltPattern: string; // e.g., "5x114.3"
    centerBore: number; // Hub bore in mm
  };
  compatibleVehicles?: string[];
  isRecommended: boolean;
  price?: number; // For Phase 3
}

// Wheel catalog data
const WHEEL_CATALOG: IWheel[] = [
  {
    id: 'racing-split-5',
    name: 'Racing Split-5',
    category: 'sport',
    thumbnail: '/images/wheels/racing-split-5-thumb.jpg',
    modelPath: '/models/wheels/racing-split-5.glb',
    specifications: {
      diameter: 17,
      width: 7.5,
      offset: 45,
      material: 'alloy',
      weight: 'lightweight',
      boltPattern: '5x114.3',
      centerBore: 64.1,
    },
    isRecommended: true,
  },
  {
    id: 'chrome-luxe',
    name: 'Chrome Luxe',
    category: 'luxury',
    thumbnail: '/images/wheels/chrome-luxe-thumb.jpg',
    modelPath: '/models/wheels/chrome-luxe.glb',
    specifications: {
      diameter: 18,
      width: 8.0,
      offset: 40,
      material: 'chrome',
      weight: 'heavy',
      boltPattern: '5x114.3',
      centerBore: 64.1,
    },
    isRecommended: false,
  },
];
```

#### **Wheel Replacement System**

```typescript
const WheelReplacer: React.FC<WheelReplacerProps> = ({
  vehicleModel,
  selectedWheel,
  onWheelChanged,
}) => {
  const { scene: wheelModel } = useGLTF(selectedWheel?.modelPath || '');
  const [wheelPositions, setWheelPositions] = useState<Vector3[]>([]);

  // Find wheel positions in the vehicle model
  useEffect(() => {
    if (!vehicleModel) return;

    const positions: Vector3[] = [];
    const wheelNames = ['WheelFL', 'WheelFR', 'WheelRL', 'WheelRR'];

    wheelNames.forEach((name) => {
      const wheelNode = vehicleModel.getObjectByName(name);
      if (wheelNode) {
        positions.push(wheelNode.position.clone());
      }
    });

    setWheelPositions(positions);
  }, [vehicleModel]);

  // Replace wheels when selection changes
  useEffect(() => {
    if (!vehicleModel || !wheelModel || wheelPositions.length === 0) return;

    // Remove existing wheels
    const existingWheels = vehicleModel.children.filter((child) =>
      child.name.startsWith('CustomWheel')
    );
    existingWheels.forEach((wheel) => vehicleModel.remove(wheel));

    // Add new wheels at correct positions
    wheelPositions.forEach((position, index) => {
      const wheelInstance = wheelModel.clone();
      wheelInstance.position.copy(position);
      wheelInstance.name = `CustomWheel${index}`;

      // Mirror wheels on the right side
      if (index === 1 || index === 3) {
        // FR and RR
        wheelInstance.scale.x *= -1;
      }

      // Apply proper rotation for wheel alignment
      wheelInstance.rotation.y = index < 2 ? 0 : Math.PI;

      vehicleModel.add(wheelInstance);
    });

    onWheelChanged?.(selectedWheel);
  }, [vehicleModel, wheelModel, selectedWheel, wheelPositions]);

  return null;
};
```

#### **Wheel Selection UI**

```typescript
const WheelSelector: React.FC<WheelSelectorProps> = ({
  wheels,
  selectedWheel,
  onWheelSelect,
  onWheelPreview
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('sport');
  const [previewWheel, setPreviewWheel] = useState<IWheel | null>(null);

  const wheelsByCategory = useMemo(() => {
    return wheels.reduce((acc, wheel) => {
      if (!acc[wheel.category]) {
        acc[wheel.category] = [];
      }
      acc[wheel.category].push(wheel);
      return acc;
    }, {} as Record<string, IWheel[]>);
  }, [wheels]);

  const handleWheelHover = (wheel: IWheel) => {
    setPreviewWheel(wheel);
    onWheelPreview?.(wheel);
  };

  const handleWheelLeave = () => {
    setPreviewWheel(null);
    onWheelPreview?.(null);
  };

  return (
    <div className="wheel-selector">
      <h3 className="text-lg font-semibold mb-4">Wheels</h3>

      {/* Category tabs */}
      <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
        {Object.keys(wheelsByCategory).map(category => (
          <button
            key={category}
            className={`
              flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all
              ${selectedCategory === category
                ? 'bg-white shadow-sm text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
              }
            `}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Wheel grid */}
      <div className="grid grid-cols-3 gap-3">
        {wheelsByCategory[selectedCategory]?.map((wheel) => (
          <div
            key={wheel.id}
            className="relative group cursor-pointer"
            onMouseEnter={() => handleWheelHover(wheel)}
            onMouseLeave={handleWheelLeave}
            onClick={() => onWheelSelect(wheel)}
          >
            <div className={`
              border-2 rounded-lg overflow-hidden transition-all
              ${selectedWheel?.id === wheel.id
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}>
              <img
                src={wheel.thumbnail}
                alt={wheel.name}
                className="w-full aspect-square object-cover"
              />

              {wheel.isRecommended && (
                <div className="absolute top-2 left-2">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Recommended
                  </span>
                </div>
              )}

              <div className="p-2">
                <h4 className="font-medium text-sm">{wheel.name}</h4>
                <p className="text-xs text-gray-500">
                  {wheel.specifications.diameter}" • {wheel.specifications.material}
                </p>
              </div>
            </div>

            {/* Hover preview */}
            {previewWheel?.id === wheel.id && (
              <div className="absolute left-full top-0 ml-2 bg-white border rounded-lg shadow-lg p-3 z-50 min-w-64">
                <img
                  src={wheel.thumbnail}
                  alt={wheel.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <h4 className="font-medium">{wheel.name}</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Size: {wheel.specifications.diameter}" × {wheel.specifications.width}"</p>
                  <p>Material: {wheel.specifications.material}</p>
                  <p>Weight: {wheel.specifications.weight}</p>
                  <p>Offset: ET{wheel.specifications.offset}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### **Testing Strategy**

```typescript
describe('Wheel Customization', () => {
  let mockVehicle: Object3D;
  let mockWheels: IWheel[];

  beforeEach(() => {
    mockVehicle = createMockVehicleWithWheels();
    mockWheels = [
      createMockWheel('sport', 'Racing Split-5'),
      createMockWheel('luxury', 'Chrome Luxe'),
      createMockWheel('classic', 'Vintage Spoke')
    ];
  });

  describe('Wheel Selection Interface', () => {
    it('displays wheels organized by category', () => {
      render(<WheelSelector wheels={mockWheels} />);

      expect(screen.getByText('Sport')).toBeInTheDocument();
      expect(screen.getByText('Luxury')).toBeInTheDocument();
      expect(screen.getByText('Classic')).toBeInTheDocument();
    });

    it('shows wheel specifications on hover', async () => {
      render(<WheelSelector wheels={mockWheels} />);

      const wheelOption = screen.getByAltText('Racing Split-5');
      fireEvent.mouseEnter(wheelOption);

      await waitFor(() => {
        expect(screen.getByText(/17" × 7.5"/)).toBeInTheDocument();
        expect(screen.getByText(/Material: alloy/)).toBeInTheDocument();
      });
    });
  });

  describe('Wheel Replacement System', () => {
    it('replaces all four wheels simultaneously', () => {
      const onWheelChanged = jest.fn();
      render(
        <WheelReplacer
          vehicleModel={mockVehicle}
          selectedWheel={mockWheels[0]}
          onWheelChanged={onWheelChanged}
        />
      );

      // Check that wheel replacement occurred
      const customWheels = mockVehicle.children.filter(child =>
        child.name.startsWith('CustomWheel')
      );
      expect(customWheels).toHaveLength(4);
      expect(onWheelChanged).toHaveBeenCalledWith(mockWheels[0]);
    });

    it('maintains proper wheel positioning and scaling', () => {
      render(
        <WheelReplacer
          vehicleModel={mockVehicle}
          selectedWheel={mockWheels[0]}
        />
      );

      const frontRightWheel = mockVehicle.getObjectByName('CustomWheel1');
      const rearRightWheel = mockVehicle.getObjectByName('CustomWheel3');

      // Right-side wheels should be mirrored
      expect(frontRightWheel?.scale.x).toBe(-1);
      expect(rearRightWheel?.scale.x).toBe(-1);
    });
  });

  describe('Performance Requirements', () => {
    it('completes wheel changes within 1 second', async () => {
      const startTime = performance.now();

      render(
        <WheelReplacer
          vehicleModel={mockVehicle}
          selectedWheel={mockWheels[0]}
        />
      );

      await waitFor(() => {
        const customWheels = mockVehicle.children.filter(child =>
          child.name.startsWith('CustomWheel')
        );
        expect(customWheels).toHaveLength(4);
      });

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});
```

### **Dependencies & Next Steps**

#### **Phase 1 Completion Dependencies**

- **Requires**: Paint customization (US-P1-003) for integrated experience
- **Integrates with**: Customization state store
- **Prepares for**: Phase 2 advanced customization features

#### **Phase 1 Success Criteria Summary**

| Feature             | Completion Status | Success Metrics                         |
| ------------------- | ----------------- | --------------------------------------- |
| Vehicle Selection   | ⏳ In Progress    | Cascading dropdowns, 3D model loading   |
| 3D Scene Setup      | ⏳ Pending        | 60 FPS, <5s load time                   |
| Paint Customization | ⏳ Pending        | Real-time updates, material accuracy    |
| Wheel Customization | ⏳ Pending        | 4-wheel replacement, fitment validation |

---

## 📊 Phase 1 Progress Tracking & Next Steps

### **Sprint Planning**

| Sprint  | Duration | Stories              | Total Points | Focus Areas                    |
| ------- | -------- | -------------------- | ------------ | ------------------------------ |
| **1.1** | Week 1   | US-P1-001            | 8 points     | Vehicle selection system       |
| **1.2** | Week 2   | US-P1-002, US-P1-003 | 18 points    | 3D scene + paint customization |
| **1.3** | Week 2   | US-P1-004            | 6 points     | Basic wheel customization      |

### **Phase 1 Definition of Done**

- [ ] All 4 user stories implemented with TDD approach
- [ ] > 90% test coverage with Jest and React Testing Library
- [ ] TypeScript compilation with zero errors
- [ ] 60 FPS on desktop, 30 FPS on mobile
- [ ] All components follow established design system
- [ ] State management working with Zustand
- [ ] Ready for Phase 2 development

### **Risk Mitigation**

| Risk                        | Impact | Probability | Mitigation                                              |
| --------------------------- | ------ | ----------- | ------------------------------------------------------- |
| 3D Model Loading Issues     | High   | Medium      | Implement robust error handling, fallback models        |
| Performance on Mobile       | High   | High        | Progressive loading, LOD system, performance monitoring |
| Browser Compatibility       | Medium | Low         | Test on major browsers, polyfills if needed             |
| State Management Complexity | Medium | Medium      | Keep state simple, comprehensive testing                |

---

**Document Status**: 🚧 **ACTIVE DEVELOPMENT** - Phase 1 user stories ready for TDD implementation  
**Next Phase**: [Phase 2 User Stories](./USER_STORIES_PHASE_2.md) - 3D Experience & Local Storage  
**Dependencies**: All Phase 1 stories must complete before Phase 2 begins
