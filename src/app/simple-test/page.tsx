'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { SimpleModelLoader } from '@/components/SimpleModelLoader';

export default function SimpleRenderTestPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f0f0f0' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <Suspense fallback={null}>
          {/* Essential Lighting */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} />

          {/* Model Loader */}
          <SimpleModelLoader path="/models/cars/generic-test-car.glb" />

          {/* Environment and Controls */}
          <Environment preset="sunset" />
          <OrbitControls />

          {/* Simple Ground Plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#cccccc" />
          </mesh>
        </Suspense>
      </Canvas>
      <div style={{ position: 'absolute', top: '20px', left: '20px', padding: '10px', background: 'white', border: '1px solid black', zIndex: 10 }}>
        <h1>Simple 3D Render Test</h1>
        <p>Loading model: /models/cars/generic-test-car.glb</p>
        <p>If you see a car, the core rendering is working.</p>
      </div>
    </div>
  );
}
