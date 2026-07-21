import dataFetchingTags from "@/constants/dataFetchingTags";
import { getData } from "@/helpers/data-fetching/data-fetching";
import { Tooltip } from "antd";
import Link from "next/link";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";
import { PiStackOverflowLogoFill } from "react-icons/pi";

const FloatingLinks = async () => {
  const { data: ownerData, isLoading: isOwnerDataLoading } = await getData(
    "/owners/getOwner",
    undefined,
    [dataFetchingTags.owners]
  );

  const availableLinks = [
    {
      id: "1",
      title: "github",
      url: ownerData?.githubUrl || "",
      icon: <FaGithub />,
    },
    {
      id: "2",
      title: "linkedin",
      url: ownerData?.linkedInUrl || "",
      icon: <FaLinkedin />,
    },
    {
      id: "3",
      title: "facebook",
      url: ownerData?.facebookUrl || "",
      icon: <FaFacebook />,
    },
    {
      id: "4",
      title: "stackoverflow",
      url: ownerData?.stackOverflowUrl || "",
      icon: <PiStackOverflowLogoFill />,
    },
  ];

  console.log({ ownerData });
  return (
    <div className="hidden md:block ">
      <div className="flex flex-col fixed top-[300px] left-[30px] text-ternaryText text-3xl gap-y-3 z-40">
        {availableLinks?.map((item) => (
          <Tooltip title={item.title} key={item.id}>
            <Link
              href={item.url}
              key={item.id}
              target={item?.url.length > 0 ? "_blank" : "_self"}
              aria-label="Redirect to social handler"
            >
              {item.icon}
            </Link>
          </Tooltip>
        ))}
        <div className="w-[1px] bg-ternaryText h-[130px] mt-3 ml-3"></div>
      </div>
    </div>
  );
};

export default FloatingLinks;
