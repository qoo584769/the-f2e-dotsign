import React from "react";
import Processbar from "../Processbar/Processbar";

import logo from "../../assets/logo/logo_darkbg_horizontal.png";
import userIcon from "../../assets/icon/ic_user.svg";

interface NavbarProps {
  step: string;
}

const Navbar: React.FC<NavbarProps> = ({ step }) => {
  return (
    <nav className="bg-black px-5 py-4">
      <div className="max-w-[1920px] flex justify-between items-center">
        <div className="logo w-[220px] py-2">
          <img src={logo} alt="LOGO" className="" />
        </div>
        {step !== "home" && <Processbar step={step}></Processbar>}
        <div className="userIcon">
          <img src={userIcon} alt="userIcon" className="" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
