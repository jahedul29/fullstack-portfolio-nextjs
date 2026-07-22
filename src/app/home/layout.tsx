import Loading from "@/components/common/Loading";
import FloatingLinks from "@/components/common/User/FloatingLinks";
import Footer from "@/components/common/User/Footer";
import GotoTopButton from "@/components/common/User/GotoTopButton";
import UserNavbar from "@/components/common/User/UserNavbar";
import { Toaster } from "@/components/ui/sonner";
import dataFetchingTags from "@/constants/dataFetchingTags";
import { getData } from "@/helpers/data-fetching/data-fetching";
import { normalizeSections } from "@/lib/sections";
import { ReactNode, Suspense } from "react";

const UserLayout = async ({ children }: { children: ReactNode }) => {
  const { data: ownerData } = await getData(
    "/owners/getOwner",
    undefined,
    [dataFetchingTags.owners]
  );

  const sections = normalizeSections(ownerData?.sections);

  return (
    <Suspense fallback={<Loading />}>
      <div className="w-screen min-h-screen bg-primaryBg relative">
        <FloatingLinks />
        <GotoTopButton />
        <UserNavbar
          sections={sections}
          name={ownerData?.name}
          resumeUrl={ownerData?.resumeUrl}
        />
        <main className="w-full min-h-screen">{children}</main>
        <Footer ownerName={ownerData?.name} />
        <Toaster />
      </div>
    </Suspense>
  );
};

export default UserLayout;
