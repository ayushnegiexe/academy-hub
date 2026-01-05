import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { AGE_GROUPS } from "../data";

export default defineTool({
  name: "get_age_group",
  title: "Get age group details",
  description: "Get the training details for one academy age group by its tag (U10, U12, U15 or U18).",
  inputSchema: {
    tag: z.string().describe("Age group tag, e.g. U10, U12, U15 or U18."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ tag }) => {
    const normalized = tag.trim().toUpperCase().replace(/^UNDER\s*/, "U");
    const group = AGE_GROUPS.find((g) => g.tag === normalized);
    if (!group) {
      throw new ToolError(
        `Unknown age group "${tag}". Available groups: ${AGE_GROUPS.map((g) => g.tag).join(", ")}.`,
      );
    }
    return {
      content: [
        {
          type: "text",
          text: `${group.tag} — ${group.title}\n${group.summary}\nFocus: ${group.focus.join(", ")}`,
        },
      ],
      structuredContent: { group },
    };
  },
});
