# LinkedIn Integration Setup Guide

## Issue: "The redirect_uri does not match the registered value"

This error occurs when the redirect URI configured in your LinkedIn app doesn't match the one being sent during authentication.

## How to Fix

1. **Go to LinkedIn Developer Portal**
   - Visit: https://www.linkedin.com/developers/apps
   - Select your application

2. **Navigate to Auth Settings**
   - Click on the "Auth" tab
   - Find the "OAuth 2.0 settings" section

3. **Add Redirect URLs**
   You need to add BOTH of these URLs to your LinkedIn app:
   
   **For Local Development:**
   ```
   http://localhost:5173/linkedin-callback
   ```
   
   **For Production (replace with your actual domain):**
   ```
   https://your-domain.com/linkedin-callback
   https://your-lovable-preview-url.lovableproject.com/linkedin-callback
   ```

4. **Required Scopes**
   Make sure these scopes are enabled in your LinkedIn app:
   - `openid` - Required for authentication
   - `profile` - Access to name and profile picture
   - `email` - Access to email address

5. **Save Changes**
   - Click "Update" to save your redirect URLs
   - Wait a few minutes for changes to propagate

## Testing

After updating the redirect URLs:
1. Clear your browser cache
2. Return to the Careers page
3. Click the LinkedIn button again
4. You should now see the LinkedIn authorization screen

## Troubleshooting

**Still getting the error?**
- Double-check that the redirect URL is spelled correctly (case-sensitive)
- Make sure there are no trailing slashes
- Verify your LinkedIn app is in "Development" mode if testing locally
- Check that you've saved the changes in the LinkedIn Developer Portal

**403 Error?**
- Verify your LinkedIn Client ID and Client Secret are correct
- Ensure your app has the required API permissions
- Check that your LinkedIn app status is "Active"

## Current Configuration

Your app is configured to use:
- **Redirect URI Path:** `/linkedin-callback`
- **Required Scopes:** `openid profile email`

The full redirect URI will be: `{your-domain}/linkedin-callback`
