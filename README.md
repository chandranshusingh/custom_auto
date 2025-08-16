# Auto Customizer

**3D Car Customization Platform with AR Capabilities**

**Status:** 🚧 **In Development** - Phase-based implementation following TDD methodology

---

## 🎯 System Overview

Auto Customizer is a comprehensive 3D car customization platform that combines:

- **Next.js-based web application** with React Three Fiber for 3D rendering
- **Component-based architecture** with feature-sliced design pattern
- **Test-Driven Development** methodology with comprehensive test coverage
- **Progressive enhancement** from local prototype to full marketplace
- **Cross-platform strategy** with web-first launch followed by Android AR app

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Windows 10/11 (local development)
- Git for version control

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd auto-customizer

# Install dependencies
npm install
# or
yarn install
```

### Running the System

```bash
# Start development server
npm run dev
# or
yarn dev

# Build for production
npm run build
# or
yarn build
```

## 🧪 Testing (TDD Methodology)

### Test-Driven Development Approach

**TDD is Mandatory:** For every feature, component, or function, write failing tests first using Jest & React Testing Library. Only after tests fail should you write the minimum code required to make them pass.

### Test Coverage

- **Unit Tests** - Jest & React Testing Library for component testing ✅
- **Integration Tests** - Component interaction testing ✅
- **E2E Tests** - Cypress for complete user journey validation ✅
- **Performance Tests** - Lighthouse & WebPageTest for 3D performance ✅

### Running Tests

```bash
# Run all tests
npm test
# or
yarn test

# Run tests in watch mode (recommended for development)
npm run test:watch
# or
yarn test:watch

# Run E2E tests
npm run test:e2e
# or
yarn test:e2e

# Run performance tests
npm run test:performance
# or
yarn test:performance
```

### TDD Workflow Example

```bash
# 1. Write failing test first
npm run test:watch

# 2. Write minimum code to make test pass
# 3. Refactor while keeping tests green
# 4. Commit when all tests pass
```

## 🛠️ Development Requirements

### Core Development Principles

- **TDD is Mandatory:** Write failing tests first, then implement features
- **Component-Based Architecture:** Decompose UI into small, reusable components
- **Strict TypeScript:** Use TypeScript throughout with clear interfaces
- **Feature-Sliced Design:** Organize code by features, not technical layers

### Development Workflow

```bash
# 1. Start from project root
cd auto-customizer

# 2. Install dependencies if not already done
npm install

# 3. Start development server
npm run dev

# 4. Run tests in watch mode (recommended)
npm run test:watch

# 5. Ensure TypeScript compilation passes
npm run type-check
```

### Project Structure (Feature-Sliced Design)

```
/src
├── app/                # Next.js App Router: pages, layouts, API routes
│   ├── (customizer)/   # Route group for main app experience
│   │   ├── page.tsx
│   │   └── layout.tsx
│   └── api/            # API routes for backend logic
├── components/         # Shared, reusable UI components
│   ├── ui/             # Primitives: Button, Input, Modal, etc.
│   └── icons/          # SVG icon components
├── features/           # Feature-specific components
│   ├── vehicle-selector/
│   │   ├── components/
│   │   ├── model/
│   │   └── index.ts
│   └── part-customizer/
│       ├── components/
│       ├── model/
│       └── index.ts
├── lib/                # Core logic, helpers, utilities
│   ├── api.ts          # API fetching logic
│   ├── hooks.ts        # Custom React hooks
│   └── utils.ts        # General utility functions
├── public/             # Static assets (images, 3D models)
├── styles/             # Global styles
└── types/              # Global TypeScript type definitions
    └── index.ts
```

## 🚨 Common Pitfalls & Troubleshooting

### TypeScript Compilation Errors

**Problem**: TypeScript compilation fails

```bash
# ✅ SOLUTION: Check for type errors
npm run type-check

# Fix common issues:
# - Add proper type definitions in /src/types/
# - Ensure all imports have correct file extensions
# - Use proper TypeScript interfaces for props
```

### 3D Model Loading Issues

**Problem**: 3D models fail to load or render

```bash
# ✅ SOLUTION: Verify model files and paths
# - Check that .glb files are in /public/models/
# - Ensure correct file paths in components
# - Verify react-three-fiber setup
```

### Test Failures

**Problem**: Tests fail or don't run properly

```bash
# ✅ SOLUTION: Check test setup
npm run test

# Common fixes:
# - Ensure Jest and React Testing Library are configured
# - Check for proper test file naming (*.test.tsx)
# - Verify component imports in test files
```

### Port Conflicts

**Problem**: Port 3000 already in use

```bash
# ✅ SOLUTION: Use different port or kill process
npm run dev -- -p 3001

