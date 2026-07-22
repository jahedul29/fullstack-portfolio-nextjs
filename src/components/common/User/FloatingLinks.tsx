import Link from "next/link";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";
import { PiStackOverflowLogoFill } from "react-icons/pi";

import dataFetchingTags from "@/constants/dataFetchingTags";
import { getData } from "@/helpers/data-fetching/data-fetching";

const FloatingLinks = async () => {
  const { data: ownerData } = await getData(
    "/owners/getOwner",
    undefined,
    [dataFetchingTags.owners]
  );

  const availableLinks = [
    { id: "1", label: "GitHub", url: ownerData?.githubUrl || "", icon: <FaGithub /> },
    {
      id: "2",
      label: "LinkedIn",
      url: ownerData?.linkedInUrl || "",
      icon: <FaLinkedin />,
    },
    {
      id: "3",
      label: "Facebook",
      url: ownerData?.facebookUrl || "",
      icon: <FaFacebook />,
    },
    {
      id: "4",
      label: "Stack Overflow",
      url: ownerData?.stackOverflowUrl || "",
      icon: <PiStackOverflowLogoFill />,
    },
  ].filter((link) => link.url.length > 0);

  if (availableLinks.length === 0) {
    return null;
  }

  return (
    <div className="hidden md:block">
      <div className="fixed left-[30px] top-[300px] z-40 flex flex-col gap-y-3 text-3xl">
        {availableLinks.map((item) => (
          <Link
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${item.label} profile`}
            title={item.label}
            className="text-muted-foreground transition-colors hover:text-brand"
          >
            {item.icon}
          </Link>
        ))}
        <div className="ml-3 mt-3 h-[130px] w-px bg-border" />
      </div>
    </div>
  );
};

export default FloatingLinks;
