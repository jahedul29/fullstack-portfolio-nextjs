import AboutMe from "@/components/user/home/aboutme/AboutMe";
import Blogs from "@/components/user/home/blogs/Blogs";
import EmptyState from "@/components/user/home/EmptyState";
import Experience from "@/components/user/home/experience/Experience";
import GetInTouch from "@/components/user/home/getintouch/GetInTouch";
import Header from "@/components/user/home/header/Header";
import Projects from "@/components/user/home/projects/Projects";
import Skills from "@/components/user/home/skills/Skills";
import dataFetchingTags from "@/constants/dataFetchingTags";
import { getData } from "@/helpers/data-fetching/data-fetching";

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

  const show = (k: string) => ownerData?.sections?.[k] !== false;

  return (
    <div className="w-full">
      <Header ownerData={ownerData} skills={skills} />
      {show("about") && <AboutMe ownerData={ownerData} id="aboutMe" />}
      {show("projects") && <Projects projects={projects} id="projects" />}
      {show("experience") && (
        <Experience experiences={experiences} id="experiences" />
      )}
      {show("blogs") && <Blogs blogs={blogs} id="blogs" />}
      {show("skills") && <Skills skills={skills} id="skills" />}
      {show("contact") && <GetInTouch ownerData={ownerData} id="contact" />}
    </div>
  );
};

export default Home;
