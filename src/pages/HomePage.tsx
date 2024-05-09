import { Link } from "react-router-dom";

import Container from "../utils/Container";
import Navbar from "../components/Navbar/Navbar";
import FolderLayout from "../components/Folder/FolderLayout";
import FolderList from "../components/Folder/FolderList";

import addIcon from "../assets/icon/ic_add_dark.svg";

const HomePage = () => {
  return (
    <Container>
      <Navbar></Navbar>
      <FolderLayout>
        <FolderList title="我的文件" finalPDF={() => {}}></FolderList>
        <div className="w-full h-full flex flex-col justify-center items-center">
          <Link to="upload">
            <img src={addIcon} alt="" className="" />
          </Link>
          <span className="block mt-7 text-4xl text-[#1e1e1e]">
            快來建立新檔吧
          </span>
        </div>
      </FolderLayout>
    </Container>
  );
};

export default HomePage;
