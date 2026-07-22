"use client";

import { useEffect, useState } from "react";

import Filterbar from "@/components/common/User/Filterbar";
import ContentCard from "@/components/user/home/ContentCard";
import dataFetchingTags from "@/constants/dataFetchingTags";
import { getData } from "@/helpers/data-fetching/data-fetching";
import { IBlog } from "@/types";

const CATEGORY_OPTIONS = [
  { label: "All categories", value: "" },
  { label: "Web Development", value: "web-development" },
];

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [queryParams, setQueryParams] = useState<{
    [key: string]: string | number | undefined;
  }>({
    page: 1,
    limit: 100,
    sortBy: "priorityScore",
    sortOrder: "desc",
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getData(
        "/blogs",
        undefined,
        [dataFetchingTags.blogs],
        { ...queryParams }
      );
      setBlogs(data ?? []);
    };

    fetchData();
  }, [queryParams]);

  return (
    <div className="container mx-auto max-w-6xl px-5 py-16 sm:px-10 md:py-20">
      <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Writing
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            All posts
          </h1>
        </div>
        <Filterbar
          classNames="lg:w-1/2"
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          options={CATEGORY_OPTIONS}
          filterKey="category"
          defaultSelectValue={(queryParams?.category as string) || ""}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <ContentCard
            key={blog.id}
            title={blog.title}
            imageUrl={blog.photoUrl}
            imageAlt={`${blog.title} cover`}
            eyebrow={blog.category}
            ctaHref={blog.blogUrl}
            ctaLabel={`Read on ${blog.platform}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogsPage;
