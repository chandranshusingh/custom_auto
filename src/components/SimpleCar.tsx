'use client';

import React from 'react';
import { IVehicle } from '@/types';

interface SimpleCarProps {
  vehicle?: IVehicle;
  color?: string;
}

export const SimpleCar: React.FC<SimpleCarProps> = ({ vehicle, color = '#FFFFFF' }) => {
  // Use vehicle color if available, otherwise use the color prop
  const carColor = vehicle ? '#FF6B6B' : color; // Default red for vehicles
  
  return (
    <group>
      {/* Car body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2, 0.8, 4]} />
        <meshStandardMaterial color={carColor} />
      </mesh>

      {/* Car roof */}
      <mesh position={[0, 0.8, -0.5]} castShadow>
        <boxGeometry args={[1.5, 0.6, 2.5]} />
        <meshStandardMaterial color={carColor} />
      </mesh>

      {/* Wheels */}
      <mesh position={[-1.2, -0.4, 1.2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[1.2, -0.4, 1.2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[-1.2, -0.4, -1.2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[1.2, -0.4, -1.2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
};
