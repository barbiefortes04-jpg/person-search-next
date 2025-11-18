import { Button } from "@/components/ui/button"
import { ExternalLink, Github, GitBranch, Code, FileCode } from "lucide-react"
import Link from "next/link"
import { SectionCard } from '@/app/components/section-card'
import { TechStackGrid, FileReferenceList } from '@/app/components/tech-components'
import { CheckList } from '@/app/components/check-list'
import { ConfigBox } from '@/app/components/feature-components'

export default function GitHubPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <Github className="h-10 w-10" />
          GitHub Repository
        </h1>
        <p className="text-lg text-muted-foreground">
          View the complete source code and OAuth implementation
        </p>
      </div>
      
      <div className="mt-4 mb-8 p-4 bg-muted rounded-lg">
        <p className="text-sm">
          <strong>Original Project:</strong> Forked from{' '}
          <a 
            href="https://github.com/gocallum" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:underline font-semibold"
          >
            Callum Bir&apos;s
          </a>
          {' '}Person Search application
        </p>
        <p className="text-sm mt-2">
          <strong>Enhanced For:</strong> ECA Tech Bootcamp (AusBiz Consulting) — Week 4 MCP Integration
        </p>
      </div>

      <div className="space-y-6">
        <SectionCard 
          title="Repository Information" 
          description="OAuth-secured Person Search application"
          icon={Code}
        >
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h3 className="font-semibold text-lg">person-search-next</h3>
              <p className="text-sm text-muted-foreground">Next.js 15 + Auth.js + Prisma + PostgreSQL</p>
            </div>
            <Button asChild>
              <Link 
                href="https://github.com/barbiefortes04-jpg/person-search-next" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                View Repository
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm font-semibold mb-1">
                <GitBranch className="h-4 w-4" />
                Branch
              </div>
              <p className="text-sm text-muted-foreground">next15</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm font-semibold mb-1">
                <Code className="h-4 w-4" />
                Framework
              </div>
              <p className="text-sm text-muted-foreground">Next.js 15.5.6</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard 
          title="Key Implementation Files" 
          description="Core application source code and configuration"
          icon={FileCode}
        >
          <FileReferenceList files={[
            { path: 'auth.ts', description: 'Auth.js configuration' },
            { path: 'middleware.ts', description: 'Route protection' },
            { path: 'app/api/auth/[...nextauth]/route.ts', description: 'API handler' },
            { path: 'prisma/schema.prisma', description: 'Database schema (Person & Auth models)' },
            { path: 'app/actions/actions.ts', description: 'Server Actions for CRUD operations' },
            { path: 'app/components/user-menu.tsx', description: 'User session UI' },
            { path: 'lib/prisma.ts', description: 'Prisma client singleton' }
          ]} />
        </SectionCard>

        <SectionCard 
          title="Tech Stack" 
          description="Technologies used in this project"
        >
          <TechStackGrid stacks={[
            {
              name: 'Frontend',
              items: [
                'Next.js 15 (App Router)',
                'React 19',
                'TypeScript 5',
                'Tailwind CSS',
                'shadcn/ui Components'
              ]
            },
            {
              name: 'Backend',
              items: [
                'Auth.js (NextAuth v5)',
                'Prisma ORM',
                'PostgreSQL (Neon)',
                'Server Actions',
                'Zod Validation'
              ]
            }
          ]} />
        </SectionCard>

        <SectionCard title="Features Implemented">
          <CheckList items={[
            { text: 'Google OAuth 2.0 authentication with Auth.js' },
            { text: 'Protected routes with middleware authentication' },
            { text: 'Full CRUD operations for Person management' },
            { text: 'Database-backed session management with Prisma' },
            { text: 'PostgreSQL database with Neon serverless hosting' },
            { text: 'Responsive UI with dark mode support' },
            { text: 'Form validation with Zod schemas' },
            { text: 'Comprehensive security implementation' },
            { text: 'Built-in documentation pages (/about, /auth-setup, /security, /database, /github)' },
            { text: 'Model Context Protocol (MCP) server integration' },
            { text: 'Local MCP server with Prisma direct database access' },
            { text: 'Reusable component architecture (PageHeader, SectionCard, etc.)' },
            { text: 'Database schema documentation with complete Prisma models' }
          ]} variant="success" />
        </SectionCard>

        <SectionCard 
          title="Project Attribution" 
          description="Credits and acknowledgments"
        >
          <div className="space-y-3">
            <div>
              <strong className="text-sm">Original Author:</strong>
              <p className="text-sm text-muted-foreground mt-1">
                <a 
                  href="https://github.com/gocallum" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline"
                >
                  Callum Bir
                </a>
                {' '}— Created the foundational Person Search application with OAuth authentication
              </p>
            </div>
            <div>
              <strong className="text-sm">Enhanced Version:</strong>
              <p className="text-sm text-muted-foreground mt-1">
                ECA Tech Bootcamp Project (AusBiz Consulting) — Added MCP integration, local server, 
                component refactoring, and comprehensive documentation
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <Button asChild size="sm" variant="outline">
                <Link href="https://github.com/gocallum" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  Original Repository
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="https://github.com/barbiefortes04-jpg/person-search-next" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  Enhanced Repository
                </Link>
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard 
          title="Deployment" 
          description="Production hosting and configuration"
        >
          <ConfigBox title="Production Environment">
            <div className="space-y-2 text-sm">
              <div><strong>Platform:</strong> Vercel (optimized for Next.js)</div>
              <div><strong>Database:</strong> Neon PostgreSQL (serverless)</div>
              <div><strong>Environment:</strong> Production environment variables configured</div>
              <div><strong>SSL:</strong> Automatic HTTPS encryption</div>
            </div>
          </ConfigBox>
        </SectionCard>
      </div>
    </div>
  )
}
