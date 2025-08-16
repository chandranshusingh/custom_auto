# DRACO Decoder Directory

This directory contains the DRACO decoder files for compressed 3D model loading.

## About DRACO

DRACO is a 3D compression library developed by Google that significantly reduces 3D model file sizes while maintaining quality. It's particularly useful for web applications where bandwidth and loading times are critical.

## Required Files

The following files are needed for DRACO decoding:

```
draco/
├── draco_decoder.js       # Main decoder (JavaScript)
├── draco_decoder.wasm     # WebAssembly decoder (faster)
├── draco_wasm_wrapper.js  # WASM wrapper
└── README.md              # This file
```

## Installation

### Option 1: Download from Three.js Examples
1. Go to: https://github.com/mrdoob/three.js/tree/dev/examples/jsm/libs/draco
2. Download the decoder files
3. Place them in this directory

### Option 2: Use CDN (for development)
```javascript
// In ModelLoader.tsx
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
```

### Option 3: NPM Package
```bash
npm install draco3dgltf
# Copy files from node_modules/draco3dgltf/ to public/draco/
```

## Usage

The ModelLoader component is configured to use DRACO decompression:

```typescript
// ModelLoader automatically sets up DRACO if enabled
<ModelLoader 
  modelPath="/models/cars/maruti_swift.glb"
  dracoCompression={true}  // Enable DRACO
/>
```

## Performance Benefits

- **File Size Reduction**: 50-90% smaller files
- **Faster Loading**: Less bandwidth required
- **Quality Maintained**: Lossless compression for geometry
- **Wide Support**: Compatible with modern browsers

## Browser Compatibility

- ✅ Chrome 57+
- ✅ Firefox 52+  
- ✅ Safari 11+
- ✅ Edge 16+
- ⚠️ IE: Not supported (fallback required)

---

**Last Updated**: December 2024  
**Owner**: Development Team  
