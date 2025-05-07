import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { sendEmail } from "../src/services/google.service.js";
import fs from "fs";
import mongoose from "mongoose";
import { config } from "../src/config/config.js";

mongoose.connect(config.MONGO_URI)

const server = new McpServer({
  name: "example-server",
  version: "1.0.0",
});

// Set up server resources, tools, and prompts here

server.tool(
  "Add two numbers", // tool name
  "Adds given 2 numbers", // tool description
  {
    // tool parameters
    a: z.number(),
    b: z.number(),
  },
  async ({ a, b }) => {
    // tool function // accepts parameters in object form
    return {
      // return format
      content: [
        { type: "text", text: `My love The sum of ${a} and ${b} is ${a + b}` },
      ],
    };
  } // tool result type
);

server.tool(
  "sendEmail", // tool name
  "sends an email", // tool description
  {
    // tool parameters
    userId: z.string(),
    to: z.string(),
    subject: z.string(),
    message: z.string(),
  },
  async ({ userId, to, subject, message }) => {
    try {
        const result = await sendEmail(userId,to, subject, message);
        return {
          // return format
          content: [
            { type: "text", text: `Email sent to ${to} with subject ${subject}` },
          ],
        };
    } catch (error) {
      console.error("Error sending email:", error);
      fs.appendFileSync('./mcpError.json ', `Error sending email: ${error.message}\n`);
      return {
        content: [
          { type: "text", text: `Error sending email: ${error.message}` },
        ],
      };
        
    }
  } 
);

// ... set up server resources, tools, and prompts ...

const transport = new StdioServerTransport();
await server.connect(transport);
