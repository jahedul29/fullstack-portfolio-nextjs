"use client";

import { FaArrowUp } from "react-icons/fa";
import CommonButton from "../CommonButton";

const GotoTopButton = () => {
  return (
    <CommonButton
      classNames="fixed bottom-6 md:bottom-12 right-6 md:right-12 z-40 text-lg md:text-xl"
      content={<FaArrowUp />}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Go to Top"
    />
  );
};

export default GotoTopButton;
