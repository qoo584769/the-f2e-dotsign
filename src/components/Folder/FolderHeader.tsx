import React, { useState } from "react";
import { Link } from "react-router-dom";

import downloadIcon from "../../assets/icon/ic_download.svg";
import leftArr from "../../assets/icon/left_arr.svg";
import rightArrActive from "../../assets/icon/right_arr_active.svg";
import rightArrDisabled from "../../assets/icon/right_arr_disabled.svg";
import Button from "../Button/Button";

interface FolderHeaderProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  next?: Boolean;
  prePath: String;
  nextPath?: String;
  finalPDF?(): void;
  download?(): void;
}

const FolderHeader: React.FC<FolderHeaderProps> = ({
  children,
  title,
  next,
  prePath,
  nextPath,
  finalPDF,
  download,
}) => {
  if (title === "我的文件") {
    return (
      <>
        <h2 className="text-3xl text-[#1e1e1e] px-4 pb-1 md:pb-4">{title}</h2>
        <div className="border-b-2 border-b-[#B7EC5D]"></div>
        {children}
      </>
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
        <div className="w-full md:w-1/4 bg-white px-8 pt-6 pb-12 rounded-3xl">
          <div className="border-b border-[#B7EC5D] text-center pb-4">
            建立檔案
          </div>
          <div className="text-center py-[72px]">確定已完成簽屬文件?</div>
          <div className="grid grid-cols-2 gap-5">
            <button
              className="border border-[#808080]  rounded-full"
              onClick={closeModal}
            >
              等一下
            </button>
            <Link
              to={`/finish`}
              onClick={finalPDF}
              className=" text-xl border-2 border-[#b7ec5d] rounded-full py-2 bg-[#4d4d4d] text-[#b7ec5d] text-center"
            >
              <span className="">確定</span>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const FinishBtn = (nextPath: any) => {
    if (nextPath.nextPath === "finish") {
      return (
        <Button state="active">
          <div className="flex justify-center items-center" onClick={openModal}>
            <span className="mr-[10px]">下一步</span>
            <img src={rightArrActive} alt="" className="" />
          </div>
        </Button>
      );
    }
    return (
      <Link to={`/${nextPath.nextPath}`}>
        <Button state="active">
          <span className="mr-[10px]">下一步</span>
          <img src={rightArrActive} alt="" className="" />
        </Button>
      </Link>
    );
  };

  return (
    <>
      {isOpen && <CheckModal></CheckModal>}
      {/* 手機板 */}
      <div className="md:hidden border-b-2 border-b-[#B7EC5D] pb-2 flex justify-center">
        <h2 className="text-3xl text-[#1e1e1e]">{title}</h2>
        <div className="px-4 pb-4 flex justify-around items-center absolute left-0 right-0 bottom-0 mx-auto ">
          {next ? (
            <Link to={`/${prePath}`}>
              <Button state="none">
                <img src={leftArr} alt="" className="" />
                <span className="ml-[10px]">上一步</span>
              </Button>
            </Link>
          ) : (
            <Link to={`/${prePath}`}>
              <Button state="none">
                <img src={leftArr} alt="" className="" />
                <span className="ml-[10px]">回首頁</span>
              </Button>
            </Link>
          )}
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
                  <span className="mr-[10px]">下一步</span>
                  <img src={rightArrDisabled} alt="" className="" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      {/* PC版 */}
      <div className="hidden border-b-2 border-b-[#B7EC5D] px-4 pb-4 md:flex justify-between items-center">
        {next ? (
          <Link to={`/${prePath}`}>
            <Button state="none">
              <img src={leftArr} alt="" className="" />
              <span className="ml-[10px]">上一步</span>
            </Button>
          </Link>
        ) : (
          <Link to={`/${prePath}`}>
            <Button state="none">
              <img src={leftArr} alt="" className="" />
              <span className="ml-[10px]">回首頁</span>
            </Button>
          </Link>
        )}
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
                <span className="mr-[10px]">下一步</span>
                <img src={rightArrDisabled} alt="" className="" />
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default FolderHeader;
