import Link from "next/link";

import { Button } from "@/components/ui/button";
import ContentCard from "@/components/user/home/ContentCard";
import Section from "@/components/user/home/Section";
import { IBlog } from "@/types";

const Blogs = ({ blogs, id = "" }: { blogs: IBlog[]; id?: string }) => {
  return (
    <Section
      id={id}
      eyebrow="Writing"
      title="Recent posts"
      subtitle="Notes on what I've learned building and scaling products."
      muted
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs?.map((blog) => (
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

      <div className="mt-12 flex justify-center">
        <Button variant="outline" size="lg" asChild>
          <Link href="/blogs">See all posts</Link>
        </Button>
      </div>
    </Section>
  );
};

export default Blogs;
