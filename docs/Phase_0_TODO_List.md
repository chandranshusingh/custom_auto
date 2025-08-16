# Phase 0 - Basic Setup for Prototype

**Status**: 🚧 **TO DO** - Project setup phase for local prototype  
**Timeline**: Week 1, Day 1  
**Goal**: Get basic development environment ready

---

## 🛠️ **SETUP TASKS**

### **TDD Project Initialization**

- [ ] Create Next.js project: `npx create-next-app@latest auto-customizer --typescript --tailwind --app`
- [ ] Install 3D dependencies: `npm install @react-three/fiber @react-three/drei three`
- [ ] **TDD Setup**: Install testing dependencies: `npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom`
- [ ] **TDD Setup**: Create jest.config.js with Next.js integration
- [ ] **TDD Setup**: Create jest.setup.js with 3D mocks
- [ ] Set up basic folder structure including **tests** folder
- [ ] Verify `npm run dev` AND `npm run test:watch` both start without errors

### **TDD-Ready Folder Structure**

```
src/
├── app/
│   ├── page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── VehicleSelector.tsx
│   ├── ColorPicker.tsx
│   ├── WheelSelector.tsx
│   └── CarScene.tsx
├── __tests__/
│   ├── VehicleSelector.test.tsx
│   ├── ColorPicker.test.tsx
│   ├── CarScene.test.tsx
│   └── integration/
│       └── UserFlow.test.tsx
├── data/
│   └── (for JSON files if needed)
└── types.ts (strict type definitions)

Root level:
├── jest.config.js (Jest configuration)
├── jest.setup.js (3D mocks and test setup)
└── public/
    └── models/
        ├── car1.glb
        ├── car2.glb
        └── wheel1.glb
```

### **TDD Phase 0 Complete When:**

- ✅ Project created with ALL dependencies installed (including testing)
- ✅ Dev server starts without errors (`npm run dev`)
- ✅ **TDD Environment**: Test watcher starts without errors (`npm run test:watch`)
- ✅ **Sample Test**: At least one passing test to verify TDD setup works
- ✅ **3D Mocks**: Jest setup with React Three Fiber mocks configured
- ✅ **Quality Gates**: `npm run validate` command configured and working
- ✅ TDD-ready folder structure exists with **tests** directory
- ✅ Ready to start TDD development cycle (RED-GREEN-REFACTOR)

**Estimated Time**: 2-3 hours (additional time for TDD setup)

---

**Phase 0 establishes TDD foundation for prototype development. Critical: TDD environment must work before any feature development begins!**
