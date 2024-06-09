import { useState, useRef, useEffect } from "react";
import { fabric } from "fabric";
import * as pdfjsLib from "pdfjs-dist";
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

import { useFileStore, useFinalPDF } from "../store/useFileStore";
import { useFolderStore } from "../store/useFolderTabStore";

import Container from "../utils/Container";
import Navbar from "../components/Navbar/Navbar";
import FolderLayout from "../components/Folder/FolderLayout";
import FolderList from "../components/Folder/FolderList";

import SignatureCollection from "../components/ToolbarInSignature/ToolbarSign";
import ImgCollection from "../components/ToolbarInSignature/ToolbarImage";
import TextCollection from "../components/ToolbarInSignature/ToolbarText";

import signIcon from "../assets/icon/ic_sign.svg";
import picIcon from "../assets/icon/ic_pic.svg";
import textIcon from "../assets/icon/ic_text.svg";
import pageIcon from "../assets/icon/ic_page.svg";
import signIcon_h from "../assets/icon/ic_sign_h.svg";
import picIcon_h from "../assets/icon/ic_pic_h.svg";
import textIcon_h from "../assets/icon/ic_text_h.svg";
import pageIcon_h from "../assets/icon/ic_page_h.svg";
import closeIcon from "../assets/icon/ic_close_s.svg";

