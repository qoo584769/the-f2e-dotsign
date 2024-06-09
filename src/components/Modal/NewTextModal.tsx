import React, { useState } from "react";

import { useAlertStore } from "../../store/useAlertStore";

interface NewTextModalProps {
  children?: React.ReactNode;
  toggleModal(): void;
  textList: string[];
  setTextList: any;
}

const NewTextModal: React.FC<NewTextModalProps> = ({
  toggleModal,
  textList,
  setTextList,
}) => {
  const { setAlertData } = useAlertStore();

  const [inputValue, setInputValue] = useState("");

  const saveText = () => {
    setTextList([...textList, inputValue]);
    toggleModal();
    const alertData = {
      msg: "文字新增成功",
      showAlert: true,
    };
    setAlertData(alertData);
  };

  return (
    <div className="fixed w-full h-full top-0 left-0 transition-all bg-black/50 flex items-center justify-center z-20">
      <div className="w-[90%] max-w-[530px] min-h-[261px] px-8 pt-4 pb-7 rounded-[40px] flex flex-col justify-between bg-white">
        <textarea
          name=""
          id=""
          className="my-5 h-[40dvh] rounded-[20px] border-2 border-[#cccccc] outline-none p-6"
          onChange={(e) => setInputValue(e.target.value)}
        ></textarea>
        <div className="flex justify-between md:justify-evenly">
          <button className="" onClick={toggleModal}>
            取消
          </button>
          <button className="" onClick={saveText}>
            確定
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTextModal;
