# App Icons and Splash Screens Guide

This guide provides instructions for creating and implementing proper app icons and splash screens for the Time Tracker app on both Android and iOS platforms.

## Required Icon Sizes

### Android Icons
- 48x48 (mdpi)
- 72x72 (hdpi)
- 96x96 (xhdpi)
- 144x144 (xxhdpi)
- 192x192 (xxxhdpi)
- 512x512 (Play Store)
- 1024x1024 (Play Store feature graphic)

### iOS Icons
- 180x180 (iPhone)
- 167x167 (iPad Pro)
- 152x152 (iPad, iPad mini)
- 120x120 (iPhone)
- 1024x1024 (App Store)

### Web App Icons (already in manifest.json)
- 192x192
- 512x512

## Splash Screen Sizes

### Android Splash Screens
- 320x480 (mdpi)
- 480x800 (hdpi)
- 720x1280 (xhdpi)
- 960x1600 (xxhdpi)
- 1280x1920 (xxxhdpi)

### iOS Splash Screens
- 2048x2732 (iPad Pro)
- 1668x2224 (iPad Pro)
- 1536x2048 (iPad)
- 1242x2688 (iPhone XS Max)
- 1125x2436 (iPhone X/XS)
- 828x1792 (iPhone XR)
- 750x1334 (iPhone 8/7/6s/6)

## Creating App Icons

### Design Guidelines
1. **Keep it simple**: Use a simple, recognizable design
2. **Proper padding**: Leave space around the edges (approximately 15% padding)
3. **Consistent branding**: Use the Time Tracker blue (#3498db) as the primary color
4. **No transparency**: Icons should be fully opaque
5. **Square base**: Start with a square design that will be masked by the OS

### Tools for Creating Icons
- Adobe Illustrator or Photoshop
- [Figma](https://www.figma.com/)
- [Sketch](https://www.sketch.com/)
- [Canva](https://www.canva.com/)
- [Icon Kitchen](https://icon.kitchen/)

### Automated Icon Generation
1. Create a high-resolution master icon (1024x1024)
2. Use an icon generator tool:
   - [App Icon Generator](https://appicon.co/)
   - [MakeAppIcon](https://makeappicon.com/)
   - [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)

## Creating Splash Screens

### Design Guidelines
1. **Centered logo**: Place the Time Tracker logo in the center
2. **Consistent background**: Use the Time Tracker blue (#3498db) as the background
3. **Responsive design**: Ensure the design works on different aspect ratios
4. **Minimal content**: Keep it simple with just the logo and possibly the app name

### Tools for Creating Splash Screens
- Adobe Illustrator or Photoshop
- [Figma](https://www.figma.com/)
- [Canva](https://www.canva.com/)

## Implementation

### For PWA Builder
1. Prepare all required icon sizes
2. When using PWA Builder, upload your icons when prompted during the packaging process
3. PWA Builder will generate the necessary configurations for both Android and iOS

### Manual Implementation for Android (TWA)
1. Place icon files in the appropriate `res/mipmap-*` directories
2. Configure the splash screen in `styles.xml` and `colors.xml`
3. Update the Android Manifest to reference the correct icons and splash screen

### Manual Implementation for iOS
1. Add icons to the Xcode project's asset catalog
2. Configure the splash screen in the LaunchScreen.storyboard file
3. Ensure proper settings in the Info.plist file

## Time Tracker Icon Design

For the Time Tracker app, we recommend a simple clock design with:
- A circular clock face in white
- Blue background (#3498db)
- Clock hands pointing to a specific time (e.g., 10:10)
- Optional "TT" text below the clock face

## Testing Icons and Splash Screens

Before finalizing:
1. Test on multiple device sizes
2. Check how the icon appears on different home screens
3. Verify the splash screen displays correctly during app launch
4. Ensure consistent branding across all sizes and platforms
