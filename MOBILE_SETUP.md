# Mobile App Setup - Screenshot Prevention

## Prerequisites
- Git installed
- Node.js & npm installed
- For iOS: Mac with Xcode installed
- For Android: Android Studio installed

## Step 1: Export & Clone Project

1. In Lovable, click "Export to GitHub"
2. Clone your repository:
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

## Step 2: Install Dependencies

```bash
npm install
```

This installs all packages including:
- `@capacitor/core`
- `@capacitor/cli`
- `@capacitor/ios`
- `@capacitor/android`

## Step 3: Add Mobile Platforms

### For iOS:
```bash
npx cap add ios
```

**Requirements**:
- Must be on macOS
- Xcode must be installed
- iOS development certificates (for physical devices)

### For Android:
```bash
npx cap add android
```

**Requirements**:
- Android Studio must be installed
- Android SDK configured

## Step 4: Update Native Dependencies

```bash
# For iOS
npx cap update ios

# For Android
npx cap update android
```

## Step 5: Build Web Assets

```bash
npm run build
```

This creates the `dist` folder that Capacitor will package.

## Step 6: Sync Capacitor

```bash
npx cap sync
```

This copies:
- Web assets to native projects
- Capacitor configuration
- Plugins and dependencies

**⚠️ Important**: Run `npx cap sync` every time you:
- Pull new code from Git
- Update `capacitor.config.ts`
- Install new Capacitor plugins
- Change web assets

## Step 7: Add Screenshot Prevention Native Code

### iOS Native Code (Swift)

Edit `ios/App/App/AppDelegate.swift`:

```swift
import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    var window: UIWindow?
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        
        // Prevent screenshots
        NotificationCenter.default.addObserver(
            forName: UIApplication.userDidTakeScreenshotNotification,
            object: nil,
            queue: .main
        ) { _ in
            // Send event to JavaScript
            NotificationCenter.default.post(
                name: Notification.Name("screenshot-detected"),
                object: nil
            )
            
            // Optional: Show alert
            if let viewController = UIApplication.shared.windows.first?.rootViewController {
                let alert = UIAlertController(
                    title: "Screenshots Disabled",
                    message: "Screenshots are disabled for security purposes to protect breeder information.",
                    preferredStyle: .alert
                )
                alert.addAction(UIAlertAction(title: "OK", style: .default))
                viewController.present(alert, animated: true)
            }
        }
        
        return true
    }
}
```

**Note**: iOS cannot completely prevent screenshots, but it can detect them and warn users.

### Android Native Code (Kotlin/Java)

Edit `android/app/src/main/java/.../MainActivity.java`:

```java
package app.lovable.b0c506328ae44cb285f2a7512b4e4743;

import android.os.Bundle;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Prevent screenshots and screen recording
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_SECURE,
            WindowManager.LayoutParams.FLAG_SECURE
        );
    }
}
```

**Note**: Android's `FLAG_SECURE` completely prevents screenshots and screen recording.

## Step 8: Run on Device/Emulator

### iOS:
```bash
npx cap run ios
```

Or open in Xcode:
```bash
npx cap open ios
```

Then:
1. Select your device/simulator
2. Click Run (▶️) button
3. Build and deploy

### Android:
```bash
npx cap run android
```

Or open in Android Studio:
```bash
npx cap open android
```

Then:
1. Select your device/emulator
2. Click Run (▶️) button
3. Build and deploy

## Step 9: Testing Screenshot Prevention

### iOS Testing:
1. Run app on device/simulator
2. Try to take screenshot: Volume Up + Power Button
3. Screenshot should be taken (iOS allows it)
4. App should show alert: "Screenshots Disabled"
5. Check that event is logged

### Android Testing:
1. Run app on device/emulator
2. Try to take screenshot: Volume Down + Power Button
3. Screenshot should **fail** - screen goes black
4. Device may show "Screenshot prevented by app"
5. Screen recording should also be blocked

## Troubleshooting

### Issue: "npx cap sync" fails
**Solution**: 
```bash
# Remove and re-add platforms
npx cap rm ios
npx cap rm android
npx cap add ios
npx cap add android
npx cap sync
```

### Issue: Screenshot prevention not working on iOS
**Cause**: iOS cannot fully prevent screenshots, only detect them.
**Solution**: This is expected behavior. iOS will detect and warn, but cannot block.

### Issue: Screenshot prevention not working on Android
**Possible causes**:
1. `FLAG_SECURE` not added to MainActivity
2. App not rebuilt after adding flag
3. Testing on rooted device (may bypass)

**Solution**: 
- Verify MainActivity code
- Clean and rebuild: `./gradlew clean` then rebuild
- Test on non-rooted device

### Issue: Hot reload not working
**Solution**: Make sure `server.url` in `capacitor.config.ts` points to your Lovable preview URL.

### Issue: White screen on app launch
**Possible causes**:
1. Web assets not built
2. Assets not synced to native project

**Solution**:
```bash
npm run build
npx cap sync
npx cap run [ios|android]
```

## Development Workflow

### Making Changes:

1. **Edit code in Lovable** (or locally after export)
2. **Pull latest changes** (if working locally):
   ```bash
   git pull origin main
   ```
3. **Sync changes to mobile**:
   ```bash
   npm install  # If dependencies changed
   npm run build
   npx cap sync
   ```
4. **Run on device**:
   ```bash
   npx cap run ios
   # or
   npx cap run android
   ```

### Live Reload Setup (Development):

For faster development, use live reload:

```bash
# Start dev server
npm run dev

# In another terminal, run with live reload
npx cap run ios --livereload --external
# or
npx cap run android --livereload --external
```

This allows code changes to update instantly without rebuilding.

## Production Deployment

### iOS App Store:
1. Open project in Xcode: `npx cap open ios`
2. Update version/build number
3. Configure signing & capabilities
4. Archive for distribution
5. Upload to App Store Connect
6. Submit for review

### Google Play Store:
1. Open project in Android Studio: `npx cap open android`
2. Update version/build number
3. Generate signed APK/AAB
4. Upload to Google Play Console
5. Submit for review

## Security Checklist

Before deploying to production:

- [ ] Screenshot prevention native code added
- [ ] FLAG_SECURE tested on Android
- [ ] Screenshot detection tested on iOS
- [ ] Watermarking works on image uploads
- [ ] User notifications appear on screenshot attempts
- [ ] Audit logging is functional
- [ ] App builds without errors
- [ ] All sensitive screens have protection enabled

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS Development Guide](https://developer.apple.com/documentation/)
- [Android Development Guide](https://developer.android.com/docs)
- [Lovable Mobile Blog Post](https://lovable.dev/blogs/mobile-development)

## Support

For issues specific to this implementation:
- Check `IMAGE_PROTECTION.md` for feature details
- Review Capacitor logs: `npx cap doctor`
- Check native logs in Xcode/Android Studio

For general mobile development:
- [Lovable Discord Community](https://discord.gg/lovable)
- [Capacitor Community Forum](https://forum.capacitorjs.com/)

---

**Remember**: Always run `npx cap sync` after pulling code changes or updating configuration!
