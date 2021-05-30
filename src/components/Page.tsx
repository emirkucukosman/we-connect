import React, { forwardRef, LegacyRef } from "react";
import { Helmet } from "react-helmet";

type PageProps = {
  children: React.ReactNode;
  title?: string;
  [x: string]: any;
};

const Page: React.FC<PageProps> = forwardRef(
  ({ children, title = "", ...rest }, ref: LegacyRef<HTMLDivElement>) => {
    return (
      <div ref={ref} {...rest}>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        {children}
      </div>
    );
  }
);

export default Page;
