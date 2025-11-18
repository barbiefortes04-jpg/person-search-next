import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, Lock, EyeOff, Server, Database } from "lucide-react"
import { PageHeader } from '@/app/components/page-header'
import { SectionCard } from '@/app/components/section-card'
import { RouteList, FeatureList, ConfigBox } from '@/app/components/feature-components'
import { CheckList } from '@/app/components/check-list'

export default function SecurityPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PageHeader 
        title="Security Features"
        description="Comprehensive security implementation and protected routes documentation"
      />

      <Alert className="mb-6">
        <Shield className="h-4 w-4" />
        <AlertTitle>Security-First Design</AlertTitle>
        <AlertDescription>
          This application implements industry-standard security practices including OAuth 2.0, 
          route protection, session management, and secure credential storage.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <SectionCard 
          title="Protected Routes" 
          description="Authentication-required pages and access control"
          icon={Lock}
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Protected Pages</h3>
              <RouteList items={[
                { route: '/', description: 'Home (Person Search & CRUD)', status: 'protected' }
              ]} />
            </div>

            <div>
              <h3 className="font-semibold mb-3">Public Pages</h3>
              <RouteList items={[
                { route: '/auth/signin', status: 'public' },
                { route: '/about', status: 'public' },
                { route: '/auth-setup', status: 'public' },
                { route: '/security', status: 'public' },
                { route: '/database', status: 'public' },
                { route: '/github', status: 'public' }
              ]} />
            </div>

            <ConfigBox title="Access Control Logic">
              <div className="space-y-2">
                <p><strong>Unauthenticated users:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Redirected to <code>/auth/signin</code> when accessing protected routes</li>
                  <li>Can view documentation pages (about, auth-setup, security, database, github)</li>
                  <li>Cannot access Person CRUD functionality or MCP pages</li>
                </ul>
                <p className="mt-3"><strong>Authenticated users:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Full access to Person Search and CRUD operations</li>
                  <li>Session persists across page refreshes</li>
                  <li>Can sign out from any page via user menu</li>
                </ul>
              </div>
            </ConfigBox>
          </div>
        </SectionCard>

        <SectionCard 
          title="OAuth 2.0 Security" 
          description="Google OAuth implementation security measures"
          icon={Shield}
        >
          <FeatureList items={[
            { title: 'State Parameter Protection', description: 'Prevents CSRF attacks during OAuth flow', icon: 'check' },
            { title: 'Secure Token Storage', description: 'Access tokens encrypted in database, never exposed to client', icon: 'check' },
            { title: 'HTTPS Enforcement', description: 'Production deployment requires secure connections', icon: 'check' },
            { title: 'Session Expiration', description: 'Automatic logout after inactivity period', icon: 'check' },
            { title: 'Scope Limitation', description: 'Only requests necessary user permissions (profile, email)', icon: 'check' }
          ]} />
        </SectionCard>

        <SectionCard 
          title="Middleware Protection" 
          description="Server-side route authentication"
          icon={Server}
        >
          <div className="space-y-3 text-sm">
            <p>
              <code className="bg-muted px-2 py-1 rounded">middleware.ts</code> intercepts all requests 
              before they reach page components.
            </p>
            <ConfigBox title="Protection Logic:">
              <ol className="list-decimal list-inside space-y-1">
                <li>Check if user has valid session token</li>
                <li>If accessing protected route without auth → redirect to sign-in</li>
                <li>If authenticated → allow request to proceed</li>
                <li>Public routes bypass authentication check</li>
              </ol>
            </ConfigBox>
          </div>
        </SectionCard>

        <SectionCard 
          title="Data Security" 
          description="Database and credential protection"
          icon={Database}
        >
          <FeatureList items={[
            { 
              title: 'Environment Variables', 
              description: 'All secrets stored in .env file, excluded from version control via .gitignore', 
              icon: 'check' 
            },
            { title: 'Credential Rotation', description: 'Database passwords rotated after any potential exposure', icon: 'check' },
            { title: 'Encrypted Connections', description: 'PostgreSQL connections use SSL/TLS (sslmode=require)', icon: 'check' },
            { title: 'Prisma ORM', description: 'Parameterized queries prevent SQL injection attacks', icon: 'check' },
            { title: 'Session Management', description: 'Database-backed sessions with automatic cleanup of expired sessions', icon: 'check' }
          ]} />
        </SectionCard>

        <SectionCard 
          title="Best Practices Implemented" 
          icon={EyeOff}
        >
          <CheckList 
            variant="success"
            items={[
              { text: 'No sensitive data in client-side JavaScript' },
              { text: 'Server-side session validation on every request' },
              { text: 'Secure HTTP-only cookies for session tokens' },
              { text: 'CSRF protection built into Auth.js' },
              { text: 'Automatic security headers via Next.js' },
              { text: 'Environment-specific configuration (dev/prod separation)' }
            ]} 
          />
        </SectionCard>
      </div>
    </div>
  )
}
