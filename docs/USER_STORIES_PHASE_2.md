# 🚗 Phase 2 User Stories - Auto Customizer V1 Web Launch

**Document ID:** AC-P2-US-V1.0  
**Last Updated:** January 2025  
**Version:** 1.0.0  
**Status:** ⏳ **PENDING** - Awaits Phase 1 Completion  
**Phase Duration:** Weeks 3-10  
**Total User Stories:** 5

---

## 📋 Document Cross-References & Dependencies

| Reference Type    | Document                                                                                                                   | Section                | Purpose                            |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------------------------- |
| **Architecture**  | [Project Master Context](./Project_Master_Context.md#phase-2-v1-web-launch-weeks-3-10)                                     | Phase 2 Details        | System architecture and deployment |
| **Development**   | [Development Guide](./Development_Guide.md#phase-based-deployment)                                                         | Deployment Strategy    | Vercel deployment procedures       |
| **Technical**     | [Technical Development Document](../Technical%20Development%20Document.md#phase-2-web-marketplace-authentication--testing) | Phase 2 Implementation | Technical specifications           |
| **Product**       | [Detailed Product Development Plan](../Detailed%20Product%20Development%20Plan.md#phase-2-v1-public-web-launch-weeks-3-10) | Phase 2 Features       | Product requirements               |
| **Prerequisites** | [Phase 1 User Stories](./USER_STORIES_PHASE_1.md)                                                                          | All Phase 1 Stories    | Must be 100% complete              |

---

## 🎯 Phase 2 Overview & Success Criteria

### **Phase Goal**

Launch live web application with full 3D experience, local build persistence, and social sharing capabilities.

### **Hero Features**

1. **3D Customizer** - Rotate, pan, zoom around realistic 3D models
2. **Social Build Sharing** - Generate high-quality spec sheet images
3. **Local Build Saving** - Browser localStorage persistence

### **Core Technologies**

- **Frontend**: Next.js 14+, TypeScript, React Three Fiber
- **3D Engine**: Advanced R3F features, post-processing effects
- **Deployment**: Vercel with CDN optimization
- **Storage**: Browser localStorage, Canvas-to-image generation
- **Performance**: 60 FPS desktop, 30 FPS mobile

### **Success Metrics**

| Metric                  | Target       | Measurement Method      |
| ----------------------- | ------------ | ----------------------- |
| 3D Interaction Response | <50ms        | Input lag monitoring    |
| Build Save/Load Time    | <2s          | localStorage operations |
| Spec Sheet Generation   | <10s         | Image export timing     |
| Vercel Deployment       | 99.9% uptime | Monitoring dashboard    |
| Mobile Performance      | 30+ FPS      | Frame rate tracking     |

---

## US-P2-001: Advanced 3D Camera Controls & Interactions {#advanced-3d-controls}

### **User Story**

**As a** car enthusiast  
**I want to** smoothly navigate around my customized car in 3D space with intuitive controls  
**So that** I can examine every detail from any angle and feel immersed in the experience

**Priority:** 🔴 Critical (Hero Feature)  
**Story Points:** 10  
**Sprint:** 2.1  
**Estimated Hours:** 20

### **Detailed Acceptance Criteria**

```gherkin
Feature: Advanced 3D Camera Controls & Interactions

  Background:
    Given I have a fully customized vehicle loaded in the 3D scene
    And the scene is running at target performance (60 FPS desktop, 30 FPS mobile)
    And I can see camera control hints in the bottom-right corner

  Scenario: Smooth orbital camera movement
    Given I want to rotate around the vehicle
    When I click and drag with the left mouse button
    Then the camera should orbit smoothly around the car
    And the car should remain centered in view
    And rotation should have natural momentum and easing
    And I should not be able to flip the camera upside down
    And vertical rotation should be limited to -10° to 80° from horizontal

  Scenario: Zoom controls with bounds
    Given I want to get closer or farther from the vehicle
    When I use the mouse wheel to zoom
    Then zoom should be smooth and responsive
    And minimum zoom should stop at 1.5 car lengths away
    And maximum zoom should stop at 0.3 car lengths (detail view)
    And zoom should maintain focus on the car center
    And zoom speed should be appropriate (not too fast or slow)

  Scenario: Pan controls for different viewing angles
    Given I want to offset my view of the vehicle
    When I right-click and drag (or Shift+drag)
    Then the view should pan smoothly
    And the car should remain in reasonable bounds
    And pan should be limited to prevent losing the car from view
    And pan should work in conjunction with rotation

  Scenario: Preset camera angles with smooth transitions
    Given I want quick access to common viewing angles
    When I click preset camera buttons
    Then I should see smooth 2-second transitions to:
      - "Front Quarter" view (most popular angle)
      - "Side Profile" view (perfect side view)
      - "Rear Quarter" view (back-angled view)
      - "Detail View" (close-up for paint/wheel inspection)
    And each transition should use smooth easing curves
    And I should be able to interrupt transitions with manual controls

  Scenario: Mobile touch controls optimization
    Given I am using the customizer on a mobile device
    When I use touch gestures
    Then single finger drag should rotate the camera
    And pinch gesture should zoom smoothly
    And two-finger drag should pan the view
    And gestures should feel natural and responsive
    And touch targets should be appropriate for finger size

  Scenario: Auto-rotation and focus features
    Given I want a cinematic presentation of my build
    When I enable auto-rotation mode
    Then the camera should slowly rotate around the car (30-second full rotation)
    And auto-rotation should pause when I interact manually
    And auto-rotation should resume after 5 seconds of inactivity
    And I should be able to toggle auto-rotation on/off easily
    And auto-rotation should maintain current zoom and height

  Scenario: Performance during complex interactions
    Given I perform rapid camera movements
    When I quickly drag, zoom, and pan simultaneously
    Then frame rate should remain stable at target FPS
    And there should be no stuttering or lag
    And memory usage should remain stable
    And CPU usage should not spike excessively
    And all movements should feel smooth and responsive
```

### **Technical Implementation Details**

#### **Camera Control System Architecture**

```typescript
// Camera configuration and constraints
interface ICameraConfig {
  // Orbital controls
  enableRotate: boolean;
  rotateSpeed: number;
  minPolarAngle: number;    // Vertical rotation limits
  maxPolarAngle: number;
  enableDamping: boolean;   // Smooth momentum
  dampingFactor: number;

  // Zoom controls
  enableZoom: boolean;
  zoomSpeed: number;
  minDistance: number;      // Closest zoom
  maxDistance: number;      // Farthest zoom

  // Pan controls
  enablePan: boolean;
  panSpeed: number;
  panBoundary: Box3;       // Limits for panning

  // Auto-rotation
  autoRotate: boolean;
  autoRotateSpeed: number; // Degrees per second
}

// Camera preset positions
interface ICameraPreset {
  name: string;
  position: Vector3;
  target: Vector3;
  transition: {
    duration: number;        // Transition time in seconds
    easing: string;         // Easing function name
  };
}

// Performance monitoring
interface ICameraPerformance {
  frameRate: number;
  inputLag: number;        // Time from input to visual response
  memoryUsage: number;
  isOptimized: boolean;
}

// Main camera controller component
const AdvancedCameraControls: React.FC<CameraControlsProps> = ({
  vehicle,
  onPerformanceUpdate,
  enablePresets = true,
  enableAutoRotate = true
}) => {
  const controlsRef = useRef<OrbitControls>();
  const [activePreset, setActivePreset] = useState<string>('front-quarter');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [performanceData, setPerformanceData] = useState<ICameraPerformance>();

  // Camera configuration based on device capabilities
  const cameraConfig = useMemo((): ICameraConfig => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    return {
      enableRotate: true,
      rotateSpeed: isMobile ? 0.8 : 1.0,
      minPolarAngle: Math.PI * 0.1,  // 18 degrees from top
      maxPolarAngle: Math.PI * 0.8,  // 144 degrees (prevent flipping)
      enableDamping: true,
      dampingFactor: 0.1,

      enableZoom: true,
      zoomSpeed: isMobile ? 0.8 : 1.0,
      minDistance: 2.0,              // Close detail view
      maxDistance: 12.0,             // Wide overview

      enablePan: true,
      panSpeed: isMobile ? 0.8 : 1.0,
      panBoundary: new Box3(
        new Vector3(-5, -2, -5),
        new Vector3(5, 4, 5)
      ),

      autoRotate: false,             // Controlled separately
      autoRotateSpeed: 2.0           // 2 degrees per second
    };
  }, []);

  // Camera presets for common viewing angles
  const cameraPresets: ICameraPreset[] = [
    {
      name: 'front-quarter',
      position: new Vector3(4, 2, 4),
      target: new Vector3(0, 0.5, 0),
      transition: { duration: 2.0, easing: 'easeInOutCubic' }
    },
    {
      name: 'side-profile',
      position: new Vector3(6, 1.5, 0),
      target: new Vector3(0, 0.5, 0),
      transition: { duration: 2.0, easing: 'easeInOutCubic' }
    },
    {
      name: 'rear-quarter',
      position: new Vector3(-4, 2, -4),
      target: new Vector3(0, 0.5, 0),
      transition: { duration: 2.0, easing: 'easeInOutCubic' }
    },
    {
      name: 'detail-view',
      position: new Vector3(2.5, 1, 2.5),
      target: new Vector3(0, 0.8, 0),
      transition: { duration: 1.5, easing: 'easeInOutQuad' }
    }
  ];

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        {...cameraConfig}
        onStart={handleInteractionStart}
        onChange={handleCameraChange}
        onEnd={handleInteractionEnd}
      />

      {enablePresets && (
        <CameraPresetButtons
          presets={cameraPresets}
          activePreset={activePreset}
          onPresetChange={handlePresetChange}
          disabled={isTransitioning}
        />
      )}

      <PerformanceMonitor onUpdate={handlePerformanceUpdate} />
    </>
  );
};
```

#### **Smooth Camera Transitions System**

```typescript
// Camera transition manager
const useCameraTransition = (controls: OrbitControls | null) => {
  const transitionRef = useRef<{
    startTime: number;
    duration: number;
    startPosition: Vector3;
    startTarget: Vector3;
    endPosition: Vector3;
    endTarget: Vector3;
    easing: (t: number) => number;
    onComplete?: () => void;
  } | null>(null);

  const startTransition = useCallback(
    (
      targetPosition: Vector3,
      targetTarget: Vector3,
      duration: number = 2.0,
      easing: string = 'easeInOutCubic',
      onComplete?: () => void
    ) => {
      if (!controls) return;

      transitionRef.current = {
        startTime: performance.now(),
        duration: duration * 1000, // Convert to milliseconds
        startPosition: controls.object.position.clone(),
        startTarget: controls.target.clone(),
        endPosition: targetPosition.clone(),
        endTarget: targetTarget.clone(),
        easing: easingFunctions[easing] || easingFunctions.easeInOutCubic,
        onComplete,
      };
    },
    [controls]
  );

  useFrame(() => {
    const transition = transitionRef.current;
    if (!transition || !controls) return;

    const elapsed = performance.now() - transition.startTime;
    const progress = Math.min(elapsed / transition.duration, 1);
    const easedProgress = transition.easing(progress);

    // Interpolate position
    controls.object.position.lerpVectors(
      transition.startPosition,
      transition.endPosition,
      easedProgress
    );

    // Interpolate target
    controls.target.lerpVectors(
      transition.startTarget,
      transition.endTarget,
      easedProgress
    );

    controls.update();

    // Check if transition is complete
    if (progress >= 1) {
      transitionRef.current = null;
      transition.onComplete?.();
    }
  });

  return { startTransition, isTransitioning: !!transitionRef.current };
};

// Easing functions for smooth transitions
const easingFunctions = {
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeInOutQuad: (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
        ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};
```

#### **Mobile Touch Optimization**

```typescript
// Mobile-specific touch handling
const MobileCameraControls: React.FC<MobileCameraProps> = ({ controls }) => {
  const [touchState, setTouchState] = useState<{
    isRotating: boolean;
    isPanning: boolean;
    isZooming: boolean;
    lastPinchDistance: number;
  }>({
    isRotating: false,
    isPanning: false,
    isZooming: false,
    lastPinchDistance: 0,
  });

  const handleTouchStart = useCallback((event: TouchEvent) => {
    event.preventDefault();

    if (event.touches.length === 1) {
      // Single finger - rotation
      setTouchState((prev) => ({ ...prev, isRotating: true }));
    } else if (event.touches.length === 2) {
      // Two fingers - check for pinch vs pan
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
      );

      setTouchState((prev) => ({
        ...prev,
        isZooming: true,
        isPanning: true,
        lastPinchDistance: distance,
      }));
    }
  }, []);

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      event.preventDefault();

      if (event.touches.length === 2 && touchState.isZooming) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );

        const deltaDistance = distance - touchState.lastPinchDistance;
        const zoomFactor = 1 + deltaDistance * 0.01;

        // Apply zoom through controls
        if (controls) {
          const newDistance = controls.getDistance() / zoomFactor;
          controls.dollyTo(
            Math.max(
              controls.minDistance,
              Math.min(controls.maxDistance, newDistance)
            ),
            true
          );
        }

        setTouchState((prev) => ({ ...prev, lastPinchDistance: distance }));
      }
    },
    [controls, touchState.isZooming, touchState.lastPinchDistance]
  );

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleTouchStart, handleTouchMove]);

  return null;
};
```

### **User Journey & Test Scenarios**

#### **3D Interaction User Journey**

```typescript
describe('Advanced 3D Camera Controls User Journey', () => {
  let mockScene: Scene;
  let mockCamera: PerspectiveCamera;
  let mockControls: OrbitControls;

  beforeEach(() => {
    mockScene = createMockScene();
    mockCamera = createMockCamera();
    mockControls = createMockOrbitControls();
  });

  describe('Camera Movement and Controls', () => {
    it('provides smooth orbital rotation around vehicle', async () => {
      const user = userEvent.setup();
      render(<AdvancedCameraControls />);

      const canvas = screen.getByRole('img', { hidden: true });

      // Simulate mouse drag for rotation
      await user.pointer([
        { target: canvas, coords: { clientX: 200, clientY: 200 } },
        { keys: '[MouseLeft>]', coords: { clientX: 300, clientY: 200 } },
        { keys: '[/MouseLeft]' }
      ]);

      // Verify rotation occurred
      expect(mockControls.getAzimuthalAngle()).not.toBe(0);
      expect(mockControls.getPolarAngle()).toBeGreaterThan(0.1);
    });

    it('respects zoom boundaries and maintains smooth movement', async () => {
      const user = userEvent.setup();
      render(<AdvancedCameraControls />);

      const canvas = screen.getByRole('img', { hidden: true });

      // Test zoom in
      await user.pointer({ target: canvas });
      await user.wheel(canvas, { deltaY: -100 });

      expect(mockControls.getDistance()).toBeGreaterThan(2.0); // Min distance

      // Test zoom out
      await user.wheel(canvas, { deltaY: 1000 });

      expect(mockControls.getDistance()).toBeLessThan(12.0); // Max distance
    });

    it('transitions smoothly between camera presets', async () => {
      const user = userEvent.setup();
      render(<AdvancedCameraControls enablePresets={true} />);

      const frontQuarterButton = screen.getByRole('button', { name: /front quarter/i });
      const sideProfileButton = screen.getByRole('button', { name: /side profile/i });

      await user.click(frontQuarterButton);

      // Wait for transition to complete
      await waitFor(() => {
        expect(mockCamera.position.x).toBeCloseTo(4, 1);
        expect(mockCamera.position.z).toBeCloseTo(4, 1);
      }, { timeout: 2500 });

      await user.click(sideProfileButton);

      await waitFor(() => {
        expect(mockCamera.position.x).toBeCloseTo(6, 1);
        expect(mockCamera.position.z).toBeCloseTo(0, 1);
      }, { timeout: 2500 });
    });
  });

  describe('Mobile Touch Interactions', () => {
    beforeEach(() => {
      // Mock mobile user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
        configurable: true
      });
    });

    it('handles single finger rotation on mobile', async () => {
      render(<AdvancedCameraControls />);
      const canvas = screen.getByRole('img', { hidden: true });

      // Simulate touch drag
      fireEvent.touchStart(canvas, {
        touches: [{ clientX: 100, clientY: 100 }]
      });

      fireEvent.touchMove(canvas, {
        touches: [{ clientX: 150, clientY: 100 }]
      });

      fireEvent.touchEnd(canvas);

      expect(mockControls.getAzimuthalAngle()).not.toBe(0);
    });

    it('handles pinch-to-zoom gestures', async () => {
      render(<MobileCameraControls controls={mockControls} />);
      const canvas = screen.getByRole('img', { hidden: true });

      // Start pinch gesture
      fireEvent.touchStart(canvas, {
        touches: [
          { clientX: 100, clientY: 100 },
          { clientX: 200, clientY: 100 }
        ]
      });

      // Pinch in (zoom in)
      fireEvent.touchMove(canvas, {
        touches: [
          { clientX: 120, clientY: 100 },
          { clientX: 180, clientY: 100 }
        ]
      });

      expect(mockControls.getDistance()).toBeLessThan(mockControls.getDistance());
    });
  });
});
```

---

## US-P2-002: Local Build Saving & Management System {#local-build-saving}

### **User Story**

**As a** car enthusiast  
**I want to** save my customized builds locally and manage multiple configurations  
**So that** I can experiment with different looks and return to previous designs without losing my work

**Priority:** 🔴 Critical  
**Story Points:** 8  
**Sprint:** 2.2  
**Estimated Hours:** 16

### **Detailed Acceptance Criteria**

```gherkin
Feature: Local Build Saving & Management System

  Background:
    Given I have customized a vehicle with specific paint and wheels
    And I can see a "Save Build" button in the customization panel
    And I have not yet saved this configuration

  Scenario: Auto-save functionality
    Given I make any customization change (paint color, wheels, etc.)
    When the change is applied successfully
    Then the build should be auto-saved to localStorage within 500ms
    And I should see a brief "Build saved" notification
    And the auto-save should not interfere with my customization workflow
    And the save operation should be throttled to avoid excessive saves

  Scenario: Manual build saving with custom name
    Given I want to save my build with a specific name
    When I click the "Save Build" button
    Then I should see a save dialog modal
    And I should be able to enter a custom build name (max 50 characters)
    And I should be able to add an optional description (max 200 characters)
    And I should be able to tag the build (e.g., "Daily Driver", "Show Car")
    And I should see a preview thumbnail of my current build
    And clicking "Save" should store the build and close the modal

  Scenario: Build library management interface
    Given I have multiple saved builds
    When I click "My Builds" or "Load Build"
    Then I should see a grid view of all my saved builds
    And each build should show:
      - Thumbnail preview image
      - Build name and description
      - Vehicle details (make, model, year)
      - Save date and last modified date
      - Quick action buttons (Load, Rename, Delete)
    And builds should be sortable by date, name, or vehicle
    And I should be able to search builds by name or vehicle

  Scenario: Loading a saved build
    Given I select a saved build from my library
    When I click "Load Build"
    Then the system should load the exact vehicle configuration
    And all customizations should be restored (paint, wheels, etc.)
    And the 3D scene should update to show the loaded build
    And loading should complete within 3 seconds
    And I should see a confirmation that the build was loaded successfully

  Scenario: Build versioning and history
    Given I load a saved build and make modifications
    When I save the updated build
    Then I should have options to:
      - "Update existing build" (overwrites the original)
      - "Save as new build" (creates a copy)
      - "Save as version" (creates a numbered version)
    And I should see version history for builds with multiple versions
    And I should be able to revert to previous versions

  Scenario: Storage management and limits
    Given I continue to save builds over time
    When localStorage approaches capacity limits
    Then I should receive warnings when approaching 80% capacity
    And I should be able to see storage usage statistics
    And I should have options to export builds to free up space
    And I should be able to import previously exported builds
    And the system should handle storage quota exceeded errors gracefully

  Scenario: Build sharing preparation
    Given I have a build I want to share with others
    When I select sharing options
    Then I should be able to generate a shareable build code
    And I should be able to export the build as a JSON file
    And the exported data should include all customization details
    And I should be able to import builds shared by others
```

### **Technical Implementation Details**

#### **Build Data Structure & Storage**

```typescript
// Core build data structure
interface ISavedBuild {
  id: string; // Unique identifier (UUID)
  version: number; // Build version for updates
  name: string; // User-defined name
  description?: string; // Optional description
  tags: string[]; // User tags for organization

  // Vehicle configuration
  vehicle: {
    make: string;
    model: string;
    year: number;
    trim: string;
    modelPath: string;
  };

  // Customization state
  customization: {
    paint: IPaintMaterial;
    wheels: IWheel;
    bodyKit?: IBodyKit; // For future phases
    interior?: IInteriorConfig; // For future phases
  };

  // Metadata
  thumbnail: string; // Base64 encoded image
  createdAt: Date;
  updatedAt: Date;
  isAutoSave: boolean;
  parentBuildId?: string; // For versions/copies
  viewCount: number; // Usage tracking
}

// Build management interface
interface IBuildManager {
  // Save operations
  saveBuild: (build: Omit<ISavedBuild, 'id' | 'createdAt'>) => Promise<string>;
  updateBuild: (id: string, updates: Partial<ISavedBuild>) => Promise<void>;
  autoSave: (customizationState: ICustomizationState) => Promise<void>;

  // Load operations
  loadBuild: (id: string) => Promise<ISavedBuild | null>;
  listBuilds: (sortBy?: 'date' | 'name' | 'vehicle') => Promise<ISavedBuild[]>;
  searchBuilds: (query: string) => Promise<ISavedBuild[]>;

  // Management operations
  deleteBuild: (id: string) => Promise<void>;
  duplicateBuild: (id: string, newName?: string) => Promise<string>;
  exportBuild: (id: string) => Promise<string>; // JSON string
  importBuild: (buildData: string) => Promise<string>; // Returns new ID

  // Storage management
  getStorageInfo: () => Promise<IStorageInfo>;
  cleanupOldBuilds: (keepCount: number) => Promise<void>;
}

interface IStorageInfo {
  used: number; // Bytes used
  available: number; // Bytes available
  total: number; // Total quota
  buildCount: number;
  oldestBuildDate: Date;
}
```

#### **Local Storage Manager Implementation**

```typescript
class LocalBuildManager implements IBuildManager {
  private readonly STORAGE_KEY = 'auto_customizer_builds';
  private readonly AUTO_SAVE_KEY = 'auto_customizer_auto_save';
  private readonly THUMBNAIL_SIZE = { width: 300, height: 200 };

  private autoSaveTimeout: NodeJS.Timeout | null = null;

  async saveBuild(
    build: Omit<ISavedBuild, 'id' | 'createdAt'>
  ): Promise<string> {
    const id = uuidv4();
    const completeBuild: ISavedBuild = {
      ...build,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const existingBuilds = await this.getBuildsFromStorage();
      existingBuilds[id] = completeBuild;

      await this.saveBuildsToStorage(existingBuilds);

      // Track storage usage
      await this.checkStorageCapacity();

      return id;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        throw new Error(
          'Storage quota exceeded. Please delete some builds or export them to free up space.'
        );
      }
      throw error;
    }
  }

  async autoSave(customizationState: ICustomizationState): Promise<void> {
    // Throttle auto-saves to prevent excessive storage operations
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }

    this.autoSaveTimeout = setTimeout(async () => {
      try {
        const thumbnail = await this.generateThumbnail();
        const autoSaveBuild: ISavedBuild = {
          id: 'auto-save',
          version: 1,
          name: 'Auto Save',
          description: 'Automatically saved build',
          tags: [],
          vehicle: customizationState.vehicle,
          customization: {
            paint: customizationState.selectedPaint,
            wheels: customizationState.selectedWheel,
          },
          thumbnail,
          createdAt: new Date(),
          updatedAt: new Date(),
          isAutoSave: true,
          viewCount: 0,
        };

        localStorage.setItem(this.AUTO_SAVE_KEY, JSON.stringify(autoSaveBuild));

        // Show brief notification
        this.showSaveNotification('Build auto-saved');
      } catch (error) {
        console.warn('Auto-save failed:', error);
      }
    }, 500);
  }

  async loadBuild(id: string): Promise<ISavedBuild | null> {
    try {
      if (id === 'auto-save') {
        const autoSave = localStorage.getItem(this.AUTO_SAVE_KEY);
        return autoSave ? JSON.parse(autoSave) : null;
      }

      const builds = await this.getBuildsFromStorage();
      const build = builds[id];

      if (build) {
        // Update view count and last accessed
        build.viewCount += 1;
        build.updatedAt = new Date();
        await this.saveBuildsToStorage(builds);
      }

      return build || null;
    } catch (error) {
      console.error('Failed to load build:', error);
      return null;
    }
  }

  async generateThumbnail(): Promise<string> {
    // Capture current 3D scene as thumbnail
    const canvas = document.querySelector(
      'canvas[data-engine="three.js r158"]'
    ) as HTMLCanvasElement;
    if (!canvas) {
      return '';
    }

    // Create a smaller canvas for the thumbnail
    const thumbnailCanvas = document.createElement('canvas');
    thumbnailCanvas.width = this.THUMBNAIL_SIZE.width;
    thumbnailCanvas.height = this.THUMBNAIL_SIZE.height;

    const ctx = thumbnailCanvas.getContext('2d');
    if (!ctx) return '';

    // Draw the 3D canvas content to the thumbnail canvas
    ctx.drawImage(
      canvas,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      this.THUMBNAIL_SIZE.width,
      this.THUMBNAIL_SIZE.height
    );

    return thumbnailCanvas.toDataURL('image/jpeg', 0.8);
  }

  private async getBuildsFromStorage(): Promise<Record<string, ISavedBuild>> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }

  private async saveBuildsToStorage(
    builds: Record<string, ISavedBuild>
  ): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(builds));
  }

  private async checkStorageCapacity(): Promise<void> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const quota = estimate.quota || 0;

      const usagePercentage = (used / quota) * 100;

      if (usagePercentage > 80) {
        this.showStorageWarning(usagePercentage, used, quota);
      }
    }
  }

  private showSaveNotification(message: string): void {
    // Implementation for showing brief save notification
    const notification = document.createElement('div');
    notification.className = 'build-save-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2000);
  }
}
```

#### **Build Management UI Components**

```typescript
// Build save dialog component
const BuildSaveDialog: React.FC<BuildSaveDialogProps> = ({
  isOpen,
  currentBuild,
  onSave,
  onClose
}) => {
  const [buildName, setBuildName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<string>('');

  useEffect(() => {
    if (isOpen && currentBuild) {
      // Generate thumbnail when dialog opens
      generateThumbnail().then(setThumbnail);
    }
  }, [isOpen, currentBuild]);

  const handleSave = () => {
    if (!buildName.trim()) {
      toast.error('Please enter a build name');
      return;
    }

    const buildData: Omit<ISavedBuild, 'id' | 'createdAt'> = {
      version: 1,
      name: buildName.trim(),
      description: description.trim(),
      tags,
      vehicle: currentBuild.vehicle,
      customization: currentBuild.customization,
      thumbnail,
      updatedAt: new Date(),
      isAutoSave: false,
      viewCount: 0
    };

    onSave(buildData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Build</DialogTitle>
          <DialogDescription>
            Save your current customization to load it later
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Thumbnail preview */}
          {thumbnail && (
            <div className="flex justify-center">
              <img
                src={thumbnail}
                alt="Build preview"
                className="w-48 h-32 object-cover rounded border"
              />
            </div>
          )}

          {/* Build name input */}
          <div>
            <Label htmlFor="build-name">Build Name *</Label>
            <Input
              id="build-name"
              value={buildName}
              onChange={(e) => setBuildName(e.target.value)}
              placeholder="e.g., My Dream Swift"
              maxLength={50}
            />
          </div>

          {/* Description input */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description of your build..."
              maxLength={200}
              rows={3}
            />
          </div>

          {/* Tags input */}
          <div>
            <Label>Tags</Label>
            <TagInput
              tags={tags}
              onTagsChange={setTags}
              suggestions={['Daily Driver', 'Show Car', 'Racing', 'Luxury']}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!buildName.trim()}>
            Save Build
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Build library grid component
const BuildLibrary: React.FC<BuildLibraryProps> = ({
  onBuildLoad,
  onBuildDelete
}) => {
  const [builds, setBuilds] = useState<ISavedBuild[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'vehicle'>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const buildManager = useMemo(() => new LocalBuildManager(), []);

  useEffect(() => {
    loadBuilds();
  }, [sortBy]);

  const loadBuilds = async () => {
    setLoading(true);
    try {
      const allBuilds = await buildManager.listBuilds(sortBy);
      setBuilds(allBuilds);
    } catch (error) {
      toast.error('Failed to load builds');
    } finally {
      setLoading(false);
    }
  };

  const filteredBuilds = useMemo(() => {
    if (!searchQuery) return builds;

    return builds.filter(build =>
      build.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      build.vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      build.vehicle.model.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [builds, searchQuery]);

  return (
    <div className="build-library">
      <div className="library-header flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Builds ({filteredBuilds.length})</h2>

        <div className="library-controls flex gap-2">
          <Input
            placeholder="Search builds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="vehicle">Sort by Vehicle</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <BuildCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBuilds.map((build) => (
            <BuildCard
              key={build.id}
              build={build}
              onLoad={() => onBuildLoad(build)}
              onDelete={() => onBuildDelete(build.id)}
              onRename={handleBuildRename}
              onDuplicate={handleBuildDuplicate}
            />
          ))}
        </div>
      )}
    </div>
  );
};
```

### **Testing Strategy & User Scenarios**

```typescript
describe('Local Build Saving & Management', () => {
  let buildManager: LocalBuildManager;
  let mockCustomizationState: ICustomizationState;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    buildManager = new LocalBuildManager();
    mockCustomizationState = createMockCustomizationState();
  });

  describe('Build Saving Operations', () => {
    it('saves build with all required data', async () => {
      const buildData = {
        version: 1,
        name: 'Test Build',
        description: 'Test description',
        tags: ['test'],
        vehicle: mockCustomizationState.vehicle,
        customization: mockCustomizationState,
        thumbnail: 'data:image/jpeg;base64,test',
        updatedAt: new Date(),
        isAutoSave: false,
        viewCount: 0
      };

      const buildId = await buildManager.saveBuild(buildData);

      expect(buildId).toBeDefined();
      expect(typeof buildId).toBe('string');

      const savedBuild = await buildManager.loadBuild(buildId);
      expect(savedBuild).not.toBeNull();
      expect(savedBuild!.name).toBe('Test Build');
    });

    it('handles auto-save with throttling', async () => {
      jest.useFakeTimers();
      const autoSaveSpy = jest.spyOn(buildManager, 'autoSave');

      // Trigger multiple rapid auto-saves
      buildManager.autoSave(mockCustomizationState);
      buildManager.autoSave(mockCustomizationState);
      buildManager.autoSave(mockCustomizationState);

      // Fast-forward timers
      jest.advanceTimersByTime(600);

      // Should only save once due to throttling
      await waitFor(() => {
        expect(autoSaveSpy).toHaveBeenCalledTimes(3);
      });

      const autoSavedBuild = await buildManager.loadBuild('auto-save');
      expect(autoSavedBuild).not.toBeNull();
      expect(autoSavedBuild!.isAutoSave).toBe(true);

      jest.useRealTimers();
    });
  });

  describe('Build Management Interface', () => {
    it('displays build library with sorting and search', async () => {
      // Create test builds
      await buildManager.saveBuild(createMockBuild('Build A', 'Maruti', 'Swift'));
      await buildManager.saveBuild(createMockBuild('Build B', 'Honda', 'Civic'));

      render(<BuildLibrary onBuildLoad={jest.fn()} onBuildDelete={jest.fn()} />);

      await waitFor(() => {
        expect(screen.getByText('My Builds (2)')).toBeInTheDocument();
        expect(screen.getByText('Build A')).toBeInTheDocument();
        expect(screen.getByText('Build B')).toBeInTheDocument();
      });

      // Test search functionality
      const searchInput = screen.getByPlaceholderText('Search builds...');
      await userEvent.type(searchInput, 'Swift');

      await waitFor(() => {
        expect(screen.getByText('Build A')).toBeInTheDocument();
        expect(screen.queryByText('Build B')).not.toBeInTheDocument();
      });
    });

    it('opens save dialog and creates build', async () => {
      const onSave = jest.fn();
      render(
        <BuildSaveDialog
          isOpen={true}
          currentBuild={mockCustomizationState}
          onSave={onSave}
          onClose={jest.fn()}
        />
      );

      const nameInput = screen.getByLabelText(/build name/i);
      await userEvent.type(nameInput, 'My Test Build');

      const descriptionInput = screen.getByLabelText(/description/i);
      await userEvent.type(descriptionInput, 'This is a test build');

      const saveButton = screen.getByRole('button', { name: /save build/i });
      await userEvent.click(saveButton);

      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'My Test Build',
          description: 'This is a test build'
        })
      );
    });
  });

  describe('Storage Management', () => {
    it('handles storage quota exceeded error', async () => {
      // Mock localStorage to throw quota exceeded error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      });

      const buildData = createMockBuild('Test Build', 'Maruti', 'Swift');

      await expect(buildManager.saveBuild(buildData)).rejects.toThrow(
        'Storage quota exceeded'
      );

      localStorage.setItem = originalSetItem;
    });

    it('warns when storage capacity is high', async () => {
      // Mock storage estimate API
      const mockEstimate = jest.fn().mockResolvedValue({
        usage: 8000000,    // 8MB used
        quota: 10000000    // 10MB total (80% usage)
      });

      Object.defineProperty(navigator, 'storage', {
        value: { estimate: mockEstimate },
        configurable: true
      });

      const showWarningSpy = jest.spyOn(buildManager as any, 'showStorageWarning');

      await buildManager.saveBuild(createMockBuild('Test', 'Maruti', 'Swift'));

      expect(showWarningSpy).toHaveBeenCalledWith(80, 8000000, 10000000);
    });
  });
});
```

---

## US-P2-003: High-Quality Spec Sheet Generation & Social Sharing {#spec-sheet-generation}

### **User Story**

**As a** car enthusiast  
**I want to** generate professional-quality spec sheets of my customized builds  
**So that** I can share my creations on social media platforms and showcase my design work

**Priority:** 🔴 Critical (Hero Feature)  
**Story Points:** 10  
**Sprint:** 2.3  
**Estimated Hours:** 20

### **Detailed Acceptance Criteria**

```gherkin
Feature: High-Quality Spec Sheet Generation & Social Sharing

  Background:
    Given I have completed customizing a vehicle
    And I can see a "Share Build" button in the customization panel
    And my build includes custom paint and wheels

  Scenario: Generate spec sheet with multiple format options
    Given I click the "Share Build" button
    When the spec sheet generator opens
    Then I should see format options:
      - "Instagram Square" (1080x1080)
      - "Instagram Story" (1080x1920)
      - "WhatsApp Status" (1080x1920)
      - "Facebook Post" (1200x630)
      - "High Resolution" (2400x1800)
    And each format should show a preview thumbnail
    And I should be able to select multiple formats simultaneously

  Scenario: Professional-quality rendering with customizable angles
    Given I select a spec sheet format
    When I choose render settings
    Then I should see camera angle options:
      - "Front Quarter" (most popular)
      - "Side Profile" (classic car show angle)
      - "Rear Quarter" (sporty angle)
      - "Detail Shot" (close-up view)
    And I should see lighting options:
      - "Studio" (clean, professional)
      - "Showroom" (warm, premium)
      - "Outdoor" (natural lighting)
      - "Dramatic" (high contrast)
    And I should see background options:
      - "Transparent" (for custom backgrounds)
      - "Gradient" (subtle fade)
      - "Showroom Floor" (reflective surface)
      - "Abstract" (geometric patterns)

  Scenario: Spec sheet information layout and branding
    Given the rendering settings are configured
    When the spec sheet is generated
    Then it should include:
      - High-resolution render of the customized vehicle
      - Vehicle specifications (Make, Model, Year, Trim)
      - Customization summary (Paint color name, Wheel type)
      - "Created with Auto Customizer" branding (tasteful, not intrusive)
      - QR code linking to the web app (optional)
    And the layout should be visually balanced and professional
    And text should be clearly readable on all background types
    And branding should maintain consistency with app design

  Scenario: Batch generation and download options
    Given I want to create multiple spec sheets
    When I select "Generate All Formats"
    Then the system should create spec sheets for all selected formats
    And generation should happen in parallel for faster processing
    And I should see progress indication for batch operations
    And completed spec sheets should be available for download as a ZIP file
    And individual images should be downloadable in high quality

  Scenario: Social media optimization and sharing
    Given a spec sheet has been generated
    When I select sharing options
    Then I should see platform-specific optimizations:
      - Instagram: Proper aspect ratio, optimal file size (<10MB)
      - WhatsApp: Compressed but high quality (<16MB)
      - Facebook: Optimized dimensions and compression
    And I should have options to:
      - Download to device
      - Copy to clipboard
      - Share directly to platforms (if APIs available)
      - Generate shareable link to the build

  Scenario: Performance and quality requirements
    Given I generate a spec sheet
    When the rendering process occurs
    Then high-resolution spec sheet should generate within 10 seconds
    And the final image should be at least 300 DPI equivalent
    And file size should be optimized for sharing (<5MB for social media)
    And image quality should show no visible artifacts or compression issues
    And 3D model should be rendered at maximum detail level
```

### **Technical Implementation Details**

#### **Spec Sheet Rendering System**

```typescript
// Spec sheet configuration interface
interface ISpecSheetConfig {
  format: {
    name: string;
    dimensions: { width: number; height: number };
    aspectRatio: number;
    platform: 'instagram' | 'whatsapp' | 'facebook' | 'general';
    maxFileSize: number; // in bytes
  };

  render: {
    cameraAngle:
      | 'front-quarter'
      | 'side-profile'
      | 'rear-quarter'
      | 'detail-shot';
    lighting: 'studio' | 'showroom' | 'outdoor' | 'dramatic';
    background: 'transparent' | 'gradient' | 'showroom' | 'abstract';
    quality: 'high' | 'ultra'; // Render quality setting
  };

  layout: {
    vehicleImageSize: number; // Percentage of total space
    infoPanel: boolean; // Show spec information
    branding: boolean; // Include app branding
    qrCode: boolean; // Include QR code
  };

  metadata: {
    title?: string;
    description?: string;
    watermark?: string;
  };
}

// Predefined format configurations
const SPEC_SHEET_FORMATS: Record<string, ISpecSheetConfig> = {
  'instagram-square': {
    format: {
      name: 'Instagram Square',
      dimensions: { width: 1080, height: 1080 },
      aspectRatio: 1,
      platform: 'instagram',
      maxFileSize: 10 * 1024 * 1024, // 10MB
    },
    render: {
      cameraAngle: 'front-quarter',
      lighting: 'studio',
      background: 'gradient',
      quality: 'high',
    },
    layout: {
      vehicleImageSize: 75,
      infoPanel: true,
      branding: true,
      qrCode: false,
    },
    metadata: {},
  },

  'instagram-story': {
    format: {
      name: 'Instagram Story',
      dimensions: { width: 1080, height: 1920 },
      aspectRatio: 9 / 16,
      platform: 'instagram',
      maxFileSize: 10 * 1024 * 1024,
    },
    render: {
      cameraAngle: 'front-quarter',
      lighting: 'dramatic',
      background: 'abstract',
      quality: 'high',
    },
    layout: {
      vehicleImageSize: 60,
      infoPanel: true,
      branding: true,
      qrCode: true,
    },
    metadata: {},
  },
};
```

#### **High-Quality 3D Rendering Engine**

```typescript
class SpecSheetRenderer {
  private offscreenCanvas: HTMLCanvasElement;
  private renderer: WebGLRenderer;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private composer: EffectComposer;

  constructor() {
    this.initializeOffscreenRenderer();
  }

  private initializeOffscreenRenderer(): void {
    // Create offscreen canvas for high-quality rendering
    this.offscreenCanvas = document.createElement('canvas');

    // Initialize Three.js renderer with maximum quality settings
    this.renderer = new WebGLRenderer({
      canvas: this.offscreenCanvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });

    this.renderer.setPixelRatio(2); // High DPI rendering
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputEncoding = sRGBEncoding;

    // Initialize post-processing for enhanced quality
    this.composer = new EffectComposer(this.renderer);
    this.setupPostProcessing();
  }

  private setupPostProcessing(): void {
    // Add render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // Add SMAA (better antialiasing)
    const smaaPass = new SMAAPass(
      window.innerWidth * this.renderer.getPixelRatio(),
      window.innerHeight * this.renderer.getPixelRatio()
    );
    this.composer.addPass(smaaPass);

    // Add bloom effect for metallic surfaces
    const bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      0.15, // strength
      0.4, // radius
      0.85 // threshold
    );
    this.composer.addPass(bloomPass);

    // Add SSAO for better depth perception
    const ssaoPass = new SSAOPass(this.scene, this.camera, 1024, 1024);
    ssaoPass.kernelRadius = 0.1;
    ssaoPass.minDistance = 0.001;
    ssaoPass.maxDistance = 0.1;
    this.composer.addPass(ssaoPass);
  }

  async renderSpecSheet(
    vehicle: Object3D,
    customization: ICustomizationState,
    config: ISpecSheetConfig
  ): Promise<string> {
    // Set canvas size for target resolution
    const { width, height } = config.format.dimensions;
    this.offscreenCanvas.width = width;
    this.offscreenCanvas.height = height;
    this.renderer.setSize(width, height, false);
    this.composer.setSize(width, height);

    // Setup scene for rendering
    this.setupRenderScene(vehicle, config);

    // Apply lighting setup
    this.setupLighting(config.render.lighting);

    // Position camera for desired angle
    this.positionCamera(config.render.cameraAngle);

    // Apply background
    this.setupBackground(config.render.background);

    // Apply materials optimization for high-quality render
    this.optimizeVehicleMaterials(vehicle);

    // Render multiple passes for quality
    return new Promise((resolve, reject) => {
      try {
        // Warm-up renders for material compilation
        for (let i = 0; i < 3; i++) {
          this.composer.render();
        }

        // Final high-quality render
        this.composer.render();

        // Convert to high-quality image
        const dataURL = this.offscreenCanvas.toDataURL('image/jpeg', 0.95);
        resolve(dataURL);
      } catch (error) {
        reject(new Error(`Spec sheet rendering failed: ${error.message}`));
      }
    });
  }

  private setupLighting(lightingType: string): void {
    // Clear existing lights
    this.scene.children = this.scene.children.filter(
      (child) => !(child instanceof Light)
    );

    switch (lightingType) {
      case 'studio':
        this.setupStudioLighting();
        break;
      case 'showroom':
        this.setupShowroomLighting();
        break;
      case 'outdoor':
        this.setupOutdoorLighting();
        break;
      case 'dramatic':
        this.setupDramaticLighting();
        break;
    }
  }

  private setupStudioLighting(): void {
    // Key light (main illumination)
    const keyLight = new DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(5, 8, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -10;
    keyLight.shadow.camera.right = 10;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    this.scene.add(keyLight);

    // Fill light (soft shadows)
    const fillLight = new DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-3, 5, -2);
    this.scene.add(fillLight);

    // Rim light (outline/separation)
    const rimLight = new DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(-5, 2, -5);
    this.scene.add(rimLight);

    // Ambient light (global illumination)
    const ambientLight = new AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientLight);

    // Environment map for reflections
    const envMapLoader = new RGBELoader();
    envMapLoader.load('/hdri/studio_env.hdr', (envMap) => {
      envMap.mapping = EquirectangularReflectionMapping;
      this.scene.environment = envMap;
    });
  }

  private positionCamera(angle: string): void {
    const target = new Vector3(0, 0.5, 0); // Car center point

    let position: Vector3;
    switch (angle) {
      case 'front-quarter':
        position = new Vector3(4, 2, 4);
        break;
      case 'side-profile':
        position = new Vector3(6, 1.5, 0);
        break;
      case 'rear-quarter':
        position = new Vector3(-4, 2, -4);
        break;
      case 'detail-shot':
        position = new Vector3(2.5, 1.2, 2.5);
        target.y = 1.0; // Focus higher for detail
        break;
    }

    this.camera.position.copy(position);
    this.camera.lookAt(target);
    this.camera.updateProjectionMatrix();
  }

  private optimizeVehicleMaterials(vehicle: Object3D): void {
    vehicle.traverse((child) => {
      if (child instanceof Mesh && child.material) {
        const material = child.material as MeshStandardMaterial;

        // Enhance material properties for rendering
        material.needsUpdate = true;

        if (child.name.includes('Body')) {
          // Enhance paint materials
          material.roughness = Math.max(0.1, material.roughness);
          material.metalness = Math.min(0.9, material.metalness);

          // Add clearcoat for paint depth
          material.clearcoat = 0.8;
          material.clearcoatRoughness = 0.1;
        }

        if (child.name.includes('Wheel')) {
          // Enhance wheel materials
          if (material.metalness > 0.5) {
            // Chrome/metallic wheels
            material.roughness = 0.05;
            material.metalness = 1.0;
          }
        }
      }
    });
  }
}
```

#### **Spec Sheet Layout & Composition**

```typescript
class SpecSheetComposer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async composeSpecSheet(
    vehicleRender: string,
    buildData: ISavedBuild,
    config: ISpecSheetConfig
  ): Promise<string> {
    const { width, height } = config.format.dimensions;
    this.canvas.width = width;
    this.canvas.height = height;

    // Setup canvas for high-quality rendering
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    // Setup background
    await this.renderBackground(config);

    // Add vehicle render
    await this.addVehicleRender(vehicleRender, config);

    // Add information panel
    if (config.layout.infoPanel) {
      await this.addInfoPanel(buildData, config);
    }

    // Add branding
    if (config.layout.branding) {
      await this.addBranding(config);
    }

    // Add QR code
    if (config.layout.qrCode) {
      await this.addQRCode(buildData, config);
    }

    return this.canvas.toDataURL('image/jpeg', 0.95);
  }

  private async renderBackground(config: ISpecSheetConfig): Promise<void> {
    const { width, height } = config.format.dimensions;

    switch (config.render.background) {
      case 'gradient':
        const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#f8fafc');
        gradient.addColorStop(1, '#e2e8f0');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);
        break;

      case 'showroom':
        // Create showroom floor reflection effect
        const floorGradient = this.ctx.createLinearGradient(
          0,
          height * 0.6,
          0,
          height
        );
        floorGradient.addColorStop(0, '#2d3748');
        floorGradient.addColorStop(1, '#1a202c');
        this.ctx.fillStyle = floorGradient;
        this.ctx.fillRect(0, height * 0.6, width, height * 0.4);

        const ceilingGradient = this.ctx.createLinearGradient(
          0,
          0,
          0,
          height * 0.6
        );
        ceilingGradient.addColorStop(0, '#f7fafc');
        ceilingGradient.addColorStop(1, '#edf2f7');
        this.ctx.fillStyle = ceilingGradient;
        this.ctx.fillRect(0, 0, width, height * 0.6);
        break;

      case 'abstract':
        await this.renderAbstractBackground(width, height);
        break;

      case 'transparent':
        // Keep transparent
        break;
    }
  }

  private async addVehicleRender(
    vehicleRender: string,
    config: ISpecSheetConfig
  ): Promise<void> {
    const img = new Image();

    return new Promise((resolve) => {
      img.onload = () => {
        const { width, height } = config.format.dimensions;
        const vehicleSize = config.layout.vehicleImageSize / 100;

        // Calculate positioning for vehicle image
        const vehicleWidth = width * vehicleSize;
        const vehicleHeight = height * vehicleSize;
        const x = (width - vehicleWidth) / 2;
        const y = config.layout.infoPanel
          ? (height - vehicleHeight) * 0.3
          : (height - vehicleHeight) / 2;

        // Apply subtle drop shadow
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 20;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 10;

        this.ctx.drawImage(img, x, y, vehicleWidth, vehicleHeight);

        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;

        resolve();
      };
      img.src = vehicleRender;
    });
  }

  private async addInfoPanel(
    buildData: ISavedBuild,
    config: ISpecSheetConfig
  ): Promise<void> {
    const { width, height } = config.format.dimensions;
    const panelHeight = height * 0.25;
    const panelY = height - panelHeight;

    // Semi-transparent panel background
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    this.ctx.fillRect(0, panelY, width, panelHeight);

    // Panel border
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, panelY);
    this.ctx.lineTo(width, panelY);
    this.ctx.stroke();

    // Text styling
    const fontSize = Math.max(24, width * 0.025);
    this.ctx.fillStyle = '#2d3748';
    this.ctx.textAlign = 'left';

    // Vehicle information
    this.ctx.font = `bold ${fontSize * 1.5}px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
    const title = `${buildData.vehicle.year} ${buildData.vehicle.make} ${buildData.vehicle.model}`;
    this.ctx.fillText(title, 40, panelY + 50);

    // Customization details
    this.ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
    this.ctx.fillStyle = '#4a5568';

    const paintInfo = `Paint: ${buildData.customization.paint.name}`;
    const wheelInfo = `Wheels: ${buildData.customization.wheels.name}`;

    this.ctx.fillText(paintInfo, 40, panelY + 90);
    this.ctx.fillText(wheelInfo, 40, panelY + 120);

    // Build name if available
    if (buildData.name && buildData.name !== 'Auto Save') {
      this.ctx.font = `italic ${fontSize * 0.9}px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
      this.ctx.fillStyle = '#718096';
      this.ctx.fillText(`"${buildData.name}"`, 40, panelY + 150);
    }
  }

  private async addBranding(config: ISpecSheetConfig): Promise<void> {
    const { width, height } = config.format.dimensions;
    const fontSize = Math.max(16, width * 0.015);

    // Subtle branding in bottom right
    this.ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
    this.ctx.fillStyle = 'rgba(107, 114, 128, 0.7)';
    this.ctx.textAlign = 'right';

    const brandingText = 'Created with Auto Customizer';
    this.ctx.fillText(brandingText, width - 20, height - 20);
  }
}
```

### **Testing Strategy**

```typescript
describe('Spec Sheet Generation & Social Sharing', () => {
  let renderer: SpecSheetRenderer;
  let composer: SpecSheetComposer;
  let mockBuild: ISavedBuild;
  let mockVehicle: Object3D;

  beforeEach(() => {
    renderer = new SpecSheetRenderer();
    composer = new SpecSheetComposer();
    mockBuild = createMockSavedBuild();
    mockVehicle = createMockVehicleObject();
  });

  describe('High-Quality Rendering', () => {
    it('generates spec sheet within performance targets', async () => {
      const config = SPEC_SHEET_FORMATS['instagram-square'];
      const startTime = performance.now();

      const vehicleRender = await renderer.renderSpecSheet(
        mockVehicle,
        mockBuild.customization,
        config
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(10000); // < 10 seconds
      expect(vehicleRender).toMatch(/^data:image\/jpeg;base64,/);

      // Check image dimensions
      const img = new Image();
      img.src = vehicleRender;

      await new Promise((resolve) => {
        img.onload = () => {
          expect(img.width).toBe(config.format.dimensions.width);
          expect(img.height).toBe(config.format.dimensions.height);
          resolve(true);
        };
      });
    });

    it('applies different lighting setups correctly', async () => {
      const configs = [
        {
          ...SPEC_SHEET_FORMATS['instagram-square'],
          render: {
            ...SPEC_SHEET_FORMATS['instagram-square'].render,
            lighting: 'studio',
          },
        },
        {
          ...SPEC_SHEET_FORMATS['instagram-square'],
          render: {
            ...SPEC_SHEET_FORMATS['instagram-square'].render,
            lighting: 'dramatic',
          },
        },
      ];

      for (const config of configs) {
        const result = await renderer.renderSpecSheet(
          mockVehicle,
          mockBuild.customization,
          config
        );
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(1000); // Substantial image data
      }
    });
  });

  describe('Spec Sheet Composition', () => {
    it('composes complete spec sheet with all elements', async () => {
      const vehicleRender =
        'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
      const config = SPEC_SHEET_FORMATS['instagram-square'];

      const specSheet = await composer.composeSpecSheet(
        vehicleRender,
        mockBuild,
        config
      );

      expect(specSheet).toMatch(/^data:image\/jpeg;base64,/);

      // Verify final image dimensions
      const img = new Image();
      img.src = specSheet;

      await new Promise((resolve) => {
        img.onload = () => {
          expect(img.width).toBe(1080);
          expect(img.height).toBe(1080);
          resolve(true);
        };
      });
    });

    it('handles different aspect ratios correctly', async () => {
      const vehicleRender = 'data:image/jpeg;base64,test';
      const configs = [
        SPEC_SHEET_FORMATS['instagram-square'], // 1:1
        SPEC_SHEET_FORMATS['instagram-story'], // 9:16
      ];

      for (const config of configs) {
        const result = await composer.composeSpecSheet(
          vehicleRender,
          mockBuild,
          config
        );
        expect(result).toBeDefined();

        const img = new Image();
        img.src = result;

        await new Promise((resolve) => {
          img.onload = () => {
            const actualRatio = img.width / img.height;
            const expectedRatio = config.format.aspectRatio;
            expect(Math.abs(actualRatio - expectedRatio)).toBeLessThan(0.01);
            resolve(true);
          };
        });
      }
    });
  });

  describe('Batch Generation', () => {
    it('generates multiple formats simultaneously', async () => {
      const formats = ['instagram-square', 'instagram-story', 'facebook-post'];
      const promises = formats.map(async (formatKey) => {
        const config = SPEC_SHEET_FORMATS[formatKey];
        const vehicleRender = await renderer.renderSpecSheet(
          mockVehicle,
          mockBuild.customization,
          config
        );
        return composer.composeSpecSheet(vehicleRender, mockBuild, config);
      });

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      results.forEach((result) => {
        expect(result).toMatch(/^data:image\/jpeg;base64,/);
      });
    });
  });

  describe('Social Media Optimization', () => {
    it('optimizes file sizes for different platforms', async () => {
      const instagramConfig = SPEC_SHEET_FORMATS['instagram-square'];
      const vehicleRender = await renderer.renderSpecSheet(
        mockVehicle,
        mockBuild.customization,
        instagramConfig
      );
      const specSheet = await composer.composeSpecSheet(
        vehicleRender,
        mockBuild,
        instagramConfig
      );

      // Convert base64 to bytes to check file size
      const base64Data = specSheet.split(',')[1];
      const fileSizeBytes = (base64Data.length * 3) / 4; // Approximate bytes from base64

      expect(fileSizeBytes).toBeLessThan(instagramConfig.format.maxFileSize);
    });
  });
});
```

---

## 📊 Phase 2 Progress Tracking & Integration

### **Sprint Planning & Dependencies**

| Sprint  | Duration  | Stories              | Total Points | Prerequisites                |
| ------- | --------- | -------------------- | ------------ | ---------------------------- |
| **2.1** | Week 3-4  | US-P2-001            | 10 points    | Phase 1 100% complete        |
| **2.2** | Week 5-6  | US-P2-002            | 8 points     | Advanced 3D controls working |
| **2.3** | Week 7-8  | US-P2-003            | 10 points    | Build saving functional      |
| **2.4** | Week 9-10 | Deployment & Testing | -            | All features complete        |

### **Phase 2 Integration Points**

| Feature               | Integrates With            | Data Flow                                         | Critical Dependencies     |
| --------------------- | -------------------------- | ------------------------------------------------- | ------------------------- |
| Advanced 3D Controls  | Phase 1 3D Scene           | Camera state ↔ Render system                     | Vehicle model loaded      |
| Build Saving          | All customization          | Customization state → localStorage                | Thumbnail generation      |
| Spec Sheet Generation | 3D Controls + Build Saving | Build data → High-quality render → Social formats | Both features operational |

### **Deployment Readiness Checklist**

- [ ] All Phase 2 user stories implemented and tested
- [ ] Performance targets met (60 FPS desktop, 30 FPS mobile)
- [ ] Vercel deployment configuration complete
- [ ] CDN optimization for 3D assets
- [ ] Mobile responsiveness validated
- [ ] Cross-browser compatibility tested
- [ ] Error handling and graceful degradation
- [ ] Analytics and monitoring setup

### **Success Metrics Validation**

| Metric                  | Target  | Actual | Status |
| ----------------------- | ------- | ------ | ------ |
| 3D Interaction Response | <50ms   | TBD    | ⏳     |
| Build Save/Load Time    | <2s     | TBD    | ⏳     |
| Spec Sheet Generation   | <10s    | TBD    | ⏳     |
| Mobile Performance      | 30+ FPS | TBD    | ⏳     |
| Vercel Uptime           | 99.9%   | TBD    | ⏳     |

---

**Document Status**: ⏳ **PENDING** - Awaits Phase 1 completion  
**Next Phase**: [Phase 3 User Stories](./USER_STORIES_PHASE_3.md) - E-commerce & Authentication  
**Prerequisites**: Complete Phase 1 User Stories with 100% test coverage and performance targets met

<function_calls>
<invoke name="todo_write">
<parameter name="merge">true
