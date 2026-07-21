"use client";

import Link from "next/link";
import { useState } from "react";
import { scroller } from "react-scroll";

const UserNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navbarItems = [
    {
      id: "aboutMe",
      title: "About Me",
    },
    {
      id: "experiences",
      title: "Experiences",
    },
    {
      id: "projects",
      title: "Projects",
    },
    {
      id: "contributions",
      title: "Contributions",
    },
    {
      id: "blogs",
      title: "Blogs",
    },
    {
      id: "skills",
      title: "Skills",
    },
  ];

  return (
    <div className="flex justify-between items-center md:items-start py-5 px-5 md:px-10 bg-primaryBg relative">
      <div>
        <Link href="/home" className="text-ternaryText font-bold text-2xl">
          Jahedul
        </Link>
      </div>
      <div className="flex gap-x-6 text-primaryText items-center hidden md:flex">
        {navbarItems?.map((item) => (
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
          {navbarItems?.map((item) => (
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
