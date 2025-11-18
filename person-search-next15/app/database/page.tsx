import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, Table, Key, GitBranch, Layers, Info, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/app/components/page-header'
import { SectionCard } from '@/app/components/section-card'
import { CodeBlock } from '@/app/components/code-block'
import { InfoList } from '@/app/components/info-list'
import { CheckList } from '@/app/components/check-list'
import { ConfigBox } from '@/app/components/feature-components'

export default function DatabasePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PageHeader 
        title="Database Architecture"
        description="Comprehensive guide to the Prisma schema, database structure, and data models"
      />

      <Alert className="mb-6">
        <Database className="h-4 w-4" />
        <AlertDescription>
          This application uses <strong>PostgreSQL</strong> hosted on <strong>Neon</strong> (serverless) 
          with <strong>Prisma ORM</strong> for type-safe database operations and migrations.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <SectionCard 
          title="Database Technology Stack" 
          description="Technologies powering the data layer"
          icon={Layers}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Database className="h-4 w-4" />
                PostgreSQL 16
              </h4>
              <p className="text-sm text-muted-foreground">
                Robust relational database with ACID compliance, JSON support, and advanced indexing
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Prisma ORM 6.19.0
              </h4>
              <p className="text-sm text-muted-foreground">
                Type-safe database client with auto-generated types and migration management
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                Neon Serverless
              </h4>
              <p className="text-sm text-muted-foreground">
                Serverless PostgreSQL with connection pooling, automatic scaling, and branching
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Prisma Adapter
              </h4>
              <p className="text-sm text-muted-foreground">
                Auth.js integration for database-backed session management
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard 
          title="Complete Prisma Schema" 
          description="Full database schema definition"
          icon={Table}
        >
          <div className="space-y-4">
            <p className="text-sm">
              The schema is defined in <code className="bg-muted px-2 py-1 rounded">prisma/schema.prisma</code> and 
              includes models for Person CRUD operations and Auth.js authentication.
            </p>

            <CodeBlock 
              language="text"
              code={`// Prisma Schema Configuration
generator client {
  provider = "prisma-client-js"
  output   = "../app/generated/prisma"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_UNPOOLED")
}

// ========================================
// PERSON MODEL (Main CRUD Operations)
// ========================================
model Person {
  id          String   @id @default(cuid())
  name        String
  email       String   @unique
  phoneNumber String   @map("phone_number")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("people")
}

// ========================================
// AUTH.JS MODELS (Authentication)
// ========================================
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime? @map("email_verified")
  image         String?
  accounts      Account[]
  sessions      Session[]

  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String  @map("user_id")
  type              String
  provider          String
  providerAccountId String  @map("provider_account_id")
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id")
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}`}
            />
          </div>
        </SectionCard>

        <SectionCard 
          title="Person Model (CRUD Operations)" 
          description="Primary data model for person management"
          icon={Table}
        >
          <div className="space-y-4">
            <p className="text-sm">
              The <strong>Person</strong> model is the core entity for all CRUD operations in this application. 
              It stores individual person records with contact information.
            </p>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">Field</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Constraints</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3"><code className="bg-muted px-2 py-1 rounded">id</code></td>
                    <td className="p-3">String</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1">
                        <Key className="h-3 w-3" /> Primary Key, CUID
                      </span>
                    </td>
                    <td className="p-3">Unique identifier (auto-generated)</td>
                  </tr>
                  <tr className="border-t bg-muted/30">
                    <td className="p-3"><code className="bg-muted px-2 py-1 rounded">name</code></td>
                    <td className="p-3">String</td>
                    <td className="p-3">Required</td>
                    <td className="p-3">Person&apos;s full name</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3"><code className="bg-muted px-2 py-1 rounded">email</code></td>
                    <td className="p-3">String</td>
                    <td className="p-3">Required, Unique</td>
                    <td className="p-3">Email address (must be unique)</td>
                  </tr>
                  <tr className="border-t bg-muted/30">
                    <td className="p-3"><code className="bg-muted px-2 py-1 rounded">phoneNumber</code></td>
                    <td className="p-3">String</td>
                    <td className="p-3">Required</td>
                    <td className="p-3">Contact phone number</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3"><code className="bg-muted px-2 py-1 rounded">createdAt</code></td>
                    <td className="p-3">DateTime</td>
                    <td className="p-3">Auto-generated</td>
                    <td className="p-3">Record creation timestamp</td>
                  </tr>
                  <tr className="border-t bg-muted/30">
                    <td className="p-3"><code className="bg-muted px-2 py-1 rounded">updatedAt</code></td>
                    <td className="p-3">DateTime</td>
                    <td className="p-3">Auto-updated</td>
                    <td className="p-3">Last modification timestamp</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ConfigBox title="Database Table Mapping">
              <p className="text-sm">
                The Person model maps to the <code className="bg-muted px-2 py-1 rounded">people</code> table 
                in PostgreSQL. Field names use snake_case in the database (e.g., <code className="bg-muted px-1 rounded">phone_number</code>, 
                <code className="bg-muted px-1 rounded">created_at</code>) while maintaining camelCase in TypeScript.
              </p>
            </ConfigBox>
          </div>
        </SectionCard>

        <SectionCard 
          title="Authentication Models" 
          description="Auth.js database schema for OAuth and sessions"
          icon={Key}
        >
          <div className="space-y-4">
            <p className="text-sm">
              These models are required by <strong>Auth.js (NextAuth v5)</strong> with the Prisma adapter 
              to manage user authentication, OAuth accounts, and session persistence.
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold mb-2">User Model</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Stores authenticated user profiles from OAuth providers (Google).
                </p>
                <InfoList 
                  items={[
                    { label: <><code className="bg-muted px-1 rounded text-xs">id</code> - Unique user identifier (CUID)</> },
                    { label: <><code className="bg-muted px-1 rounded text-xs">name</code> - User&apos;s display name from OAuth</> },
                    { label: <><code className="bg-muted px-1 rounded text-xs">email</code> - Unique email address (primary identifier)</> },
                    { label: <><code className="bg-muted px-1 rounded text-xs">emailVerified</code> - Email verification timestamp</> },
                    { label: <><code className="bg-muted px-1 rounded text-xs">image</code> - Profile picture URL from OAuth</> },
                  ]}
                  className="text-xs"
                />
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold mb-2">Account Model</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Links users to OAuth providers and stores provider-specific tokens.
                </p>
                <InfoList 
                  items={[
                    { label: <><code className="bg-muted px-1 rounded text-xs">provider</code> - OAuth provider name (e.g., &quot;google&quot;)</> },
                    { label: <><code className="bg-muted px-1 rounded text-xs">providerAccountId</code> - User ID from OAuth provider</> },
                    { label: <><code className="bg-muted px-1 rounded text-xs">access_token</code> - OAuth access token (encrypted)</> },
                    { label: <><code className="bg-muted px-1 rounded text-xs">refresh_token</code> - Token for refreshing access</> },
                    { label: <><code className="bg-muted px-1 rounded text-xs">expires_at</code> - Token expiration timestamp</> },
                  ]}
                  className="text-xs"
                />
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold mb-2">Session Model</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Manages active user sessions with automatic expiration.
                </p>
                <InfoList 
                  items={[
                    { label: <><code className="bg-muted px-1 rounded text-xs">sessionToken</code> - Unique session identifier (stored in cookie)</> },
                    { label: <><code className="bg-muted px-1 rounded text-xs">userId</code> - Reference to authenticated user</> },
                    { label: <><code className="bg-muted px-1 rounded text-xs">expires</code> - Session expiration timestamp</> },
                  ]}
                  className="text-xs"
                />
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold mb-2">VerificationToken Model</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Stores email verification tokens (for future email/password authentication).
                </p>
                <InfoList 
                  items={[
                    { label: <><code className="bg-muted px-1 rounded text-xs">identifier</code> - Email address or user identifier</> },
                    { label: <><code className="bg-muted px-1 rounded text-xs">token</code> - Verification token string</> },
                    { label: <><code className="bg-muted px-1 rounded text-xs">expires</code> - Token expiration timestamp</> },
                  ]}
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard 
          title="Database Relationships" 
          description="Foreign keys and data connections"
          icon={GitBranch}
        >
          <div className="space-y-4">
            <p className="text-sm">
              The database uses foreign key constraints to maintain referential integrity between related tables.
            </p>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Relationship Diagram:</h4>
              <div className="space-y-2 text-sm font-mono">
                <div>User (1) ←→ (Many) Account</div>
                <div className="ml-4 text-muted-foreground">↳ One user can have multiple OAuth accounts</div>
                
                <div className="mt-3">User (1) ←→ (Many) Session</div>
                <div className="ml-4 text-muted-foreground">↳ One user can have multiple active sessions</div>
                
                <div className="mt-3">Person (Independent)</div>
                <div className="ml-4 text-muted-foreground">↳ No foreign key relationships (standalone CRUD entity)</div>
              </div>
            </div>

            <ConfigBox title="Cascade Delete Behavior">
              <p className="text-sm">
                When a <strong>User</strong> is deleted, all associated <strong>Accounts</strong> and <strong>Sessions</strong> are 
                automatically deleted (<code className="bg-muted px-1 rounded">onDelete: Cascade</code>). This prevents orphaned records 
                and maintains database integrity.
              </p>
            </ConfigBox>
          </div>
        </SectionCard>

        <SectionCard 
          title="Database Configuration" 
          description="Connection settings and environment variables"
          icon={Database}
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Connection Strings</h4>
              <p className="text-sm text-muted-foreground mb-3">
                The application uses two PostgreSQL connection strings for different purposes:
              </p>
              
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs">DATABASE_URL</code>
                    <span className="text-xs text-muted-foreground">(Pooled Connection)</span>
                  </div>
                  <p className="text-sm">
                    Used for application queries. Routes through pgBouncer connection pooler for serverless compatibility.
                  </p>
                  <CodeBlock 
                    code="postgresql://user:password@host-pooler.region.neon.tech/db?sslmode=require"
                    language="text"
                  />
                </div>

                <div className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs">DATABASE_URL_UNPOOLED</code>
                    <span className="text-xs text-muted-foreground">(Direct Connection)</span>
                  </div>
                  <p className="text-sm">
                    Used for Prisma migrations. Direct connection without pooling for schema changes.
                  </p>
                  <CodeBlock 
                    code="postgresql://user:password@host.region.neon.tech/db?sslmode=require"
                    language="text"
                  />
                </div>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Security:</strong> Connection strings contain sensitive credentials and are stored in 
                <code className="bg-muted px-2 py-1 rounded mx-1">.env</code> files, which are excluded from version control.
              </AlertDescription>
            </Alert>
          </div>
        </SectionCard>

        <SectionCard 
          title="Prisma Client Generation" 
          description="Type-safe database client configuration"
          icon={Layers}
        >
          <div className="space-y-4">
            <p className="text-sm">
              Prisma generates a type-safe client based on the schema, providing autocomplete and type checking for all database operations.
            </p>

            <ConfigBox title="Client Configuration">
              <CodeBlock 
                language="text"
                code={`generator client {
  provider = "prisma-client-js"
  output   = "../app/generated/prisma"
}`}
              />
              <p className="text-sm mt-2">
                The client is generated to <code className="bg-muted px-2 py-1 rounded">app/generated/prisma</code> and 
                automatically regenerated when the schema changes.
              </p>
            </ConfigBox>

            <div>
              <h4 className="font-semibold mb-2">Usage in Application:</h4>
              <CodeBlock 
                language="text"
                code={`import { prisma } from '@/lib/prisma'

// Type-safe query with autocomplete
const person = await prisma.person.findUnique({
  where: { id: 'abc123' }
})

// TypeScript knows the exact shape of 'person'
console.log(person?.name, person?.email)`}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard 
          title="Database Migrations" 
          description="Schema version control and deployment"
          icon={GitBranch}
        >
          <div className="space-y-4">
            <p className="text-sm">
              Prisma Migrate manages database schema changes through version-controlled migration files.
            </p>

            <div>
              <h4 className="font-semibold mb-2">Migration Commands:</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold mb-1">Development (Create Migration):</p>
                  <CodeBlock code="pnpm db:migrate" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Creates a new migration file and applies it to the database
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-1">Production (Push Schema):</p>
                  <CodeBlock code="pnpm db:push" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Pushes schema changes directly without creating migration files (used in CI/CD)
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-1">Generate Client:</p>
                  <CodeBlock code="pnpm db:generate" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Regenerates Prisma Client after schema changes
                  </p>
                </div>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Deployment:</strong> The build process automatically runs <code className="bg-muted px-1 rounded">prisma generate</code> 
                to ensure the client is up-to-date before deployment.
              </AlertDescription>
            </Alert>
          </div>
        </SectionCard>

        <SectionCard 
          title="Database Seeding" 
          description="Sample data for testing and development"
          icon={Database}
        >
          <div className="space-y-4">
            <p className="text-sm">
              The application includes a seed script to populate the database with sample person records for testing.
            </p>

            <div>
              <h4 className="font-semibold mb-2">Seed Command:</h4>
              <CodeBlock code="pnpm db:seed" />
            </div>

            <ConfigBox title="Seed Data">
              <p className="text-sm mb-2">
                The seed script (<code className="bg-muted px-1 rounded">prisma/seed.ts</code>) creates 10 sample people:
              </p>
              <InfoList 
                items={[
                  { label: "John Doe, Jane Smith, Alice Johnson" },
                  { label: "Bob Williams, Charlie Brown, Emily Davis" },
                  { label: "Frank Miller, Grace Lee, Henry Moore, Isabella Young" },
                ]}
                className="text-sm"
              />
              <p className="text-sm mt-2 text-muted-foreground">
                Each person has a unique email, phone number, and auto-generated ID.
              </p>
            </ConfigBox>
          </div>
        </SectionCard>

        <SectionCard 
          title="CRUD Operations Implementation" 
          description="Server Actions for database operations"
          icon={Table}
        >
          <div className="space-y-4">
            <p className="text-sm">
              All database operations are implemented as Next.js Server Actions in 
              <code className="bg-muted px-2 py-1 rounded mx-1">app/actions/actions.ts</code> with authentication checks.
            </p>

            <CheckList 
              variant="success"
              items={[
                { text: 'Create - addUser() creates new person records' },
                { text: 'Read - getUserById() and searchUsers() fetch person data' },
                { text: 'Update - updateUser() modifies existing person records' },
                { text: 'Delete - deleteUser() removes person records' },
                { text: 'All operations require authentication (OAuth)' },
                { text: 'Automatic cache revalidation after mutations' },
                { text: 'Type-safe with Zod schema validation' },
              ]}
            />

            <ConfigBox title="Example: Create Operation">
              <CodeBlock 
                language="text"
                code={`export async function addUser(data: Omit<User, 'id'>): Promise<User> {
  await requireAuth() // Ensure user is authenticated
  
  const validatedData = userSchema.omit({ id: true }).parse(data)
  
  const newPerson = await prisma.person.create({
    data: {
      name: validatedData.name,
      email: validatedData.email,
      phoneNumber: validatedData.phoneNumber,
    },
  })

  revalidatePath('/') // Refresh UI
  return newPerson
}`}
              />
            </ConfigBox>
          </div>
        </SectionCard>

        <SectionCard 
          title="Database Best Practices" 
          description="Security and performance optimizations"
        >
          <CheckList 
            variant="success"
            items={[
              { text: 'Connection pooling for serverless environments (pgBouncer)' },
              { text: 'SSL/TLS encryption for all database connections (sslmode=require)' },
              { text: 'Unique constraints on email fields to prevent duplicates' },
              { text: 'Automatic timestamps (createdAt, updatedAt) for audit trails' },
              { text: 'Cascade deletes to maintain referential integrity' },
              { text: 'Type-safe queries with Prisma Client (no SQL injection)' },
              { text: 'Environment-specific configurations (dev/prod separation)' },
              { text: 'Prisma Client singleton pattern to prevent connection exhaustion' },
            ]}
          />
        </SectionCard>

        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/auth-setup">
              Auth Setup
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/security">
              Security Features
            </Link>
          </Button>
          <Button asChild>
            <Link href="/github">
              View GitHub Repository
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
