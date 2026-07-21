"use client";

import { store } from "@/redux/store";
import { ReactNode } from "react";
import "react-multi-carousel/lib/styles.css";
import { Provider } from "react-redux";
import StyledComponentsRegistry from "./AntdRegistry";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
    </Provider>
  );
};

export default Providers;
