#!/usr/bin/env node

/**
 * Local MCP Server for Person CRUD Operations
 * Connects Claude Desktop directly to Neon Database via Prisma
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Create MCP server
const server = new Server(
  {
    name: "person-crud-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_people",
        description: "List all people in the database or search by name",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Optional search query to filter by name",
            },
            limit: {
              type: "number",
              description: "Maximum number of results (default: 50)",
              minimum: 1,
              maximum: 100,
            },
          },
        },
      },
      {
        name: "get_person",
        description: "Get details of a specific person by their ID",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The unique ID of the person to retrieve",
            },
          },
          required: ["id"],
        },
      },
      {
        name: "create_person",
        description: "Create a new person in the database",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Full name of the person",
              minLength: 1,
            },
            email: {
              type: "string",
              description: "Email address",
              format: "email",
            },
            phoneNumber: {
              type: "string",
              description: "Australian mobile number (format: 04XXXXXXXX)",
              pattern: "^04\\d{8}$",
            },
          },
          required: ["name", "email", "phoneNumber"],
        },
      },
      {
        name: "update_person",
        description: "Update an existing person's information",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The unique ID of the person to update",
            },
            name: {
              type: "string",
              description: "New name (optional)",
            },
            email: {
              type: "string",
              description: "New email (optional)",
            },
            phoneNumber: {
              type: "string",
              description: "New phone number (optional)",
              pattern: "^04\\d{8}$",
            },
          },
          required: ["id"],
        },
      },
      {
        name: "delete_person",
        description: "Delete a person from the database",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The unique ID of the person to delete",
            },
          },
          required: ["id"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_people": {
        const people = await prisma.person.findMany({
          where: args.query
            ? {
                name: {
                  contains: args.query,
                  mode: "insensitive",
                },
              }
            : undefined,
          take: args.limit || 50,
          orderBy: {
            createdAt: "desc",
          },
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  count: people.length,
                  people: people,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "get_person": {
        const person = await prisma.person.findUnique({
          where: { id: args.id },
        });

        if (!person) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: false,
                  error: "Person not found",
                }),
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  person: person,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "create_person": {
        const person = await prisma.person.create({
          data: {
            name: args.name,
            email: args.email,
            phoneNumber: args.phoneNumber,
          },
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  message: "Person created successfully",
                  person: person,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "update_person": {
        const updateData = {};
        if (args.name) updateData.name = args.name;
        if (args.email) updateData.email = args.email;
        if (args.phoneNumber) updateData.phoneNumber = args.phoneNumber;

        if (Object.keys(updateData).length === 0) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: false,
                  error: "No fields to update",
                }),
              },
            ],
            isError: true,
          };
        }

        const person = await prisma.person.update({
          where: { id: args.id },
          data: updateData,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  message: "Person updated successfully",
                  person: person,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "delete_person": {
        await prisma.person.delete({
          where: { id: args.id },
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Person deleted successfully",
              }),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: false,
            error: error.message,
          }),
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Person CRUD MCP Server running (connected to Neon DB)");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});

// Cleanup on exit
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
