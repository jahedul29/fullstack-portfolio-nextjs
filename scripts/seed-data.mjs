// Editable sample content for `npm run seed`. Replace every value below with
// your own before (or after) seeding — this file has no logic, only data.

export const ownerData = {
  name: "Jane Developer",
  email: "jane.developer@example.com",
  phoneNumber: "+1 555 010 1234",
  linkedInUrl: "https://linkedin.com/in/jane-developer",
  facebookUrl: "https://facebook.com/jane.developer",
  githubUrl: "https://github.com/jane-developer",
  resumeUrl: "https://example.com/jane-developer-resume.pdf",
  stackOverflowUrl: "https://stackoverflow.com/users/1/jane-developer",
  calanderlyUrl: "https://calendly.com/jane-developer",
  address: "Remote / San Francisco, CA",
  photoUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
  designation: "Senior Full-Stack Engineer",
  summery:
    "I build fast, accessible, production-grade web products end to end — from data model to pixel.",
  aboutOwner:
    "Senior full-stack engineer with 7+ years shipping and operating web applications used by hundreds of thousands of people. I care most about developer experience, measurable outcomes, and code that's still easy to change two years later. Outside of work I mentor engineers and contribute to open source.",
  metaKeywords: [
    "Jane Developer",
    "Senior Full-Stack Engineer",
    "Next.js Developer",
    "TypeScript",
    "React",
    "Node.js",
  ],
};

export const skillsData = [
  { name: "TypeScript", level: 95, category: "Languages" },
  { name: "React", level: 92, category: "Frontend" },
  { name: "Next.js", level: 90, category: "Frontend" },
  { name: "Node.js", level: 90, category: "Backend" },
  { name: "MongoDB", level: 85, category: "Databases" },
  { name: "AWS", level: 80, category: "Infrastructure" },
];

export const projectsData = [
  {
    title: "Realtime Analytics Dashboard",
    category: "fullstack",
    photoUrl: "https://avatars.githubusercontent.com/u/9919?v=4",
    description:
      "A multi-tenant analytics platform that ingests millions of events a day and renders them as live dashboards, replacing a brittle nightly-batch reporting pipeline.",
    githubUrl: "https://github.com/jane-developer/realtime-analytics-dashboard",
    websiteUrl: "https://example.com/projects/realtime-analytics-dashboard",
    isFeatured: true,
    priorityScore: 100,
    outcome:
      "Cut report-generation time from 24 hours to under 5 seconds for 200+ internal users.",
    role: "Lead Full-Stack Engineer",
    technologies: ["TypeScript", "React", "Next.js", "Node.js", "MongoDB"],
  },
  {
    title: "Headless E-Commerce Storefront",
    category: "frontend",
    photoUrl: "https://avatars.githubusercontent.com/u/1?v=4",
    description:
      "A composable, headless storefront built on a commerce API, rebuilt from a legacy server-rendered template to a modern edge-rendered app.",
    githubUrl: "https://github.com/jane-developer/headless-storefront",
    websiteUrl: "https://example.com/projects/headless-storefront",
    isFeatured: true,
    priorityScore: 90,
    outcome:
      "Raised the Lighthouse performance score from 62 to 96 and lifted checkout conversion by 18%.",
    role: "Frontend Lead",
    technologies: ["TypeScript", "React", "Next.js"],
  },
  {
    title: "Distributed Job Queue Service",
    category: "backend",
    photoUrl: "https://avatars.githubusercontent.com/u/2?v=4",
    description:
      "A horizontally-scalable background job processor with retries, dead-letter queues, and per-tenant rate limiting for a SaaS platform.",
    githubUrl: "https://github.com/jane-developer/distributed-job-queue",
    websiteUrl: "https://example.com/projects/distributed-job-queue",
    isFeatured: false,
    priorityScore: 80,
    outcome:
      "Processed 2M+ background jobs a day at 99.98% success rate after rollout.",
    role: "Backend Engineer",
    technologies: ["Node.js", "MongoDB", "AWS"],
  },
  {
    title: "Open-Source Component Library",
    category: "frontend",
    photoUrl: "https://avatars.githubusercontent.com/u/3?v=4",
    description:
      "An accessible, themeable React component library shared across five internal product teams, published with automated visual-regression testing.",
    githubUrl: "https://github.com/jane-developer/component-library",
    websiteUrl: "https://example.com/projects/component-library",
    isFeatured: false,
    priorityScore: 70,
    outcome:
      "Adopted by 15+ internal teams, cutting new-screen UI development time by roughly 30%.",
    role: "Maintainer",
    technologies: ["TypeScript", "React"],
  },
];

