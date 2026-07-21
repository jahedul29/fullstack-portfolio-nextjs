"use client";

import Filterbar from "@/components/common/User/Filterbar";
import SectionHeader from "@/components/common/User/SectionHeader";
import dataFetchingTags from "@/constants/dataFetchingTags";
import { getData } from "@/helpers/data-fetching/data-fetching";
import { IBlog } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Blogs = ({}: {}) => {
  const [blogs, setBlogs] = useState([]);
  const [queryParams, setQueryParams] = useState<{
    [key: string]: string | number | undefined;
  }>({
    page: 1,
    limit: 100,
    sortBy: "priorityScore",
    sortOrder: "desc",
  });

  const fetchData = async () => {
    const { data, isLoading } = await getData(
      "/blogs",
      undefined,
      [dataFetchingTags.blogs],
      { ...queryParams }
    );
    setBlogs(data);
  };

  useEffect(() => {
    fetchData();
  }, [queryParams]);

  console.log({ blogs });

  return (
    <div className="container mx-auto px-5 sm:px-10 md:px-0 xl:px-20 2xl:px-40 mt-10 lg:mt-20 mb-40">
      <div className="flex flex-col lg:flex-row justify-between">
        <SectionHeader title="Blogs" classNames="mb-5 lg:mb-10" />
        <Filterbar
          classNames="w-full lg:w-1/2 mb-10 lg:mb-0"
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          options={[
            { label: "All", value: "" },
            { label: "Web Development", value: "web-development" },
          ]}
          filterKey="category"
          defaultSelectValue={(queryParams?.category as string) || ""}
        />
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs?.map((item: IBlog) => (
            <div
              className="p-4 bg-secondaryBg group relative rounded-md mx-3"
              key={item?.id}
            >
              <div className="py-1 px-2 text-sm bg-primaryBg text-primaryText absolute right-0 z-10 top-0">
                {item?.category}
              </div>
              <div className="relative h-[150px] overflow-hidden">
                <Image
                  src={item?.photoUrl}
                  layout="fill"
                  objectFit="cover"
                  alt={"image"}
                  className="scale-100 group-hover:scale-150 duration-[2000ms]"
                />
              </div>
              <p className="mt-5 mb-4 text-xl text-primaryText line-clamp-2 min-h-[50px]">
                {item?.title}
              </p>
              <Link
                href={item?.blogUrl}
                target="_blank"
                className="px-4 py-1  text-ternaryText rounded-lg border border-ternaryText"
                aria-label="Redirect to Blog"
              >
                Read at {item.platform}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
