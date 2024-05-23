import React from "react";

interface ButtonProps {
  children?: React.ReactNode;
  state?: any;
}

const NoneBtn: React.FC<ButtonProps> = ({ children }) => {
  return <button className="text-xl flex text-[#4d4d4d]">{children}</button>;
};

const DisabledBtn: React.FC<ButtonProps> = ({ children }) => {
  return (
    <button className="flex text-xl border-2 border-[#b3b3b3] bg-[#cccccc] rounded-full px-7 py-1 cursor-not-allowed text-[#808080]">
      {children}
    </button>
  );
};

const ActiveBtn: React.FC<ButtonProps> = ({ children }) => {
  return (
    <button className="flex text-xl border-2 border-[#b7ec5d] rounded-full px-7 py-1 bg-[#4d4d4d] text-[#b7ec5d]">
      {children}
    </button>
  );
};

const UploadBtn: React.FC<ButtonProps> = () => {
  return (
    <>
      <input
        type="file"
        id="upload"
        accept="application/pdf"
        className=" hidden"
      ></input>
      <label
        htmlFor="upload"
        className="text-xl border-2 border-[#b7ec5d] rounded-full px-7 py-1 bg-[#4d4d4d] text-[#b7ec5d] cursor-pointer"
      >
        選擇檔案
      </label>
    </>
  );
};

const getProps = <T extends object, K extends keyof T>(obj: T, key: K) => {
  return obj[key];
};

const btnSelector: React.FC<ButtonProps> = ({ children, state }) => {
  const btnList = {
    none: <NoneBtn>{children}</NoneBtn>,
    disabled: <DisabledBtn>{children}</DisabledBtn>,
    active: <ActiveBtn>{children}</ActiveBtn>,
    upload: <UploadBtn>{children}</UploadBtn>,
  };
  return getProps(btnList, state);
};

const Button: React.FC<ButtonProps> = ({ children, state }) => {
  return btnSelector({ children, state });
};

export default Button;
