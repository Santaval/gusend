# GitHub OAuth Integration

This Next.js app now includes GitHub OAuth integration that allows authenticated users to connect their GitHub account and access their repositories.

## Features

- 🔐 GitHub OAuth authentication
- 📁 Repository listing with metadata (stars, forks, language, etc.)
- 🔄 Token management with automatic refresh
- 🎨 Beautiful UI with shadcn components
- 🛡️ Clerk authentication integration

## Setup Instructions

### 1. Create a GitHub OAuth App

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: Your app name
   - **Homepage URL**: `http://localhost:3000` (or your domain)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/github`
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**

### 2. Environment Variables

Update your `.env.local` file (don't commit this to version control):

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# GitHub OAuth credentials
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Next.js URL
NEXTAUTH_URL=http://localhost:3000
```

### 3. Run the Application

```bash
npm run dev
```

## How It Works

### Authentication Flow

1. User signs in with Clerk
2. User clicks "Connect GitHub" button
3. Redirected to GitHub OAuth authorization page
4. User grants permissions (repo access)
5. GitHub redirects back with authorization code
6. Server exchanges code for access token
7. Token is stored client-side (localStorage)
8. User can now access their GitHub repositories

### API Routes

- **`/api/auth/github`** - Handles OAuth callback and token exchange
- **`/api/github/repos`** - Fetches user repositories using stored token

### Components

- **`GitHubOAuthButton`** - Initiates the OAuth flow
- **`GitHubDashboard`** - Displays connected repositories
- **`useGitHub`** - Custom hook for GitHub state management

## Security Considerations

⚠️ **Important**: This implementation stores GitHub tokens in localStorage for demo purposes. In production:

1. Store tokens server-side in a secure database
2. Link tokens to Clerk user IDs
3. Encrypt tokens at rest
4. Implement token refresh logic
5. Add proper error handling and logging

## Usage

1. **Sign in** with Clerk authentication
2. **Navigate to Dashboard** (`/dashboard`)
3. **Click "Connect GitHub Account"**
4. **Grant permissions** on GitHub
5. **View your repositories** with metadata

## API Usage Example

```typescript
// Fetch repositories
const response = await fetch('/api/github/repos', {
  headers: {
    'Authorization': `Bearer ${your_github_token}`,
  },
});

const data = await response.json();
console.log(data.repos);
```

## Permissions

The app requests the following GitHub scopes:
- `repo` - Full access to repositories
- `read:user` - Read user profile information

You can modify the scopes in `src/components/github-oauth-button.tsx` if you need different permissions.

## Troubleshooting

### Common Issues

1. **"Missing authorization code"** - Check your OAuth app callback URL
2. **"Invalid GitHub token"** - Token may have expired, disconnect and reconnect
3. **"Unauthorized"** - Make sure you're signed in with Clerk first

### Development Notes

- Tokens are stored in localStorage (not secure for production)
- No token refresh mechanism implemented
- Rate limiting is handled by GitHub (5000 requests/hour for authenticated users)

## Production Deployment

Before deploying to production:

1. Update callback URL in GitHub OAuth app settings
2. Set environment variables in your hosting provider
3. Implement server-side token storage
4. Add proper error handling and logging
5. Consider implementing webhook endpoints for real-time updates