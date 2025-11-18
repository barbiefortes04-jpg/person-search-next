import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Zod schemas for validation
const createPersonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phoneNumber: z.string().regex(/^04\d{8}$/, "Phone must be Australian mobile (04XXXXXXXX)"),
});

const updatePersonSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().regex(/^04\d{8}$/).optional(),
});

const handler = createMcpHandler(
  (server) => {
    // List all people or search by name
    server.tool(
      "list_people",
      "List all people in the database or search by name",
      {
        query: z.string().optional().describe("Optional search query to filter by name"),
        limit: z.number().int().min(1).max(100).optional().describe("Maximum number of results (default: 50)"),
      },
      async ({ query, limit }) => {
        try {
          const people = await prisma.person.findMany({
            where: query
              ? {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                }
              : undefined,
            take: limit || 50,
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
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: false,
                  error: error instanceof Error ? error.message : "Failed to list people",
                }),
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Get a specific person by ID
    server.tool(
      "get_person",
      "Get details of a specific person by their ID",
      {
        id: z.string().describe("The unique ID of the person to retrieve"),
      },
      async ({ id }) => {
        try {
          const person = await prisma.person.findUnique({
            where: { id },
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
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: false,
                  error: error instanceof Error ? error.message : "Failed to get person",
                }),
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Create a new person
    server.tool(
      "create_person",
      "Create a new person in the database",
      {
        name: z.string().min(1).describe("Full name of the person"),
        email: z.string().email().describe("Email address"),
        phoneNumber: z.string().regex(/^04\d{8}$/).describe("Australian mobile number (format: 04XXXXXXXX)"),
      },
      async ({ name, email, phoneNumber }) => {
        try {
          // Validate input
          const validatedData = createPersonSchema.parse({ name, email, phoneNumber });

          // Create person
          const person = await prisma.person.create({
            data: validatedData,
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
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: false,
                  error: error instanceof Error ? error.message : "Failed to create person",
                }),
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Update an existing person
    server.tool(
      "update_person",
      "Update an existing person's information",
      {
        id: z.string().describe("The unique ID of the person to update"),
        name: z.string().min(1).optional().describe("New name (optional)"),
        email: z.string().email().optional().describe("New email (optional)"),
        phoneNumber: z.string().regex(/^04\d{8}$/).optional().describe("New phone number (optional)"),
      },
      async ({ id, name, email, phoneNumber }) => {
        try {
          // Build update data
          const updateData: { name?: string; email?: string; phoneNumber?: string } = {};
          if (name) updateData.name = name;
          if (email) updateData.email = email;
          if (phoneNumber) updateData.phoneNumber = phoneNumber;

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

          // Validate update data
          updatePersonSchema.parse(updateData);

          // Update person
          const person = await prisma.person.update({
            where: { id },
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
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: false,
                  error: error instanceof Error ? error.message : "Failed to update person",
                }),
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Delete a person
    server.tool(
      "delete_person",
      "Delete a person from the database",
      {
        id: z.string().describe("The unique ID of the person to delete"),
      },
      async ({ id }) => {
        try {
          await prisma.person.delete({
            where: { id },
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
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: false,
                  error: error instanceof Error ? error.message : "Failed to delete person",
                }),
              },
            ],
            isError: true,
          };
        }
      }
    );
  },
  {
    // Server capabilities
    capabilities: {
      tools: {},
    },
  },
  {
    // Handler options
    basePath: "/api/mcp",
    verboseLogs: true,
    maxDuration: 60,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
