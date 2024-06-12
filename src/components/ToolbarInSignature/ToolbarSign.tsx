import React, { useState } from "react";
import { fabric } from "fabric";

import { useToolbarStore } from "../../store/useFileStore";
import { useAlertStore } from "../../store/useAlertStore";

import NewSignModal from "../../components/Modal/NewSignModal";
import addIcon from "../../assets/icon/ic_add_dark.svg";
import closeIcon from "../../assets/icon/ic_close_s.svg";

interface SignaturePageProps {
  children?: React.ReactNode;
  list?: any;
  fabricCanvas: fabric.Canvas | null;
  closeSignModal(): void;
}

// 左側選單container
// const CollectionContainer: React.FC<SignaturePageProps> = ({
//   children,
//   list,
//   addItem,
//   removeItem,
//   fabricCanvas,
// }) => {
//   return (
//     <div
//       className="bg-[#F5F5F5] p-5 ml-2 rounded-2xl flex-grow flex flex-col overflow-y-hidden"
//       style={{
//         justifyContent: !list.length ? "center" : "",
//       }}
//     >
//       {list ? (
//         <div className="overflow-y-scroll">
//           {list.map((item: any, index: any) => {
//             return (
//               <div key={index} className="relative">
//                 <img
//                   src={closeIcon}
//                   alt=""
//                   className="absolute right-0 top-0 cursor-pointer"
//                   onClick={() => {
//                     removeItem(index);
//                   }}
//                 />
//                 <img
//                   key={index}
//                   src={item}
//                   alt=""
//                   className="block mb-2 bg-white"
//                   onClick={() => addItem(item, fabricCanvas as fabric.Canvas)}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       ) : null}
//       {children}
//     </div>
//   );
// };

// 左側簽名列表
const SignatureCollection: React.FC<SignaturePageProps> = ({
  fabricCanvas,
  closeSignModal,
}) => {
  const { signList, setSignList } = useToolbarStore();
  const { setAlertData } = useAlertStore();

  const [isOpen, setIsOpen] = useState(false);

  // PDF放上簽名
  const addSignature = (sign: any, fabricCanvas: fabric.Canvas) => {
    fabric.Image.fromURL(sign, (img) => {
      img.top = 300;
      img.scaleX = 0.5;
      img.scaleY = 0.5;
      fabricCanvas.add(img);
    });
    fabricCanvas.renderAll();
  };

  // 刪除簽名列表的簽名
  const removeSignature = (id: any) => {
    const filterData = signList.filter((_item, index) => index !== id);
    setSignList(filterData);
    const alertData = {
      msg: "刪除簽名檔成功",
      showAlert: true,
      bgColor: "bg-[#648D1EE5]",
      bdColor: "border-[#B7EC5D]",
    };
    setAlertData(alertData);
  };

  const showModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <>
      {isOpen ? (
        <NewSignModal
          closeModal={closeModal}
          signList={signList}
          setSignList={setSignList}
        ></NewSignModal>
      ) : null}

      {/* 手機板 */}
      <div className="w-full h-4/5 p-8 pt-6 rounded-t-[40px] bg-white absolute bottom-0 flex flex-col md:hidden">
        <div className="border-b-2 border-b-[#B7EC5D] text-center">簽名檔</div>
        <div
          className="bg-[#F5F5F5] my-6 rounded-2xl flex-grow flex flex-col overflow-y-hidden md:hidden"
          style={{
            justifyContent: !signList.length ? "center" : "",
          }}
        >
          {signList ? (
            <div className="overflow-y-scroll">
              {signList.map((item: any, index: any) => {
                return (
                  <div
                    key={index}
                    className="relative bg-white m-4 rounded-3xl"
                  >
                    <img
                      src={closeIcon}
                      alt=""
                      className="absolute right-0 top-0 cursor-pointer"
                      onClick={() => {
                        removeSignature(index);
                      }}
                    />
                    <img
                      key={index}
                      src={item}
                      alt=""
                      className="block mb-2 m-auto"
                      onClick={() => [
                        addSignature(item, fabricCanvas as fabric.Canvas),
                        closeSignModal(),
                      ]}
                    />
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className="flex flex-col items-center mt-5">
            <button
              className="flex flex-col items-center cursor-pointer"
              onClick={showModal}
            >
              {signList.length === 0 ? (
                <>
                  <img src={addIcon} className="w-[80px] h-[80px]" alt="" />
                  <span className="mt-4 text-2xl">新增簽名檔</span>
                </>
              ) : (
                <img src={addIcon} className="w-[60px] h-[60px]" alt="" />
              )}
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            className="border-2 rounded-full py-2 w-full "
            onClick={closeSignModal}
          >
            取消
          </button>
          {/* <button className="border-2 rounded-full py-2 ml-5 w-full">使用</button> */}
        </div>
      </div>
      {/* PC版 */}
      <div
        className="bg-[#F5F5F5] p-5 ml-2 rounded-2xl flex-grow hidden md:flex flex-col overflow-y-hidden"
        style={{
          justifyContent: !signList.length ? "center" : "",
        }}
      >
        {signList ? (
          <div className="overflow-y-scroll">
            {signList.map((item: any, index: any) => {
              return (
                <div key={index} className="relative rounded-3xl">
                  <img
                    src={closeIcon}
                    alt=""
                    className="absolute right-0 top-0 cursor-pointer"
                    onClick={() => {
                      removeSignature(index);
                    }}
                  />
                  <img
                    key={index}
                    src={item}
                    alt=""
                    className="block mb-4 bg-white rounded-3xl"
                    onClick={() =>
                      addSignature(item, fabricCanvas as fabric.Canvas)
                    }
                  />
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="flex flex-col items-center mt-5">
          <button
            className="flex flex-col items-center cursor-pointer"
            onClick={showModal}
          >
            {signList.length === 0 ? (
              <>
                <img src={addIcon} className="w-[80px] h-[80px]" alt="" />
                <span className="mt-4 text-2xl">新增簽名檔</span>
              </>
            ) : (
              <img src={addIcon} className="w-[60px] h-[60px]" alt="" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default SignatureCollection;
