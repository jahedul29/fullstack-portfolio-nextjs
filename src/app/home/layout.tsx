import Loading from "@/components/common/Loading";
import FloatingLinks from "@/components/common/User/FloatingLinks";
import Footer from "@/components/common/User/Footer";
import GotoTopButton from "@/components/common/User/GotoTopButton";
import UserNavbar from "@/components/common/User/UserNavbar";
import dataFetchingTags from "@/constants/dataFetchingTags";
import { getData } from "@/helpers/data-fetching/data-fetching";
import { ReactNode, Suspense } from "react";

const UserLayout = async ({ children }: { children: ReactNode }) => {
  const { data: ownerData } = await getData(
    "/owners/getOwner",
    undefined,
    [dataFetchingTags.owners]
  );

  return (
    <Suspense fallback={<Loading />}>
      <div className="w-screen min-h-screen bg-primaryBg relative">
        <FloatingLinks />
        <GotoTopButton />
        <UserNavbar sections={ownerData?.sections} name={ownerData?.name} />
        <div className="w-full min-h-screen">{children}</div>
        <Footer ownerName={ownerData?.name} />
      </div>
    </Suspense>
  );
};

export default UserLayout;
