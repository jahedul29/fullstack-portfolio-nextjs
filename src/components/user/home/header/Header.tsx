import { ISkill } from "@/types";
// import GithubData from "./GithubData";
import HireMeButton from "./HireMeButton";
import ParticleAnimation from "./ParticleAnimation";
import SkillTypical from "./SkillTypical";

const Header = async ({
  ownerData,
  skills,
}: {
  ownerData: any;
  skills: ISkill[];
}) => {
  const skillForTypical = skills?.flatMap((element, index, array) => {
    return [element.name, 1000];
  });

  return (
    <div className="min-h-[calc(100vh-70px)] relative overflow-hidden">
      <ParticleAnimation />
      <div className="container mx-auto w-full flex flex-col items-center justify-center h-screen gap-y-4 md:gap-y-7 relative z-10 pb-40">
        <p className="text-ternaryText text-2xl font-bold">Hi, I am</p>
        <h1 className="text-primaryText text-4xl md:text-6xl font-semibold">
          {ownerData?.name}
        </h1>
        <p className="text-secondaryText text-2xl md:text-3xl font-bold">
          {ownerData?.designation}
        </p>
        <SkillTypical skills={skillForTypical} />
        <HireMeButton />
        {/* <GithubData /> */}
      </div>
    </div>
  );
};

export default Header;
