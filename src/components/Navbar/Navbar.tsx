import logo from "../../assets/logo/logo_darkbg_horizontal.png";
import userIcon from "../../assets/icon/ic_user.svg";

const Navbar = () => {
  return (
    <nav className="bg-black px-5 py-4">
      <div className="max-w-[1920px] flex justify-between items-center">
        <div className="logo w-[220px]">
          <img src={logo} alt="LOGO" className="" />
        </div>
        <div className="userIcon">
          <img src={userIcon} alt="userIcon" className="" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
