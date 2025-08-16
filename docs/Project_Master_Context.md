# Auto Customizer: Local Prototype Context

**Document Purpose**: Central reference for Auto Customizer Local Prototype development  
**Last Updated**: January 2025  
**Version**: 1.0  
**Status**: 🚧 **PROTOTYPE DEVELOPMENT** - Local Windows development only

---

## 🎯 System Overview

### Project Description

**Auto Customizer: Local Prototype** - A simple 3D car customization prototype built with Next.js and React Three Fiber. Focus on rapid local development and testing on Windows machine only. No external services, databases, or complex integrations.

### Implementation Status Summary

- 🚧 **Current Phase: Local Prototype** - Simple 3D car customization (2-3 weeks max)
- 🎯 **Scope**: Vehicle selection + paint colors + wheel changes only
- 💻 **Platform**: Windows local development only
- 📦 **Storage**: JSON files and localStorage only

### Current System Health

- 🚧 **Development Phase**: Local Prototype
- 🎯 **Current Focus**: Basic vehicle selection and simple 3D customization
- 📋 **Test Coverage**: Basic testing for core functionality only
- 🔧 **Code Quality**: TypeScript with relaxed standards for speed
- 📱 **Performance Targets**: 30 FPS minimum, basic functionality over optimization

---

## 🏗️ System Architecture

### Simple Local Prototype Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Auto Customizer Local Prototype            │
├─────────────────────────────────────────────────────────┤
│  Frontend (Next.js)     │  3D Engine (R3F)           │
│  ┌─────────────────────┐ │  ┌─────────────────────────┐   │
│  │   Basic Interface   │ │  │   Simple 3D Scene      │   │
│  │ • Vehicle Dropdown  │◄┼──┤ • Single Car Model     │   │
│  │ • Color Picker      │ │  │ • Basic Materials      │   │
│  │ • Wheel Selector    │ │  │ • Simple Camera        │   │
│  │ • Preview Window    │ │  │ • No Optimization      │   │
│  └─────────────────────┘ │  └─────────────────────────┘   │
│                          │                            │
│  Data Sources            │  Storage                   │
│  ┌─────────────────────┐ │  ┌─────────────────────────┐   │
│  │ • Static JSON Files │ │  │ • localStorage Only     │   │
│  │ • Hardcoded Options │ │  │ • No Database          │   │
│  │ • Basic Mock Data   │ │  │ • Browser Storage      │   │
│  └─────────────────────┘ │  └─────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack (Minimal)

- **Frontend**: Next.js 14+, Basic TypeScript, React Three Fiber
- **3D Engine**: React Three Fiber (minimal setup)
- **State Management**: Simple useState/useContext (no Zustand needed)
- **Styling**: Basic Tailwind CSS
- **Storage**: Static JSON files + localStorage
- **Testing**: Basic Jest tests only (no complex testing)
- **Development**: Windows local dev server only

---

## 🖥️ Hardware & Performance Constraints

### Development Environment Specifications

- **Primary Development Hardware**: Windows machine (any reasonable spec)
- **Target**: Local development only - no deployment concerns
- **Platform**: Windows 64-bit
- **Performance Philosophy**: Functionality first, optimization later

### Relaxed Performance Requirements (Prototype)

- **Desktop Target**: 20+ FPS acceptable for prototype testing
- **Mobile**: Not a priority for local prototype
- **Memory Budget**: No strict limits - just get it working
- **Asset Optimization**: Use any basic 3D models - optimization not required

### Implementation Standards (Simplified)

- Focus on getting features working locally
- No complex optimization needed for prototype
- Basic functionality over performance
- Simple error handling sufficient

---

## 🎯 Local Prototype Development Plan

### Single Phase: Local Prototype (2-3 weeks max) 🚧

**Goal: Simple working 3D car customization locally**

#### Minimal Core Features

- **Vehicle Selection**: Simple dropdown for 2-3 car models
- **Color Customization**: Basic color picker with 5-6 colors
- **Wheel Selection**: Simple wheel options (3-4 choices)
- **3D Preview**: Basic 3D model display with rotation

#### Simplified Technical Implementation

```typescript
// Simple Data Models (No complex schemas needed)
interface Vehicle {
  id: string;
  name: string; // "Toyota Camry", "Honda Civic", etc.
  modelPath: string; // "/models/camry.glb"
}

interface CustomizationState {
  selectedVehicle: Vehicle | null;
  selectedColor: string; // hex color
  selectedWheels: string; // wheel ID
}
```

