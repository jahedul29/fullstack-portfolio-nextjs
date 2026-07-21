"use client";
import { TypeAnimation } from "react-type-animation";

const SkillTypical = ({ skills }: { skills: Array<string | number> }) => {
  return (
    <p className="text-xl font-semibold text-lightText">
      I work in{" "}
      <TypeAnimation
        sequence={skills}
        repeat={Infinity}
        speed={1}
        wrapper="span"
        className="text-ternaryText text-2xl font-bold"
      />
    </p>
  );
};

export default SkillTypical;
