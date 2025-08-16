# Thumbnails Directory

This directory contains thumbnail images for vehicle models and parts.

## Structure

```
thumbnails/
├── cars/               # Car model thumbnails
│   ├── maruti_swift.jpg    # 400x300 thumbnail
│   ├── tata_nexon.jpg      # 400x300 thumbnail  
│   ├── honda_city.jpg      # 400x300 thumbnail
│   └── mahindra_thar.jpg   # 400x300 thumbnail
└── README.md           # This file
```

## Requirements

### Image Format
- **Format**: JPEG (.jpg) preferred for photos, PNG for graphics
- **Dimensions**: 400x300 pixels (4:3 aspect ratio)
- **File Size**: <100KB per thumbnail
- **Quality**: 85% JPEG quality for balance of size/quality

### Content Guidelines
- **View**: 3/4 front view angle for consistency
- **Background**: Clean white or transparent background
- **Lighting**: Even lighting, no harsh shadows
- **Framing**: Car fills ~80% of frame
- **Colors**: Representative of actual car paint colors

### Indian Car Thumbnails Needed

1. **Maruti Swift** - Popular hatchback
   - Colors: Pearl White, Midnight Black, Metallic Blue
   - File: `maruti_swift.jpg`

2. **Tata Nexon** - Compact SUV
   - Colors: Flame Red, Daytona Grey, Foliage Green
   - File: `tata_nexon.jpg`

3. **Honda City** - Sedan
   - Colors: Platinum White, Radiant Red, Golden Brown
   - File: `honda_city.jpg`

4. **Mahindra Thar** - Off-road SUV  
   - Colors: Rocky Beige, Napoli Black, Mystic Copper
   - File: `mahindra_thar.jpg`

## Usage

Thumbnails are used in:
- Vehicle selector component
- Model loading preview
- Shopping cart items
- Build gallery

## Optimization

- Compress images using tools like TinyPNG
- Use responsive images for different screen sizes
- Implement lazy loading for performance
- Consider WebP format for better compression

---

**Last Updated**: December 2024  
**Owner**: Development Team  