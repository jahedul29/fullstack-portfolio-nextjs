import Loading from "@/components/common/Loading";
import FloatingLinks from "@/components/common/User/FloatingLinks";
import Footer from "@/components/common/User/Footer";
import GotoTopButton from "@/components/common/User/GotoTopButton";
import UserNavbar from "@/components/common/User/UserNavbar";
import { ReactNode, Suspense } from "react";

const UserLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<Loading />}>
      <div className="w-screen min-h-screen bg-primaryBg relative">
        <FloatingLinks />
        <GotoTopButton />
        <UserNavbar />
        <div className="w-full min-h-screen">{children}</div>
        <Footer />
      </div>
    </Suspense>
  );
};

export default UserLayout;
