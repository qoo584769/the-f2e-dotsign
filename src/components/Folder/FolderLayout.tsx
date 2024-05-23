import React from "react";

interface FolderLayoutProps {
  children?: React.ReactNode;
}

const FolderLayout: React.FC<FolderLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="relative w-4/5 max-w-[1420px] h-4/5 max-h-[880px] mx-auto mt-10 px-8 pt-10 pb-8 bg-white rounded-[40px] flex flex-col">
        {children}
      </div>
    </>
  );
};

export default FolderLayout;
