import React from "react";

import bgImg from "../assets/img/bg_decorate.svg";

interface ContainerProps {
  children?: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div
      className="bg-no-repeat bg-bottom bg-[#333333] w-full h-screen"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {children}
    </div>
  );
};

export default Container;
