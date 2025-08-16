import React, { useLayoutEffect, useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Vector3, Group, Mesh, MeshStandardMaterial } from 'three';

interface SimpleModelLoaderProps {
  path: string;
  color?: string;
}

export const SimpleModelLoader: React.FC<SimpleModelLoaderProps> = ({ path, color = '#FFFFFF' }) => {
  const gltf = useGLTF(path);
  const groupRef = useRef<Group>(null!);

  useLayoutEffect(() => {
    if (gltf.scene && groupRef.current) {
      // 1. Calculate the bounding box of the model
      const box = new Box3().setFromObject(gltf.scene);
      const size = box.getSize(new Vector3());
      const center = box.getCenter(new Vector3());

      // 2. Find the largest dimension to determine the scale factor
      const maxDim = Math.max(size.x, size.y, size.z);
      // Scale the model so its largest dimension is 3 units
      const scale = 3 / maxDim;

      // 3. Apply scale and position adjustments to the wrapper group
      const group = groupRef.current;
      group.scale.set(scale, scale, scale);
      
      // Center the model at the origin
      group.position.x = -center.x * scale;
      group.position.y = -center.y * scale;
      group.position.z = -center.z * scale;
      
      console.log(`[SimpleModelLoader] Auto-scaled model ${path}`, { size, center, scale });
    }
  }, [gltf, path]);

  // Apply color to the model materials
  useEffect(() => {
    if (gltf.scene && color) {
      gltf.scene.traverse((child) => {
        if (child instanceof Mesh && child.material) {
          // Handle both single materials and material arrays
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          
          materials.forEach((material) => {
            if (material instanceof MeshStandardMaterial) {
              // Apply the color to the material
              material.color.set(color);
              material.needsUpdate = true;
            }
          });
        }
      });
      
      console.log(`[SimpleModelLoader] Applied color ${color} to model ${path}`);
    }
  }, [gltf, color, path]);

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} dispose={null} />
    </group>
  );
};

// Enable drei's GLTF cache at compile time
useGLTF.preload = useGLTF.preload ?? (() => {});
