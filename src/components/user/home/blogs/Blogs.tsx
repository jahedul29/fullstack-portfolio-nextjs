import CommonButton from "@/components/common/CommonButton";
import CustomSlider from "@/components/common/User/CustomSlider";
import SectionHeader from "@/components/common/User/SectionHeader";
import { IBlog } from "@/types";
import Image from "next/image";
import Link from "next/link";

const Blogs = ({ blogs, id = "" }: { blogs: IBlog[]; id: string }) => {
  return (
    <section
      className="container mx-auto px-5 sm:px-10 md:px-0 xl:px-20 2xl:px-40 mt-40 mb-40"
      id={id}
    >
      <SectionHeader title="Blogs" />
      <CustomSlider>
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
      </CustomSlider>
      <div className="flex justify-center items-center">
        <CommonButton
          content="See all Blogs"
          classNames="mt-12 px-20 py-2 text-base"
          href="/home/blogs"
        />
      </div>
    </section>
  );
};

export default Blogs;