# Or on Windows:
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

## 📊 System Architecture & Development Phases

### Phase-Based Development Approach

| Phase                      | Goal                                  | Duration | Key Technologies                  |
| -------------------------- | ------------------------------------- | -------- | --------------------------------- |
| **Phase 1: Local MVP**     | HTML prototype with 2D layered images | 2 weeks  | HTML5, Tailwind CSS, Vanilla JS   |
| **Phase 2: V1 Web Launch** | 3D customizer with local storage      | 8 weeks  | Next.js, React Three Fiber, Drei  |
| **Phase 3: Marketplace**   | User accounts, e-commerce, payments   | 10 weeks | NextAuth.js, PostgreSQL, Razorpay |
| **Phase 4: Android App**   | AR functionality with mobile app      | TBD      | React Native, ARCore              |

### Current Architecture (Phase 2+)

```
auto-customizer/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (customizer)/        # Main customizer routes
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   └── api/                 # API routes
│   │       ├── vehicles/        # Vehicle data endpoints
│   │       └── parts/           # Parts data endpoints
│   ├── components/              # Shared UI components
│   │   ├── ui/                  # Primitive components
│   │   │   ├── Button.tsx
│   │   │   ├── Select.tsx
│   │   │   └── Modal.tsx
│   │   └── icons/               # SVG icon components
│   ├── features/                # Feature-specific components
│   │   ├── vehicle-selector/
│   │   │   ├── components/
│   │   │   │   ├── VehicleSelector.tsx
│   │   │   │   └── DropdownCascade.tsx
│   │   │   ├── model/
│   │   │   │   └── types.ts
│   │   │   └── index.ts
│   │   ├── part-customizer/
│   │   │   ├── components/
│   │   │   │   ├── PartSelector.tsx
│   │   │   │   └── ColorPicker.tsx
│   │   │   ├── model/
│   │   │   └── index.ts
│   │   └── customizer-scene/
│   │       ├── components/
│   │       │   ├── Scene3D.tsx
│   │       │   ├── CameraControls.tsx
│   │       │   └── VehicleModel.tsx
│   │       └── hooks/
│   │           └── useCustomizationState.ts
│   ├── lib/                     # Core utilities
│   │   ├── api.ts              # API client
│   │   ├── hooks.ts            # Custom React hooks
│   │   ├── store.ts            # Zustand state management
│   │   └── utils.ts            # Utility functions
│   ├── public/
│   │   ├── data/               # JSON data files
│   │   │   └── vehicles.json
│   │   └── models/             # 3D model files (.glb)
│   ├── styles/                 # Global styles
│   └── types/                  # TypeScript definitions
│       └── index.ts
├── __tests__/                  # Test files
├── docs/                       # Documentation
├── package.json               # Dependencies
└── README.md                  # Project documentation
```

## 🔧 API Endpoints

### Vehicle Data (Phase 2+)

- `GET /api/vehicles` - Get all vehicle makes and models
- `GET /api/vehicles/{make}` - Get models for specific make
- `GET /api/vehicles/{make}/{model}` - Get vehicle details and available parts

### Customization Data

- `GET /api/parts` - Get all customizable parts categories
- `GET /api/parts/{category}` - Get parts for specific category (colors, wheels, etc.)
- `GET /api/models/{vehicleId}` - Get 3D model file path for vehicle

### Build Management (Local Storage - Phase 2)

- Client-side localStorage for saving/loading builds
- No server-side persistence until Phase 3