#### Development Tasks

1. **Setup**: Next.js + React Three Fiber basic setup
2. **Vehicle Selector**: Simple dropdown component
3. **3D Scene**: Basic R3F canvas with model loading
4. **Color System**: Simple material color changes
5. **Wheel System**: Basic model swapping
6. **Storage**: Save to localStorage

#### No Complex Requirements

- No TDD requirements (basic testing only)
- No performance optimization
- No complex state management
- No error handling beyond basics
- No responsive design (desktop only)

---

## 🧪 TDD Testing Standards (Prototype-Focused)

### TDD-First Approach for Prototype

- **RED-GREEN-REFACTOR**: Write failing tests first, even for prototypes
- **Quality Through Tests**: TDD ensures faster, more reliable prototype development
- **Test Coverage**: Aim for >85% coverage on core prototype components
- **Focus**: Test-driven ensures working functionality from the start

### Prototype TDD Setup (Streamlined)

- **Jest + React Testing Library**: Core testing framework
- **Test Structure**: Simple, focused tests for prototype components
- **Component Tests**: Test component behavior and interactions
- **Integration Tests**: Test feature workflows
- **Mock Strategy**: Simple mocks for 3D components and external dependencies

### Code Quality Standards (TDD-Enforced)

- **TypeScript**: Strict typing with interfaces, no any types
- **ESLint**: Zero errors/warnings - quality enforced by tests
- **Test-Driven Quality**: Tests guide code structure and design
- **Performance**: Test performance expectations in test suites

---

## 🚀 Simple Project Structure

### Basic Folder Structure

```
src/
├── app/                 # Next.js pages
│   ├── page.tsx         # Main customizer page
│   └── globals.css      # Basic styling
├── components/          # Simple components
│   ├── VehicleSelector.tsx
│   ├── ColorPicker.tsx
│   ├── WheelSelector.tsx
│   └── CarScene.tsx     # 3D scene
├── data/                # Static data
│   ├── vehicles.json
│   ├── colors.json
│   └── wheels.json
├── public/              # 3D models & assets
│   └── models/          # .glb files
└── types.ts             # Basic type definitions
```

### Simple Component Approach

- **Single File Components**: Keep it simple
- **Basic State**: useState and basic context if needed
- **Minimal Abstraction**: No complex patterns needed

---

## 🎨 Basic 3D Implementation

### Simple React Three Fiber Setup

```typescript
// Basic 3D Scene Structure
<Canvas>
  <ambientLight />
  <pointLight position={[10, 10, 10]} />
  <CarModel />
  <OrbitControls />
</Canvas>
```

### No Optimization Required

- **Basic .glb Models**: Use any models that work
- **Simple Rendering**: No instancing or LOD needed
- **Basic Lighting**: Ambient + one point light
- **No Culling**: Keep it simple

### Simple State Management

- **useState**: For basic component state
- **localStorage**: Save current configuration
- **No Complex Stores**: Keep state simple and local

---

## 📊 Relaxed Performance Targets (Prototype)

### Basic 3D Performance Goals

- **Desktop**: 15+ FPS acceptable, anything that works
- **Mobile**: Not a concern for local prototype
- **Load Time**: As long as it loads, it's fine
- **Memory Usage**: No specific limits - just get it working
- **Model Complexity**: Use any models - no optimization needed

### Simple Web Performance

- **Load Time**: Reasonable for local development
- **Responsiveness**: Basic functionality working
- **No Optimization**: Focus on features, not performance

### No External Performance Concerns

- No API performance requirements (local only)
- No database performance (JSON files only)
- No payment processing (not implemented)

---

## 🔐 Basic Security (Prototype)

### Minimal Security Concerns

- **Local Only**: No external security concerns
- **Basic Validation**: Simple input checks if needed
- **File Safety**: Only use trusted 3D models
- **No Authentication**: Not needed for prototype
- **No Payment Security**: Not implementing payments
- **No Data Protection**: Local data only

---

## 🎨 Basic Design & Error Handling

### Simple Design Approach

- **Design Philosophy**: Get it working first, make it pretty later
- **No Complex Patterns**: Basic styling with Tailwind
- **No Accessibility Requirements**: For prototype only
- **Desktop Only**: No responsive design needed

