import SectionHeader from "@/components/common/User/SectionHeader";
import { IExperience, ISkill } from "@/types";
import moment from "moment";

const Experience = ({
  experiences,
  id = "",
}: {
  experiences: IExperience[];
  id?: string;
}) => {
  return (
    <section
      className="container mx-auto px-5 sm:px-10 md:px-0 xl:px-20 2xl:px-40 mt-40 mb-40"
      id={id}
    >
      <SectionHeader title="Professional Experience" />
      <div className="px-0 lg:px-60 mx-auto">
        {experiences?.map((experience: IExperience) => (
          <div
            key={experience.id}
            className="flex flex-col sm:flex-row justify-center gap-x-6 items-stretch"
          >
            <div className="flex flex-col items-start sm:items-end text-sm text-secondaryText font-semibold w-full sm:w-[30%] mb-2 sm:mb-0">
              <p className="text-right">
                {moment(experience?.startTime).format("MMM, YYYY")} -{" "}
                {experience?.endTime
                  ? moment(experience?.endTime).format("MMM, YYYY")
                  : "Present"}
              </p>
              <p className="text-base text-right">{experience.position}</p>
            </div>
            <div className="w-[1px] h-auto bg-ternaryText"></div>
            <div className="w-full sm:w-[69%] mb-6">
              <p className="text-2xl text-primaryText font-bold">
                {experience?.companyName}
              </p>
              <p className="mb-4 mt-2 text-base text-secondaryText font-medium">
                {experience?.description}
              </p>
              <div className=" flex gap-2 flex-wrap">
                {experience?.technologies.map(
                  (skill: ISkill, index: number) => (
                    <p
                      key={skill.id + index}
                      className="rounded-lg px-2 py-1 bg-ternaryText text-secondaryBg text-sm font-semibold"
                    >
                      {skill?.name}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
