"use client";

import { useEffect, useState } from "react";
import { FaGithub, FaLink, FaYoutube } from "react-icons/fa";

import Filterbar from "@/components/common/User/Filterbar";
import ContentCard, {
  ContentCardLink,
} from "@/components/user/home/ContentCard";
import dataFetchingTags from "@/constants/dataFetchingTags";
import { getData } from "@/helpers/data-fetching/data-fetching";
import { IProject } from "@/types";

const CATEGORY_OPTIONS = [
  { label: "All categories", value: "" },
  { label: "Fullstack", value: "fullstack" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
];

const buildProjectLinks = (project: IProject): ContentCardLink[] => {
  const links: ContentCardLink[] = [];
  if (project?.githubUrl) {
    links.push({
      href: project.githubUrl,
      label: "GitHub",
      icon: <FaGithub />,
    });
  }
  if (project?.websiteUrl) {
    links.push({ href: project.websiteUrl, label: "Live site", icon: <FaLink /> });
  }
  if (project?.videoUrl) {
    links.push({
      href: project.videoUrl,
      label: "Video walkthrough",
      icon: <FaYoutube />,
    });
  }
  return links;
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [queryParams, setQueryParams] = useState<{
    [key: string]: string | number | undefined;
  }>({
    page: 1,
    limit: 100,
    sortBy: "priorityScore",
    sortOrder: "desc",
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getData(
        "/projects",
        undefined,
        [dataFetchingTags.projects],
        { ...queryParams }
      );
      setProjects(data ?? []);
    };

    fetchData();
  }, [queryParams]);

  return (
    <div className="container mx-auto max-w-6xl px-5 py-16 sm:px-10 md:py-20">
      <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Projects
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            All projects
          </h1>
        </div>
        <Filterbar
          classNames="lg:w-1/2"
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          options={CATEGORY_OPTIONS}
          filterKey="category"
          defaultSelectValue={(queryParams?.category as string) || ""}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ContentCard
            key={project.id}
            title={project.title}
            imageUrl={project.photoUrl}
            imageAlt={`${project.title} preview`}
            featured={project.isFeatured}
            roleLabel={project.role}
            description={project.outcome || project.description}
            tags={project.technologies?.map((skill) => skill.name)}
            links={buildProjectLinks(project)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
