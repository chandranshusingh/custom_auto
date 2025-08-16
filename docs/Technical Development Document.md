## **Auto Customizer: Technical Development Document**

This document provides a detailed, phase-by-phase technical implementation plan. It is designed to be used with a TDD (Test-Driven Development) methodology and provides specific instructions for an AI assistant like Cursor AI.

### **📋 Essential Reference Documents**

Before development begins, consult these comprehensive standards documents:

- **[3D Asset & Performance Guide](./docs/3D_Asset_Performance_Guide.md)** - Complete optimization for Intel UHD Graphics 770, model specifications, performance benchmarking
- **[Component Design System](./docs/Component_Design_System.md)** - Design tokens, 3D-specific UI patterns, responsive design, accessibility guidelines
- **[Data Schema & Error Handling](./docs/Data_Schema_Error_Handling.md)** - Complete data interfaces, validation schemas, error recovery patterns
- **[Project Master Context](./docs/Project_Master_Context.md)** - System architecture overview and hardware constraints
- **[Development Guide](./docs/Development_Guide.md)** - TDD workflow and development standards

These documents provide the architectural foundation and must be integrated throughout implementation.

### **Phase 0: Project Setup & AI Instructions**

**Goal:** To establish a robust, scalable, and maintainable project structure and define the core development principles for the AI assistant. This phase precedes any feature development.

#### **1\. Instructions for Cursor AI: Core Principles**

- **TDD is Mandatory:** For every feature, component, or function, you **must** write the failing tests first using the specified testing framework (Jest & React Testing Library). Only after the tests are written and have failed should you write the minimum amount of code required to make them pass.
- **Component-Based Architecture:** Decompose every UI element into small, single-responsibility, reusable components following the design system in `docs/Component_Design_System.md`.
- **Strict Typing:** Use TypeScript for the entire project. Define clear interfaces using the comprehensive schemas in `docs/Data_Schema_Error_Handling.md`.
- **Performance-First:** All 3D features must be optimized for Intel UHD Graphics 770 integrated graphics - see `docs/3D_Asset_Performance_Guide.md` for specific constraints.
- **Hardware Constraints:** Target 30 FPS minimum on integrated graphics, <200 MB GPU memory, <15K vertices per car model.
- **Error Handling:** Use the comprehensive error hierarchy from `docs/Data_Schema_Error_Handling.md` - no generic error catching.
- **Design System:** Use design tokens and components from `docs/Component_Design_System.md` for consistent UI.
- **Clear Naming Conventions:** Use PascalCase for components and interfaces (e.g., VehicleSelector.tsx, interface IVehicle), and camelCase for functions and variables (e.g., loadVehicleData).
- **Environment Variables:** All sensitive keys, API URLs, or environment-specific configurations must be managed through .env files. Do not hardcode them.
- **Code Formatting & Linting:** Use ESLint and Prettier to maintain a consistent code style. Configure them to run automatically on save and before each commit.

#### **2\. Project Structure (Next.js)**

Cursor AI, initialize the project with the following structure. This "feature-sliced" design keeps related logic, components, and styles together, making the codebase easier to navigate, maintain, and refactor.

/src  
├── app/ \# Next.js App Router: pages, layouts, API routes  
│ ├── (customizer)/ \# Route group for the main app experience  
│ │ ├── page.tsx  
│ │ └── layout.tsx  
│ └── api/ \# API routes for backend logic  
│ └── ...  
├── components/ \# Shared, reusable UI components (Dumb components)  
│ ├── ui/ \# Primitives: Button, Input, Modal, etc.  
│ └── icons/ \# SVG icon components  
├── features/ \# Feature-specific components (Smart components)  
│ ├── vehicle-selector/  
│ │ ├── components/  
│ │ ├── model/  
│ │ └── index.ts  
│ └── part-customizer/  
│ ├── components/  
│ ├── model/  
│ └── index.ts  
├── lib/ \# Core logic, helpers, and utilities  
│ ├── api.ts \# API fetching logic  
│ ├── hooks.ts \# Custom React hooks  
│ └── utils.ts \# General utility functions  
├── public/ \# Static assets (images, 3D models)  
├── styles/ \# Global styles  
└── types/ \# Global TypeScript type definitions  
 └── index.ts

### **Phase 1: Local MVP Prototype (HTML to Next.js Conversion)**

**Goal:** To rapidly build the V1 web application based on the validated HTML prototype, using the established Next.js structure.

#### **1\. Story: Vehicle Selection**

- **Technical Design:**
  - Create a VehicleSelector feature in /src/features/.
  - The vehicle data will be stored in a JSON file (/public/data/vehicles.json) for this phase.
  - State will be managed using React's useState hook.
  - Create reusable \<Select\> and \<Button\> components in /src/components/ui/.