### User & E-commerce (Phase 3+)

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/builds` - Get user's saved builds
- `POST /api/user/builds` - Save new build
- `GET /api/cart` - Get shopping cart contents
- `POST /api/cart/add` - Add item to cart
- `POST /api/orders` - Create order
- `POST /api/payment/verify` - Verify Razorpay payment

## 📈 Performance Metrics

### 3D Web Application Targets

- **Initial Load Time**: < 3 seconds for base application
- **3D Model Load Time**: < 5 seconds for vehicle models
- **Frame Rate**: 60 FPS on desktop, 30 FPS minimum on mobile
- **Memory Usage**: < 1GB for 3D scene rendering
- **API Response Time**: < 500ms for vehicle/parts data

### Performance Testing Tools

- **Lighthouse**: Core Web Vitals and performance scoring
- **WebPageTest**: Network performance analysis
- **Chrome DevTools**: 3D rendering performance profiling
- **React DevTools Profiler**: Component render optimization

## 🎨 Features by Phase

### Phase 1: Local MVP (2 weeks)

- ✅ **Vehicle Selection**: Cascading dropdowns for make/model/year/trim
- ✅ **Visual Customization**: 2D layered image system for real-time preview
- ✅ **Categorized Parts**: Organized part categories (paint, wheels, body kits)
- ✅ **Single File Deployment**: Standalone HTML file with embedded assets

### Phase 2: V1 Web Launch (8 weeks) 🚧 In Progress

- 🚧 **3D Customizer**: Interactive 3D vehicle models with React Three Fiber
- 🚧 **Camera Controls**: Rotate, pan, zoom around 3D model
- 🚧 **Real-time Material Updates**: Instant color/texture changes on 3D model
- 🚧 **Local Build Saving**: Browser localStorage for build persistence
- 🚧 **Social Sharing**: Generate spec sheet images for social media

### Phase 3: Marketplace (10 weeks) ⏳ Planned

- ⏳ **User Authentication**: NextAuth.js with email/password
- ⏳ **E-commerce Integration**: Shopping cart with Razorpay payments
- ⏳ **User Profile**: "My Garage" with saved builds and order history
- ⏳ **Partner Integration**: Local garage finder for part installation
- ⏳ **Database Persistence**: PostgreSQL with Prisma ORM

### Phase 4: Android App ⏳ Planned

- ⏳ **Cross-Platform Parity**: React Native with full web feature set
- ⏳ **AR Experience**: ARCore integration for real-world car placement
- ⏳ **Mobile-Optimized UI**: Touch-first interface design
- ⏳ **Offline Capability**: Local caching for vehicle data

## 📝 Documentation

- **[Project Master Context](docs/Project_Master_Context.md)** - System architecture and design
- **[Development Status Dashboard](docs/Development_Status_Dashboard.md)** - **MANDATORY**: Project progress tracking and phase completion status
- **[Phase 1 TODO List](docs/Phase_1_TODO_List.md)** - Prototype TDD development priorities and status
- **[Testing Guide](docs/Testing_Guide.md)** - Testing procedures and TDD methodology
- **[Development Guide](docs/Development_Guide.md)** - Development practices
- **[Startup Guide](docs/STARTUP_GUIDE.md)** - Development environment setup

## 🤝 Contributing

### Development Standards

- **TypeScript**: Strict typing throughout, clear interfaces for all data models
- **React**: Component-based architecture with single responsibility principle
- **Next.js**: App Router pattern with proper file-based routing
- **3D Graphics**: React Three Fiber best practices for performance
- **Testing**: TDD methodology mandatory - write failing tests first
- **Naming**: PascalCase for components/interfaces, camelCase for functions

### Code Quality Requirements

- **TypeScript**: Zero compilation errors, strict mode enabled
- **Test Coverage**: Target 90%+ coverage with meaningful tests
- **Performance**: Meet 3D rendering performance benchmarks
- **Accessibility**: WCAG 2.1 AA compliance for all UI components
- **Code Formatting**: ESLint + Prettier configured, auto-format on save

### TDD Workflow (Mandatory)

1. **Red**: Write failing test for new feature/component
2. **Green**: Write minimum code to make test pass
3. **Refactor**: Improve code while keeping tests green
4. **Update Dashboard**: Update [Development Status Dashboard](docs/Development_Status_Dashboard.md) with task completion
5. **Repeat**: For each new feature or bug fix

### Development Status Tracking (MANDATORY)

**All developers must update the [Development Status Dashboard](docs/Development_Status_Dashboard.md) when:**

- Completing any task or user story
- Finishing a sprint or phase
- Achieving quality milestones (test coverage, performance targets)
- Identifying risks, blockers, or lessons learned

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support & Development Status

### Getting Help

1. **Check Common Pitfalls** section above for 3D/TypeScript issues
2. **Review Documentation** in the `docs/` directory
3. **Run Tests** with `npm test` to verify system status
4. **Check Browser Console** for 3D rendering or WebGL errors

### Current Development Status

- **Current Phase**: Phase 2 (V1 Web Launch) 🚧 In Progress
- **Last Updated**: January 2025
- **Test Framework**: TDD with Jest & React Testing Library
- **3D Engine**: React Three Fiber integration in progress
- **Next Steps**: Complete 3D customizer MVP, implement local storage

### Tech Stack Status

- ✅ **Next.js 14+**: App Router configured
- 🚧 **React Three Fiber**: 3D scene setup in progress
- 🚧 **TypeScript**: Interfaces defined, implementation ongoing
- ⏳ **Testing**: Jest & React Testing Library setup planned
- ⏳ **State Management**: Zustand integration planned

---

**Note**: Auto Customizer is currently in active development following a phased approach. Phase 1 (HTML prototype) complete, Phase 2 (3D web app) in progress. Database and authentication features planned for Phase 3.
