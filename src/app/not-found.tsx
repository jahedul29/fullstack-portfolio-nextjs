import Image from "next/image";
import notFoundImage from "../assets/not-found.svg";

const NotFoundPage = () => {
  return (
    <div style={{ overflow: "hidden" }}>
      <Image
        src={notFoundImage}
        alt="not-found"
        style={{ height: "100vh", width: "100vw" }}
      />
    </div>
  );
};

export default NotFoundPage;
