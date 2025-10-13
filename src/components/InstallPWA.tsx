import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 p-4 shadow-lg z-50 bg-background border-2">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">Install PawDNA</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Install our app for a better experience with offline access and quick launch from your home screen.
          </p>
          <div className="flex gap-2">
            <Button onClick={handleInstallClick} size="sm" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Install
            </Button>
            <Button onClick={handleDismiss} size="sm" variant="outline">
              Later
            </Button>
          </div>
        </div>
        <Button
          onClick={handleDismiss}
          size="icon"
          variant="ghost"
          className="h-6 w-6"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
