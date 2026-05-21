# How to Add Your Custom Logo Icon

## Current Setup
Right now, the site uses a **gamepad emoji** (🎮) as the placeholder logo next to "maasdam.online"

## Option 1: Use a PNG Image Icon

### Step 1: Create/Save Your Icon
- Save your icon as: `src/assets/logo.png` (64x64px recommended)
- Make sure it has a transparent background (PNG format)

### Step 2: Update consts.ts
Change this line in `src/consts.ts`:
```typescript
export const SITE_LOGO = '🎮'; // Replace with custom icon path
```

To:
```typescript
import logo from '../assets/logo.png';
export const SITE_LOGO_IMAGE = logo;
```

### Step 3: Update Header.astro
In `src/components/Header.astro`, replace the logo part:

**Current:**
```astro
<span class="logo-icon">{SITE_LOGO}</span>
```

**New:**
```astro
<img src={SITE_LOGO_IMAGE.src} alt="maasdam.online" class="logo-icon" />
```

And update the import:
```astro
import { SITE_TITLE, SITE_LOGO_IMAGE } from '../consts';
```

### Step 4: Update CSS in Header.astro
Change the logo-icon style:

```css
.logo-icon {
	width: 16px;
	height: 16px;
	line-height: 1;
	display: inline-block;
}
```

---

## Option 2: Use an SVG Icon (Recommended)

SVGs are scalable and perfect for logos!

### Step 1: Save SVG
- Save your logo as: `src/assets/logo.svg`

### Step 2: Update Header.astro
Embed the SVG directly:

```astro
<svg viewBox="0 0 64 64" class="logo-icon">
	<use href="/logo.svg#icon"/>
</svg>
```

Or place `logo.svg` in `public/` folder and reference it.

---

## Option 3: Keep the Emoji
If you like the emoji, you can change it to something else:

In `consts.ts`:
```typescript
export const SITE_LOGO = '🎮'; // Gamepad
// Or try:
// export const SITE_LOGO = '⚙️';  // Gear
// export const SITE_LOGO = '🖥️';  // Computer
// export const SITE_LOGO = '🌐'; // Globe
// export const SITE_LOGO = '📡'; // Satellite
```

---

## File Structure After Adding Custom Icon
```
astro-blog/
├── src/
│   ├── assets/
│   │   ├── logo.png      ← Your custom logo
│   │   ├── icons/
│   │   │   ├── minecraft.png
│   │   │   └── rimworld.png
│   │   └── ...
│   ├── components/
│   └── ...
```

---

## Quick Tips
- **Icon size**: 64x64px or larger (Astro will handle scaling)
- **Format**: PNG (for images) or SVG (for scalability)
- **Background**: Transparent PNG recommended
- **Style**: Matches Win95 aesthetic - simple, bold
- **Location**: Keep in `src/assets/` for best performance
