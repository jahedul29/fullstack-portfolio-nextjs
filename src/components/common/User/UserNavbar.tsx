"use client";

import { getSiteName } from "@/helpers/config/siteConfig";
import Link from "next/link";
import { useState } from "react";
import { scroller } from "react-scroll";

export type UserNavbarSection = { key: string; visible: boolean };

type UserNavbarProps = {
  sections?: UserNavbarSection[];
  name?: string;
};

const NAV_ITEMS: Record<string, { id: string; title: string }> = {
  about: { id: "aboutMe", title: "About Me" },
  projects: { id: "projects", title: "Projects" },
  contributions: { id: "contributions", title: "Contributions" },
  experience: { id: "experiences", title: "Experiences" },
  blogs: { id: "blogs", title: "Blogs" },
  skills: { id: "skills", title: "Skills" },
};

const UserNavbar = ({ sections = [], name }: UserNavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const visibleNavbarItems = sections
    .filter((section) => section.visible)
    .map((section) => NAV_ITEMS[section.key])
    .filter((item): item is { id: string; title: string } => !!item);

  return (
    <div className="flex justify-between items-center md:items-start py-5 px-5 md:px-10 bg-primaryBg relative">
      <div>
        <Link href="/home" className="text-ternaryText font-bold text-2xl">
          {name || getSiteName()}
        </Link>
      </div>
      <div className="flex gap-x-6 text-primaryText items-center hidden md:flex">
        {visibleNavbarItems?.map((item) => (
          <a
            href={`/home/#${item?.id}`}
            onClick={(e) => {
              e.preventDefault();
              scroller.scrollTo(item.id, {
                duration: 500,
                delay: 30,
                smooth: "easeInOutCubic",
                offset: -100,
              });
            }}
            key={item?.id}
            className="border-b-2 border-transparent hover:border-ternaryText hover:text-ternaryText pb-1 transition-all duration-300 cursor-pointer"
          >
            {item.title}
          </a>
        ))}
      </div>
      <div className="block md:hidden">
        <label
          className="btn btn-ghost btn-circle text-primaryText"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </label>
        <div
          className={`absolute bg-secondaryBg transition-all duration-300 flex flex-col w-screen left-0 overflow-hidden top-[85px] z-20 text-primaryText ${
            isMobileMenuOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          {visibleNavbarItems?.map((item) => (
            <a
              href={`/home/#${item?.id}`}
              className="border-b-2 border-transparent hover:border-ternaryText hover:text-ternaryText py-3 transition-all duration-300 w-full text-center"
              key={item.id}
              onClick={(e) => {
                e.preventDefault();
                scroller.scrollTo(item.id, {
                  duration: 500,
                  delay: 30,
                  smooth: "easeInOutCubic",
                });
              }}
            >
              {item.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;
