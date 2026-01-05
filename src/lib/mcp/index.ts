import { defineMcp } from "@lovable.dev/mcp-js";
import getAcademyInfo from "./tools/get-academy-info";
import listAgeGroups from "./tools/list-age-groups";
import getAgeGroup from "./tools/get-age-group";

export default defineMcp({
  name: "devsheel-football-academy",
  title: "Devsheel Football Academy",
  version: "0.1.0",
  instructions:
    "Public information tools for Devsheel Football Academy. Use `get_academy_info` for an overview and contact details, `list_age_groups` for all training groups, and `get_age_group` for one group (U10, U12, U15, U18).",
  tools: [getAcademyInfo, listAgeGroups, getAgeGroup],
});
