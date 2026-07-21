import { getSiteName } from "@/helpers/config/siteConfig";

const EmptyState = () => {
  const siteName = getSiteName();

  return (
    <div className="container mx-auto px-5 sm:px-10 md:px-0 xl:px-20 2xl:px-40 min-h-[70vh] flex flex-col items-center justify-center text-center gap-y-4">
      <h1 className="text-4xl text-ternaryText font-semibold">
        Welcome to {siteName}
      </h1>
      <p className="text-lightText text-lg max-w-xl">
        This site has no owner profile yet. Finish setting it up by signing in
        to <span className="text-ternaryText">/admin</span> and creating the
        owner record.
      </p>
    </div>
  );
};

export default EmptyState;
