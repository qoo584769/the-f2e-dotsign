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
}

const ImgCollection: React.FC<SignaturePageProps> = ({ fabricCanvas }) => {
  const { imgList, setImgList } = useToolbarStore();
  const { setAlertData } = useAlertStore();
  // const [imgList, setImgList] = useState<any[]>([]);
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
      // img.top = 300;
      // img.left = 50;
      // img.scaleX = 0.2;
      // img.scaleY = 0.2;
      // img.scaleToWidth(100);
      // img.scaleToHeight(100);
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
    // setImgList((pre) => {
    //   return pre.filter((_item, index) => index !== id);
    // });
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
      <div
        className="bg-[#F5F5F5] p-5 ml-2 rounded-2xl flex-grow flex flex-col overflow-y-hidden"
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
          {/* <input
            type="file"
            name=""
            id="uploadImg"
            accept="image/*"
            className="hidden"
            ref={imgRef}
            onChange={handleUpload}
          />
          <label htmlFor="uploadImg" className="flex flex-col items-center">
            {imgList.length === 0 ? (
              <>
                <img src={addIcon} className="w-[80px] h-[80px]" alt="" />
                <span className="mt-4">新增圖片</span>
              </>
            ) : (
              <img src={addIcon} className="w-[60px] h-[60px]" alt="" />
            )}
          </label> */}

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
