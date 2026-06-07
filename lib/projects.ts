// Single source of truth for the whole experience.
//
// The world is a floating island with a house on it. You enter through the front
// door into two low-poly rooms:
//   • "projects"  — interactive objects, each one a real project of mine
//   • "portfolio" — framed boards about me, my stack and where to find more
// A few things live "exterior" (the cloud above the roof, the mailbox by the path).

export type Room = "projects" | "portfolio" | "exterior";

export type ModelKind =
  | "monitor"
  | "retroMac"
  | "serverRack"
  | "cloud"
  | "console"
  | "chartScreen"
  | "phone"
  | "tray"
  | "mailbox"
  | "octocat";

export interface ProjectLink {
  label: string;
  href: string;
  kind: "primary" | "secondary";
}

// Anything that can be shown in the detail overlay (projects and portfolio frames).
export interface OverlayItem {
  title: string;
  tagline: string;
  description: string;
  accent: string;
  tags?: string[];
  links?: ProjectLink[];
  body?: string[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  links: ProjectLink[];
  accent: string;
  kind: ModelKind;
  room: Room;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  focus: [number, number, number];
}

export const PROFILE = {
  name: "Plattnericus",
  firstName: "Felix",
  tagline: "Apprentice developer & relentless self-hoster",
  avatar: "pfp.jpg",
  email: "mail@plattnericus.dev",
  github: "https://github.com/Plattnericus",
  domain: "plattnericus.dev",
  location: "South Tyrol, Italy",
};

// ── Interactive project objects ───────────────────────────────────────────────
export const PROJECTS: Project[] = [
  {
    id: "pokyh",
    title: "POKYH",
    tagline: "The big one",
    description:
      "POKYH is the project I keep coming back to — my flagship site and the thing I'm most proud of. Everything I learn tends to end up here first.",
    tags: ["Web", "Flagship"],
    links: [{ label: "Open POKYH", href: "https://pokyh.com", kind: "primary" }],
    accent: "#0a84ff",
    kind: "monitor",
    room: "projects",
    position: [-3.75, 0.92, -2.95],
    rotation: [0, 0.12, 0],
    scale: 1,
    focus: [-4.2, 1.25, -2.9],
  },
  {
    id: "campedell",
    title: "CampedellApp",
    tagline: "TypeScript, on the go",
    description:
      "A mobile-first TypeScript app I shipped to Vercel. Small, fast, and the project where I got comfortable with proper typing.",
    tags: ["TypeScript", "App", "Vercel"],
    links: [
      { label: "Open app", href: "https://campedell-app.vercel.app", kind: "primary" },
      { label: "Source", href: "https://github.com/Plattnericus/CampedellApp", kind: "secondary" },
    ],
    accent: "#5e5ce6",
    kind: "phone",
    room: "projects",
    position: [-4.0, 2.32, -3.12],
    rotation: [0.5, 0.2, 0],
    scale: 1,
    focus: [-3.55, 1.15, -2.7],
  },
  {
    id: "finanzen",
    title: "Finanzen",
    tagline: "School project · BFS FI 2",
    description:
      "A little stock-tracking dashboard built for school. Live prices, a watchlist, and my first real taste of working with financial APIs.",
    tags: ["Finance", "Web", "School"],
    links: [
      { label: "Open demo", href: "https://finanzen.plattnericus.dev", kind: "primary" },
      { label: "Source", href: "https://github.com/Plattnericus/Finanzen", kind: "secondary" },
    ],
    accent: "#bf5af2",
    kind: "chartScreen",
    room: "projects",
    position: [-2.95, 0.92, -2.98],
    rotation: [0, 0, 0],
    scale: 1,
    focus: [-2.85, 1.25, -2.95],
  },
  {
    id: "mensa",
    title: "Mensa",
    tagline: "Lunch, sorted",
    description:
      "The cafeteria app for Tschuggmal BFS — today's menu without the guesswork. Built because I was tired of not knowing what was for lunch.",
    tags: ["JavaScript", "School"],
    links: [{ label: "View source", href: "https://github.com/Plattnericus/mensa", kind: "primary" }],
    accent: "#ffd60a",
    kind: "tray",
    room: "projects",
    position: [-2.4, 1.99, -3.12],
    rotation: [0, -0.15, 0],
    scale: 1,
    focus: [-2.15, 1.15, -2.7],
  },
  {
    id: "streamdeck",
    title: "macOS Tahoe Clone",
    tagline: "StreamDeck · BFS FI 3",
    description:
      "My final-year school project: a browser desktop that mimics macOS Tahoe — draggable windows, a dock, the works. Easily the most fun I've had building UI.",
    tags: ["JavaScript", "UI", "School"],
    links: [
      { label: "Open website", href: "https://streamdeck.plattnericus.dev", kind: "primary" },
      { label: "Source", href: "https://github.com/Plattnericus/StreamDeck", kind: "secondary" },
    ],
    accent: "#ff9f0a",
    kind: "retroMac",
    room: "projects",
    position: [-2.15, 0.92, -2.88],
    rotation: [0, 1.39, 0],
    scale: 1,
    focus: [-1.35, 1.2, -2.82],
  },
  {
    id: "proxmox",
    title: "Proxmox",
    tagline: "The metal it all runs on",
    description:
      "My home Proxmox box — the server that hosts the cloud, the apps and every half-finished experiment. Tinkering with it taught me more than any class.",
    tags: ["Infra", "Self-hosted", "Homelab"],
    links: [{ label: "Open dashboard", href: "https://proxmox.plattnericus.dev", kind: "primary" }],
    accent: "#30d158",
    kind: "serverRack",
    room: "projects",
    position: [-5.1, 0, -0.9],
    rotation: [0, 5.06, 0],
    scale: 1,
    focus: [-0.85, 0.8, -2.55],
  },
  {
    id: "minesweeper",
    title: "Minesweeper",
    tagline: "Made for fun",
    description:
      "A clean, modern Minesweeper I built purely because I wanted to. No deadline, no brief — just polish for polish's sake.",
    tags: ["Game", "JavaScript"],
    links: [
      { label: "Play now", href: "https://minesweeper.plattnericus.dev", kind: "primary" },
      { label: "Source", href: "https://github.com/Ryhox/minesweeper.ryhox.dev", kind: "secondary" },
    ],
    accent: "#ff453a",
    kind: "console",
    room: "projects",
    position: [-3.2, 2.32, -3.12],
    rotation: [0.35, 0.9, 0],
    scale: 1,
    focus: [-4.75, 0.85, 0.5],
  },
  {
    id: "cloud",
    title: "Cloud",
    tagline: "My data, my rules",
    description:
      "A self-hosted cloud running on the Proxmox box. Files, backups and a few services — all mine, none of it rented from anyone.",
    tags: ["Self-hosted", "Storage"],
    links: [{ label: "Open cloud", href: "https://cloud.plattnericus.dev", kind: "primary" }],
    accent: "#64d2ff",
    kind: "cloud",
    room: "exterior",
    position: [-2.6, 5.4, 1.6],
    rotation: [0, 0, 0],
    scale: 0.72,
    focus: [-2.6, 5.4, 1.6],
  },
  {
    id: "contact",
    title: "Say hi",
    tagline: "The mailbox is always open",
    description:
      "Got an idea, a question, or just want to talk shop? Drop a letter in the mailbox — I read everything and reply to most of it.",
    tags: ["Contact"],
    links: [{ label: "Write an e-mail", href: "mailto:mail@plattnericus.dev", kind: "primary" }],
    accent: "#ff375f",
    kind: "mailbox",
    room: "exterior",
    position: [-3.4, 0, 5.2],
    rotation: [0, 0.5, 0],
    scale: 1,
    focus: [-3.4, 0.7, 5.2],
  },
  {
    id: "github",
    title: "GitHub",
    tagline: "Everything else lives here",
    description:
      "Forks, experiments, half-baked ideas and the occasional finished thing. If you want to see how I actually work, this is the place.",
    tags: ["Open source"],
    links: [{ label: "Visit my profile", href: "https://github.com/Plattnericus", kind: "primary" }],
    accent: "#f5f5f7",
    kind: "octocat",
    room: "portfolio",
    position: [4.4, 0.95, -2.7],
    rotation: [0, -0.5, 0],
    scale: 1,
    focus: [4.4, 1.2, -2.7],
  },
];

// ── Portfolio room: framed boards on the wall ────────────────────────────────
export interface Frame {
  id: string;
  title: string;
  tagline: string;
  description: string;
  accent: string;
  // Wall position (back wall of the portfolio room).
  position: [number, number, number];
  size: [number, number];
  links?: ProjectLink[];
  body?: string[]; // optional bullet lines shown in the overlay
}

export const FRAMES: Frame[] = [
  {
    id: "about",
    title: "About me",
    tagline: "Who's behind all this",
    accent: "#0a84ff",
    position: [1.6, 1.85, -3.32],
    size: [1.1, 1.4],
    description:
      "Hi, I'm Felix — known online as Plattnericus. I'm an apprentice developer from South Tyrol who got hooked on building things for the web and never really stopped. Most of what you see here started as a 'wonder if I could…' and turned into a weekend (or three).",
    body: [
      "Currently: finishing my apprenticeship (BFS FI).",
      "Happiest when: self-hosting something that probably didn't need self-hosting.",
      "Always up for: a good side-project and a worse idea.",
    ],
  },
  {
    id: "stack",
    title: "My stack",
    tagline: "Tools I reach for",
    accent: "#30d158",
    position: [3.1, 1.85, -3.32],
    size: [1.1, 1.4],
    description:
      "I like vanilla fundamentals first, frameworks when they earn their keep, and a homelab to run it all on.",
    body: [
      "Web — JavaScript, TypeScript, React, Next.js, plain HTML/CSS.",
      "Backend — Node.js and whatever the project needs.",
      "Infra — Proxmox, Docker, self-hosted everything.",
    ],
  },
  {
    id: "elsewhere",
    title: "Find me",
    tagline: "Out in the wild",
    accent: "#bf5af2",
    position: [4.55, 1.85, -3.32],
    size: [1.0, 1.4],
    description: "The usual places. GitHub is where the real activity is.",
    links: [
      { label: "GitHub", href: "https://github.com/Plattnericus", kind: "primary" },
      { label: "E-mail", href: "mailto:mail@plattnericus.dev", kind: "secondary" },
    ],
    body: ["github.com/Plattnericus", "mail@plattnericus.dev", "plattnericus.dev"],
  },
];

// Camera anchors per room: [camera position, look-at target].
export const ROOM_VIEWS: Record<
  Exclude<Room, "exterior"> | "exterior",
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  exterior: { pos: [0, 0.2, 11.6], target: [0, 1.0, 0] },
  projects: { pos: [-2.9, 1.7, 1.4], target: [-2.9, 1.3, -2.9] },
  portfolio: { pos: [2.9, 1.7, 1.4], target: [2.9, 1.3, -2.9] },
};
