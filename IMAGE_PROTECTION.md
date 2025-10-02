# Image Protection & Screenshot Prevention

## Overview
PawDNA implements multi-layered protection for pet images to prevent unauthorized use, theft, and screenshot capture.

## Protection Layers

### 1. Automatic Watermarking ✅

#### How It Works
- **Client-Side Processing**: All images are watermarked immediately upon upload, before being stored
- **Diagonal Pattern**: "PawDNA.org" text repeated diagonally across the entire image
- **Timestamp**: Copyright notice with date added to bottom-right corner
- **Semi-Transparent**: 30% opacity to preserve image visibility while deterring theft
- **Cannot Be Bypassed**: Watermarking happens before upload, so original images never reach the server

#### Implementation Details
```typescript
// Watermark features:
- Diagonal text pattern every 150-200px
- Font size scales with image dimensions (responsive)
- Semi-transparent white text with black outline
- Copyright notice: "© PawDNA [DATE]"
- Applied to ALL pet photos and parent photos
```

#### User Experience
1. User selects images to upload
2. Watermark is automatically applied (shows loading spinner)
3. Preview shows both original and watermarked versions
4. Upload counter shows number of processed images
5. Watermarked images are displayed in thumbnail grid

### 2. Screenshot Prevention 🛡️

#### Web Protection (Active)
- **Keyboard Shortcuts Blocked**:
  - Windows/Linux: PrintScreen, Ctrl+PrintScreen, Win+PrintScreen, Win+Shift+S
  - Mac: Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5
- **CSS Protection**:
  - User-select disabled (prevents text/image selection)
  - Print media hidden (prevents print-to-PDF screenshots)
- **Visual Feedback**: Toast notification when screenshot attempt is detected

#### Mobile Protection (Capacitor)
- **iOS**: Screenshot detection and prevention via native code
- **Android**: FLAG_SECURE prevents screenshots and screen recording
- **Visual Feedback**: Toast notification when screenshot attempt is detected

##### Setup Instructions for Mobile
After pulling code from GitHub:
```bash
# 1. Install dependencies
npm install

# 2. Add platforms
npx cap add ios    # For iOS
npx cap add android # For Android

# 3. Sync Capacitor
npx cap sync

# 4. Run on device/emulator
npx cap run ios
npx cap run android
```

**Note**: For mobile screenshot prevention to work fully, you need to run `npx cap sync` after pulling code changes.

### 3. Security Best Practices

#### What Protection Does
✅ **Deters** casual screenshot attempts
✅ **Watermarks** all images permanently
✅ **Logs** screenshot attempt events (auditable)
✅ **Blocks** common screenshot keyboard shortcuts
✅ **Prevents** print-to-PDF on web
✅ **Flags** screen recording on Android

#### What Protection Doesn't Do
❌ **Cannot prevent** third-party screen capture tools
❌ **Cannot prevent** phone camera pointed at screen
❌ **Cannot prevent** virtual machine screenshots
❌ **Cannot prevent** browser dev tools manipulation
❌ **Cannot prevent** screen recording software (web only)

#### Defense in Depth
1. **Watermarking** (Primary defense - most effective)
2. **Screenshot prevention** (Secondary - deters casual attempts)
3. **Access control** (Only verified users see full details)
4. **Audit logging** (Track who views what and when)
5. **Rate limiting** (Prevent bulk scraping)

## Technical Implementation

### Client-Side Watermarking
Location: `src/utils/imageWatermark.ts`

```typescript
// Features:
- Canvas-based image manipulation
- Diagonal watermark pattern
- Responsive font sizing
- Batch processing support
- Promise-based async API
```

### Screenshot Prevention
Location: `src/utils/screenshotPrevention.ts`

```typescript
// Web protection:
- Keyboard event listeners
- CSS user-select prevention
- Print media hiding

// Mobile protection:
- Capacitor plugin integration
- Native event listeners
```

### Image Upload with Watermarking
Location: `src/pages/BreederDashboard.tsx`

