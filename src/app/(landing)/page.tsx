import AboutMe from "@/components/user/home/aboutme/AboutMe";
import Blogs from "@/components/user/home/blogs/Blogs";
import Contributions from "@/components/user/home/contributions/Contributions";
import EmptyState from "@/components/user/home/EmptyState";
import Experience from "@/components/user/home/experience/Experience";
import GetInTouch from "@/components/user/home/getintouch/GetInTouch";
import Header from "@/components/user/home/header/Header";
import Projects from "@/components/user/home/projects/Projects";
import SideProjects from "@/components/user/home/sideprojects/SideProjects";
import Skills from "@/components/user/home/skills/Skills";
import dataFetchingTags from "@/constants/dataFetchingTags";
import { getData } from "@/helpers/data-fetching/data-fetching";
import { normalizeSections } from "@/lib/sections";
import { SectionKey } from "@/server/modules/owner/owner.constant";
import { Fragment, ReactNode } from "react";

type HomeSectionContext = {
  ownerData: any;
  projects: any;
  personalProjects: any;
  experiences: any;
  blogs: any;
  skills: any;
  skillCategories: any;
  contributions: any;
};

const SECTION_COMPONENTS: Record<
  SectionKey,
  (ctx: HomeSectionContext) => ReactNode
> = {
  about: ({ ownerData }) => <AboutMe ownerData={ownerData} id="aboutMe" />,
  projects: ({ projects }) => <Projects projects={projects} id="projects" />,
  sideProjects: ({ personalProjects }) => (
    <SideProjects projects={personalProjects} id="side-projects" />
  ),
  contributions: ({ contributions }) => (
    <Contributions contributions={contributions} id="contributions" />
  ),
  experience: ({ experiences }) => (
    <Experience experiences={experiences} id="experiences" />
  ),
  blogs: ({ blogs }) => <Blogs blogs={blogs} id="blogs" />,
  skills: ({ skills, skillCategories }) => (
    <Skills skills={skills} categories={skillCategories} id="skills" />
  ),
  contact: ({ ownerData }) => (
    <GetInTouch ownerData={ownerData} id="contact" />
  ),
};

const Home = async () => {
  const { data: ownerData, isLoading: isOwnerDataLoading } = await getData(
    "/owners/getOwner",
    undefined,
    [dataFetchingTags.owners]
  );

  if (!ownerData) {
    return <EmptyState />;
  }

  const { data: featuredProjects, isLoading: isProjectDataLoading } =
    await getData("/projects", undefined, [dataFetchingTags.projects], {
      isFeatured: true,
      limit: 50,
      sortBy: "priorityScore",
      sortOrder: "desc",
    });
  const projects = (featuredProjects || [])
    .filter((project: any) => project.type !== "personal")
    .slice(0, 3);
  const personalProjects = (featuredProjects || [])
    .filter((project: any) => project.type === "personal")
    .slice(0, 3);
  const { data: skills, isLoading: isSkillLoading } = await getData(
    "/skills",
    undefined,
    [dataFetchingTags.skills],
    { limit: 200 }
  );
  const { data: skillCategories, isLoading: isSkillCategoriesLoading } =
    await getData(
      "/skill-categories",
      undefined,
      [dataFetchingTags.skillCategories],
      { limit: 200 }
    );
  const { data: blogs, isLoading: isBlogsLoading } = await getData(
    "/blogs",
    undefined,
    [dataFetchingTags.blogs]
  );
  const { data: experiences, isLoading: isExperiencesLoading } = await getData(
    "/experiences",
    undefined,
    [dataFetchingTags.experiences],
    {
      show: true,
      sortBy: "startTime",
      sortOrder: "desc",
    }
  );
  const { data: contributions, isLoading: isContributionsLoading } =
    await getData(
      "/contributions",
      undefined,
      [dataFetchingTags.contributions],
      {
        page: 1,
        limit: 3,
        isFeatured: true,
        sortBy: "priorityScore",
        sortOrder: "desc",
      }
    );

  const sections = normalizeSections(ownerData?.sections);
  const ctx: HomeSectionContext = {
    ownerData,
    projects,
    personalProjects,
    experiences,
    blogs,
    skills,
    skillCategories,
    contributions,
  };

  return (
    <div className="w-full">
      <Header ownerData={ownerData} skills={skills} />
      {sections
        .filter((section) => section.visible)
        .map((section) => (
          <Fragment key={section.key}>
            {section.key in SECTION_COMPONENTS
              ? SECTION_COMPONENTS[section.key as SectionKey](ctx)
              : null}
          </Fragment>
        ))}
    </div>
  );
};

export default Home;
