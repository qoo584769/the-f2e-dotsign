import React, { useRef } from "react";

import { useAlertStore } from "../../store/useAlertStore";

import imgPhoto from "../../assets/img/img_photo.svg";

interface NewImgModalProps {
  children?: React.ReactNode;
  toggleModal(): void;
  imgList: string[];
  setImgList(data: string[]): void;
}

const NewImgModal: React.FC<NewImgModalProps> = ({
  toggleModal,
  imgList,
  setImgList,
}) => {
  const { setAlertData } = useAlertStore();

  const imgRef = useRef(null);

  // 圖片上傳
  const handleUpload = () => {
    if (imgRef.current !== null) {
      const { files } = imgRef.current;
      const imgURL = URL.createObjectURL(files[0]);
      setImgList([...imgList, imgURL]);
      toggleModal();
      const alertData = {
        msg: "新增圖片成功",
        showAlert: true,
        bgColor: "bg-[#648D1EE5]",
        bdColor: "border-[#B7EC5D]",
      };
      setAlertData(alertData);
    }
  };

  const handleDragEnter = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const { dataTransfer } = e;
    const files = dataTransfer?.files;

    const imgURL = URL.createObjectURL(files[0]);
    setImgList([...imgList, imgURL]);
    toggleModal();
    const alertData = {
      msg: "新增圖片成功",
      showAlert: true,
      bgColor: "bg-[#648D1EE5]",
      bdColor: "border-[#B7EC5D]",
    };
    setAlertData(alertData);
  };

  return (
    <div className="fixed w-full h-full top-0 left-0 transition-all bg-black/50 flex items-center justify-center z-20">
      <div className="w-[90%] max-w-[530px] min-h-[261px] px-8 pt-4 pb-7 rounded-[40px] flex flex-col justify-between bg-white">
        <div
          className="border-dashed border-secondary border-[1px] py-5 my-5 rounded-[20px] flex flex-col justify-center gap-6 items-center"
          onDrop={(e) => handleDrop(e)}
          onDragOver={(e) => handleDragOver(e)}
          onDragEnter={(e) => handleDragEnter(e)}
        >
          <img src={imgPhoto} alt="" />
          <button className="min-w-[131px] h-[41px] py-2 px-7 flex items-center justify-center border-2 border-primary cursor-pointer rounded-[50px] gap-2 text-base font-bold md:text-lg whitespace-nowrap hover:text-black disabled:bg-gray-20 bg-secondary text-primary over:text-black hover:bg-primary">
            <input
              type="file"
              accept="image/png, image/jpeg"
              ref={imgRef}
              className="opacity-0 absolute w-[131px] h-[41px] cursor-pointer"
              onChange={handleUpload}
            />
            選擇檔案
          </button>
          <div className="text-center">
            <h5 className="text-[#999999] mb-3 md:block">拖曳或選擇檔案</h5>
            <p className="text-[#999999] px-4 text-center">
              圖片格式僅限JPG、PNG
            </p>
          </div>
        </div>

        <button
          className="min-w-[131px] h-[41px] py-2 px-7 flex items-center justify-center border-2 cursor-pointer rounded-[50px] gap-2 text-base font-bold md:text-lg whitespace-nowrap disabled:bg-gray-20 disabled:border-gray-30 border-[#808080] text-[#808080] hover:text-primary hover:bg-[#808080]"
          onClick={toggleModal}
        >
          取消
        </button>
      </div>
    </div>
  );
};

export default NewImgModal;
