import React from "react";
import bgImg from "../../assets/img/bg_decorate.svg";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div
      className="h-full bg-no-repeat bg-bottom"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {children}
    </div>
  );
};

export default Layout;
