"use client";

import { Tooltip } from "antd";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const GithubData = () => {
  const [githubData, setGithubData] = useState<any>(null);
  const getGithubData = async () => {
    const res = await fetch("https://api.github.com/users/jahedul29");
    const result = await res.json();

    setGithubData(result);
  };

  useEffect(() => {
    getGithubData();
  }, []);

  console.log({ githubData });
  return (
    <motion.div
      initial={{
        transform: "translateZ(8px) translateY(-2px)",
      }}
      animate={{
        transform: "translateZ(32px) translateY(-8px)",
      }}
      transition={{
        repeat: Infinity,
        repeatType: "mirror",
        duration: 2,
        ease: "easeInOut",
      }}
    >
      <Tooltip title="Github">
        <Link
          href={githubData?.url || ""}
          target="_blank"
          className="absolute flex rounded-lg text-ternaryText border border-ternaryText left-[200px]"
        >
          <div className="relative overflow-hidden w-[60px] h-[70px]  rounded-l-lg ">
            <Image
              fill={true}
              src={githubData?.avatar_url || ""}
              className="object-cover"
              alt="github avatar"
            />
          </div>
          <div className="p-1 text-sm bg-primaryBg rounded-lg">
            <p>Public Repos: {githubData?.public_repos || 0}</p>
            <p>Followers: {githubData?.followers || 0}</p>
            <p>Following: {githubData?.following || 0}</p>
          </div>
        </Link>
      </Tooltip>
    </motion.div>
  );
};

export default GithubData;
