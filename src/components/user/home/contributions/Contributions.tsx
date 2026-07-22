import SectionHeader from "@/components/common/User/SectionHeader";
import { IContribution, ISkill } from "@/types";
import { Tooltip } from "antd";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLink } from "react-icons/fa";

const Contributions = ({
  contributions,
  id = "",
}: {
  contributions: IContribution[];
  id?: string;
}) => {
  return (
    <section
      className="container mx-auto px-5 sm:px-10 md:px-0 xl:px-20 2xl:px-40 mt-40 mb-40"
      id={id}
    >
      <SectionHeader title="Contributions" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {contributions?.map((contribution: IContribution) => (
          <div
            className="bg-secondaryBg rounded-lg p-4"
            key={contribution?.id}
          >
            <div className="flex justify-end gap-x-4 text-2xl mb-3">
              {contribution?.githubUrl && (
                <Tooltip title="Github">
                  <Link
                    aria-label="Redirect to contribution's github repository"
                    href={contribution?.githubUrl}
                    target="_blank"
                  >
                    <FaGithub />
                  </Link>
                </Tooltip>
              )}
              {contribution?.relatedUrl && (
                <Tooltip title="Related Link">
                  <Link
                    aria-label="Redirect to contribution's related link"
                    href={contribution?.relatedUrl}
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
                  alt="contribution"
                  layout="fill"
                  objectFit="fill"
                  src={contribution?.photoUrl}
                />
              </div>
            </div>
            <p className="text-secondaryText font-semibold text-sm mt-3">
              {contribution?.contributionFor}
            </p>
            <h2 className="text-primaryText text-xl my-3 font-semibold">
              {contribution?.title}
            </h2>
            <p className="font-medium mb-8 text-lightText">
              {contribution?.description}
            </p>
            <p className="text-secondaryText font-bold text-sm flex">
              {contribution?.technologies?.map(
                (item: ISkill, index: number) => (
                  <span key={item.id + index} className="flex">
                    {item.name}{" "}
                    {index !== contribution?.technologies?.length - 1 && (
                      <span className="mx-1">|</span>
                    )}
                  </span>
                )
              )}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Contributions;