export const experiencesData = [
  {
    companyName: "Nimbus Cloud Systems",
    position: "Senior Software Engineer",
    startTime: "2022-03-01",
    isWorkingCurrently: true,
    show: true,
    description:
      "Own the platform team's core services powering account provisioning, billing, and internal developer tooling for a B2B SaaS product.",
    impact: [
      "Led the migration of a monolithic API to a modular service architecture with zero customer-facing downtime.",
      "Introduced contract-tested internal APIs, cutting cross-team integration bugs by more than half.",
      "Mentored three mid-level engineers, two of whom were promoted within a year.",
    ],
    metrics: [
      { label: "API p95 latency", value: "-63%" },
      { label: "On-call incidents / month", value: "-40%" },
      { label: "Team size led", value: "8 engineers" },
    ],
    role: "Tech Lead, Platform Team",
    teamSize: 8,
    technologies: ["TypeScript", "React", "Node.js", "AWS"],
  },
  {
    companyName: "Brightline Retail Co.",
    position: "Software Engineer II",
    startTime: "2019-06-01",
    endTime: "2022-02-28",
    isWorkingCurrently: false,
    show: true,
    description:
      "Built and operated the customer-facing web app for a mid-market e-commerce retailer, from checkout to order tracking.",
    impact: [
      "Rebuilt the checkout flow, reducing cart abandonment by 22%.",
      "Introduced automated end-to-end testing, cutting release regressions to near zero.",
    ],
    metrics: [
      { label: "Cart abandonment", value: "-22%" },
      { label: "Deploy frequency", value: "3x" },
    ],
    role: "Full-Stack Engineer",
    teamSize: 5,
    technologies: ["React", "Node.js", "MongoDB"],
  },
  {
    companyName: "Vertex Labs",
    position: "Software Engineer",
    startTime: "2017-08-01",
    endTime: "2019-05-31",
    isWorkingCurrently: false,
    show: true,
    description:
      "Founding engineer at an early-stage startup; built the first version of the product from scratch alongside two co-founders.",
    impact: [
      "Shipped the MVP that closed the company's seed round.",
      "Built the initial CI/CD pipeline and deployment infrastructure from nothing.",
    ],
    metrics: [{ label: "Time to first customer", value: "11 weeks" }],
    role: "Founding Engineer",
    teamSize: 3,
    technologies: ["TypeScript", "React"],
  },
];

export const blogsData = [
  {
    title: "Designing Resilient Micro-Frontends at Scale",
    category: "Architecture",
    photoUrl: "https://avatars.githubusercontent.com/u/9919?v=4",
    blogUrl: "https://example.com/blog/resilient-micro-frontends",
    platform: "Personal Blog",
    description:
      "Patterns and pitfalls for splitting a large web app into independently deployable micro-frontends without shipping three copies of React.",
    isFeatured: true,
    priorityScore: 90,
  },
  {
    title: "A Practical Guide to Type-Safe API Contracts with Zod",
    category: "Backend",
    photoUrl: "https://avatars.githubusercontent.com/u/1?v=4",
    blogUrl: "https://example.com/blog/type-safe-api-contracts-zod",
    platform: "Dev.to",
    description:
      "How we used Zod schemas as the single source of truth for request validation, TypeScript types, and API documentation.",
    isFeatured: true,
    priorityScore: 80,
  },
  {
    title: "Lessons from Migrating a Legacy Monolith to Next.js",
    category: "Migration",
    photoUrl: "https://avatars.githubusercontent.com/u/2?v=4",
    blogUrl: "https://example.com/blog/legacy-monolith-to-nextjs",
    platform: "Medium",
    description:
      "A retrospective on a year-long incremental migration from a server-rendered PHP monolith to Next.js, including what we'd do differently.",
    isFeatured: false,
    priorityScore: 70,
  },
];

export const contributionsData = [
  {
    title: "next-safe-action",
    photoUrl: "https://avatars.githubusercontent.com/u/3?v=4",
    contributionFor: "Open-source Next.js server-action library",
    description:
      "Added client-side optimistic-update support and improved TypeScript inference for nested action schemas.",
    githubUrl: "https://github.com/jane-developer/next-safe-action",
    relatedUrl:
      "https://github.com/example-org/next-safe-action/pulls?q=author%3Ajane-developer",
    isFeatured: true,
    priorityScore: 80,
    technologies: ["TypeScript", "Next.js"],
  },
  {
    title: "shadcn/ui",
    photoUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
    contributionFor: "Component library documentation and accessibility fixes",
    description:
      "Fixed focus-trap edge cases in the Dialog and Sheet components and expanded the accessibility section of the docs.",
    githubUrl: "https://github.com/jane-developer/ui",
    relatedUrl:
      "https://github.com/example-org/ui/pulls?q=author%3Ajane-developer",
    isFeatured: false,
    priorityScore: 60,
    technologies: ["TypeScript", "React"],
  },
];
