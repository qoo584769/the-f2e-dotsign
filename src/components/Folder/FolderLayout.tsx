import React from "react";

interface FolderLayoutProps {
  children?: React.ReactNode;
}

const FolderLayout: React.FC<FolderLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="relative w-4/5 max-w-[1420px] h-4/5 md:max-h-[880px] mx-auto mt-16 md:mt-10 p-3 md:px-8 md:pt-10 md:pb-8 bg-white rounded-[30px] flex flex-col">
        {children}
      </div>
    </>
  );
};

export default FolderLayout;
