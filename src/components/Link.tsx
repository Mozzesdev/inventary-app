export { Link };

import { usePageContext } from "../../hooks/usePageContext";
import { classNames } from "../../utils/classNames";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  className?: string;
}

function Link({ children, className = "", ...props }: LinkProps) {
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const { href } = props;
  const isActive = href
    ? href === "/"
      ? urlPathname === href
      : urlPathname.startsWith(href as string)
    : false;

  return (
    <a className={classNames(isActive ? "!text-red-500" : "", className)} {...props}>
      {children}
    </a>
  );
}
