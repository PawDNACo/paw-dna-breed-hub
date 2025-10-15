# Google Drive Integration Setup Guide

## Prerequisites

You need a Google Cloud Project with the Drive API enabled.

## Step-by-Step Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Drive API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"
4. Enable the Google Picker API:
   - Search for "Google Picker API"
   - Click "Enable"

### 2. Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required fields:
   - **App name**: PawDNA Careers
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Add scopes:
   - Click "Add or Remove Scopes"
   - Add: `https://www.googleapis.com/auth/drive.readonly`
5. Add test users (if in testing mode):
   - Add email addresses that will test the integration
6. Save and continue

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Configure:
   - **Name**: PawDNA Careers OAuth
   - **Authorized JavaScript origins**:
     ```
     https://b0c50632-8ae4-4cb2-85f2-a7512b4e4743.lovableproject.com
     http://localhost:5173
     ```
   - **Authorized redirect URIs**:
     ```
     https://b0c50632-8ae4-4cb2-85f2-a7512b4e4743.lovableproject.com/google-drive-callback
     http://localhost:5173/google-drive-callback
     ```
5. Click "Create"
6. Copy your **Client ID** and **Client Secret**

### 4. Update Secrets in Lovable

The secrets are already configured in the backend:
- `GOOGLE_DRIVE_CLIENT_ID` ✓
- `GOOGLE_DRIVE_CLIENT_SECRET` ✓

If you need to update them, contact your admin.

### 5. Configure API Key for Picker (Optional)

For enhanced security with the Picker API:
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API key"
3. Restrict the API key:
   - **Application restrictions**: HTTP referrers
   - Add your domains
   - **API restrictions**: Restrict to "Google Picker API"

## How It Works

1. **User clicks Google Drive button**
   - Frontend requests client ID from secure backend
   - Opens Google OAuth popup with proper scopes

2. **User authorizes access**
   - Google redirects to `/google-drive-callback`
   - Callback sends authorization code to parent window

3. **Backend exchanges code for token**
   - Edge function securely exchanges code for access token
   - Returns token to frontend

4. **Google Picker loads**
   - User selects resume file from their Drive
   - File metadata is captured
   - File can be downloaded and attached to application

## Scopes Used

- `https://www.googleapis.com/auth/drive.readonly` - Read-only access to Drive files

## Supported File Types

The picker is configured to show:
- PDF files (`.pdf`)
- Word documents (`.doc`, `.docx`)

## Troubleshooting

### "403: Access Not Configured" Error
- Make sure Google Drive API is enabled in your project
- Check that Google Picker API is also enabled
- Wait a few minutes for API enablement to propagate

### "Redirect URI Mismatch" Error
- Verify the redirect URI in your Google Cloud Console matches exactly
- No trailing slashes
- Must include the full path: `/google-drive-callback`

### "Access Blocked" Error
- Add your email as a test user in OAuth consent screen
- Or publish the app (requires verification for production)

### Popup Blocked
- User needs to allow popups for your site
- Check browser popup blocker settings

## Security Notes

- Client Secret is stored securely in backend
- Access tokens are never stored, only used temporarily
- OAuth flow uses state parameter for CSRF protection
- Only read-only access is requested
- Files are not stored without user consent

## Production Checklist

- [ ] Verify OAuth consent screen is properly configured
- [ ] Add all production domains to authorized origins
- [ ] Add all production redirect URIs
- [ ] Test with multiple file types
- [ ] Verify file download/upload flow
- [ ] Consider publishing OAuth app for wider access
- [ ] Monitor API quotas in Google Cloud Console
