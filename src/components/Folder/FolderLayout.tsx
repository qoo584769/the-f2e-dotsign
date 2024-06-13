import React from "react";

interface FolderLayoutProps {
  children?: React.ReactNode;
}

const FolderLayout: React.FC<FolderLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="relative flex-grow flex flex-col ml-3 mr-3 mb-5 mt-16 p-3 bg-white rounded-[30px] md:w-4/5 md:max-w-[1420px] md:max-h-[780px] md:mx-auto md:mt-10 md:mb-20 md:px-8 md:pt-10 md:pb-8">
        {children}
      </div>
    </>
  );
};

export default FolderLayout;
