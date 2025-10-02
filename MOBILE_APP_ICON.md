# Mobile App Icon Setup

## Current Icon

The PawDNA app uses a custom paw print icon located at `public/paw-icon.png`.

## Web Browser

The icon is automatically set as the favicon and will appear in browser tabs and bookmarks.

## Mobile App (iOS & Android)

To use the paw print icon in your mobile app after exporting to GitHub:

### 1. Export to GitHub
First export your project using the GitHub button in Lovable.

### 2. Generate App Icons
After cloning your repo locally, you'll need to generate platform-specific icons:

**For iOS:**
- Create icon sizes: 1024x1024 (App Store), 180x180, 120x120, 87x87, 80x80, 76x76, 60x60, 58x58, 40x40, 29x29, 20x20
- Place in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

**For Android:**
- Create icon sizes: 512x512 (Play Store), xxxhdpi (192x192), xxhdpi (144x144), xhdpi (96x96), hdpi (72x72), mdpi (48x48)
- Place in `android/app/src/main/res/` folders (mipmap-xxxhdpi, mipmap-xxhdpi, etc.)

### 3. Use Icon Generator Tool (Recommended)

The easiest way is to use an online icon generator:

1. Go to [https://icon.kitchen](https://icon.kitchen) or [https://www.appicon.co](https://www.appicon.co)
2. Upload `public/paw-icon.png`
3. Download the generated icon packs for iOS and Android
4. Extract and copy to the appropriate directories mentioned above

### 4. Update Capacitor Config

The `capacitor.config.ts` file already includes the app name:
```typescript
appName: 'paw-dna-breed-hub'
```

### 5. Sync Changes

After adding icons:
```bash
npx cap sync ios
npx cap sync android
```

## Design Details

The paw print icon features:
- Simple, clean silhouette design
- Single color that adapts to light/dark themes
- Four toe pads and one larger central pad
- Professional appearance suitable for app stores
- High resolution for all screen sizes

## Notes

- The icon works automatically in the web browser
- For mobile apps, you must manually generate and add platform-specific icon sizes
- Always test the icon on both light and dark backgrounds
- The icon should remain recognizable even at small sizes (29x29px)