#### Basic Design Elements

- **Colors**: Use default browser colors or simple Tailwind classes
- **Typography**: System fonts, no custom typography
- **Layout**: Simple flexbox layouts
- **3D Viewport**: Basic canvas size, no optimization needed

### Simple Error Handling

- **Basic Validation**: Simple checks where needed
- **Console Logging**: Log errors to console for debugging
- **Basic Feedback**: Alert() or simple text messages
- **No Recovery**: Just inform user something went wrong

#### Error Approach

- **Try/Catch**: Basic error catching for 3D loading
- **Console Logs**: Debug information in console
- **Simple Messages**: Basic user feedback
- **No Complex Handling**: Keep error handling minimal

---

## 🚀 Simple Development Workflow

### Basic Environment Setup (Windows)

```bash
# Project setup
npx create-next-app@latest auto-customizer --typescript --tailwind --app
cd auto-customizer

# Install minimal 3D dependencies
npm install @react-three/fiber @react-three/drei three

# Development
npm run dev              # Start development server (http://localhost:3000)
```

### TDD Development Process (Prototype)

1. **Start Dev Server**: `npm run dev`
2. **Write Failing Test**: Create test that describes desired behavior (RED)
3. **Write Minimum Code**: Implement just enough to pass test (GREEN)
4. **Refactor**: Improve code while keeping tests green (REFACTOR)
5. **Test in Browser**: Verify functionality works visually
6. **Commit**: Only when tests pass and code quality gates met
7. **Continue**: Move to next TDD cycle

### TDD 3D Development Example

```typescript
// Step 1: Write failing test first (RED)
describe('CarModel', () => {
  it('should change material color when color prop changes', () => {
    const { rerender } = render(<CarModel color="#ff0000" />);
    // Test will fail initially - this drives development
    expect(getMaterialColor()).toBe('#ff0000');

    rerender(<CarModel color="#00ff00" />);
    expect(getMaterialColor()).toBe('#00ff00');
  });
});

// Step 2: Write minimal code to pass test (GREEN)
const CarModel = ({ color }) => {
  const { scene } = useGLTF('/models/car.glb');

  useEffect(() => {
    scene?.traverse((child) => {
      if (child.material) {
        child.material.color.set(color);
      }
    });
  }, [scene, color]);

  return scene ? <primitive object={scene} /> : null;
};

// Step 3: Refactor while keeping tests green (REFACTOR)
```

---

## 📚 Simple Documentation

### Minimal Documentation Needed

- `README.md` - How to run the prototype locally
- `docs/Project_Master_Context.md` - This file with basic context
- Basic code comments where needed

### No Complex Documentation Required

- No comprehensive guides needed
- No 3D optimization documentation
- No design system documentation
- No complex data schemas
- Keep documentation minimal for prototype

---

## 🎯 Simple Success Criteria

### TDD Prototype Success Goals

- [ ] All features developed with TDD approach (RED-GREEN-REFACTOR)
- [ ] Test coverage >85% for core components
- [ ] Vehicle dropdown works (select from 2-3 cars) - with tests
- [ ] 3D car model displays in browser - with mocked tests
- [ ] Color picker changes car color - with component tests
- [ ] Wheel selector swaps wheel models - with integration tests
- [ ] Configuration saves to localStorage - with persistence tests
- [ ] All tests pass and maintain green status
- [ ] TypeScript compiles with zero errors
- [ ] ESLint passes with zero warnings

### TDD Quality Requirements

- **Test-Driven**: All code written test-first
- **Quality Gates**: Tests, linting, and compilation must pass
- **Coverage**: Maintain >85% test coverage
- **Refactoring**: Code improved through TDD refactor phase
- **Documentation**: Tests serve as living documentation

### Simplified Scope (But TDD-Driven)

- Simple prototype features but developed with TDD discipline
- Local development only but with proper testing setup
- Basic 3D functionality but tested for behavior
- No production deployment but production-quality code practices

---

**Document Status**: 🚧 **TDD PROTOTYPE DEVELOPMENT** - Test-driven 3D customization prototype  
**Last Updated**: January 2025  
**Version**: 1.0 (TDD-focused local prototype)  
**Target**: High-quality local prototype through TDD in 2-3 weeks
