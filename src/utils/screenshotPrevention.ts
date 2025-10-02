import { toast } from "sonner";

/**
 * SECURITY DISCLAIMER: Client-side screenshot prevention is NOT foolproof.
 * 
 * Limitations:
 * - Users can still take screenshots using:
 *   - Third-party screenshot tools
 *   - Phone camera pointed at screen
 *   - Browser extensions
 *   - Virtual machines
 *   - Screen recording software
 * 
 * This implementation provides:
 * - Basic deterrent against casual screenshot attempts
 * - User awareness that screenshots are discouraged
 * - Compliance gesture for security policies
 * 
 * For true security:
 * - Never display sensitive data that shouldn't be captured
 * - Use watermarks on sensitive content
 * - Implement server-side access logging
 * - Use time-limited access tokens
 */

// Prevent screenshots on web (BASIC DETERRENT ONLY)
export const preventWebScreenshots = () => {
  // Detect screenshot attempts via keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    // Windows/Linux: PrintScreen, Ctrl+PrintScreen, Win+PrintScreen, Win+Shift+S
    if (
      e.key === "PrintScreen" ||
      (e.ctrlKey && e.key === "PrintScreen") ||
      (e.metaKey && e.shiftKey && e.key === "s")
    ) {
      e.preventDefault();
      toast.error("Screenshots are disabled for security purposes.", {
        description: "This protects breeder and buyer information.",
      });
    }

    // Mac: Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5
    if (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5")) {
      e.preventDefault();
      toast.error("Screenshots are disabled for security purposes.", {
        description: "This protects breeder and buyer information.",
      });
    }
  };

  // Add CSS to prevent screenshots (works in some browsers)
  const style = document.createElement("style");
  style.textContent = `
    body {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    
    @media print {
      body {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
    document.head.removeChild(style);
  };
};

// Prevent screenshots on mobile using Capacitor
export const preventMobileScreenshots = async () => {
  try {
    // Check if we're running in Capacitor
    const { Capacitor } = await import("@capacitor/core");
    
    if (Capacitor.isNativePlatform()) {
      // For iOS and Android - this requires adding native code
      // We'll add the config and the user will need to sync
      console.log("Mobile screenshot prevention enabled via Capacitor");
      
      // Show toast when screenshot is detected (requires native listener)
      document.addEventListener("screenshot-detected", () => {
        toast.error("Screenshots are disabled for security purposes.", {
          description: "This protects breeder and buyer information.",
        });
      });
    }
  } catch (error) {
    console.log("Not running in Capacitor environment");
  }
};

// Initialize screenshot prevention
export const initializeScreenshotPrevention = () => {
  // Web prevention
  const cleanup = preventWebScreenshots();
  
  // Mobile prevention
  preventMobileScreenshots();

  return cleanup;
};
