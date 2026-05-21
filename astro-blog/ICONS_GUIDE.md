# Maasdam Gaming - Icon Design Guide

## Icons You Should Create/Use

### Server Icons (High Priority)
1. **Minecraft Server Icon** ⛏️
   - Size: 64x64px (upscaled to 3rem)
   - Style: 8-bit blocky Minecraft aesthetic
   - Colors: Earth tones (greens, browns, oranges)
   - Concept: Minecraft pickaxe or crafting table

2. **Rimworld Server Icon** 🚀
   - Size: 64x64px (upscaled to 3rem)
   - Style: Sci-fi/retro-futuristic
   - Colors: Blues, purples, teals
   - Concept: Spaceship, rocket, or alien landscape

### UI Icons (Medium Priority)
3. **Copy Icon** 📋
   - For "Copy IP" buttons
   - Style: Simple line art
   - Usage: Server card action button

4. **Discord Icon** 💬
   - For footer/header links
   - Already using SVG, but you can customize colors

5. **Blog/News Icon** 📰
   - For blog section header
   - Style: Newspaper or document

### Navigation Icons (Low Priority - Optional)
6. **Home Icon** 🏠
7. **Settings Icon** ⚙️
8. **Rules/Shield Icon** 🛡️

## Design Tips

### Color Palette
- **Primary (Accent):** #4ade80 (Minecraft Green)
- **Secondary:** #06b6d4 (Rimworld Cyan)
- **Dark Background:** rgba(20, 24, 30)
- **Highlight:** #16a34a (Dark Green)

### Style Recommendations
- Keep icons **simple and bold**
- Use **8-bit or pixelated style** for gaming aesthetic
- Ensure icons work at **32x32px** minimum
- Use **glowing effects** with accent colors

### Tools Suggestions
- **Aseprite** - Pixel art editor (paid, best for 8-bit)
- **Piskel** - Free online pixel art tool
- **Krita** - Free advanced editor
- **GIMP** - Free image editor
- **Figma** - Design tool (free tier available)

## Implementation
Once created, save icons as:
- PNG format with transparency (recommended)
- SVG format for scalability
- Save to: `src/assets/icons/`

You can use them in components like:
```astro
<img src={import('../assets/icons/minecraft.png')} alt="Minecraft" class="server-icon" />
```

Or embed SVGs directly in components for better styling control.
