import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function LinkedInCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      console.error('LinkedIn OAuth error:', error, errorDescription);
      if (window.opener) {
        window.opener.postMessage(
          { 
            type: 'linkedin-oauth-callback', 
            error, 
            errorDescription 
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
            type: 'linkedin-oauth-callback', 
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
        <h2 className="text-xl font-semibold mb-2">Completing LinkedIn Authentication...</h2>
        <p className="text-muted-foreground">This window will close automatically.</p>
      </div>
    </div>
  );
}
