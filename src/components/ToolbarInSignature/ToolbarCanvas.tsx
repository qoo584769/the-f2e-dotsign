import React from "react";
import { useFileStore } from "../../store/useFileStore";

interface CanvasPageProps {
  children?: React.ReactNode;
  list?: any;
  closeCanvasModal(): void;
  urlRef: any;
  curPage: number;
  setCurPage: any;
}

const ToolbarCanvas: React.FC<CanvasPageProps> = ({
  closeCanvasModal,
  urlRef,
  curPage,
  setCurPage,
}) => {
  const { uploadInfo } = useFileStore();

  return (
    <>
      {/* 手機板 */}
      <div className="w-full h-4/5 p-8 pt-6 rounded-t-[40px] bg-white absolute bottom-0 flex flex-col md:hidden">
        <div className="border-b-2 border-b-[#B7EC5D] text-center">
          選擇頁面
        </div>
        <div className="bg-[#F5F5F5] my-6 rounded-2xl flex-grow flex flex-col overflow-y-hidden">
          <div className="p-5 overflow-y-scroll">
            {Array.from(new Array(uploadInfo.totalPages), (_, index) => {
              return (
                <div className="mb-4 last:mb-0" key={index}>
                  <div
                    className={`p-3 grid grid-cols-3 place-content-center border-2 rounded-xl ${index + 1 === curPage ? "bg-[#b7ec5d]/[.7] border-[#b7ec5d]" : "bg-white"}`}
                    onClick={() => {
                      setCurPage(index + 1), closeCanvasModal();
                    }}
                  >
                    <span className="">{index + 1}.</span>
                    <img src={urlRef.current[index]} alt="" className="block" />
                    <span className="w-2 h-2 bg-[#F93819] rounded-full justify-self-end"></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            className="border-2 rounded-full py-2 w-full "
            onClick={closeCanvasModal}
          >
            取消
          </button>
          {/* <button className="border-2 rounded-full py-2 ml-5 w-full">使用</button> */}
        </div>
      </div>
      {/* PC版 */}
      <div className="hidden bg-[#F5F5F5] ml-2 rounded-2xl flex-grow md:flex flex-col overflow-y-hidden">
        <div className="overflow-y-scroll p-5">
          {Array.from(new Array(uploadInfo.totalPages), (_, index) => {
            return (
              <div className="mb-4 last:mb-0" key={index}>
                <div
                  className={`p-3 grid grid-cols-3 place-content-center border-2 rounded-xl ${index + 1 === curPage ? "bg-[#b7ec5d]/[.7] border-[#b7ec5d]" : "bg-white"}`}
                  onClick={() => {
                    setCurPage(index + 1);
                  }}
                >
                  <span className="">{index + 1}.</span>
                  <img src={urlRef.current[index]} alt="" className="block" />
                  <span className="w-2 h-2 bg-[#F93819] rounded-full justify-self-end"></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ToolbarCanvas;
