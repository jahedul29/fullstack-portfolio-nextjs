import React, { useEffect, useRef, useState } from "react";

interface SkillBarProps {
  skillName: string;
  percentage: number;
}

const SkillBar: React.FC<SkillBarProps> = ({ skillName, percentage }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const scrollObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        scrollObserver.unobserve(entry.target);
      }
    });

    if (ref.current) {
      scrollObserver.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        scrollObserver.unobserve(ref.current);
      }
    };
  }, []);

  const classes = ` 
        ${isVisible ? "translate-x-0" : "-translate-x-[100%]"}`;
  return (
    <div className="mb-4 flex w-full" ref={ref}>
      <p className="mb-2 w-[30%] lg:w-[10%] bg-secondaryBg rounded-l-md text-center">
        {skillName}
      </p>
      <div className="relative h-6 rounded-r-md bg-secondaryBg overflow-hidden w-[70%] lg:w-[90%]">
        <div
          className={`absolute top-0 left-0 h-full bg-ternaryText rounded-r-md transition-transform duration-1000 ${classes}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default SkillBar;
