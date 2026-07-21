"use client";

import CommonButton from "@/components/common/CommonButton";
import { scroller } from "react-scroll";

const HireMeButton = () => {
  return (
    <CommonButton
      content="Hire Me"
      classNames="px-8 py-1"
      onClick={() => {
        scroller.scrollTo("contact", {
          duration: 500,
          delay: 30,
          smooth: "easeInOutCubic",
        });
      }}
    />
  );
};

export default HireMeButton;
