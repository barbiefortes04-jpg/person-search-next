# Production Deployment Guide

## Quick Deployment to Vercel

### 1. Environment Variables Required

Add these to your Vercel dashboard:

```env
# Database (Required)
DATABASE_URL=postgresql://username:password@your-neon-host/database?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://username:password@your-neon-host/database?sslmode=require

# Auth.js (Required)
NEXTAUTH_SECRET=your-production-secret-key
NEXTAUTH_URL=https://person-search-next.vercel.app

# Google OAuth (Required)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# MCP API (Optional - for additional security)
MCP_API_KEY=your-optional-mcp-api-key
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create/select your project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://person-search-next.vercel.app/api/auth/callback/google`

### 3. Database Setup (Neon)

1. Create a Neon database at [neon.tech](https://neon.tech)
2. Copy the connection string
3. Run migrations: `npx prisma db push`
4. Seed data: `npx tsx prisma/seed.ts`

### 4. Vercel Deployment

```bash
# Push to GitHub (auto-deploys)
git push origin main

# Or manual deployment
npx vercel --prod
```

### 5. MCP Server Testing

Once deployed, test the MCP endpoints:

- **Production MCP Endpoint**: `https://person-search-next.vercel.app/api/mcp`
- **API Documentation**: Visit `/mcp-demo` page for live testing

### 6. Claude Desktop Configuration

Add to your Claude Desktop config file:

```json
{
  "mcpServers": {
    "person-crud": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote", 
        "https://person-search-next.vercel.app/api/mcp"
      ]
    }
  }
}
```

## Production URL

🚀 **Live Application**: [https://person-search-next.vercel.app](https://person-search-next.vercel.app)

## Features Available in Production

✅ Full CRUD operations for Person management  
✅ Google OAuth authentication  
✅ MCP server with Claude Desktop integration  
✅ Real-time demo interface at `/mcp-demo`  
✅ Complete setup documentation at `/mcp-setup`  
✅ PostgreSQL database with Neon hosting  
✅ Production-ready environment configuration  

## Troubleshooting

1. **Build fails**: Check environment variables
2. **Auth issues**: Verify Google OAuth settings
3. **Database errors**: Check Neon connection string
4. **MCP not working**: Install `mcp-remote` globally: `npm i -g mcp-remote`