# Phase 1 - Core Prototype Development

**Status**: 🚧 **IN PROGRESS** - Main development phase  
**Timeline**: Weeks 1-2  
**Goal**: Build working 3D car customization prototype

---

## 🎯 **CORE FEATURES TO BUILD**

### **Task 1: 3D Scene Display (TDD)**

**TDD Development Process:**

- [ ] **RED**: Write failing test for CarScene component (mocked 3D)
- [ ] **GREEN**: Implement minimal CarScene to pass tests
- [ ] **REFACTOR**: Improve 3D setup while keeping tests green
- [ ] **Verify**: Check visual 3D display works in browser

**Required Tests:**

- [ ] Test: Renders Canvas component
- [ ] Test: Shows CarModel when vehicle prop provided
- [ ] Test: Hides CarModel when no vehicle prop
- [ ] Test: Applies OrbitControls correctly

**TDD Success Criteria**: All 3D scene tests pass + visual 3D model displays

### **Task 2: Vehicle Selection (TDD)**

**TDD Development Process:**

- [ ] **RED**: Write failing tests for VehicleSelector component
- [ ] **GREEN**: Implement minimal VehicleSelector to pass tests
- [ ] **REFACTOR**: Improve component while keeping tests green
- [ ] **Verify**: Check dropdown works in browser

**Required Tests:**

- [ ] Test: Renders dropdown with vehicle options
- [ ] Test: Calls onSelect when vehicle chosen
- [ ] Test: Disables dropdown when no vehicles provided
- [ ] Test: Shows correct vehicle names

**TDD Success Criteria**: All dropdown tests pass + visual dropdown works

### **Task 3: Color Customization (TDD)**

**TDD Development Process:**

- [ ] **RED**: Write failing tests for ColorPicker component
- [ ] **GREEN**: Implement minimal ColorPicker to pass tests
- [ ] **REFACTOR**: Improve color logic while keeping tests green
- [ ] **RED**: Write failing integration tests for color + 3D
- [ ] **GREEN**: Connect color picker to 3D material changes
- [ ] **Verify**: Check color changes work in browser

**Required Tests:**

- [ ] Test: Renders color buttons
- [ ] Test: Calls onChange when color selected
- [ ] Test: Shows selected color state
- [ ] Test: Integration with 3D color changes

**TDD Success Criteria**: All color tests pass + visual color changes work

### **Task 4: UI Layout (TDD)**

**TDD Development Process:**

- [ ] **RED**: Write failing tests for Layout components
- [ ] **GREEN**: Implement minimal layout to pass tests
- [ ] **REFACTOR**: Improve styling while keeping tests green
- [ ] **Verify**: Check layout looks good in browser

**Required Tests:**

- [ ] Test: Renders two-column layout correctly
- [ ] Test: Responsive behavior on desktop
- [ ] Test: Component spacing and typography
- [ ] Test: Integration of all UI components

**TDD Success Criteria**: All layout tests pass + UI looks presentable

## 🎯 **OPTIONAL TDD FEATURES (IF TIME PERMITS)**

### **Task 5: Wheel Customization (TDD)**

**TDD Development Process:**

- [ ] **RED**: Write failing tests for WheelSelector component
- [ ] **GREEN**: Implement minimal WheelSelector to pass tests
- [ ] **REFACTOR**: Improve wheel logic while keeping tests green

**Required Tests:**

- [ ] Test: Renders wheel options
- [ ] Test: Calls onChange when wheel selected
- [ ] Test: Integration with 3D wheel swapping

### **Task 6: Settings Persistence (TDD)**

**TDD Development Process:**

- [ ] **RED**: Write failing tests for localStorage functions
- [ ] **GREEN**: Implement minimal persistence to pass tests
- [ ] **REFACTOR**: Improve storage logic while keeping tests green

**Required Tests:**

- [ ] Test: Saves configuration to localStorage
- [ ] Test: Loads configuration on app start
- [ ] Test: Handles localStorage errors gracefully

### **Task 7: Error Handling (TDD)**

**TDD Development Process:**

- [ ] **RED**: Write failing tests for error scenarios
- [ ] **GREEN**: Implement error handling to pass tests
- [ ] **REFACTOR**: Improve error logic while keeping tests green

**Required Tests:**

