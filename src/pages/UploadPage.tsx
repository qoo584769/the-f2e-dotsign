"use client";
import { useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

import { useFileContext } from "../store/FileContext";

import Container from "../utils/Container";
import Navbar from "../components/Navbar/Navbar";
import FolderLayout from "../components/Folder/FolderLayout";
import FolderList from "../components/Folder/FolderList";

import imgPhoto from "../assets/img/img_photo.svg";
import editIcon from "../assets/icon/ic_edit.svg";
import closeIcon from "../assets/icon/ic_close_s.svg";
import closeIcon_h from "../assets/icon/ic_close_s_h.svg";

const UploadPage = () => {
  const { uploadInfo, setUploadInfo } = useFileContext();

  const uploadRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isHover, setIsHover] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const renderPDF = async (data: any) => {
    const pdfDoc = await pdfjsLib.getDocument(data).promise;
    setUploadInfo((pre: any) => ({
      ...pre,
      totalPages: pdfDoc.numPages,
    }));
    const pdfPage = await pdfDoc.getPage(1);
    const viewport = pdfPage.getViewport({ scale: 0.3 });
    const canvas = canvasRef.current;
    if (canvas !== null) {
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const canvasContext = canvas.getContext("2d");
      pdfPage.render({
        canvasContext: canvasContext as CanvasRenderingContext2D,
        viewport,
      });
    }
  };

  const uploadHander = () => {
    if (uploadRef.current !== null) {
      const { files } = uploadRef.current;

      // 產生fileReader物件
      const fileReader = new FileReader();
      // 處理資料
      if (files !== null) {
        fileReader.readAsArrayBuffer(files[0]);
        setUploaded(true);
        fileReader.onload = async () => {
          const typedarray = new Uint8Array(fileReader.result as any);
          setUploadInfo((pre: any) => ({
            ...pre,
            file: files[0],
            typedarray: Array.from(typedarray),
          }));
          await renderPDF(typedarray);
        };
      }
    }
  };

  return (
    <Container>
      <Navbar></Navbar>
      <FolderLayout>
        <FolderList
          title="上傳檔案"
          next={uploaded}
          nextPath="signature"
        ></FolderList>
        <div className="w-full h-full p-7 flex-grow flex justify-center items-center">
          {uploaded ? (
            <div className="w-fit h-fit flex flex-col justify-center items-center ">
              <div className="relative">
                {isHover ? (
                  <img
                    src={closeIcon_h}
                    alt=""
                    className="absolute bottom-[90%] right-[-10%] cursor-pointer"
                    onClick={() => setUploaded(false)}
                    onMouseLeave={() => setIsHover(false)}
                  />
                ) : (
                  <img
                    src={closeIcon}
                    alt=""
                    className="absolute bottom-[90%] right-[-10%] cursor-pointer"
                    onMouseEnter={() => setIsHover(true)}
                  />
                )}
                <canvas ref={canvasRef} className=""></canvas>
              </div>

              <span className="mt-6">{uploadInfo?.file.name}</span>
              <span className="mt-1">{uploadInfo?.totalPages} 頁</span>
              <label htmlFor="fileName" className="mt-10">
                專案名稱
              </label>
              <p className="mt-2 pl-6 flex border rounded-full">
                <input
                  type="text"
                  id="fileName"
                  className="w-[400px] outline-none border-none bg-transparent"
                  placeholder={uploadInfo?.file.name}
                />
                <img src={editIcon} alt="" className="" />
              </p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center border border-[#4d4d4d] border-dashed rounded-[20px]">
              <img src={imgPhoto} alt="" className="block mb-5" />
              <input
                type="file"
                id="upload"
                accept="application/pdf"
                className="hidden"
                ref={uploadRef}
                onChange={uploadHander}
              ></input>
              <label
                htmlFor="upload"
                className="text-xl border-2 border-[#b7ec5d] rounded-full px-7 py-2 bg-[#4d4d4d] text-[#b7ec5d] cursor-pointer"
              >
                選擇檔案
              </label>
              <span className="block mt-8 text-base text-[#1e1e1e]">
                僅支援 PDF、JPG、PNG 檔案，且容量不超過 20MB。
              </span>
            </div>
          )}
        </div>
      </FolderLayout>
    </Container>
  );
};

export default UploadPage;
