import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function GoogleDriveCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('Google Drive OAuth error:', error);
      if (window.opener) {
        window.opener.postMessage(
          { 
            type: 'google-drive-oauth-callback', 
            error 
          },
          window.location.origin
        );
      }
      window.close();
      return;
    }

    if (code && state) {
      // Send authorization code back to parent window
      if (window.opener) {
        window.opener.postMessage(
          { 
            type: 'google-drive-oauth-callback', 
            code, 
            state 
          },
          window.location.origin
        );
      }
      window.close();
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Completing Google Drive Authentication...</h2>
        <p className="text-muted-foreground">This window will close automatically.</p>
      </div>
    </div>
  );
}
