export type AgeGroup = {
  tag: "U10" | "U12" | "U15" | "U18";
  title: string;
  summary: string;
  focus: string[];
};

export const ACADEMY = {
  name: "Devsheel Football Academy",
  tagline: "Where champions are forged",
  about:
    "A young grassroots football academy for players aged roughly 9 to 18. Sessions are small, fundamentals-first and led personally by the founder. No pro placements or major honours yet — occasional tournaments and steady, honest development.",
  coach:
    "The academy is run personally by its founder, the head coach. Every player is seen in every session and coaching is hands-on rather than delegated.",
  contact: {
    address: "42 Kingsway Sports Complex, Devsheel Park, London N16 5QP",
    phone: "+44 20 7946 0123",
    email: "hello@devsheel.fc",
    note: "The academy does not offer free trials. Get in touch to talk about joining.",
  },
} as const;

export const AGE_GROUPS: AgeGroup[] = [
  {
    tag: "U10",
    title: "Under 10",
    summary:
      "First steps in structured football. Coordination, ball familiarity and small-sided games — the age where the love of the ball is set.",
    focus: ["First touch & dribbling", "Small-sided games", "Basic positioning", "Fun-led sessions"],
  },
  {
    tag: "U12",
    title: "Under 12",
    summary:
      "Building on the fundamentals. Introducing simple team shape, passing patterns and the responsibility that comes with a shirt.",
    focus: ["Passing & receiving", "Introductory tactics", "Two-footed play", "Teamwork & respect"],
  },
  {
    tag: "U15",
    title: "Under 15",
    summary:
      "Bridging youth football and competitive age-group play. Deeper tactical work, positional roles and physical development within safe limits.",
    focus: ["Positional roles", "Game intelligence", "Fitness fundamentals", "Occasional tournaments"],
  },
  {
    tag: "U18",
    title: "Under 18",
    summary:
      "Preparing players for adult football. Higher intensity, tactical detail and personal accountability on and off the pitch.",
    focus: ["Tactical detail", "Strength & conditioning", "Match analysis", "Leadership on the pitch"],
  },
];
