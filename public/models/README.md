# 3D Models Directory

This directory contains the 3D model assets for the Auto Customizer application.

## Structure

```
models/
├── cars/           # Car model files (.glb/.gltf)
│   ├── maruti_swift.glb
│   ├── tata_nexon.glb
│   ├── honda_city.glb
│   └── mahindra_thar.glb
├── README.md       # This file
```

## Requirements

### File Format
- **Primary**: .glb (binary GLTF) - preferred for smaller file sizes
- **Secondary**: .gltf (text GLTF) - for development and debugging

### Performance Targets
- **File Size**: <10MB per model (with DRACO compression)
- **Polygon Count**: 
  - Desktop: <50K polygons
  - Mobile: <20K polygons (LOD optimization)
- **Texture Resolution**: 
  - Desktop: 2048x2048 max
  - Mobile: 1024x1024 max

### Model Requirements
- **Scale**: Real-world scale (meters)
- **Position**: Centered at origin (0,0,0)
- **Rotation**: Forward facing (positive Z-axis)
- **Materials**: PBR materials preferred
- **Textures**: Embedded or in same directory
- **Animation**: Optional (engine idle, wheel rotation)

## Indian Car Models Needed

### Priority 1 (Immediate)
- **Maruti Swift** (2024) - Most popular compact car
  - Target file: `maruti_swift.glb`
  - Reference: ZXi variant

### Priority 2 (Phase 1)
- **Tata Nexon** (2024) - Popular compact SUV
- **Honda City** (2024) - Premium sedan  
- **Mahindra Thar** (2024) - Off-road SUV

## DRACO Compression

DRACO compression should be applied to reduce file sizes:
- Decoder files should be in `/public/draco/` directory
- Enable compression for production builds
- Test compatibility with Three.js loaders

## Testing

All models should be tested with:
1. ModelLoader component
2. Performance monitoring (60 FPS desktop, 30 FPS mobile)
3. Memory usage (<200MB total)
4. Loading time (<3s per model)

## Sources

### Free Model Sources
- **Sketchfab**: (Creative Commons models)
- **TurboSquid**: (Free models section)  
- **Free3D**: Open source car models
- **Blender Open Projects**: Reference models

### Custom Modeling
- Created in Blender/Maya
- Follow PBR workflow
- Optimize for web performance
- Test in Three.js environment

---

**Last Updated**: December 2024  
**Owner**: Development Team  