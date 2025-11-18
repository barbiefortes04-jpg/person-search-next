import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Code, Download, Settings, Terminal, CheckCircle2, AlertCircle } from 'lucide-react'
import { PageHeader } from '@/app/components/page-header'
import { SectionCard } from '@/app/components/section-card'
import { StepSection } from '@/app/components/step-section'
import { InfoList } from '@/app/components/info-list'
import { CodeBlock } from '@/app/components/code-block'

export default function McpSetupPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PageHeader 
        title="MCP Server Setup Guide"
        description="Step-by-step instructions to enable Person CRUD operations through Claude Desktop"
      />

      <SectionCard title="What is MCP?" className="mb-8">
        <div className="space-y-4">
          <p>
            <strong>MCP (Model Context Protocol)</strong> is a protocol created by Anthropic that allows AI assistants 
            like Claude to interact with external tools and data sources. Think of it as a bridge that lets Claude 
            directly control your Person database through natural language.
          </p>
          
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-semibold mb-2">Example Usage:</p>
            <p className="text-sm italic">
              &quot;Create a new person named Sarah Johnson with email sarah@example.com and phone 0412345678&quot;
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              → Claude uses the MCP server to call your API and create the person record
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">1. You Chat</h4>
              <p className="text-sm text-muted-foreground">Talk to Claude Desktop in natural language</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">2. MCP Server</h4>
              <p className="text-sm text-muted-foreground">Translates requests to API calls</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">3. Your Database</h4>
              <p className="text-sm text-muted-foreground">CRUD operations executed</p>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Prerequisites" icon={CheckCircle2} className="mb-8">
        <InfoList 
          variant="checklist"
          items={[
            { label: <><strong>Claude Desktop</strong> - Download from <a href="https://claude.ai/download" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">claude.ai/download</a></> },
            { label: <><strong>Node.js 20+</strong> - Required to run the MCP server</> },
            { label: <><strong>Git</strong> - To clone the MCP server repository</> },
          ]}
        />
      </SectionCard>

      <StepSection stepNumber={1} title="Install mcp-remote" icon={Download} className="mb-8">
        <div className="space-y-4">
          <p>
            The MCP server runs <strong>directly on Vercel</strong> with your deployed app. 
            You just need to install <code className="bg-muted px-2 py-1 rounded">mcp-remote</code> to connect Claude Desktop to it.
          </p>

          <div>
            <h4 className="font-semibold mb-2">Install globally via npm:</h4>
            <CodeBlock code="npm install -g mcp-remote" />
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>mcp-remote</strong> is a proxy tool that converts HTTP requests to stdio, 
              which Claude Desktop requires for MCP communication.
            </AlertDescription>
          </Alert>
        </div>
      </StepSection>

      <StepSection stepNumber={2} title="Get Your Vercel URL" icon={Settings} className="mb-8">
        <div className="space-y-4">
          <p>Your MCP server endpoint is:</p>
          
          <CodeBlock code="https://person-search-next.vercel.app/api/mcp" language="text" />

          <div>
            <h4 className="font-semibold mb-2">Find your Vercel URL:</h4>
            <InfoList 
              variant="numbered"
              items={[
                { label: <>Go to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">vercel.com</a></> },
                { label: "Open your project dashboard" },
                { label: <>Copy the deployment URL (e.g., <code className="bg-muted px-1 rounded text-xs">https://person-search-next.vercel.app</code>)</> },
                { label: <>Add <code className="bg-muted px-1 rounded text-xs">/api/mcp</code> to the end</> },
              ]}
              className="ml-2"
            />
          </div>

          <Alert>
            <AlertDescription>
              <strong>Example:</strong> If your app is at <code className="bg-muted px-2 py-1 rounded text-xs">https://person-search-next.vercel.app</code>, 
              your MCP endpoint is <code className="bg-muted px-2 py-1 rounded text-xs">https://person-search-next.vercel.app/api/mcp</code>
            </AlertDescription>
          </Alert>
        </div>
      </StepSection>

      <StepSection stepNumber={3} title="Configure Claude Desktop" icon={Terminal} className="mb-8">
        <div className="space-y-4">
          <p>Add the MCP server to Claude Desktop&apos;s configuration file:</p>

          <div>
            <h4 className="font-semibold mb-2">Configuration File Location:</h4>
            <InfoList 
              items={[
                { label: <><strong>Windows:</strong> <code className="bg-muted px-2 py-1 rounded text-xs">%APPDATA%\Claude\claude_desktop_config.json</code></> },
                { label: <><strong>macOS:</strong> <code className="bg-muted px-2 py-1 rounded text-xs">~/Library/Application Support/Claude/claude_desktop_config.json</code></> },
                { label: <><strong>Linux:</strong> <code className="bg-muted px-2 py-1 rounded text-xs">~/.config/Claude/claude_desktop_config.json</code></> },
              ]}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-2">Add This Configuration:</h4>
            <CodeBlock 
              language="json"
              code={`{
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
}`} 
            />
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Replace <code className="bg-muted px-1 rounded text-xs">https://person-search-next.vercel.app/api/mcp</code> with 
              your actual Vercel deployment URL + <code className="bg-muted px-1 rounded text-xs">/api/mcp</code>
            </AlertDescription>
          </Alert>
        </div>
      </StepSection>

      <StepSection stepNumber={4} title="Test the Integration" icon={Code} className="mb-8">
        <div className="space-y-4">
          <InfoList 
            variant="numbered"
            items={[
              { label: <><strong>Restart Claude Desktop</strong> after saving the configuration</> },
              { label: <><strong>Open a new conversation</strong> in Claude Desktop</> },
              { label: (
                <div>
                  <strong>Try a command:</strong>
                  <div className="bg-muted p-3 rounded-lg mt-2 text-sm italic">
                    &quot;List all people in the database&quot;
                  </div>
                </div>
              )},
              { label: <><strong>Verify:</strong> Claude should use the MCP server to fetch and display your Person records</> },
            ]}
            className="ml-2"
          />

          <div className="mt-4">
            <Button asChild>
              <Link href="/mcp-demo">
                View Live Demo →
              </Link>
            </Button>
          </div>
        </div>
      </StepSection>

      <SectionCard title="Available MCP Tools" description="Commands Claude can execute through the MCP server" className="mb-8">
        <div className="space-y-4">
          {[
            {
              name: 'create_person',
              desc: 'Create a new person in the database',
              example: '"Create a person named John Doe with email john@example.com"'
            },
            {
              name: 'get_person',
              desc: "Retrieve a person's details by ID",
              example: '"Get details for person with ID abc123"'
            },
            {
              name: 'list_people',
              desc: 'List all people or search by name',
              example: '"Show me all people in the database"'
            },
            {
              name: 'update_person',
              desc: "Update a person's information",
              example: '"Update John\'s email to newemail@example.com"'
            },
            {
              name: 'delete_person',
              desc: 'Remove a person from the database',
              example: '"Delete the person with ID abc123"'
            }
          ].map((tool) => (
            <div key={tool.name} className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold">{tool.name}</h4>
              <p className="text-sm text-muted-foreground">{tool.desc}</p>
              <p className="text-xs mt-1 italic">Example: {tool.example}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Troubleshooting" className="mb-8">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm">MCP server not appearing in Claude Desktop?</h4>
            <InfoList 
              items={[
                { label: "Verify the configuration file path is correct" },
                { label: "Check that the MCP server path uses the correct format for your OS" },
                { label: "Restart Claude Desktop completely" },
              ]}
              className="text-sm text-muted-foreground ml-2 mt-1"
            />
          </div>

          <div>
            <h4 className="font-semibold text-sm">API calls failing?</h4>
            <InfoList 
              items={[
                { label: "Confirm your Vercel app URL is correct in the .env file" },
                { label: "Check that your API key matches in both .env and claude_desktop_config.json" },
                { label: "Verify your Vercel app is deployed and accessible" },
              ]}
              className="text-sm text-muted-foreground ml-2 mt-1"
            />
          </div>

          <div>
            <h4 className="font-semibold text-sm">Build errors?</h4>
            <InfoList 
              items={[
                { label: "Ensure Node.js 20+ is installed" },
                { label: <>Run <code className="bg-muted px-2 py-1 rounded text-xs">npm install</code> again</> },
                { label: "Delete node_modules and package-lock.json, then reinstall" },
              ]}
              className="text-sm text-muted-foreground ml-2 mt-1"
            />
          </div>
        </div>
      </SectionCard>

      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link href="/github">
            View GitHub Repository
          </Link>
        </Button>
        <Button asChild>
          <Link href="/mcp-demo">
            Try Live Demo
          </Link>
        </Button>
      </div>
    </div>
  )
}
