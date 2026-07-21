"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

type CommonButtonProps = {
  classNames?: string;
  content: ReactNode | string;
  onClick?: () => void;
  [key: string]: any;
  href?: string;
};

const CommonButton = ({
  classNames = "",
  content,
  onClick,
  href = "",
  ...rest
}: CommonButtonProps) => {
  const router = useRouter();
  let handleOnClick = onClick || undefined;
  if (href) {
    handleOnClick = () => {
      router.push(href);
    };
  }
  
  return (
    <button
      className={`text-ternaryText border border-ternaryText rounded-lg text-lg h-auto p-3 bg-transparent ${classNames}`}
      onClick={handleOnClick}
      {...rest}
    >
      {content}
    </button>
  );
};

export default CommonButton;
