import '@testing-library/jest-dom';

// Mock Three.js and React Three Fiber for testing
jest.mock('three', () => ({
  Scene: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    remove: jest.fn(),
    children: [],
    background: null,
  })),
  PerspectiveCamera: jest.fn().mockImplementation(() => ({
    position: { set: jest.fn() },
    lookAt: jest.fn(),
    aspect: 1,
    updateProjectionMatrix: jest.fn(),
  })),
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    render: jest.fn(),
    domElement: document.createElement('canvas'),
    dispose: jest.fn(),
  })),
  AmbientLight: jest.fn().mockImplementation(() => ({
    intensity: 1,
    dispose: jest.fn(),
  })),
  DirectionalLight: jest.fn().mockImplementation(() => ({
    intensity: 1,
    position: { set: jest.fn() },
    dispose: jest.fn(),
  })),
  Mesh: jest.fn().mockImplementation(() => ({
    position: { set: jest.fn() },
    rotation: { set: jest.fn() },
    scale: { set: jest.fn() },
    dispose: jest.fn(),
  })),
  BoxGeometry: jest.fn().mockImplementation(() => ({
    dispose: jest.fn(),
  })),
  MeshStandardMaterial: jest.fn().mockImplementation(() => ({
    color: { setHex: jest.fn() },
    dispose: jest.fn(),
  })),
  Vector3: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    copy: jest.fn(),
  })),
  Euler: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    copy: jest.fn(),
  })),
}));

// Mock React Three Fiber components
jest.mock('@react-three/fiber', () => {
  const React = require('react');
  const originalModule = jest.requireActual('@react-three/fiber');

  return {
    ...originalModule,
    Canvas: ({ children }) => <div data-testid="canvas">{children}</div>,
    // Mock other R3F components that are used as primitive elements
    ambientLight: (props) => <div data-testid="ambient-light" {...props} />,
    directionalLight: (props) => <div data-testid="directional-light" {...props} />,
    mesh: (props) => <div data-testid="mesh" {...props} />,
    planeGeometry: (props) => <div data-testid="plane-geometry" {...props} />,
    shadowMaterial: (props) => <div data-testid="shadow-material" {...props} />,
    group: (props) => <div data-testid="group" {...props} />,
    primitive: (props) => <div data-testid="primitive" {...props} />,
  };
});

jest.mock('@react-three/drei', () => ({
  OrbitControls: ({
    enablePan,
    enableZoom,
    enableRotate,
    minDistance,
    maxDistance,
    minPolarAngle,
    maxPolarAngle,
    autoRotate,
    autoRotateSpeed,
    ...props
  }) => <div data-testid="orbit-controls" {...props} />,
  useGLTF: jest.fn(() => ({
    scene: { children: [] },
    animations: [],
  })),
  Environment: ({ ...props }) => <div data-testid="environment" {...props} />,
}));

global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

// Mock window.matchMedia for responsive testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
