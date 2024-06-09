import React, { useState } from "react";
import { fabric } from "fabric";

import NewImgModal from "../Modal/NewImgModal";

import { useToolbarStore } from "../../store/useFileStore";
import { useAlertStore } from "../../store/useAlertStore";

import addIcon from "../../assets/icon/ic_add_dark.svg";
import closeIcon from "../../assets/icon/ic_close_s.svg";

interface SignaturePageProps {
  children?: React.ReactNode;
  list?: any;
  fabricCanvas: fabric.Canvas | null;
  closeImgModal(): void;
}

const ImgCollection: React.FC<SignaturePageProps> = ({
  fabricCanvas,
  closeImgModal,
}) => {
  const { imgList, setImgList } = useToolbarStore();
  const { setAlertData } = useAlertStore();
  const [showModal, setShowModal] = useState(false);

  // PDF放上圖片
  const addImage = (image: any, fabricCanvas: fabric.Canvas) => {
    fabric.Image.fromURL(image, (img) => {
      const oImg = img.set({
        left: 50,
        top: 300,
        scaleX: 0.2,
        scaleY: 0.2,
      });
      fabricCanvas.add(oImg);
    });
    fabricCanvas.renderAll();
  };

  // 刪除圖片列表的圖片
  const removeImage = (id: any) => {
    const filterData = imgList.filter((_item, index) => index !== id);
    setImgList(filterData);
    const alertData = {
      msg: "圖片刪除成功",
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
        <NewImgModal
          toggleModal={toggleModal}
          imgList={imgList}
          setImgList={setImgList}
        ></NewImgModal>
      )}
      {/* 手機板 */}
      <div className="w-full h-4/5 p-8 pt-6 rounded-t-[40px] bg-white absolute bottom-0 flex flex-col md:hidden">
        <div className="border-b-2 border-b-[#B7EC5D] text-center">圖片庫</div>
        <div
          className="bg-[#F5F5F5] my-6 rounded-2xl flex-grow flex flex-col overflow-y-hidden md:hidden"
          style={{
            justifyContent: !imgList.length ? "center" : "",
          }}
        >
          {imgList ? (
            <div className="overflow-y-scroll">
              {imgList.map((item: any, index: any) => {
                return (
                  <div key={index} className="relative">
                    <img
                      src={closeIcon}
                      alt=""
                      className="absolute right-0 top-0 cursor-pointer"
                      onClick={() => {
                        removeImage(index);
                      }}
                    />
                    <img
                      key={index}
                      src={item}
                      alt=""
                      className="block mb-2 bg-white"
                      onClick={() => {
                        addImage(item, fabricCanvas as fabric.Canvas),
                          closeImgModal();
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className="flex flex-col items-center mt-5">
            <button
              className="flex flex-col items-center cursor-pointer"
              onClick={toggleModal}
            >
              {imgList.length === 0 ? (
                <>
                  <img src={addIcon} className="w-[80px] h-[80px]" alt="" />
                  <span className="mt-4 text-2xl">新增圖片</span>
                </>
              ) : (
                <img src={addIcon} className="w-[60px] h-[60px]" alt="" />
              )}
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            className="border-2 rounded-full py-2 w-full mr-5"
            onClick={closeImgModal}
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
          justifyContent: !imgList.length ? "center" : "",
        }}
      >
        {imgList ? (
          <div className="overflow-y-scroll">
            {imgList.map((item: any, index: any) => {
              return (
                <div key={index} className="relative flex justify-center">
                  <img
                    src={closeIcon}
                    alt=""
                    className="absolute right-0 top-0 cursor-pointer"
                    onClick={() => {
                      removeImage(index);
                    }}
                  />
                  <img
                    key={index}
                    src={item}
                    alt=""
                    className="h-[180px] block mb-2 bg-white"
                    onClick={() =>
                      addImage(item, fabricCanvas as fabric.Canvas)
                    }
                  />
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
            {imgList.length === 0 ? (
              <>
                <img src={addIcon} className="w-[80px] h-[80px]" alt="" />
                <span className="mt-4 text-2xl">新增圖片</span>
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

export default ImgCollection;
