"use client";

import SectionHeader from "@/components/common/User/SectionHeader";
import SkillBar from "@/components/common/User/SkillBar";
import { ISkill } from "@/types";

const Skills = ({ skills, id = "" }: { skills: ISkill[]; id?: string }) => {
  return (
    <section
      className="container mx-auto px-5 sm:px-10 md:px-0 xl:px-20 2xl:px-40 mt-40 mb-40"
      id={id}
    >
      <SectionHeader title="Skills" />
      <div>
        {skills?.map((item: ISkill) => (
          <SkillBar
            skillName={item.name}
            percentage={item.level}
            key={item.id}
          />
        ))}
      </div>
    </section>
  );
};

export default Skills;