- **Data Model (/src/types/index.ts):**  
  **Use comprehensive schemas from `docs/Data_Schema_Error_Handling.md`**

  ```typescript
  interface IVehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    category: VehicleCategory;
    models3D: {
      exterior: ModelAsset;
      interior?: ModelAsset;
      wheels: ModelAsset[];
    };
    customizationOptions: CustomizationCategory[];
    basePrice: number;
    currency: string;
    specifications: VehicleSpecifications;
  }

  // Complete data schemas available in docs/Data_Schema_Error_Handling.md
  ```

- **TDD Plan:**
  1. **Test:** Write a test for the VehicleSelector component that asserts:
     - The "Make" dropdown is populated on initial render.
     - Selecting a "Make" populates and enables the "Model" dropdown.
     - The "Load Vehicle" button is disabled until all fields are selected.
  2. **Implement:** Create the VehicleSelector component and related logic to pass the tests.

#### **2\. Story: Visual Customization (3D)**

- **Technical Design:**
  - Create a CustomizerScene feature in /src/features/.
  - Use react-three-fiber and drei to set up the 3D canvas.
  - The 3D model (.glb file) will be loaded from the /public/models/ directory.
  - A state management solution like **Zustand** will be used to manage the customization state (selected color, parts, etc.) and share it between the UI and the 3D scene.
- **Data Model (/src/types/index.ts):**  
  interface ICustomizationState {  
   color: string;  
   wheelId: number;  
   // ... other part IDs  
  }

- **TDD Plan:**
  1. **Test:** Write tests for the Zustand store that assert:
     - The store initializes with default customization values.
     - Actions like setColor and setWheel correctly update the state.
  2. **Implement:** Create the Zustand store. Then, create the 3D components that consume this store and update the model's materials accordingly.

### **Phase 2: Web Marketplace, Authentication & Testing**

**Goal:** To add e-commerce functionality and user accounts, backed by a database.

#### **1\. Story: User Authentication**

- **Technical Design:**
  - Integrate **NextAuth.js**.
  - Set up a PostgreSQL database using a service like **Supabase** or **Railway**.
  - Use the Prisma ORM for database interactions.
  - Create API routes in /src/app/api/auth/\[...nextauth\]/ for handling login, registration, etc.
- **Data Model (Prisma Schema):**  
  model User {  
   id String @id @default(cuid())  
   email String @unique  
   name String?  
   createdAt DateTime @default(now())  
   builds Build\[\]  
  }

  model Build {  
   id String @id @default(cuid())  
   userId String  
   user User @relation(fields: \[userId\], references: \[id\])  
   vehicle Json  
   parts Json  
   createdAt DateTime @default(now())  
  }

- **TDD Plan:**
  1. **Test:** Write API tests using Jest to assert that:
     - The registration endpoint creates a new user.
     - The login endpoint returns a valid session token for correct credentials.
  2. **Implement:** Build the NextAuth.js configuration and API routes to pass the tests.

#### **2\. Story: E-commerce Functionality**

- **Technical Design:**
  - Create a ShoppingCart feature.
  - Use Zustand to manage the cart state globally.
  - Integrate the **Razorpay Web SDK**.
  - Create API routes for creating an order and verifying a payment.
- **Data Model (Prisma Schema):**  
  model Product {  
   id String @id @default(cuid())  
   name String  
   price Int // Store price in paise  
   category String  
   // ... other fields  
  }

- **TDD Plan:**
  1. **Test:** Write tests for the shopping cart store to ensure addItem, removeItem, and calculateTotal functions work correctly. Write API tests for the payment verification endpoint.
  2. **Implement:** Build the cart logic and Razorpay integration to pass the tests.

### **Phase 3: Android App Launch**

**Goal:** To launch a native Android app with AR functionality.

#### **1\. Story: Full Web Parity**

- **Technical Design:**
  - Set up a new **React Native** project (using Expo for simplicity).
  - Create a shared /src/lib/ directory (as a separate package or submodule) to share code (like API fetching logic and type definitions) between the web and mobile apps.
  - The app will be a client that consumes the existing Next.js API.
- **TDD Plan:**
  - Follow the same TDD principles as the web app, using Jest and React Native Testing Library to test components and logic.

#### **2\. Story: "Try in AR" Mode**

- **Technical Design:**
  - Use the expo-three and expo-gl libraries to render the 3D model within the React Native app.
  - Use Expo's AR module, which is a wrapper around Google's **ARCore**.
  - Create a feature that allows the user to place the 3D model from the customizer onto a detected surface in the real world.
- **TDD Plan:**
  - Testing AR features is complex. The focus will be on unit testing the logic that prepares the 3D model for AR rendering and testing the UI components that control the AR experience (e.g., the "Place Car" button). Manual testing on a physical device will be critical.
