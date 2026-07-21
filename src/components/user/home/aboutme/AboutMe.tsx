import SectionHeader from "@/components/common/User/SectionHeader";
import Image from "next/image";

const AboutMe = ({ ownerData, id = "" }: { ownerData: any; id?: string }) => {
  const aboutMe = ownerData?.aboutOwner.split("\n");

  return (
    <section
      className="container mx-auto px-5 sm:px-10 md:px-0 xl:px-20 2xl:px-40 mt-40 mb-40"
      id={id}
    >
      <SectionHeader title="About Me" />
      <div className="flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-y-10 md:gap-y-0 gap-x-0 md:gap-x-20 text-lightText">
        <div className="w-full md:w-1/2">
          {aboutMe?.map((item: string) => (
            <p className="mb-3 text-lg" key={item}>
              {item}
            </p>
          ))}
        </div>
        <div className="">
          <div className="w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] relative overflow-hidden rounded-xl">
            <Image
              alt="Jahedul"
              fill={true}
              src={ownerData?.photoUrl}
              className=" object-contain transition-all duration-1000 scale-100 hover:scale-125"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
