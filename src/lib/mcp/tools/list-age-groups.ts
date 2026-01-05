import { defineTool } from "@lovable.dev/mcp-js";
import { AGE_GROUPS, ACADEMY } from "../data";

export default defineTool({
  name: "list_age_groups",
  title: "List age groups",
  description:
    "List the academy's training age groups (U10, U12, U15, U18) with a summary and coaching focus for each.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: AGE_GROUPS.map(
          (g) => `${g.tag} — ${g.title}\n${g.summary}\nFocus: ${g.focus.join(", ")}`,
        ).join("\n\n"),
      },
    ],
    structuredContent: { academy: ACADEMY.name, groups: AGE_GROUPS },
  }),
});
