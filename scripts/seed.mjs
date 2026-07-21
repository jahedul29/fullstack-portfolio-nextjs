// Idempotent demo-content seed script.
//
// Talks to the app's own running `/api/v1` REST API (same pattern as
// `scripts/seed-admin.mjs`, run with `node --env-file=.env scripts/seed.mjs`
// against a `next dev`/`next start` instance) so every document created goes
// through the exact same zod + Mongoose validation the admin panel uses.
//
// Safe to run repeatedly against a populated DB: every resource is checked
// via its public GET endpoint first, and only if every single one already
// has data does the script skip authenticating and exit without writing
// anything.
import {
  ownerData,
  skillsData,
  projectsData,
  experiencesData,
  blogsData,
  contributionsData,
} from "./seed-data.mjs";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const API_URL = `${BASE_URL}/api/v1`;

const LIST_RESOURCES = [
  { key: "skills", path: "/skills" },
  { key: "projects", path: "/projects" },
  { key: "blogs", path: "/blogs" },
  { key: "experiences", path: "/experiences" },
  { key: "contributions", path: "/contributions" },
];

async function fetchJson(path, options) {
  const res = await fetch(`${API_URL}${path}`, options);
  const json = await res.json().catch(() => null);
  return { res, json };
}

async function getListTotal(path) {
  const { json } = await fetchJson(`${path}?limit=1`);
  return json?.meta?.total ?? 0;
}

async function ownerExists() {
  const { res } = await fetchJson("/owners/getOwner");
  return res.status === 200;
}

async function getResourceStatus() {
  const status = { owner: await ownerExists() };
  for (const { key, path } of LIST_RESOURCES) {
    status[key] = (await getListTotal(path)) >= 1;
  }
  return status;
}

function extractCookie(res, name) {
  const cookies =
    typeof res.headers.getSetCookie === "function"
      ? res.headers.getSetCookie()
      : res.headers.get("set-cookie")
      ? [res.headers.get("set-cookie")]
      : [];

  for (const cookie of cookies) {
    const match = cookie.match(new RegExp(`^${name}=([^;]+)`));
    if (match) return `${name}=${match[1]}`;
  }
  return null;
}

async function login() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required to seed empty resources"
    );
  }

  const { res, json } = await fetchJson("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });

  if (!res.ok) {
    throw new Error(
      `Login failed (${res.status}): ${json?.message ?? "unknown error"}`
    );
  }

  const cookie = extractCookie(res, "accessToken");
  if (!cookie) {
    throw new Error("Login succeeded but no accessToken cookie was returned");
  }

  return cookie;
}

async function post(path, body, cookie) {
  const { res, json } = await fetchJson(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(
      `POST ${path} failed (${res.status}): ${json?.message ?? "unknown error"}`
    );
  }

  return json.data;
}

async function getSkillMap() {
  const { json } = await fetchJson("/skills?limit=100");
  const map = new Map();
  for (const skill of json?.data ?? []) {
    map.set(skill.name, skill._id);
  }
  return map;
}

function resolveTechnologies(names, skillMap, contextLabel) {
  return names.map((name) => {
    const id = skillMap.get(name);
    if (!id) {
      throw new Error(
        `Cannot resolve skill "${name}" referenced by ${contextLabel}. Seed skills first, or add "${name}" to seed-data.mjs.`
      );
    }
    return id;
  });
}

async function seedSkills(cookie) {
  for (const skill of skillsData) {
    await post("/skills", skill, cookie);
    console.log(`created skill: ${skill.name}`);
  }
}

async function seedProjects(cookie, skillMap) {
  for (const project of projectsData) {
    const { technologies, ...rest } = project;
    const body = {
      ...rest,
      technologies: resolveTechnologies(
        technologies,
        skillMap,
        `project "${project.title}"`
      ),
    };
    await post("/projects", body, cookie);
    console.log(`created project: ${project.title}`);
  }
}

async function seedExperiences(cookie, skillMap) {
  for (const experience of experiencesData) {
    const { technologies, ...rest } = experience;
    const body = {
      ...rest,
      technologies: resolveTechnologies(
        technologies,
        skillMap,
        `experience "${experience.companyName}"`
      ),
    };
    await post("/experiences", body, cookie);
    console.log(`created experience: ${experience.companyName}`);
  }
}

async function seedBlogs(cookie) {
  for (const blog of blogsData) {
    await post("/blogs", blog, cookie);
    console.log(`created blog: ${blog.title}`);
  }
}

async function seedContributions(cookie, skillMap) {
  for (const contribution of contributionsData) {
    const { technologies, ...rest } = contribution;
    const body = {
      ...rest,
      technologies: resolveTechnologies(
        technologies,
        skillMap,
        `contribution "${contribution.title}"`
      ),
    };
    await post("/contributions", body, cookie);
    console.log(`created contribution: ${contribution.title}`);
  }
}

async function seedOwner(cookie) {
  await post("/owners", ownerData, cookie);
  console.log(`created owner: ${ownerData.name}`);
}

async function main() {
  console.log(`checking existing data via ${API_URL} ...`);
  const status = await getResourceStatus();
  console.log("resource status (populated=true means skip):", status);

  if (Object.values(status).every(Boolean)) {
    console.log("all resources already populated, nothing to seed");
    return;
  }

  const cookie = await login();

  if (!status.skills) {
    await seedSkills(cookie);
  } else {
    console.log("skills already populated, skipping");
  }

  const skillMap = await getSkillMap();

  if (!status.projects) {
    await seedProjects(cookie, skillMap);
  } else {
    console.log("projects already populated, skipping");
  }

  if (!status.experiences) {
    await seedExperiences(cookie, skillMap);
  } else {
    console.log("experiences already populated, skipping");
  }

  if (!status.blogs) {
    await seedBlogs(cookie);
  } else {
    console.log("blogs already populated, skipping");
  }

  if (!status.contributions) {
    await seedContributions(cookie, skillMap);
  } else {
    console.log("contributions already populated, skipping");
  }

  if (!status.owner) {
    await seedOwner(cookie);
  } else {
    console.log("owner already populated, skipping");
  }

  console.log("seed complete");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
