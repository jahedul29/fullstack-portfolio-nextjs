import AboutMe from "@/components/user/home/aboutme/AboutMe";
import Blogs from "@/components/user/home/blogs/Blogs";
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
      sortBy: "startTime",
      sortOrder: "desc",
    }
  );

  return (
    <div className="w-full">
      <Header ownerData={ownerData} skills={skills} />
      <AboutMe ownerData={ownerData} id="aboutMe" />
      <Projects projects={projects} id="projects" />
      <Experience experiences={experiences} id="experiences" />
      <Blogs blogs={blogs} id="blogs" />
      <Skills skills={skills} id="skills" />
      <GetInTouch ownerData={ownerData} id="contact" />
    </div>
  );
};

export default Home;