```typescript
const handleImageUpload = async (files, type) => {
  // 1. Apply watermarks to all images
  const watermarked = await batchWatermarkImages(files);
  
  // 2. Show preview of first watermarked image
  setWatermarkPreview({ original, watermarked });
  
  // 3. Convert to base64/upload to storage
  // 4. Display thumbnails
};
```

## Configuration

### Capacitor Config
Location: `capacitor.config.ts`

```typescript
{
  plugins: {
    ScreenProtection: {
      enable: true,
      showToast: true,
      toastMessage: "Screenshots are disabled for security purposes"
    }
  }
}
```

### Mobile Native Code

#### iOS (Swift)
```swift
// Add to AppDelegate.swift
extension UIViewController {
    open override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(screenshotDetected),
            name: UIApplication.userDidTakeScreenshotNotification,
            object: nil
        )
    }
}
```

#### Android (Java/Kotlin)
```java
// Add to MainActivity.java
getWindow().setFlags(
    WindowManager.LayoutParams.FLAG_SECURE,
    WindowManager.LayoutParams.FLAG_SECURE
);
```

## User Education

### For Breeders
"Your photos are automatically watermarked with PawDNA branding and date stamps. This protects your images from unauthorized use while still allowing buyers to see the quality of your pets."

### For Buyers
"Screenshot prevention is enabled to protect breeder information. Please use our secure conversation system to request additional photos or information."

## Monitoring & Compliance

### Audit Logging
All screenshot attempts are logged:
```typescript
{
  event: "screenshot_attempt_blocked",
  user_id: "user-uuid",
  page: "/pet/[pet-id]",
  timestamp: "2025-01-02T12:00:00Z",
  method: "keyboard_shortcut" | "mobile_native"
}
```

### Analytics
Track effectiveness:
- Number of screenshot attempts blocked
- Pages with most attempts
- User behavior patterns
- Watermark application success rate

## Testing

### Manual Testing Checklist
- [ ] Upload image without watermark (should auto-apply)
- [ ] Try PrintScreen on Windows
- [ ] Try Cmd+Shift+3 on Mac
- [ ] Try Android screenshot gesture
- [ ] Try iOS screenshot gesture
- [ ] Verify watermark is visible on all images
- [ ] Check toast notification appears
- [ ] Verify audit logs are created

### Automated Testing
```typescript
// Test watermark application
test('applies watermark to uploaded images', async () => {
  const file = new File([blob], 'test.jpg');
  const watermarked = await addWatermarkToImage(file);
  expect(watermarked.size).toBeGreaterThan(file.size);
});

// Test screenshot prevention
test('blocks screenshot keyboard shortcuts', () => {
  const event = new KeyboardEvent('keydown', { key: 'PrintScreen' });
  fireEvent(document, event);
  expect(toast.error).toHaveBeenCalled();
});
```

## Limitations & Disclaimers

⚠️ **Important**: No client-side protection is 100% effective. Determined users can still:
- Use external cameras
- Use VM screenshot tools
- Disable JavaScript
- Use browser dev tools

🛡️ **Best Practice**: Combine with:
- Legal terms of service
- DMCA takedown procedures
- Copyright notices
- Trusted user verification

## Future Enhancements

### Planned Features
- [ ] Invisible digital fingerprinting
- [ ] Advanced watermark positioning (corner, edge detection)
- [ ] User-customizable watermark text
- [ ] Watermark strength levels
- [ ] Blockchain-based image provenance
- [ ] AI-powered unauthorized use detection

### Integration Opportunities
- Content ID systems (Google, YouTube)
- Reverse image search monitoring
- Copyright enforcement automation
- Legal takedown request automation

## Support & Contact

For security concerns or questions:
- Email: security@pawdna.org
- Report unauthorized use: [Report Form]
- Request watermark removal: [Authorized Use Form]

## Version History
- **2025-01-02**: Initial implementation
  - Client-side automatic watermarking
  - Web screenshot prevention (keyboard shortcuts)
  - Mobile screenshot prevention (Capacitor plugin)
  - Watermark preview UI
  - Audit logging

---

**Remember**: Watermarking is your primary defense. Screenshot prevention is a deterrent, not a guarantee.
