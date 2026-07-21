import CommonButton from "@/components/common/CommonButton";
import SectionHeader from "@/components/common/User/SectionHeader";
import { ISkill } from "@/types";
import { Tooltip } from "antd";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLink, FaYoutube } from "react-icons/fa";

const Projects = ({ projects, id = "" }: { projects: any; id?: string }) => {
  return (
    <section
      className="container mx-auto px-5 sm:px-10 md:px-0 xl:px-20 2xl:px-40 mt-40 mb-40"
      id={id}
    >
      <SectionHeader title="Projects" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects?.map((project: any) => (
          <div className="bg-secondaryBg rounded-lg p-4" key={project?.id}>
            <div className="flex justify-end gap-x-4 text-2xl mb-3">
              {project?.githubUrl && (
                <Tooltip title="Github">
                  <Link
                    aria-label="Redirect to project's github repository"
                    href={project?.githubUrl}
                    target="_blank"
                  >
                    <FaGithub />
                  </Link>
                </Tooltip>
              )}
              {project?.videoUrl && (
                <Tooltip title="Youtube">
                  <Link
                    aria-label="Redirect to project's video"
                    href={project?.videoUrl}
                    target="_blank"
                  >
                    <FaYoutube />
                  </Link>
                </Tooltip>
              )}
              {project?.websiteUrl && (
                <Tooltip title="Live Url">
                  <Link
                    aria-label="Redirect to project's live site"
                    href={project?.websiteUrl}
                    target="_blank"
                  >
                    <FaLink />
                  </Link>
                </Tooltip>
              )}
            </div>
            <div className="h-[150px] overflow-hidden group">
              <div className="relative h-[800px] w-full origin-top group-hover:-translate-y-[80%] transition-all duration-[2000ms]">
                <Image
                  alt="project"
                  layout="fill"
                  objectFit="fill"
                  src={project?.photoUrl}
                />
              </div>
            </div>
            <h2 className="text-primaryText text-xl my-3 font-semibold">
              {project?.title}
            </h2>
            <p className="font-medium mb-8 text-lightText">
              {project?.description}
            </p>
            <p className="text-secondaryText font-bold text-sm flex">
              {project?.technologies?.map((item: ISkill, index: number) => (
                <span key={item.id + index} className="flex">
                  {item.name}{" "}
                  {index !== project?.technologies?.length - 1 && (
                    <span className="mx-1">|</span>
                  )}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center">
        <CommonButton
          content="See all Projects"
          classNames="mt-12 px-20 py-2 text-base"
          href="/home/projects"
        />
      </div>
    </section>
  );
};

export default Projects;
