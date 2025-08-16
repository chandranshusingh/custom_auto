'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { SimpleCar } from './SimpleCar';
import { SimpleModelLoader } from './SimpleModelLoader';
import { IVehicle } from '@/types';

interface CarSceneProps {
  vehicle?: IVehicle | null;
  colorHex?: string;
}

// Loading indicator component removed - using SimpleCar as fallback instead

export const CarScene: React.FC<CarSceneProps> = ({ 
  vehicle, 
  colorHex = '#FFFFFF' 
}) => {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [5, 3, 5], fov: 50 }}
        style={{ background: 'transparent' }}
        shadows
      >
        <Suspense fallback={null}>
          {/* Lighting Setup */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <directionalLight
            position={[-10, 10, -5]}
            intensity={0.5}
          />
          
          {/* 3D Model */}
          {vehicle && vehicle.modelPath ? (
            <SimpleModelLoader path={vehicle.modelPath} color={colorHex} />
          ) : (
            <SimpleCar color={colorHex} />
          )}
          
          {/* Environment */}
          <Environment preset="city" />
          
          {/* Camera Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={10}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            autoRotate
            autoRotateSpeed={1}
          />
          
          {/* Ground */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1, 0]}
            receiveShadow
          >
            <planeGeometry args={[50, 50]} />
            <shadowMaterial opacity={0.3} />
          </mesh>
        </Suspense>
      </Canvas>
      
      {/* Controls Hint */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-gray-600 shadow-sm">
        <span className="font-medium">Mouse:</span> Rotate • <span className="font-medium">Scroll:</span> Zoom
      </div>
    </div>
  );
};