import AboutMe from "@/components/user/home/aboutme/AboutMe";
import Blogs from "@/components/user/home/blogs/Blogs";
import Contributions from "@/components/user/home/contributions/Contributions";
import EmptyState from "@/components/user/home/EmptyState";
import Experience from "@/components/user/home/experience/Experience";
import GetInTouch from "@/components/user/home/getintouch/GetInTouch";
import Header from "@/components/user/home/header/Header";
import Projects from "@/components/user/home/projects/Projects";
import Skills from "@/components/user/home/skills/Skills";
import dataFetchingTags from "@/constants/dataFetchingTags";
import { getData } from "@/helpers/data-fetching/data-fetching";
import { normalizeSections } from "@/lib/sections";
import { SectionKey } from "@/server/modules/owner/owner.constant";
import { Fragment, ReactNode } from "react";

type HomeSectionContext = {
  ownerData: any;
  projects: any;
  experiences: any;
  blogs: any;
  skills: any;
  contributions: any;
};

const SECTION_COMPONENTS: Record<
  SectionKey,
  (ctx: HomeSectionContext) => ReactNode
> = {
  about: ({ ownerData }) => <AboutMe ownerData={ownerData} id="aboutMe" />,
  projects: ({ projects }) => <Projects projects={projects} id="projects" />,
  contributions: ({ contributions }) => (
    <Contributions contributions={contributions} id="contributions" />
  ),
  experience: ({ experiences }) => (
    <Experience experiences={experiences} id="experiences" />
  ),
  blogs: ({ blogs }) => <Blogs blogs={blogs} id="blogs" />,
  skills: ({ skills }) => <Skills skills={skills} id="skills" />,
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

  const { data: projects, isLoading: isProjectDataLoading } = await getData(
    "/projects",
    undefined,
    [dataFetchingTags.projects],
    {
      page: 1,
      limit: 3,
      isFeatured: true,
      sortBy: "priorityScore",
      sortOrder: "desc",
    }
  );
  const { data: skills, isLoading: isSkillLoading } = await getData(
    "/skills",
    undefined,
    [dataFetchingTags.skills]
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
    experiences,
    blogs,
    skills,
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
