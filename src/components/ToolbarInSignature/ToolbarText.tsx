import React, { useState } from "react";
import { fabric } from "fabric";

import { useToolbarStore } from "../../store/useFileStore";
import { useAlertStore } from "../../store/useAlertStore";

import NewTextModal from "../Modal/NewTextModal";
import addIcon from "../../assets/icon/ic_add_dark.svg";
import closeIcon from "../../assets/icon/ic_close_s.svg";

interface SignaturePageProps {
  children?: React.ReactNode;
  list?: any;
  fabricCanvas: fabric.Canvas | null;
  closeTextModal(): void;
}

const TextCollection: React.FC<SignaturePageProps> = ({
  fabricCanvas,
  closeTextModal,
}) => {
  const { textList, setTextList } = useToolbarStore();
  const { setAlertData } = useAlertStore();

  const [showModal, setShowModal] = useState(false);

  // PDF放上文字
  const addText = (text: any, fabricCanvas: fabric.Canvas) => {
    const editText = new fabric.IText(text, {
      left: 50,
      top: 100,
    });

    fabricCanvas.add(editText);
    fabricCanvas.setActiveObject(editText);
  };

  // 刪除文字列表的文字
  const removeText = (id: any) => {
    const filterData = textList.filter((_item, index) => index !== id);
    setTextList(filterData);
    const alertData = {
      msg: "文字刪除成功",
      showAlert: true,
    };
    setAlertData(alertData);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      {showModal && (
        <NewTextModal
          toggleModal={toggleModal}
          textList={textList}
          setTextList={setTextList}
        ></NewTextModal>
      )}
      {/* 手機板 */}
      <div className="w-full h-4/5 p-8 pt-6 rounded-t-[40px] bg-white absolute bottom-0 flex flex-col md:hidden">
        <div className="border-b-2 border-b-[#B7EC5D] text-center">文字庫</div>
        <div
          className="bg-[#F5F5F5] my-6 rounded-2xl flex-grow flex flex-col overflow-y-hidden md:hidden"
          style={{
            justifyContent: !textList.length ? "center" : "",
          }}
        >
          {textList ? (
            <div className="overflow-y-scroll">
              {textList.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="relative border flex items-center bg-white mb-3"
                  >
                    <img
                      src={closeIcon}
                      alt=""
                      className="absolute right-0 top-0 bottom-0 cursor-pointer"
                      onClick={() => {
                        removeText(index);
                      }}
                    />
                    <button
                      className="w-full text-left py-2 pl-3 whitespace-pre-wrap"
                      onClick={() => {
                        addText(item, fabricCanvas as fabric.Canvas);
                      }}
                    >
                      {item}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : null}
          <div className="flex flex-col items-center mt-5">
            <label
              className="flex flex-col items-center cursor-pointer"
              onClick={toggleModal}
            >
              {!textList.length ? (
                <>
                  <img src={addIcon} className="w-[80px] h-[80px]" alt="" />
                  <span className="mt-4 text-2xl">新增文字</span>
                </>
              ) : (
                <img src={addIcon} className="w-[60px] h-[60px]" alt="" />
              )}
            </label>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            className="border-2 rounded-full py-2 w-full mr-5"
            onClick={closeTextModal}
          >
            取消
          </button>
          <button className="border-2 rounded-full py-2 w-full">使用</button>
        </div>
      </div>
      {/* PC版 */}
      <div
        className="hidden bg-[#F5F5F5] p-5 ml-2 rounded-2xl flex-grow md:flex flex-col overflow-y-hidden"
        style={{
          justifyContent: !textList.length ? "center" : "",
        }}
      >
        {textList ? (
          <div className="overflow-y-scroll">
            {textList.map((item, index) => {
              return (
                <div
                  key={index}
                  className="relative border flex items-center bg-white mb-3"
                >
                  <img
                    src={closeIcon}
                    alt=""
                    className="absolute right-0 top-0 bottom-0 cursor-pointer"
                    onClick={() => {
                      removeText(index);
                    }}
                  />
                  <button
                    className="w-full text-left py-2 pl-3 whitespace-pre-wrap"
                    onClick={() => {
                      addText(item, fabricCanvas as fabric.Canvas);
                    }}
                  >
                    {item}
                  </button>
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="flex flex-col items-center mt-5">
          <label
            className="flex flex-col items-center cursor-pointer"
            onClick={toggleModal}
          >
            {!textList.length ? (
              <>
                <img src={addIcon} className="w-[80px] h-[80px]" alt="" />
                <span className="mt-4 text-2xl">新增文字</span>
              </>
            ) : (
              <img src={addIcon} className="w-[60px] h-[60px]" alt="" />
            )}
          </label>
        </div>
      </div>
    </>
  );
};

export default TextCollection;
