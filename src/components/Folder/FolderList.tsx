import React from "react";
import FolderHeader from "./FolderHeader";

interface FolderListProps {
  children?: React.ReactNode;
  title?: string;
  next?: Boolean;
  prePath?: String;
  nextPath?: String;
  finalPDF?(): void;
  download?(): void;
}

const FolderList: React.FC<FolderListProps> = ({
  children,
  title = "",
  next = false,
  prePath = "",
  nextPath = "",
  finalPDF,
  download,
}) => {
  const titleArr = ["我的文件", "上傳檔案", "簽署文件", "簽署完成"];
  if (titleArr.includes(title)) {
    return (
      <FolderHeader
        title={title}
        next={next}
        prePath={prePath}
        nextPath={nextPath}
        finalPDF={finalPDF}
        download={download}
      >
        {children}
      </FolderHeader>
    );
  }
};

export default FolderList;
