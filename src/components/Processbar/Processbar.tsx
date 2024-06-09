import React from "react";

interface ProcessProps {
  step: string;
}
const Processbar: React.FC<ProcessProps> = ({ step }) => {
  const baseDot =
    "box-border w-[16px] h-[16px] border-2 border-[#999999] rounded-full ";
  const activeDot =
    "border-[#B7EC5D] shadow-[0px_0px_0px_4px_rgba(183,236,93,0.5)]";
  const finishDot = "bg-[#B7EC5D] border-[#B7EC5D]";

  const baseLine =
    "w-[90px] md:w-[200px] h-[2px] border-[1px] border-[#999999]";
  const activeLine = "border-[#B7EC5D]";

  const baseText = "text-[#999999] text-sm font-medium";
  const activeText = "text-[#B7EC5D]";

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="py-2 flex items-center justify-center px-6">
        <div
          className={`${baseDot} ${step === "upload" ? activeDot : finishDot}`}
        ></div>

        <div className={`${baseLine} ${step !== "upload" && activeLine}`}></div>
        <div
          className={`${baseDot} ${step === "sign" && activeDot} ${step === "complete" && finishDot}`}
        ></div>

        <div
          className={`${baseLine} ${step === "complete" && activeLine}`}
        ></div>
        <div
          className={`${baseDot} ${step === "complete" ? activeDot : baseDot}`}
        ></div>
      </div>

      <div className="w-full flex justify-evenly md:justify-between">
        <span className={`${baseText} ${step === "upload" && activeText}`}>
          上傳檔案
        </span>
        <span className={`${baseText} ${step === "sign" && activeText}`}>
          簽署文件
        </span>
        <span className={`${baseText} ${step === "complete" && activeText}`}>
          簽署完成
        </span>
      </div>
    </div>
  );
};

export default Processbar;