- [ ] Test: Handles 3D model loading failures
- [ ] Test: Shows appropriate error messages
- [ ] Test: Logs errors for debugging

## 📁 **SUPPORTING FILES NEEDED**

### **3D Models**

- [ ] Find/download 2-3 basic car models (.glb format)
- [ ] Place in `public/models/` directory
- [ ] Test loading in React Three Fiber
- [ ] Ensure models are reasonably sized (not huge files)

### **Component Structure**

```typescript
// Basic component interfaces
interface Vehicle {
  id: string;
  name: string;
  modelPath: string;
}

interface Color {
  name: string;
  hex: string;
}

interface AppState {
  selectedVehicle: Vehicle | null;
  selectedColor: string;
  selectedWheels: string;
}
```

## ✅ **TDD PHASE 1 COMPLETE WHEN:**

### **TDD Requirements Met:**

- ✅ All features developed using TDD (RED-GREEN-REFACTOR)
- ✅ Test coverage >85% for all core components
- ✅ All tests pass (`npm run test`)
- ✅ TypeScript compiles with zero errors
- ✅ ESLint passes with zero warnings
- ✅ 3D car model displays **with component tests**
- ✅ Vehicle dropdown **with interaction tests**
- ✅ Color picker **with integration tests**
- ✅ UI layout **with layout tests**
- ✅ Quality gates pass (`npm run validate`)

### **TDD Success Demo:**

1. **Quality Gates**: Run `npm run validate` - all pass
2. **Test Suite**: Run `npm run test:coverage` - >85% coverage
3. **Visual Confirmation**:
   - User opens http://localhost:3000
   - Sees 3D car model (backed by passing tests)
   - Can select different cars (backed by passing tests)
   - Can change colors (backed by passing tests)
   - UI works smoothly (backed by passing tests)
4. **Refactoring Confidence**: Code can be safely improved because tests protect behavior

## 📊 **TDD PROGRESS TRACKING**

| Task                       | TDD Status     | Tests Written | Tests Passing | Coverage | Priority |
| -------------------------- | -------------- | ------------- | ------------- | -------- | -------- |
| 3D Scene Display (TDD)     | ⏳ Not Started | 0/4           | 0/4           | 0%       | High     |
| Vehicle Selection (TDD)    | ⏳ Not Started | 0/4           | 0/4           | 0%       | High     |
| Color Customization (TDD)  | ⏳ Not Started | 0/4           | 0/4           | 0%       | High     |
| UI Layout (TDD)            | ⏳ Not Started | 0/4           | 0/4           | 0%       | High     |
| Wheel Customization (TDD)  | ⏳ Not Started | 0/3           | 0/3           | 0%       | Low      |
| Settings Persistence (TDD) | ⏳ Not Started | 0/3           | 0/3           | 0%       | Low      |
| Error Handling (TDD)       | ⏳ Not Started | 0/3           | 0/3           | 0%       | Low      |

**Overall TDD Progress:**

- **Features Developed**: 0/7 (0%)
- **Tests Written**: 0/25 (0%)
- **Tests Passing**: 0/25 (0%)
- **Coverage**: 0% (Target: >85%)

## 🎯 **TDD DEVELOPMENT APPROACH**

### **TDD Build Order:**

1. **Start with 3D Scene TDD**: Write tests for 3D display, then implement
2. **Vehicle Selection TDD**: Write dropdown tests, then implement component
3. **Integration TDD**: Write tests for selector → 3D connection, then connect
4. **Color Picker TDD**: Write color tests, then implement color changes
5. **UI Layout TDD**: Write layout tests, then polish interface
6. **Optional Features TDD**: If time permits, TDD approach for extras

### **TDD Best Practices:**

- **Always RED first**: Every feature starts with failing test
- **Keep GREEN minimal**: Write only enough code to pass tests
- **REFACTOR confidently**: Tests protect against regressions
- **Test behavior, not implementation**: Focus on what components do
- **Mock 3D components**: Keep tests fast and reliable
- **Maintain coverage**: Keep >85% coverage throughout
- **Quality gates**: All tests + TypeScript + ESLint must pass before commits

**Estimated Time**: 1-2 weeks (TDD may seem slower initially but prevents bugs and enables faster development overall)

---

**Phase 1 focuses on TDD development of core 3D customization. Test-first approach ensures reliable prototype with confidence for future improvements!**
