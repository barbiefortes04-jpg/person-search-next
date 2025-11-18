import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Twitter, Shield, ServerIcon } from 'lucide-react'
import { PageHeader } from '@/app/components/page-header'
import { SectionCard } from '@/app/components/section-card'
import { InfoList } from '@/app/components/info-list'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PageHeader 
        title="About Person Search"
        description="OAuth-secured demonstration showcasing Next.js, React, Auth.js, and modern web technologies"
      />
      
      <SectionCard title="Project Overview" className="mb-8">
        <div className="space-y-4">
          <p>
            Person Search is an OAuth-secured demonstration project showcasing the power of Next.js, React, Auth.js, 
            and modern web technologies. It provides a secure, user-authenticated interface for searching and 
            managing person information with full CRUD operations.
          </p>
          <p>
            This project utilizes Next.js 15 with the App Router, React 19, TypeScript, Auth.js (NextAuth v5), 
            Prisma ORM, and PostgreSQL to create a responsive, secure, and accessible user experience.
          </p>
          <p>
            Key features include Google OAuth authentication, protected routes, server-side session management, 
            asynchronous search functionality, database-backed CRUD operations, and a dark mode toggle for user comfort.
          </p>
        </div>
      </SectionCard>
      
      <SectionCard title="Authentication Architecture" icon={Shield} className="mb-8">
        <div className="space-y-4">
          <p>
            This application implements a robust authentication system using <strong>Auth.js (NextAuth v5)</strong> with 
            Google OAuth 2.0 as the identity provider. The architecture ensures that all Person CRUD operations 
            are protected behind authentication, providing a secure user experience.
          </p>
          
          <div>
            <h3 className="font-semibold mb-2">Authentication Flow:</h3>
            <InfoList 
              variant="numbered"
              items={[
                { label: "User navigates to the application" },
                { label: "Middleware checks for valid session" },
                { label: "If unauthenticated, redirects to Google OAuth sign-in" },
                { label: "User authorizes the application via Google" },
                { label: "Session is created and stored in PostgreSQL database" },
                { label: "User gains access to Person Search and CRUD operations" },
              ]}
              className="ml-2"
            />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Security Features:</h3>
            <InfoList 
              items={[
                { label: <><strong>Protected Routes:</strong> Middleware enforces authentication on sensitive pages</> },
                { label: <><strong>Session Management:</strong> Database-backed sessions with automatic expiration</> },
                { label: <><strong>Secure Credentials:</strong> Environment variables for all sensitive configuration</> },
                { label: <><strong>OAuth 2.0:</strong> Industry-standard authentication protocol</> },
                { label: <><strong>Prisma ORM:</strong> Type-safe database queries with SQL injection prevention</> },
              ]}
            />
          </div>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Learn more:</strong> Visit the <Link href="/auth-setup" className="text-primary hover:underline">Auth Setup</Link>,{' '}
              <Link href="/security" className="text-primary hover:underline">Security</Link>, and{' '}
              <Link href="/database" className="text-primary hover:underline">Database</Link> pages for detailed documentation.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="MCP Integration" icon={ServerIcon} className="mb-8">
        <div className="space-y-4">
          <p>
            This application exposes a Model Context Protocol (MCP) integration that allows external AI agents
            (for example, Claude Desktop) to perform Person CRUD operations against the same database used by the app.
          </p>

          <div>
            <h3 className="font-semibold mb-2">How it works:</h3>
            <InfoList 
              variant="numbered"
              items={[
                { label: "Start a local MCP server (or use the deployed MCP endpoint)." },
                { label: <>Configure Claude Desktop to attach to the MCP server (instructions under <code className="rounded bg-muted px-1">/mcp-setup</code>).</> },
                { label: "Send natural-language commands to create, read, update, or delete Person records; the MCP server executes them via Prisma." },
              ]}
              className="ml-2"
            />
          </div>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm">
              To get started quickly, visit the <Link href="/mcp-setup" className="text-primary hover:underline">MCP Setup</Link> page and then
              the <Link href="/mcp-demo" className="text-primary hover:underline">MCP Demo</Link> page to see example interactions.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="About the Project" className="mb-8">
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Original Project:</strong> Created by{' '}
              <a 
                href="https://www.linkedin.com/in/callumbir/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline font-semibold"
              >
                Callum Bir
              </a>
            </p>
            <p className="text-sm mt-2">
              <strong>Enhanced For:</strong> ECA Tech Bootcamp — AusBiz Consulting
            </p>
            <p className="text-sm mt-2">
              <strong>Enhancements Include:</strong> MCP integration, local server implementation, 
              refactored component architecture, comprehensive documentation, and Week 4 deliverables.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Original Author - Callum Bir</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Callum Bir is the original creator of this Person Search application, demonstrating expertise in 
              Next.js, React, and modern frontend development. This project serves as an excellent foundation 
              for learning OAuth authentication and full-stack development.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="sm" variant="outline">
                <Link href="https://www.linkedin.com/in/callumbir/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2 h-4 w-4" /> Callum&apos;s LinkedIn
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="https://github.com/gocallum" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" /> Callum&apos;s GitHub
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="https://x.com/callumbir" target="_blank" rel="noopener noreferrer">
                  <Twitter className="mr-2 h-4 w-4" /> Callum&apos;s X
                </Link>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Enhanced Version - ECA Bootcamp Project</h3>
            <p className="text-sm text-muted-foreground">
              This enhanced version was developed as part of the ECA Tech Bootcamp curriculum provided by{' '}
              <a 
                href="https://ausbizconsulting.com.au" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline font-semibold"
              >
                AusBiz Consulting
              </a>
              . Additional features include Model Context Protocol (MCP) integration, local MCP server implementation, 
              reusable component architecture, and comprehensive setup documentation. 
              Enhanced by{' '}
              <a 
                href="https://github.com/barbiefortes04-jpg" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline font-semibold"
              >
                barbiefortes04-jpg
              </a>
              .
            </p>
          </div>
        </div>
      </SectionCard>

      <Button asChild variant="link" className="mt-4">
        <Link href="/">
          Back to Home
        </Link>
      </Button>
    </div>
  )
}

