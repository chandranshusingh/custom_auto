# TDD Testing Guide for Prototype

## 🎯 Project Context

**Auto Customizer Local Prototype** - Test-driven development approach for prototype development. TDD ensures faster, more reliable prototype development.

## 🧪 TDD Testing Philosophy

### Test-First Approach for Prototype

- **TDD Required**: Write failing tests first, then implement code
- **RED-GREEN-REFACTOR**: Follow TDD cycle religiously
- **Quality Through Testing**: TDD creates better code faster
- **Living Documentation**: Tests document expected behavior

**Prototype Priority**: Build reliable features through systematic testing approach

## 🔴 TDD Workflow (RED-GREEN-REFACTOR)

### **Primary Development Method: Test-First**

Always start development with failing tests:

#### **TDD Cycle Implementation**

```bash
# Terminal 1: Development server
npm run dev

# Terminal 2: Test watcher (keep running)
npm run test:watch

# Development flow:
# 1. Write failing test (RED)
# 2. Run tests to see failure
# 3. Write minimal code (GREEN)
# 4. Run tests to see pass
# 5. Refactor code (REFACTOR)
# 6. Verify in browser
# 7. Commit when all green
```

#### **Required Test Setup**

```javascript
// Test file structure: src/__tests__/ComponentName.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from '../ComponentName';

describe('ComponentName', () => {
  // Always start with failing test
  it('should describe expected behavior', () => {
    // Arrange
    const props = {
      /* test props */
    };

    // Act
    render(<ComponentName {...props} />);

    // Assert
    expect(screen.getByRole('...')).toBeInTheDocument();
  });
});
```

#### **TDD Test Categories**

- [ ] **Component Tests**: Test individual component behavior
- [ ] **Integration Tests**: Test component interactions
- [ ] **Mock Tests**: Test with mocked 3D components
- [ ] **State Tests**: Test state management behavior
- [ ] **Event Tests**: Test user interactions
- [ ] **Error Tests**: Test error handling scenarios

### **Browser Testing (After TDD)**

Only after tests pass, verify visually:

- [ ] **Visual Confirmation**: Does it look correct in browser?
- [ ] **User Experience**: Does interaction feel smooth?
- [ ] **Performance**: Does it run at acceptable speed?

## 🛠️ TDD Testing Tools & Setup

### **Required Testing Dependencies**

```bash
# Install testing dependencies
npm install --save-dev \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jest \
  jest-environment-jsdom
```

### **Jest Configuration (jest.config.js)**

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

### **Mock Setup for 3D Components**

```javascript
// jest.setup.js
import '@testing-library/jest-dom';

// Mock React Three Fiber
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children, ...props }) => (
    <div data-testid="3d-canvas" {...props}>
      {children}
    </div>
  ),
  useFrame: jest.fn(),
  useThree: () => ({ scene: {}, camera: {}, gl: {} }),
}));

// Mock Three.js GLTF loader
jest.mock('@react-three/drei', () => ({
  useGLTF: jest.fn(() => ({
    scene: {
      traverse: jest.fn(),
      clone: jest.fn(),
    },
  })),
  OrbitControls: () => <div data-testid="orbit-controls" />,
}));
```

## 🧑‍💻 TDD Implementation Examples

### **Component Test Example (Vehicle Selector)**

```typescript
// src/__tests__/VehicleSelector.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VehicleSelector } from '../components/VehicleSelector';

describe('VehicleSelector', () => {
  const mockVehicles = [
    { id: '1', name: 'Car 1', modelPath: '/models/car1.glb' },
    { id: '2', name: 'Car 2', modelPath: '/models/car2.glb' },
  ];

  // RED: Write failing test first
  it('should call onSelect when vehicle is chosen', async () => {
    const user = userEvent.setup();
    const mockOnSelect = jest.fn();

    render(
      <VehicleSelector
        vehicles={mockVehicles}
        onSelect={mockOnSelect}
      />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '1');

    expect(mockOnSelect).toHaveBeenCalledWith(mockVehicles[0]);
  });

  it('should disable selection when no vehicles provided', () => {
    render(<VehicleSelector vehicles={[]} onSelect={jest.fn()} />);

    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });
});
```

### **3D Component Test Example (Car Scene)**

```typescript
// src/__tests__/CarScene.test.tsx

import { render, screen } from '@testing-library/react';
import { CarScene } from '../components/CarScene';

// Mocks are automatically applied from jest.setup.js

describe('CarScene', () => {
  it('should render 3D canvas', () => {
    render(<CarScene selectedCar={null} color="#ff0000" />);

    expect(screen.getByTestId('3d-canvas')).toBeInTheDocument();
  });

  it('should render car model when vehicle selected', () => {
    const mockCar = {
      id: '1',
      name: 'Car 1',
      modelPath: '/models/car1.glb'
    };

    render(<CarScene selectedCar={mockCar} color="#ff0000" />);

    expect(screen.getByTestId('car-model')).toBeInTheDocument();
  });

  it('should not render car model when no vehicle selected', () => {
    render(<CarScene selectedCar={null} color="#ff0000" />);

    expect(screen.queryByTestId('car-model')).not.toBeInTheDocument();
  });
});
```

### **Integration Test Example (Color Picker)**

```typescript
// src/__tests__/ColorPicker.integration.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';

describe('Color Picker Integration', () => {
  it('should update car color when color is selected', async () => {
    const user = userEvent.setup();

    render(<App />);

    // First select a vehicle
    const vehicleSelect = screen.getByRole('combobox', { name: /vehicle/i });
    await user.selectOptions(vehicleSelect, '1');

    // Then select a color
    const redColorButton = screen.getByRole('button', { name: /red/i });
    await user.click(redColorButton);

    // Verify color is applied (through mocked functions)
    expect(screen.getByTestId('car-model')).toHaveAttribute('data-color', '#ff0000');
  });
});
```

