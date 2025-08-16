# DRACO Decoder Setup Instructions

## Quick Setup (Development)

For development, you can use CDN-hosted DRACO decoders by updating the ModelLoader:

```typescript
// In ModelLoader.tsx, update DRACO path to use CDN
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
```

## Production Setup (Local Files)

For production, download these files to `/public/draco/`:

### Required Files:
1. **draco_decoder.js** - Main decoder (JavaScript)
2. **draco_decoder.wasm** - WebAssembly decoder (faster)
3. **draco_wasm_wrapper.js** - WASM wrapper

### Download Sources:
1. **Three.js Repository**: https://github.com/mrdoob/three.js/tree/dev/examples/jsm/libs/draco/gltf
2. **Google DRACO**: https://github.com/google/draco/tree/master/javascript
3. **NPM Package**: 
   ```bash
   npm install draco3dgltf
   # Copy files from node_modules/draco3dgltf/
   ```

### Current Status:
- ✅ Directory structure created
- ⏳ Decoder files - Using CDN for development  
- ⏳ Local files - To be added for production

## Test Command:
```bash
# Test DRACO compression is working
npm run dev
# Check browser console for DRACO loader initialization
```