const SignaturePage = () => {
  const { uploadInfo } = useFileStore();
  const { setCompletedPDF } = useFinalPDF();
  const { pdfList, setPdfList } = useFolderStore();

  const fabricCanvasRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [curPage, setCurPage] = useState(1);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [checkedIcon, setCheckedIcon] = useState("簽名");
  const urlRef = useRef<string[]>([]);

  useEffect(() => {
    renderPDF(uploadInfo.typedarray);
  }, [checkedIcon]);

  useEffect(() => {
    const fc = new fabric.Canvas(fabricCanvasRef.current);
    setFabricCanvas(fc);

    return () => {
      // 解決fabric圖層問題
      fc.dispose();
    };
  }, [fabricCanvasRef]);

  useEffect(() => {
    if (!uploadInfo.file) return;
    if (!fabricCanvas) return;

    const makeFabricCanvas = async () => {
      fabricCanvas.requestRenderAll();
      const pdfData = await printPDF(uploadInfo.file, curPage);
      const pdfImg = await pdfToImg(pdfData);
      if (pdfImg.width !== undefined && pdfImg.height !== undefined) {
        fabricCanvas.setWidth(pdfImg.width / window.devicePixelRatio);
        fabricCanvas.setHeight(pdfImg.height / window.devicePixelRatio);
      }
      fabricCanvas.setBackgroundImage(
        pdfImg,
        fabricCanvas.renderAll.bind(fabricCanvas),
      );
    };
    makeFabricCanvas();

    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetX: 16,
      offsetY: -16,
      cursorStyle: "pointer",
      mouseUpHandler: deleteObject as any,
      render: renderIcon,
      // cornerSize: 24,
    });
  }, [fabricCanvas, curPage]);

  // 左側icon資料格式
  const iconArr = [
    { text: "簽名", icon: signIcon, iconOnCheck: signIcon_h },
    { text: "圖片", icon: picIcon, iconOnCheck: picIcon_h },
    { text: "文字", icon: textIcon, iconOnCheck: textIcon_h },
    { text: "頁數", icon: pageIcon, iconOnCheck: pageIcon_h },
  ];

  // FileReader轉檔 轉換成base64
  const readBlob = (blob: any) => {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.addEventListener("load", () => res(fr.result));
      fr.addEventListener("error", rej);
      fr.readAsDataURL(blob);
    });
  };

  // 將上傳的PDF轉乘canvas
  const printPDF = async (pdfData: any, curPage: number) => {
    const Base64Prefix = "data:application/pdf;base64,";
    pdfData = await readBlob(pdfData);
    // 將 base64 中的前綴刪去，並進行解碼
    const data = atob(pdfData.substring(Base64Prefix.length));
    const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
    const pdfPage = await pdfDoc.getPage(curPage);

    // 設定尺寸
    const scale = 2;
    const viewport = pdfPage.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = viewport.width * window.devicePixelRatio;
    canvas.height = viewport.height * window.devicePixelRatio;
    const renderTask = pdfPage.render({
      canvasContext: context as CanvasRenderingContext2D,
      viewport,
    });
    return renderTask.promise.then(() => canvas);
  };

  // PDF轉圖片
  const pdfToImg = async (pdfData: any) => {
    // 設定 PDF 轉為圖片時的比例
    const scale = 1 / window.devicePixelRatio;
    // 回傳圖片
    return new fabric.Image(pdfData, {
      scaleX: scale,
      scaleY: scale,
    });
  };

  // PDF上簽名右上角刪除圖標
  const renderIcon = (
    ctx: CanvasRenderingContext2D,
    left: any,
    top: any,
    fabricObject: any,
  ) => {
    const img = document.createElement("img");
    img.src = closeIcon;
    const size = 40;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
  };

  // fabric內建的刪除事件
  const deleteObject = (eventData: any, transform: { target: any }) => {
    if (!eventData) return;
    const target = transform.target;
    const canvas = target.canvas;
    canvas.remove(target);
    canvas.requestRenderAll();
  };

  const finalPDF = () => {
    const image = (fabricCanvas as fabric.Canvas).toDataURL({ format: "png" });
    const data = {
      pdf: image,
      updateDate: Date.now(),
      name: uploadInfo.file?.name,
    };

    setPdfList([...pdfList, data]);
    setCompletedPDF(image);
  };

  const renderPDF = async (data: any) => {
    const pdfDoc = await pdfjsLib.getDocument(Uint8Array.from(data)).promise;
    const task = new Array(pdfDoc.numPages).fill(null);
    urlRef.current = [];
    await Promise.all(
      task.map(async (_, i) => {
        const pdfPage = await pdfDoc.getPage(i + 1);
        const viewport = pdfPage.getViewport({ scale: 0.3 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const canvasContext = canvas.getContext(
          "2d",
        ) as CanvasRenderingContext2D;
        const renerTask = pdfPage.render({
          canvasContext,
          viewport,
        });
        await renerTask.promise.then(() => {
          urlRef.current[i] = canvas.toDataURL("image/png", 1);
        });
      }),
    );
  };

  // 左側多頁PDF列表
  const PDFPageCollection = () => {
    return (
      <>
        {/* 手機板 */}
        <div className="w-full h-4/5 p-8 pt-6 rounded-t-[40px] bg-white absolute bottom-0 flex flex-col md:hidden">
          <div className="border-b-2 border-b-[#B7EC5D] text-center">
            簽名檔
          </div>
          <div className="bg-[#F5F5F5] my-6 rounded-2xl flex-grow flex flex-col overflow-y-hidden md:hidden">
            <div className="overflow-y-scroll">
              {Array.from(new Array(uploadInfo.totalPages), (_, index) => {
                return (
                  <div className="overflow-y-scrll" key={index}>
                    <div className="grid place-content-center border rounded-xl bg-white overflow-y-scrol">
                      <span className="">第 {index + 1} 頁</span>
                      <img
                        src={urlRef.current[index]}
                        alt=""
                        className="block"
                        onClick={() => {
                          setCurPage(index + 1);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              className="border-2 rounded-full py-2 w-full mr-5"
              onClick={closeModal}
            >
              取消
            </button>
            <button className="border-2 rounded-full py-2 w-full">使用</button>
          </div>
        </div>
        {/* PC版 */}
        <div className="hidden bg-[#F5F5F5] p-5 ml-2 rounded-2xl flex-grow md:flex flex-col overflow-y-hidden">
          <div className="overflow-y-scroll">
            {Array.from(new Array(uploadInfo.totalPages), (_, index) => {
              return (
                <div className="overflow-y-scrll" key={index}>
                  <div className="grid place-content-center border rounded-xl bg-white overflow-y-scrol">
                    <span className="">第 {index + 1} 頁</span>
                    <img
                      src={urlRef.current[index]}
                      alt=""
                      className="block"
                      onClick={() => {
                        setCurPage(index + 1);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  const getProps = <T extends object, K extends keyof T>(obj: T, key: K) => {
    return obj[key];
  };

  const collectionSelector = (collectionName: any) => {
    const collection = {
      簽名: (
        <SignatureCollection
          fabricCanvas={fabricCanvas}
          closeSignModal={closeModal}
        ></SignatureCollection>
      ),
      圖片: (
        <ImgCollection
          fabricCanvas={fabricCanvas}
          closeImgModal={closeModal}
        ></ImgCollection>
      ),
      文字: (
        <TextCollection
          fabricCanvas={fabricCanvas}
          closeTextModal={closeModal}
        ></TextCollection>
      ),
      頁數: <PDFPageCollection></PDFPageCollection>,
    };
    return getProps(collection, collectionName);
  };

  const showModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Container>
      <Navbar step="sign"></Navbar>

      <FolderLayout>
        <FolderList
          title="簽署文件"
          next={true}
          prePath="upload"
          nextPath="finish"
          finalPDF={finalPDF}
        ></FolderList>

        <div className="md:flex-grow grid grid-rows-1 grid-cols-12 md:gap-x-5 overflow-hidden">
          {/* PC版 */}
          <div className="hidden border-r-2 border-[rgb(183,236,93)] md:col-span-3 pr-5 md:flex flex-col overflow-hidden">
            {/* 選擇工具 */}
            <div className="flex justify-between text-center mt-5 mb-4 mx-6">
              {iconArr.map((item, index) => (
                <div key={index} className="">
                  <input
                    name="iconRadio"
                    type="radio"
                    id={item.icon}
                    value={item.text}
                    className="hidden"
                    onChange={(e) => setCheckedIcon(e.target.value)}
                  />
                  <label htmlFor={item.icon} className="cursor-pointer">
                    <img
                      src={
                        item.text !== checkedIcon ? item.icon : item.iconOnCheck
                      }
                      alt=""
                      className=""
                    />
                    {item.text}
                  </label>
                </div>
              ))}
            </div>
            {/* 簽名列表 */}
            {collectionSelector(checkedIcon)}
          </div>
          {/* 手機板 */}
          <div className="flex col-span-12 py-4 justify-evenly relative md:hidden">
            {iconArr.map((item, index) => (
              <div key={index} className="">
                <input
                  name="iconRadio"
                  type="radio"
                  id={item.icon}
                  value={item.text}
                  className="hidden"
                  onChange={(e) => [setCheckedIcon(e.target.value)]}
                />
                <label htmlFor={item.icon} className="cursor-pointer">
                  <img
                    src={
                      item.text !== checkedIcon ? item.icon : item.iconOnCheck
                    }
                    alt=""
                    className=""
                    onClick={() => {
                      showModal();
                    }}
                  />
                </label>
              </div>
            ))}
            {/* 簽名列表 */}
            <div
              className={`fixed left-0 right-0 top-0 bottom-0 m-auto h-screen bg-[#22222280] ${isOpen ? "z-10" : "z-[-10]"}`}
            >
              {collectionSelector(checkedIcon)}
            </div>
          </div>

          <div className="col-span-12 max-h-[420px] md:max-h-[660px] max-w-[90%] md:col-span-9 md:max-w-[70%] mt-6 mb-1 m-auto overflow-scroll absolute bottom-16 left-0 top-[100px] right-0 md:relative md:top-0 md:bottom-0">
            <div className="bg-[#b3b3b3] w-fit p-3 md:px-12 md:py-10 mx-auto h-fit">
              <canvas ref={fabricCanvasRef} id="canvas" className=""></canvas>
            </div>
          </div>
        </div>
      </FolderLayout>
    </Container>
  );
};

export default SignaturePage;
