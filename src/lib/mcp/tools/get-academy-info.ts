import { defineTool } from "@lovable.dev/mcp-js";
import { ACADEMY } from "../data";

export default defineTool({
  name: "get_academy_info",
  title: "Get academy info",
  description:
    "Get an overview of Devsheel Football Academy: what it is, how it is coached, and its public contact details.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: [
          `${ACADEMY.name} — ${ACADEMY.tagline}`,
          ACADEMY.about,
          `Coaching: ${ACADEMY.coach}`,
          `Address: ${ACADEMY.contact.address}`,
          `Phone: ${ACADEMY.contact.phone}`,
          `Email: ${ACADEMY.contact.email}`,
          ACADEMY.contact.note,
        ].join("\n\n"),
      },
    ],
    structuredContent: { academy: ACADEMY },
  }),
});
