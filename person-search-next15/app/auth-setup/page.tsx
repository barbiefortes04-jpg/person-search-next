import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Key, Settings, Shield } from "lucide-react"
import { PageHeader } from '@/app/components/page-header'
import { SectionCard } from '@/app/components/section-card'
import { EnvVars, ConfigBox } from '@/app/components/feature-components'
import { FileReferenceList } from '@/app/components/tech-components'

export default function AuthSetupPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PageHeader 
        title="OAuth Authentication Setup"
        description="Complete guide to the Google OAuth implementation in this application"
      />

      <div className="space-y-6">
        <SectionCard 
          title="Authentication Architecture" 
          description="How OAuth is implemented in this app"
          icon={Settings}
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Technology Stack</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Auth.js (NextAuth v5)</strong> - Modern authentication library for Next.js</li>
                <li><strong>Google OAuth 2.0</strong> - Secure authentication provider</li>
                <li><strong>Prisma Adapter</strong> - Database session management</li>
                <li><strong>PostgreSQL (Neon)</strong> - User and session storage</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Authentication Flow</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>User clicks &quot;Sign in with Google&quot;</li>
                <li>Redirected to Google OAuth consent screen</li>
                <li>User authorizes the application</li>
                <li>Google returns authorization code</li>
                <li>Auth.js exchanges code for access token</li>
                <li>User profile is fetched and stored in database</li>
                <li>Session is created and user is authenticated</li>
              </ol>
            </div>
          </div>
        </SectionCard>

        <SectionCard 
          title="Configuration Details" 
          description="Environment variables and setup requirements"
          icon={Key}
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Required Environment Variables</h3>
              <EnvVars vars={[
                { key: 'AUTH_SECRET', value: 'your-secret-key' },
                { key: 'GOOGLE_CLIENT_ID', value: 'your-client-id' },
                { key: 'GOOGLE_CLIENT_SECRET', value: 'your-client-secret' },
                { key: 'DATABASE_URL', value: 'your-database-connection' }
              ]} />
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                All credentials are securely stored in environment variables and never committed to version control.
              </AlertDescription>
            </Alert>

            <ConfigBox title="Google Cloud Console Setup">
              <ol className="list-decimal list-inside space-y-2">
                <li>Create project in Google Cloud Console</li>
                <li>Enable Google OAuth API</li>
                <li>Configure OAuth consent screen</li>
                <li>Create OAuth 2.0 credentials (Web application)</li>
                <li>Add authorized redirect URIs:
                  <ul className="list-disc list-inside ml-6 mt-1">
                    <li><code className="text-xs">http://localhost:3000/api/auth/callback/google</code></li>
                    <li><code className="text-xs">https://your-domain.com/api/auth/callback/google</code></li>
                  </ul>
                </li>
              </ol>
            </ConfigBox>
          </div>
        </SectionCard>

        <SectionCard 
          title="Database Schema" 
          description="Auth.js tables managed by Prisma"
          icon={Shield}
        >
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold">User Table</h4>
              <p className="text-muted-foreground">Stores user profile information (id, name, email, image)</p>
            </div>
            <div>
              <h4 className="font-semibold">Account Table</h4>
              <p className="text-muted-foreground">OAuth provider details and tokens (Google OAuth data)</p>
            </div>
            <div>
              <h4 className="font-semibold">Session Table</h4>
              <p className="text-muted-foreground">Active user sessions with expiration timestamps</p>
            </div>
            <div>
              <h4 className="font-semibold">VerificationToken Table</h4>
              <p className="text-muted-foreground">Email verification tokens (if email auth is added)</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard 
          title="Implementation Files" 
          description="Key files in the authentication system"
        >
          <FileReferenceList files={[
            { path: 'auth.ts', description: 'Auth.js configuration and exports' },
            { path: 'middleware.ts', description: 'Route protection and redirects' },
            { path: 'app/api/auth/[...nextauth]/route.ts', description: 'API handler' },
            { path: 'app/auth/signin/page.tsx', description: 'Sign-in page' },
            { path: 'app/components/user-menu.tsx', description: 'User dropdown menu' },
            { path: 'prisma/schema.prisma', description: 'Database models' }
          ]} />
        </SectionCard>
      </div>
    </div>
  )
}
