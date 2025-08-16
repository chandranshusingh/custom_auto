# 📱 Phase 4 User Stories - Auto Customizer Android AR App

**Document ID:** AC-P4-US-V1.0  
**Last Updated:** January 2025  
**Version:** 1.0.0  
**Status:** ⏳ **PENDING** - Awaits Phase 3 Completion  
**Phase Duration:** Post-Marketplace Launch  
**Total User Stories:** 4

---

## 📋 Document Cross-References & Dependencies

| Reference Type    | Document                                                                                                                       | Section                | Purpose                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------- | ------------------------- |
| **Architecture**  | [Project Master Context](./Project_Master_Context.md#phase-4-android-ar-post-marketplace)                                      | Phase 4 Details        | Mobile architecture       |
| **Development**   | [Development Guide](./Development_Guide.md#mobile-ar-stories)                                                                  | Mobile development     | React Native setup        |
| **Technical**     | [Technical Development Document](../Technical%20Development%20Document.md#phase-3-android-app-launch)                          | Phase 4 Implementation | AR and React Native specs |
| **Product**       | [Detailed Product Development Plan](../Detailed%20Product%20Development%20Plan.md#phase-4-android-app-launch-post-marketplace) | Phase 4 Features       | AR requirements           |
| **Prerequisites** | [Phase 3 User Stories](./USER_STORIES_PHASE_3.md)                                                                              | All Phase 3 Stories    | Must be 100% complete     |

---

## 🎯 Phase 4 Overview & Success Criteria

### **Phase Goal**

Launch native Android app with full web feature parity and revolutionary AR "Try in AR" experience.

### **Hero Features**

1. **Full Web Parity** - Complete marketplace experience on mobile
2. **"Try in AR" Mode** - Life-sized 3D car placement using ARCore
3. **Mobile-Optimized UI** - Touch-first interface design
4. **Offline Capabilities** - Core features work without internet

### **Core Technologies**

- **Mobile Framework**: React Native with Expo
- **AR Engine**: ARCore for Android
- **3D Rendering**: expo-three, expo-gl
- **API Integration**: Same backend as web platform
- **State Management**: Redux Toolkit for mobile
- **Navigation**: React Navigation v6
- **Push Notifications**: Expo Notifications

### **Success Metrics**

| Metric             | Target         | Measurement Method             |
| ------------------ | -------------- | ------------------------------ |
| App Store Rating   | 4.5+ stars     | Google Play Store              |
| AR Success Rate    | 85%+ devices   | Device compatibility tracking  |
| Feature Parity     | 100%           | Functional comparison with web |
| Load Time          | <3s cold start | Performance monitoring         |
| AR Model Placement | <2s            | AR session timing              |

---

## US-P4-001: Full Web Feature Parity {#web-parity}

### **User Story**

**As an** Android user  
**I want to** access all Auto Customizer features that are available on the web platform  
**So that** I have a complete and consistent experience regardless of which device I use

**Priority:** 🔴 Critical  
**Story Points:** 15  
**Sprint:** 4.1  
**Estimated Hours:** 30

### **Detailed Acceptance Criteria**

```gherkin
Feature: Full Web Feature Parity

  Background:
    Given I have the Auto Customizer Android app installed
    And I can sign in with my existing web account
    And I have an active internet connection

  Scenario: Vehicle selection and 3D customization
    Given I open the Android app
    When I navigate to the customizer section
    Then I should see the same vehicle selection interface as the web
    And I should be able to select make, model, year, and trim
    And the 3D model should load and render properly on mobile
    And I should be able to rotate, zoom, and pan the 3D model using touch gestures
    And customization options (paint, wheels) should match the web version exactly

  Scenario: User account synchronization
    Given I am signed in to my account on both web and mobile
    When I save a build on the web platform
    Then it should appear in my mobile app's "My Garage" section within 30 seconds
    When I modify a build on mobile
    Then the changes should sync back to the web platform
    And all order history should be consistent across both platforms

  Scenario: Shopping cart and checkout flow
    Given I have customized a vehicle on mobile
    When I add parts to my shopping cart
    Then the cart should function identically to the web version
    And I should be able to modify quantities and remove items
    And the checkout process should be complete and secure
    And I should be able to save payment methods for future use
    And Razorpay payment integration should work seamlessly

  Scenario: "My Garage" dashboard functionality
    Given I am signed in to my account
    When I access "My Garage" on mobile
    Then I should see all my saved builds with thumbnails
    And I should be able to search and filter builds
    And I should be able to rename, delete, and duplicate builds
    And I should see my complete order history
    And all functionality should match the web dashboard exactly

  Scenario: Performance on mobile devices
    Given I am using the app on a mid-range Android device
    When I perform any operation (customization, navigation, etc.)
    Then the app should remain responsive and smooth
    And 3D models should maintain at least 30 FPS
    And memory usage should not exceed 1GB
    And battery drain should be reasonable during normal use
    And the app should handle interruptions (calls, notifications) gracefully

  Scenario: Offline capabilities
    Given I have previously loaded vehicle data and builds
    When I lose internet connection
    Then I should still be able to:
      - View my previously loaded builds
      - Perform basic 3D customization (with cached assets)
      - Navigate through the app interface
    And I should see clear indicators when features require internet
    And data should sync automatically when connection is restored
```

### **Technical Implementation Details**

#### **React Native App Architecture**

```typescript
// App structure and navigation
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// Main app navigation structure
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string;
            switch (route.name) {
              case 'Customizer':
                iconName = focused ? 'car-sport' : 'car-sport-outline';
                break;
              case 'MyGarage':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Cart':
                iconName = focused ? 'bag' : 'bag-outline';
                break;
              case 'Profile':
                iconName = focused ? 'person' : 'person-outline';
                break;
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Customizer" component={CustomizerStack} />
        <Tab.Screen name="MyGarage" component={MyGarageStack} />
        <Tab.Screen name="Cart" component={ShoppingCartStack} />
        <Tab.Screen name="Profile" component={ProfileStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

// Customizer stack for vehicle customization
const CustomizerStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="VehicleSelector"
        component={VehicleSelectorScreen}
        options={{ title: 'Select Vehicle' }}
      />
      <Stack.Screen
        name="CustomizerMain"
        component={CustomizerMainScreen}
        options={{ headerShown: false }} // Full-screen 3D experience
      />
      <Stack.Screen
        name="ARView"
        component={ARViewScreen}
        options={{ title: 'Try in AR', presentation: 'fullScreenModal' }}
      />
    </Stack.Navigator>
  );
};
```

#### **API Integration Layer**

```typescript
// Shared API client for consistent data access
class MobileApiClient {
  private baseURL: string;
  private authToken: string | null = null;

  constructor() {
    this.baseURL = __DEV__
      ? 'http://localhost:3000/api' // Development
      : 'https://auto-customizer.vercel.app/api'; // Production
  }

  async authenticate(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const result = await response.json();
    this.authToken = result.token;
    await this.storeAuthToken(result.token);
    return result;
  }

  async getVehicles(): Promise<IVehicle[]> {
    return this.makeRequest('/vehicles');
  }

  async getUserBuilds(): Promise<ISavedBuild[]> {
    return this.makeRequest('/user/builds');
  }

  async saveBuild(build: Omit<ISavedBuild, 'id'>): Promise<string> {
    return this.makeRequest('/user/builds', {
      method: 'POST',
      body: JSON.stringify(build),
    });
  }

  async getShoppingCart(): Promise<IShoppingCart> {
    return this.makeRequest('/cart');
  }

  async addToCart(item: ICartItem): Promise<ICartItem> {
    return this.makeRequest('/cart/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 401) {
        // Handle authentication error
        await this.clearAuthToken();
        throw new Error('Authentication required');
      }
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  private async storeAuthToken(token: string): Promise<void> {
    await AsyncStorage.setItem('auth_token', token);
  }

  private async clearAuthToken(): Promise<void> {
    this.authToken = null;
    await AsyncStorage.removeItem('auth_token');
  }
}
```

#### **3D Scene Integration for Mobile**

```typescript
// Mobile-optimized 3D scene using expo-three
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer, loadAsync } from 'expo-three';
import * as THREE from 'three';

interface Mobile3DSceneProps {
  vehicleModel: IVehicle;
  customization: ICustomizationState;
  onModelLoaded?: () => void;
}

const Mobile3DScene: React.FC<Mobile3DSceneProps> = ({
  vehicleModel,
  customization,
  onModelLoaded
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    // Initialize Three.js renderer for mobile
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x1a1a2e);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create scene
    const scene = new THREE.Scene();

    // Setup camera with mobile-optimized settings
    const camera = new THREE.PerspectiveCamera(
      45, // Field of view
      gl.drawingBufferWidth / gl.drawingBufferHeight, // Aspect ratio
      0.1, // Near clipping
      100  // Far clipping
    );
    camera.position.set(4, 2, 4);

    // Add lighting optimized for mobile performance
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024; // Reduced for mobile
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Load vehicle model
    try {
      const model = await loadAsync(vehicleModel.modelPath);

      // Optimize model for mobile
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Reduce material complexity for mobile
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.roughness = Math.max(0.2, child.material.roughness);
            child.material.metalness = Math.min(0.8, child.material.metalness);
          }

          // Enable shadow casting only for important elements
          if (child.name.includes('Body')) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        }
      });

      scene.add(model);
      applyCustomizationToModel(model, customization);

      setIsLoading(false);
      onModelLoaded?.();
    } catch (error) {
      console.error('Failed to load 3D model:', error);
      setIsLoading(false);
    }

    // Touch controls for mobile
    let isRotating = false;
    let previousTouch = { x: 0, y: 0 };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        isRotating = true;
        previousTouch.x = event.touches[0].clientX;
        previousTouch.y = event.touches[0].clientY;
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (isRotating && event.touches.length === 1) {
        const touch = event.touches[0];
        const deltaX = touch.clientX - previousTouch.x;
        const deltaY = touch.clientY - previousTouch.y;

        // Rotate camera around the model
        const spherical = new THREE.Spherical();
        spherical.setFromVector3(camera.position);
        spherical.theta -= deltaX * 0.01;
        spherical.phi += deltaY * 0.01;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

        camera.position.setFromSpherical(spherical);
        camera.lookAt(0, 0, 0);

        previousTouch.x = touch.clientX;
        previousTouch.y = touch.clientY;
      }
    };

    const handleTouchEnd = () => {
      isRotating = false;
    };

    // Add touch event listeners
    gl.canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    gl.canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    gl.canvas.addEventListener('touchend', handleTouchEnd);

    // Animation loop optimized for mobile
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Only render if scene has changed or is animating
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();

    // Cleanup function
    return () => {
      cancelAnimationFrame(frameId);
      gl.canvas.removeEventListener('touchstart', handleTouchStart);
      gl.canvas.removeEventListener('touchmove', handleTouchMove);
      gl.canvas.removeEventListener('touchend', handleTouchEnd);
    };
  };

  return (
    <View style={{ flex: 1 }}>
      <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading 3D Model...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16
  }
});
```

#### **State Management with Redux Toolkit**

```typescript
// Redux store setup for mobile app
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  },
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    loginFailure: (state) => {
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

// Customization slice
const customizationSlice = createSlice({
  name: 'customization',
  initialState: {
    currentVehicle: null,
    selectedPaint: null,
    selectedWheels: null,
    buildHistory: [],
    isModified: false,
  },
  reducers: {
    setVehicle: (state, action) => {
      state.currentVehicle = action.payload;
      state.isModified = true;
    },
    setPaint: (state, action) => {
      state.selectedPaint = action.payload;
      state.isModified = true;
    },
    setWheels: (state, action) => {
      state.selectedWheels = action.payload;
      state.isModified = true;
    },
    saveBuild: (state, action) => {
      state.buildHistory.push(action.payload);
      state.isModified = false;
    },
    resetCustomization: (state) => {
      state.selectedPaint = null;
      state.selectedWheels = null;
      state.isModified = false;
    },
  },
});

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalItems: 0,
    subtotal: 0,
    total: 0,
    isLoading: false,
  },
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
      state.totalItems += action.payload.quantity;
    },
    removeItem: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        state.totalItems -= state.items[index].quantity;
        state.items.splice(index, 1);
      }
    },
    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        state.totalItems += quantity - item.quantity;
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.subtotal = 0;
      state.total = 0;
    },
  },
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'customization', 'cart'], // Only persist these slices
};

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  customization: customizationSlice.reducer,
  cart: cartSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
```

### **Testing Strategy**

```typescript
describe('Mobile App Web Parity', () => {
  beforeEach(() => {
    // Setup mock API responses
    fetchMock.resetMocks();
  });

  describe('Vehicle Customization Parity', () => {
    it('loads the same vehicles as web platform', async () => {
      const mockVehicles = [
        { id: '1', make: 'Maruti', model: 'Swift', year: 2024 }
      ];

      fetchMock.mockResponseOnce(JSON.stringify(mockVehicles));

      render(<VehicleSelectorScreen />);

      await waitFor(() => {
        expect(screen.getByText('Maruti')).toBeTruthy();
        expect(screen.getByText('Swift')).toBeTruthy();
      });
    });

    it('applies customizations identically to web', async () => {
      const mockCustomization = {
        paint: { name: 'Metallic Blue', color: '#1E3A8A' },
        wheels: { name: 'Sport Alloys', type: 'alloy' }
      };

      render(<CustomizerMainScreen />);

      // Apply paint customization
      fireEvent.press(screen.getByText('Paint'));
      fireEvent.press(screen.getByText('Metallic Blue'));

      // Apply wheel customization
      fireEvent.press(screen.getByText('Wheels'));
      fireEvent.press(screen.getByText('Sport Alloys'));

      // Verify customization was applied
      await waitFor(() => {
        expect(screen.getByText('Metallic Blue')).toBeTruthy();
        expect(screen.getByText('Sport Alloys')).toBeTruthy();
      });
    });
  });

  describe('Account Synchronization', () => {
    it('syncs builds between web and mobile', async () => {
      // Mock API calls
      fetchMock
        .mockResponseOnce(JSON.stringify({ token: 'test-token' })) // Login
        .mockResponseOnce(JSON.stringify([                         // Get builds
          { id: '1', name: 'My Build', vehicle: { make: 'Maruti' } }
        ]));

      render(<MyGarageScreen />);

      await waitFor(() => {
        expect(screen.getByText('My Build')).toBeTruthy();
        expect(screen.getByText('Maruti')).toBeTruthy();
      });
    });

    it('maintains cart consistency across platforms', async () => {
      const mockCartItems = [
        {
          id: '1',
          product: { name: 'Metallic Paint' },
          quantity: 1,
          price: 15000
        }
      ];

      fetchMock.mockResponseOnce(JSON.stringify({ items: mockCartItems }));

      render(<ShoppingCartScreen />);

      await waitFor(() => {
        expect(screen.getByText('Metallic Paint')).toBeTruthy();
        expect(screen.getByText('1')).toBeTruthy(); // Quantity
      });
    });
  });

  describe('Performance Requirements', () => {
    it('maintains target FPS on 3D scenes', async () => {
      const performanceMonitor = jest.fn();

      render(
        <Mobile3DScene
          vehicleModel={{ modelPath: '/test-model.glb' }}
          onPerformanceUpdate={performanceMonitor}
        />
      );

      // Simulate performance monitoring
      await waitFor(() => {
        expect(performanceMonitor).toHaveBeenCalledWith(
          expect.objectContaining({
            fps: expect.any(Number),
            memoryUsage: expect.any(Number)
          })
        );
      });

      const lastCall = performanceMonitor.mock.calls.slice(-1)[0][0];
      expect(lastCall.fps).toBeGreaterThanOrEqual(30); // Minimum 30 FPS
      expect(lastCall.memoryUsage).toBeLessThan(1000); // Less than 1GB
    });

    it('handles offline mode gracefully', async () => {
      // Simulate offline state
      NetworkInfo.setNetworkStateProvider(() => Promise.resolve({
        type: 'none',
        isConnected: false,
        isInternetReachable: false
      }));

      render(<CustomizerMainScreen />);

      await waitFor(() => {
        expect(screen.getByText(/offline/i)).toBeTruthy();
      });

      // Should still show previously loaded content
      expect(screen.queryByText('Loading...')).toBeFalsy();
    });
  });
});
```

---

## US-P4-002: Revolutionary "Try in AR" Experience {#ar-experience}

### **User Story**

**As an** Android user  
**I want to** place a life-sized 3D model of my customized car in my real environment using AR  
**So that** I can visualize how the car looks in real life before making a purchase decision

**Priority:** 🔴 Critical (Hero Feature)  
**Story Points:** 20  
**Sprint:** 4.2  
**Estimated Hours:** 40

### **Detailed Acceptance Criteria**

```gherkin
Feature: Revolutionary "Try in AR" Experience

  Background:
    Given I have customized a vehicle in the mobile app
    And my Android device supports ARCore
    And I can see a prominent "Try in AR" button
    And camera permissions are granted

  Scenario: ARCore session initialization
    Given I tap the "Try in AR" button
    When the AR mode is activated
    Then ARCore should initialize successfully within 3 seconds
    And I should see the camera feed with AR overlay interface
    And I should see clear instructions: "Move your phone to find a flat surface"
    And surface detection should begin automatically
    And I should see visual indicators for detected surfaces

  Scenario: Surface detection and model placement
    Given AR session is active and scanning for surfaces
    When I point my device at a flat surface (floor, table, driveway)
    Then the system should detect horizontal planes within 5 seconds
    And detected surfaces should be highlighted with a grid overlay
    When I tap on a detected surface
    Then my customized 3D car model should appear at that location
    And the model should be properly scaled (realistic car size)
    And the model should align with the surface orientation
    And lighting should adapt to the real environment

  Scenario: AR model interaction and positioning
    Given my car model is placed in AR
    When I use touch gestures on the screen
    Then I should be able to:
      - Rotate the car by dragging horizontally
      - Move the car to different positions by dragging
      - Scale the car size within realistic bounds (90%-110%)
      - Reset to original position with double-tap
    And all interactions should feel smooth and responsive
    And the car should maintain realistic physics (no floating)

  Scenario: Environmental lighting and realism
    Given the car model is placed in AR
    When the real-world lighting conditions change
    Then the car model should adapt its lighting accordingly
    And shadows should be cast on the real surface
    And reflections should show hints of the real environment
    And metallic paint should reflect real-world lighting
    And the model should blend naturally with the environment

  Scenario: AR photo and video capture
    Given I have positioned the car perfectly in AR
    When I use the capture controls
    Then I should be able to take high-quality photos
    And I should be able to record short videos (up to 30 seconds)
    And captures should be saved to my device gallery
    And photos should be tagged with "Created with Auto Customizer"
    And I should be able to share captures directly to social media

  Scenario: AR session management and stability
    Given I am in an active AR session
    When I use the AR experience for extended periods
    Then the session should remain stable for at least 10 minutes
    And tracking should recover automatically if temporarily lost
    And I should receive warnings if device gets too hot
    And battery usage should be reasonable (<5% per minute)
    And the experience should handle interruptions gracefully

  Scenario: Device compatibility and fallbacks
    Given I attempt to use AR on various Android devices
    When ARCore compatibility is checked
    Then supported devices should have full AR functionality
    And partially supported devices should get limited AR features
    And unsupported devices should see clear messaging
    And alternative 3D viewer should be offered as fallback
    And users should be guided to upgrade their device/software if needed
```

### **Technical Implementation Details**

#### **ARCore Integration with React Native**

```typescript
// ARCore session management
import { ViroARScene, ViroARSceneNavigator, ViroNode, Viro3DObject, ViroAmbientLight, ViroDirectionalLight } from '@viro-community/react-viro';

interface ARViewProps {
  vehicleModel: IVehicle;
  customization: ICustomizationState;
  onARStatusChange: (status: ARStatus) => void;
}

type ARStatus = 'initializing' | 'tracking' | 'tracking_limited' | 'not_available';

const ARExperience: React.FC<ARViewProps> = ({
  vehicleModel,
  customization,
  onARStatusChange
}) => {
  const [arInitialized, setArInitialized] = useState(false);
  const [modelPlaced, setModelPlaced] = useState(false);
  const [modelPosition, setModelPosition] = useState([0, 0, -1]);
  const [modelRotation, setModelRotation] = useState([0, 0, 0]);
  const [modelScale, setModelScale] = useState([1, 1, 1]);
  const [trackingQuality, setTrackingQuality] = useState<ARStatus>('initializing');

  const onInitialized = (state: any, reason: any) => {
    if (state === ViroConstants.TRACKING_NORMAL) {
      setArInitialized(true);
      setTrackingQuality('tracking');
      onARStatusChange('tracking');
    } else if (state === ViroConstants.TRACKING_LIMITED) {
      setTrackingQuality('tracking_limited');
      onARStatusChange('tracking_limited');
    } else {
      setTrackingQuality('not_available');
      onARStatusChange('not_available');
    }
  };

  const onAnchorFound = () => {
    console.log('AR anchor found - surface detected');
  };

  const onAnchorUpdated = (anchor: any) => {
    // Update model position based on anchor updates
    if (modelPlaced) {
      setModelPosition([anchor.position.x, anchor.position.y, anchor.position.z]);
    }
  };

  const onPlaneSelected = (selectedSurface: any) => {
    // Place the car model on the selected surface
    const surfacePosition = [
      selectedSurface.position.x,
      selectedSurface.position.y,
      selectedSurface.position.z
    ];

    setModelPosition(surfacePosition);
    setModelPlaced(true);

    // Haptic feedback for placement confirmation
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const onModelDrag = (dragToPos: [number, number, number]) => {
    setModelPosition(dragToPos);
  };

  const onModelRotate = (rotateState: any) => {
    if (rotateState.rotationFactor) {
      const newRotation = [
        modelRotation[0],
        modelRotation[1] + rotateState.rotationFactor * 0.017453, // Convert to radians
        modelRotation[2]
      ];
      setModelRotation(newRotation);
    }
  };

  const onModelPinch = (pinchState: any) => {
    if (pinchState.scaleFactor) {
      // Constrain scaling to realistic bounds (0.9x to 1.1x)
      const newScale = Math.min(1.1, Math.max(0.9, pinchState.scaleFactor));
      setModelScale([newScale, newScale, newScale]);
    }
  };

  return (
    <ViroARScene
      onTrackingUpdated={onInitialized}
      onAnchorFound={onAnchorFound}
      onAnchorUpdated={onAnchorUpdated}
    >
      {/* Environment lighting that adapts to real world */}
      <ViroAmbientLight color="#FFFFFF" intensity={200} />
      <ViroDirectionalLight
        color="#FFFFFF"
        direction={[0, -1, -0.2]}
        intensity={250}
        castsShadow={true}
      />

      {/* Surface detection and placement */}
      {!modelPlaced && (
        <ViroNode>
          {/* Plane selector for surface detection */}
          <ViroPlaneSelector
            minWidth={2}
            minHeight={2}
            alignment="Horizontal"
            onPlaneSelected={onPlaneSelected}
          >
            <ViroBox
              position={[0, 0, 0]}
              scale={[1, 0.01, 1]}
              materials={['grid']}
              opacity={0.5}
            />
          </ViroPlaneSelector>
        </ViroNode>
      )}

      {/* Vehicle model in AR */}
      {modelPlaced && (
        <ViroNode
          position={modelPosition}
          rotation={modelRotation}
          scale={modelScale}
          onDrag={onModelDrag}
          onRotate={onModelRotate}
          onPinch={onModelPinch}
          dragType="FixedToWorld"
        >
          <Viro3DObject
            source={{ uri: vehicleModel.modelPath }}
            type="GLB"
            materials={generateMaterialsForCustomization(customization)}
            animation={{
              name: 'idle_breathing',
              run: true,
              loop: true
            }}
            onLoadStart={() => console.log('Loading AR model...')}
            onLoadEnd={() => console.log('AR model loaded successfully')}
            onError={(error) => console.error('AR model loading error:', error)}
          />

          {/* Shadow plane */}
          <ViroQuad
            position={[0, -0.5, 0]}
            rotation={[-90, 0, 0]}
            width={4}
            height={2}
            materials={['shadow']}
            opacity={0.3}
          />
        </ViroNode>
      )}

      {/* Environmental effects */}
      <ViroParticleEmitter
        position={[0, 0, 0]}
        duration={2000}
        visible={modelPlaced}
        delay={0}
        run={true}
        loop={false}
        fixedToEmitter={true}
        image={{
          source: require('./particles/sparkle.png'),
          height: 0.1,
          width: 0.1
        }}
        spawnBehavior={{
          particleLifetime: [1000, 1000],
          maxParticles: 50,
          spawnRate: 25,
          spawnVolume: { shape: 'sphere', params: [0.5, 0.5, 0.5] }
        }}
        particlePhysics={{
          velocity: { initial: [0, 2, 0], modifier: { x: 0, y: -1, z: 0 } }
        }}
        particleAppearance={{
          opacity: { initial: 1.0, factor: 'time', interpolation: [0, 0.5, 1.0] },
          scale: { initial: [1, 1, 1], factor: 'time', interpolation: [1, 0.5, 0] }
        }}
      />
    </ViroARScene>
  );
};
```

#### **AR Session Controller**

```typescript
// Main AR view controller component
const ARViewScreen: React.FC<ARViewScreenProps> = ({ route }) => {
  const { vehicleModel, customization } = route.params;
  const [arStatus, setArStatus] = useState<ARStatus>('initializing');
  const [isRecording, setIsRecording] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [deviceTemperature, setDeviceTemperature] = useState(0);

  // Check ARCore availability on component mount
  useEffect(() => {
    checkARAvailability();
    monitorDevicePerformance();

    return () => {
      // Cleanup AR session
      cleanupARSession();
    };
  }, []);

  const checkARAvailability = async () => {
    try {
      const isARSupported = await ViroARPlaneSelector.isARSupportedOnDevice();
      if (!isARSupported) {
        Alert.alert(
          'AR Not Supported',
          'Your device does not support AR features. Would you like to view the car in regular 3D mode instead?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'View in 3D', onPress: () => navigateToRegular3D() }
          ]
        );
      }
    } catch (error) {
      console.error('Error checking AR support:', error);
    }
  };

  const monitorDevicePerformance = () => {
    const performanceInterval = setInterval(async () => {
      try {
        // Monitor device temperature and performance
        const temperature = await DeviceInfo.getBatteryLevel();
        setDeviceTemperature(temperature);

        // Show warning if device is getting hot
        if (temperature > 0.8) {
          showTemperatureWarning();
        }
      } catch (error) {
        console.error('Performance monitoring error:', error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(performanceInterval);
  };

  const handleARStatusChange = (status: ARStatus) => {
    setArStatus(status);

    switch (status) {
      case 'tracking':
        // Show success feedback
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'tracking_limited':
        // Show warning to user
        showTrackingLimitedWarning();
        break;
      case 'not_available':
        // Show error and offer alternatives
        showARErrorDialog();
        break;
    }
  };

  const capturePhoto = async () => {
    try {
      const screenshot = await ViroARSceneNavigator.takeScreenshot('', false);

      // Save to device gallery
      const savedPhoto = await CameraRoll.save(screenshot.url, {
        type: 'photo',
        album: 'Auto Customizer'
      });

      setCapturedPhotos(prev => [...prev, savedPhoto]);

      // Show success feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({
        type: 'success',
        text1: 'Photo Captured!',
        text2: 'Saved to your gallery'
      });

    } catch (error) {
      console.error('Photo capture error:', error);
      Toast.show({
        type: 'error',
        text1: 'Capture Failed',
        text2: 'Unable to save photo'
      });
    }
  };

  const startVideoRecording = async () => {
    try {
      setIsRecording(true);
      await ViroARSceneNavigator.startVideoRecording('AR_Video', true, (error: any) => {
        if (error) {
          console.error('Video recording error:', error);
          setIsRecording(false);
        }
      });

      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (isRecording) {
          stopVideoRecording();
        }
      }, 30000);

    } catch (error) {
      console.error('Start recording error:', error);
      setIsRecording(false);
    }
  };

  const stopVideoRecording = async () => {
    try {
      await ViroARSceneNavigator.stopVideoRecording();
      setIsRecording(false);

      Toast.show({
        type: 'success',
        text1: 'Video Saved!',
        text2: 'Check your gallery'
      });

    } catch (error) {
      console.error('Stop recording error:', error);
    }
  };

  const shareARCapture = async (photoUri: string) => {
    try {
      const shareOptions = {
        title: 'Check out my customized car!',
        message: 'I designed this car using Auto Customizer AR. What do you think?',
        url: photoUri,
        social: Share.Social.WHATSAPP // Can be changed based on user preference
      };

      await Share.shareSingle(shareOptions);
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* AR Scene */}
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: () => (
            <ARExperience
              vehicleModel={vehicleModel}
              customization={customization}
              onARStatusChange={handleARStatusChange}
            />
          )
        }}
        style={styles.arView}
      />

      {/* AR Status Overlay */}
      <ARStatusOverlay status={arStatus} />

      {/* Control Panel */}
      <View style={styles.controlPanel}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={capturePhoto}
          disabled={arStatus !== 'tracking'}
        >
          <Ionicons name="camera" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.videoButton, isRecording && styles.recordingButton]}
          onPress={isRecording ? stopVideoRecording : startVideoRecording}
          disabled={arStatus !== 'tracking'}
        >
          <Ionicons
            name={isRecording ? "stop" : "videocam"}
            size={24}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {/* Reset AR session */}}
        >
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Performance Warning */}
      {deviceTemperature > 0.8 && (
        <View style={styles.warningBanner}>
          <Ionicons name="warning" size={16} color="#F59E0B" />
          <Text style={styles.warningText}>
            Device is getting warm. Consider taking a break.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  arView: {
    flex: 1
  },
  controlPanel: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  captureButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },
  videoButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },
  recordingButton: {
    backgroundColor: '#DC2626',
    transform: [{ scale: 1.1 }]
  },
  resetButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },
  warningBanner: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(251, 191, 36, 0.9)',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  warningText: {
    color: '#92400E',
    fontSize: 14,
    marginLeft: 8,
    flex: 1
  }
});
```

#### **AR Status and User Guidance Components**

```typescript
// AR status overlay component
const ARStatusOverlay: React.FC<{ status: ARStatus }> = ({ status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'initializing':
        return {
          icon: 'hourglass-outline',
          title: 'Initializing AR...',
          subtitle: 'Please wait while we set up AR',
          color: '#3B82F6'
        };
      case 'tracking':
        return {
          icon: 'checkmark-circle',
          title: 'AR Ready!',
          subtitle: 'Tap on a surface to place your car',
          color: '#10B981'
        };
      case 'tracking_limited':
        return {
          icon: 'warning',
          title: 'Limited Tracking',
          subtitle: 'Move your device slowly for better tracking',
          color: '#F59E0B'
        };
      case 'not_available':
        return {
          icon: 'close-circle',
          title: 'AR Not Available',
          subtitle: 'Your device may not support AR',
          color: '#EF4444'
        };
    }
  };

  const statusInfo = getStatusInfo();

  if (status === 'tracking' && Date.now() - lastStatusChange > 3000) {
    // Hide status after 3 seconds of successful tracking
    return null;
  }

  return (
    <View style={statusOverlayStyles.container}>
      <View style={statusOverlayStyles.statusCard}>
        <Ionicons
          name={statusInfo.icon}
          size={32}
          color={statusInfo.color}
        />
        <Text style={statusOverlayStyles.title}>{statusInfo.title}</Text>
        <Text style={statusOverlayStyles.subtitle}>{statusInfo.subtitle}</Text>

        {status === 'initializing' && (
          <ActivityIndicator
            size="small"
            color={statusInfo.color}
            style={{ marginTop: 8 }}
          />
        )}
      </View>
    </View>
  );
};

const statusOverlayStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    pointerEvents: 'none'
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 20
  }
});
```

### **Testing Strategy for AR Features**

```typescript
describe('AR Experience', () => {
  beforeEach(() => {
    // Mock ARCore and device capabilities
    jest.mock('@viro-community/react-viro', () => ({
      ViroARSceneNavigator: mockARSceneNavigator,
      ViroARScene: mockARScene,
      ViroConstants: {
        TRACKING_NORMAL: 'TRACKING_NORMAL',
        TRACKING_LIMITED: 'TRACKING_LIMITED',
        TRACKING_UNAVAILABLE: 'TRACKING_UNAVAILABLE'
      }
    }));
  });

  describe('AR Session Initialization', () => {
    it('initializes ARCore successfully on supported devices', async () => {
      const mockOnARStatusChange = jest.fn();

      render(
        <ARExperience
          vehicleModel={mockVehicle}
          customization={mockCustomization}
          onARStatusChange={mockOnARStatusChange}
        />
      );

      // Simulate successful AR initialization
      fireEvent(screen.getByTestId('ar-scene'), 'onTrackingUpdated', {
        state: 'TRACKING_NORMAL'
      });

      expect(mockOnARStatusChange).toHaveBeenCalledWith('tracking');
    });

    it('handles AR unavailable gracefully', async () => {
      // Mock AR not supported
      ViroARPlaneSelector.isARSupportedOnDevice = jest.fn().mockResolvedValue(false);

      render(<ARViewScreen route={{ params: { vehicleModel: mockVehicle } }} />);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'AR Not Supported',
          expect.stringContaining('Your device does not support AR'),
          expect.any(Array)
        );
      });
    });
  });

  describe('Model Placement and Interaction', () => {
    it('places model on surface tap', async () => {
      const mockOnPlaneSelected = jest.fn();

      render(
        <ARExperience
          vehicleModel={mockVehicle}
          customization={mockCustomization}
          onPlaneSelected={mockOnPlaneSelected}
        />
      );

      // Simulate surface detection and tap
      fireEvent(screen.getByTestId('plane-selector'), 'onPlaneSelected', {
        position: { x: 0, y: 0, z: -1 }
      });

      expect(mockOnPlaneSelected).toHaveBeenCalledWith(
        expect.objectContaining({
          position: { x: 0, y: 0, z: -1 }
        })
      );
    });

    it('handles model rotation gestures', async () => {
      render(<ARViewScreen route={{ params: { vehicleModel: mockVehicle } }} />);

      // Place model first
      fireEvent(screen.getByTestId('plane-selector'), 'onPlaneSelected', {
        position: { x: 0, y: 0, z: -1 }
      });

      // Simulate rotation gesture
      fireEvent(screen.getByTestId('3d-model'), 'onRotate', {
        rotationFactor: 0.5
      });

      // Verify model rotation was applied
      const modelNode = screen.getByTestId('model-node');
      expect(modelNode.props.rotation[1]).toBeCloseTo(0.5 * 0.017453); // Converted to radians
    });

    it('constrains model scaling within realistic bounds', async () => {
      render(<ARViewScreen route={{ params: { vehicleModel: mockVehicle } }} />);

      // Place model and attempt extreme scaling
      fireEvent(screen.getByTestId('plane-selector'), 'onPlaneSelected', {
        position: { x: 0, y: 0, z: -1 }
      });

      // Try to scale too large
      fireEvent(screen.getByTestId('3d-model'), 'onPinch', {
        scaleFactor: 2.0 // 200% scale
      });

      const modelNode = screen.getByTestId('model-node');
      expect(modelNode.props.scale[0]).toBe(1.1); // Should be clamped to max 110%
    });
  });

  describe('Photo and Video Capture', () => {
    it('captures AR photos successfully', async () => {
      ViroARSceneNavigator.takeScreenshot = jest.fn().mockResolvedValue({
        url: 'file://test-photo.jpg'
      });

      CameraRoll.save = jest.fn().mockResolvedValue('saved-photo-id');

      render(<ARViewScreen route={{ params: { vehicleModel: mockVehicle } }} />);

      const captureButton = screen.getByTestId('capture-button');
      fireEvent.press(captureButton);

      await waitFor(() => {
        expect(ViroARSceneNavigator.takeScreenshot).toHaveBeenCalled();
        expect(CameraRoll.save).toHaveBeenCalledWith(
          'file://test-photo.jpg',
          expect.objectContaining({ type: 'photo', album: 'Auto Customizer' })
        );
      });
    });

    it('records AR videos with time limit', async () => {
      jest.useFakeTimers();

      ViroARSceneNavigator.startVideoRecording = jest.fn();
      ViroARSceneNavigator.stopVideoRecording = jest.fn();

      render(<ARViewScreen route={{ params: { vehicleModel: mockVehicle } }} />);

      const videoButton = screen.getByTestId('video-button');
      fireEvent.press(videoButton);

      expect(ViroARSceneNavigator.startVideoRecording).toHaveBeenCalled();

      // Fast forward 30 seconds
      jest.advanceTimersByTime(30000);

      expect(ViroARSceneNavigator.stopVideoRecording).toHaveBeenCalled();

      jest.useRealTimers();
    });
  });

  describe('Performance Monitoring', () => {
    it('monitors device temperature and shows warnings', async () => {
      DeviceInfo.getBatteryLevel = jest.fn().mockResolvedValue(0.9); // 90% - hot device

      render(<ARViewScreen route={{ params: { vehicleModel: mockVehicle } }} />);

      await waitFor(() => {
        expect(screen.getByText(/Device is getting warm/)).toBeTruthy();
      });
    });

    it('maintains target FPS during AR session', async () => {
      const performanceMonitor = jest.fn();

      render(
        <ARExperience
          vehicleModel={mockVehicle}
          onPerformanceUpdate={performanceMonitor}
        />
      );

      // Simulate performance monitoring
      await waitFor(() => {
        expect(performanceMonitor).toHaveBeenCalledWith(
          expect.objectContaining({
            fps: expect.any(Number),
            arTrackingQuality: expect.any(String)
          })
        );
      });

      const performanceData = performanceMonitor.mock.calls[0][0];
      expect(performanceData.fps).toBeGreaterThanOrEqual(25); // Minimum acceptable FPS for AR
    });
  });

  describe('Error Handling and Recovery', () => {
    it('recovers from temporary tracking loss', async () => {
      const mockOnARStatusChange = jest.fn();

      render(
        <ARExperience
          onARStatusChange={mockOnARStatusChange}
        />
      );

      // Simulate tracking loss
      fireEvent(screen.getByTestId('ar-scene'), 'onTrackingUpdated', {
        state: 'TRACKING_LIMITED'
      });

      expect(mockOnARStatusChange).toHaveBeenCalledWith('tracking_limited');

      // Simulate tracking recovery
      fireEvent(screen.getByTestId('ar-scene'), 'onTrackingUpdated', {
        state: 'TRACKING_NORMAL'
      });

      expect(mockOnARStatusChange).toHaveBeenCalledWith('tracking');
    });

    it('handles AR session interruptions gracefully', async () => {
      render(<ARViewScreen route={{ params: { vehicleModel: mockVehicle } }} />);

      // Simulate app going to background
      AppState.currentState = 'background';
      fireEvent(AppState, 'change', 'background');

      // Verify AR session is paused
      expect(ViroARSceneNavigator.pause).toHaveBeenCalled();

      // Simulate app returning to foreground
      AppState.currentState = 'active';
      fireEvent(AppState, 'change', 'active');

      // Verify AR session resumes
      expect(ViroARSceneNavigator.resume).toHaveBeenCalled();
    });
  });
});
```

---

## 📊 Phase 4 Final Summary & Project Completion

### **Phase 4 Development Timeline**

| Sprint  | Duration    | Focus                     | Deliverables                                    |
| ------- | ----------- | ------------------------- | ----------------------------------------------- |
| **4.1** | Weeks 21-24 | Web Parity Implementation | Complete React Native app with all web features |
| **4.2** | Weeks 25-28 | AR Experience Development | Full ARCore integration with "Try in AR"        |
| **4.3** | Weeks 29-32 | Testing & Optimization    | Performance tuning, device compatibility        |
| **4.4** | Weeks 33-36 | Play Store Launch         | App store submission, marketing launch          |

### **Success Criteria Validation**

| Metric                | Target               | Validation Method                  |
| --------------------- | -------------------- | ---------------------------------- |
| App Store Rating      | 4.5+ stars           | Google Play Console metrics        |
| AR Compatibility      | 85%+ Android devices | Device analytics tracking          |
| Feature Parity Score  | 100% vs web          | Automated feature comparison tests |
| Performance Benchmark | 30+ FPS AR, <3s load | Real device testing suite          |
| User Retention        | 70% 7-day retention  | Analytics dashboard monitoring     |

### **Complete Project Architecture Overview**

```
Auto Customizer Ecosystem - Full Stack
├── Phase 1: Local MVP ✅
│   ├── Vehicle Selection System
│   ├── 3D Model Loading & Rendering
│   ├── Paint Color Customization
│   └── Basic Wheel Customization
├── Phase 2: Web Launch ⏳
│   ├── Advanced 3D Camera Controls
│   ├── Local Build Saving & Management
│   └── High-Quality Spec Sheet Generation
├── Phase 3: E-commerce Marketplace ⏳
│   ├── User Authentication & Registration
│   ├── Shopping Cart & Payment Processing
│   ├── "My Garage" Dashboard
│   └── Partner Integration System
└── Phase 4: Android AR App ⏳
    ├── Full Web Feature Parity
    ├── Revolutionary "Try in AR" Experience
    ├── Mobile-Optimized Performance
    └── Google Play Store Launch
```

<function_calls>
<invoke name="todo_write">
<parameter name="merge">true
