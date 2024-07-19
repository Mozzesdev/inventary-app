export { Link };

import { usePageContext } from "vike-react/usePageContext";
import { classNames } from "../../utils/classNames";
import React from "react";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  className?: string;
}

function Link({ children, className = "", ...props }: LinkProps) {
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const { href } = props;
  const isActive = urlPathname === href;

  return (
    <a
      className={classNames(isActive ? "text-red-500" : "", className)}
      {...props}
    >
      {children}
    </a>
  );
}
