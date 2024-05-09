import React, { useState } from "react";
import { Link } from "react-router-dom";

import downloadIcon from "../../assets/icon/ic_download.svg";
import Button from "../Button/Button";
interface FolderHeaderProps {
  title?: React.ReactNode;
  next?: Boolean;
  prePath: String;
  nextPath?: String;
  finalPDF?(): void;
  download?(): void;
}

const FolderHeader: React.FC<FolderHeaderProps> = ({
  title,
  next,
  prePath,
  nextPath,
  finalPDF,
  download,
}) => {
  if (title === "我的文件") {
    return (
      <h2 className="text-3xl text-[#1e1e1e] border-b-2 border-b-[#B7EC5D] px-4 pb-4">
        {title}
      </h2>
    );
  }
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const CheckModal = () => {
    return (
      <div className="z-20 w-full h-full absolute top-0 bottom-0 right-0 left-0 bg-[#34343480] flex justify-center items-center">
        <div className="bg-white px-8 pt-6 pb-12 rounded-3xl">
          <div className="border-b border-[#B7EC5D] text-center pb-4">
            建立檔案
          </div>
          <div className="text-center py-[72px]">確定已完成簽屬文件?</div>
          <div className="grid grid-cols-2 gap-5">
            <button
              className="border border-[#808080] px-[84px] rounded-full"
              onClick={closeModal}
            >
              等一下
            </button>
            <button
              className="px-[84px] text-xl border-2 border-[#b7ec5d] rounded-full py-2 bg-[#4d4d4d] text-[#b7ec5d] "
              onClick={finalPDF}
            >
              <Link to={`/finish`}>
                <span className="">確定</span>
              </Link>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const FinishBtn = (nextPath: any) => {
    if (nextPath.nextPath === "finish") {
      return (
        <Button state="active">
          <div className="" onClick={openModal}>
            <span className="">下一頁</span>
            <span className="text-2xl">&rarr;</span>
          </div>
        </Button>
      );
    }
    return (
      <Link to={`/${nextPath.nextPath}`}>
        <Button state="active">
          <span className="">下一頁</span>
          <span className="text-2xl">&rarr;</span>
        </Button>
      </Link>
    );
  };

  return (
    <>
      {isOpen && <CheckModal></CheckModal>}
      <div className="border-b-2 border-b-[#B7EC5D]  px-4 pb-4 flex justify-between items-center">
        <Link to={`/${prePath}`}>
          <Button state="none">
            &larr; <span className="">上一頁</span>
          </Button>
        </Link>
        <h2 className="text-3xl text-[#1e1e1e]">{title}</h2>
        {next ? (
          <FinishBtn nextPath={nextPath}></FinishBtn>
        ) : (
          <>
            {nextPath === "none" ? (
              <button className="" onClick={download}>
                <img src={downloadIcon} alt="" className="" />
              </button>
            ) : (
              <Button state="disabled">
                <>
                  <span className="">下一頁</span>
                  <span className="text-2xl">&rarr;</span>
                </>
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default FolderHeader;
