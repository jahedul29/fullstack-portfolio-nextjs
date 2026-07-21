"use client";
import { ReactNode } from "react";
import Carousel from "react-multi-carousel";
import UAParser from "ua-parser-js";

type CustomSliderProps = {
  items?: any[];
  responsiveOptions?: any;
  deviceType?: string;
  children: ReactNode;
};

const CustomSlider = ({
  deviceType,
  items,
  responsiveOptions,
  children,
}: CustomSliderProps) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      paritialVisibilityGutter: 10,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      paritialVisibilityGutter: 0,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      paritialVisibilityGutter: 30,
    },
  };
  return (
    <Carousel
      ssr
      partialVisbile
      itemClass="image-item"
      responsive={responsive}
      deviceType={deviceType}
    >
      {children}
    </Carousel>
  );
};

CustomSlider.getInitialProps = ({ req }: { req: any }) => {
  let userAgent;
  if (req) {
    userAgent = req.headers["user-agent"];
  } else {
    userAgent = navigator.userAgent;
  }
  const parser = new UAParser();
  parser.setUA(userAgent);
  const result = parser.getResult();
  const deviceType = (result.device && result.device.type) || "desktop";
  return { deviceType };
};

export default CustomSlider;