### **TDD Test Commands (Mandatory)**

```bash
# Development workflow
npm run test:watch    # Keep running during TDD development
npm run test          # Run all tests
npm run test:coverage # Check coverage (must be >85%)
npm run validate      # Run all quality checks before commit

# Debugging tests
npm test -- --verbose           # Detailed test output
npm test -- --detectOpenHandles # Debug hanging tests
npm test ComponentName          # Run specific test file
```

## ✅ TDD Requirements for Prototype

### **Mandatory Testing Approaches:**

- ✅ **TDD (Test-Driven Development)**: Always write tests first - RED-GREEN-REFACTOR
- ✅ **High Test Coverage**: Aim for >85% coverage on core components
- ✅ **Strategic Mocking**: Mock React Three Fiber and 3D components effectively
- ✅ **Component Testing**: Test all React components behavior
- ✅ **Integration Testing**: Test feature workflows end-to-end
- ✅ **Error Handling Tests**: Test error scenarios and fallbacks
- ✅ **State Management Tests**: Test state changes and persistence

### **Simplified Testing Scope (But TDD-Driven):**

- ✅ **Desktop Focus**: Test for desktop browsers only
- ✅ **Core Features**: Focus testing on primary prototype features
- ✅ **Mock External**: Mock 3D loading, no actual .glb files in tests
- ✅ **Fast Tests**: Use mocks to keep tests running quickly
- ✅ **Behavioral Testing**: Test what components do, not implementation details

## 🎯 TDD Testing Strategy

### **1. Test First, Code Second (RED-GREEN-REFACTOR)**

1. **Write Failing Test**: Describe expected behavior (RED)
2. **Write Minimal Code**: Just enough to pass test (GREEN)
3. **Refactor Code**: Improve while keeping tests green (REFACTOR)
4. **Verify in Browser**: Visual confirmation after tests pass
5. **Commit Changes**: Only when all tests green and quality gates pass

### **2. Focus on TDD Critical Paths**

- **Test-Driven Features**: Every feature starts with failing test
- **Coverage-Driven**: Maintain >85% test coverage on core components
- **Refactor-Friendly**: Tests enable safe refactoring
- **Documentation**: Tests serve as living documentation

### **3. TDD Development Rhythm**

- **Before Each Feature**: Write failing test first - ALWAYS
- **During Development**: Keep tests running (npm run test:watch)
- **Before Each Commit**: All tests must pass + quality gates
- **When Debugging**: Fix tests first, then implementation

## 📋 TDD Completion Checklist

### **Before Calling Prototype "Complete":**

- [ ] All features developed using TDD approach (RED-GREEN-REFACTOR)
- [ ] Test coverage >85% for core components (`npm run test:coverage`)
- [ ] All tests pass (`npm run test`)
- [ ] TypeScript compiles with zero errors (`npx tsc --noEmit`)
- [ ] ESLint passes with zero warnings (`npm run lint`)
- [ ] Runs without errors on `npm run dev`
- [ ] Page loads in browser (Chrome/Firefox)
- [ ] 3D car model displays - **with component tests**
- [ ] Vehicle dropdown shows options - **with interaction tests**
- [ ] Color picker changes car color - **with integration tests**
- [ ] localStorage persistence - **with state tests**
- [ ] Error handling scenarios - **with error tests**
- [ ] Component interfaces properly typed - **with TypeScript**
- [ ] All quality gates pass (`npm run validate`)

### **TDD Success Criteria:**

- ✅ **Test-First Development**: Every feature started with failing test
- ✅ **Quality Gates**: Tests + TypeScript + ESLint all pass
- ✅ **Coverage**: >85% test coverage maintained
- ✅ **Refactorability**: Code can be safely improved through tests
- ✅ **Documentation**: Tests document expected behavior
- ✅ **Reliability**: Prototype works consistently due to comprehensive testing

## 🚀 TDD Development Workflow

### **Daily TDD Development:**

1. Start test watcher: `npm run test:watch` (keep running)
2. Start dev server: `npm run dev` (separate terminal)
3. **RED**: Write failing test for next feature
4. **GREEN**: Write minimal code to pass test
5. **REFACTOR**: Improve code while tests stay green
6. **BROWSER**: Verify visual behavior
7. **COMMIT**: When all tests pass and quality gates clear

### **Pre-Commit Checklist (2 minutes):**

```bash
# Run complete validation
npm run validate

# This runs:
# - npm run test (all tests pass)
# - npx tsc --noEmit (TypeScript compilation)
# - npm run lint (ESLint validation)
# - Test coverage check (>85%)
```

### **Debugging TDD Issues:**

1. **Test Failure**: Fix test first, then implementation
2. **Coverage Drop**: Add missing tests for uncovered branches
3. **TypeScript Errors**: Fix type issues immediately
4. **ESLint Warnings**: Address code quality issues
5. **3D Mock Issues**: Check jest.setup.js mock configuration

### **TDD Benefits Realized:**

- **Faster Development**: Tests clarify requirements upfront
- **Fewer Bugs**: Issues caught immediately during development
- **Better Design**: Testable code is better structured code
- **Confident Refactoring**: Tests enable safe code improvements
- **Living Documentation**: Tests document expected behavior

---

**This TDD-focused testing guide enables fast, reliable prototype development through systematic test-first development. Tests ensure quality while maintaining development speed!**
