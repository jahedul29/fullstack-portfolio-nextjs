"use client";

import { Row } from "antd";

const ErrorPage = () => {
  return (
    <Row justify={"center"} align={"middle"} style={{ height: "100vh" }}>
      <h2 style={{ color: "red" }} className="text-6xl">
        Something went wrong
      </h2>
    </Row>
  );
};

export default ErrorPage;
