import React, { useState, useRef, useEffect } from "react";
import { fabric } from "fabric";
import * as pdfjsLib from "pdfjs-dist";
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
// pdfjsLib.GlobalWorkerOptions.workerSrc =
// "../../pdfjs-dist/build/pdf.worker.min.mjs";
// pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url,
// ).toString();

import { useFileContext } from "../store/FileContext";

import Container from "../utils/Container";
import Navbar from "../components/Navbar/Navbar";
import FolderLayout from "../components/Folder/FolderLayout";
import FolderList from "../components/Folder/FolderList";
import NewSignModal from "../components/Modal/NewSignModal";

import signIcon from "../assets/icon/ic_sign.svg";
import picIcon from "../assets/icon/ic_pic.svg";
import textIcon from "../assets/icon/ic_text.svg";
import pageIcon from "../assets/icon/ic_page.svg";
import signIcon_h from "../assets/icon/ic_sign_h.svg";
import picIcon_h from "../assets/icon/ic_pic_h.svg";
import textIcon_h from "../assets/icon/ic_text_h.svg";
import pageIcon_h from "../assets/icon/ic_page_h.svg";
import addIcon from "../assets/icon/ic_add_dark.svg";
import closeIcon from "../assets/icon/ic_close_s.svg";

interface SignaturePageProps {
  children?: React.ReactNode;
  list?: any;
  addItem(item: any, fabricCanvas: fabric.Canvas): void;
  removeItem(item: any): void;
}

const SignaturePage = () => {
  const { uploadInfo, setFinishPDF } = useFileContext();

  // const signCanvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const imgRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  // const [signature, setSignature] = useState(false);
  const [signList, setSignList] = useState([]);
  const [imgList, setImgList] = useState<any[]>([]);
  const [textList, setTextList] = useState<any[]>([]);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [checkedIcon, setCheckedIcon] = useState("簽名");

  useEffect(() => {
    // uploadHander();
    const fc = new fabric.Canvas(fabricCanvasRef.current);
    setFabricCanvas(fc);
    return () => {
      fc.dispose();
    };
  }, [fabricCanvasRef]);

  useEffect(() => {
    if (!uploadInfo.file) return;
  }, [uploadInfo.file]);

  useEffect(() => {
    if (!uploadInfo.file) return;
    if (!fabricCanvas) return;

    const makeFabricCanvas = async () => {
      fabricCanvas.requestRenderAll();
      const pdfData = await printPDF(uploadInfo.file);
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
  }, [fabricCanvas]);

  // icon資料格式
  const iconArr = [
    { text: "簽名", icon: signIcon, iconOnCheck: signIcon_h },
    { text: "圖片", icon: picIcon, iconOnCheck: picIcon_h },
    { text: "文字", icon: textIcon, iconOnCheck: textIcon_h },
    { text: "頁數", icon: pageIcon, iconOnCheck: pageIcon_h },
  ];
  // -------------------------------

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
  const printPDF = async (pdfData: any) => {
    const Base64Prefix = "data:application/pdf;base64,";
    pdfData = await readBlob(pdfData);
    // 將 base64 中的前綴刪去，並進行解碼
    const data = atob(pdfData.substring(Base64Prefix.length));
    const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
    const pdfPage = await pdfDoc.getPage(1);

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

  // PDF放上簽名
  const addSignature = (sign: any, fabricCanvas: fabric.Canvas) => {
    fabric.Image.fromURL(sign, (img) => {
      img.top = 300;
      img.scaleX = 0.5;
      img.scaleY = 0.5;
      // img.scaleToWidth(100);
      // img.scaleToHeight(100);
      fabricCanvas.add(img);
    });
    fabricCanvas.renderAll();
  };

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

  // PDF放上文字
  const addText = (text: any, fabricCanvas: fabric.Canvas) => {
    const editText = new fabric.IText(text, {
      left: 50,
      top: 100,
    });

    fabricCanvas.add(editText);
    fabricCanvas.setActiveObject(editText);
  };

  // 刪除簽名列表的簽名
  const removeSignature = (id: any) => {
    setSignList((pre) => {
      return pre.filter((_item, index) => index !== id);
    });
  };

  // 刪除圖片列表的圖片
  const removeImage = (id: any) => {
    setImgList((pre) => {
      return pre.filter((_item, index) => index !== id);
    });
  };
  // 刪除圖片列表的圖片
  const removeText = (id: any) => {
    setTextList((pre) => {
      return pre.filter((_item, index) => index !== id);
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

  // temp
  // fabric內建的刪除事件
  const deleteObject = (eventData: any, transform: { target: any }) => {
    if (!eventData) return;
    const target = transform.target;
    const canvas = target.canvas;
    canvas.remove(target);
    canvas.requestRenderAll();
  };
  // -------------------------------

  // -------------------------------
  // temp
  const finalPDF = () => {
    const image = (fabricCanvas as fabric.Canvas).toDataURL({ format: "png" });
    setFinishPDF(image);
  };
  // -------------------------------
  // const readerPDF = async (data: any) => {
  //   const pdfDoc = await pdfjsLib.getDocument(data).promise;
  //   const pdfPage = await pdfDoc.getPage(1);
  //   const viewport = pdfPage.getViewport({ scale: 1 });
  //   signCanvasRef.current.width = viewport.width;
  //   signCanvasRef.current.height = viewport.height;
  //   const canvasContext = signCanvasRef.current.getContext("2d");
  //   pdfPage.render({ canvasContext, viewport });
  // };

  // const uploadHander = () => {
  // 取得上傳PDF
  // const [file] = uploadRef.current.files;
  // const file = uploadInfo.file;
  // if (file === undefined) return;

  // 產生fileReader物件
  // const fileReader = new FileReader();
  // 處理資料
  //   fileReader.readAsArrayBuffer(file);

  //   fileReader.onloadend = async () => {
  //     const typedarray = new Uint8Array(fileReader.result);
  //     await readerPDF(typedarray);
  //   };
  // };

  // 左側選單container
  const CollectionContainer: React.FC<SignaturePageProps> = ({
    children,
    list,
    addItem,
    removeItem,
  }) => {
    return (
      <div
        className="bg-[#F5F5F5] p-5 ml-2 rounded-2xl flex-grow flex flex-col overflow-y-hidden"
        style={{
          justifyContent: !list.length ? "center" : "",
        }}
      >
        {list ? (
          <div className="overflow-y-scroll">
            {list !== undefined
              ? list.map((item: any, index: any) => {
                  return (
                    <div key={index} className="relative">
                      <img
                        src={closeIcon}
                        alt=""
                        className="absolute right-0 top-0 cursor-pointer"
                        onClick={() => {
                          removeItem(index);
                        }}
                      />
                      <img
                        key={index}
                        src={item}
                        alt=""
                        className="block mb-2 bg-white"
                        onClick={() =>
                          addItem(item, fabricCanvas as fabric.Canvas)
                        }
                      />
                    </div>
                  );
                })
              : null}
          </div>
        ) : null}
        {children}
      </div>
    );
  };
  // 簽名列表
  const SignatureCollection = () => {
    return (
      <CollectionContainer
        list={signList}
        addItem={addSignature}
        removeItem={removeSignature}
      >
        <div className="flex flex-col items-center mt-5">
          <button className="flex flex-col " onClick={showModal}>
            {signList.length === 0 ? (
              <>
                <img src={addIcon} className="w-[80px] h-[80px]" alt="" />
                <span className="">新增簽名檔</span>
              </>
            ) : (
              <img src={addIcon} className="w-[60px] h-[60px]" alt="" />
            )}
          </button>
        </div>
      </CollectionContainer>
    );
  };

  // 圖片列表
  const ImgCollection = () => {
    return (
      <CollectionContainer
        list={imgList}
        addItem={addImage}
        removeItem={removeImage}
      >
        <div className="flex flex-col items-center mt-5">
          <input
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
                <span className="">新增圖片</span>
              </>
            ) : (
              <img src={addIcon} className="w-[60px] h-[60px]" alt="" />
            )}
          </label>
        </div>
      </CollectionContainer>
    );
  };

  // 文字列表
  const TextCollection = () => {
    const [inputValue, setInputValue] = useState("");
    const saveText = () => {
      setTextList((pre: any) => {
        return [...pre, inputValue];
      });
    };

    return (
      <div
        className="bg-[#F5F5F5] p-5 ml-2 rounded-2xl flex-grow flex flex-col overflow-y-hidden"
        style={{
          justifyContent: !textList.length ? "center" : "",
        }}
      >
        {textList ? (
          <div className="overflow-y-scroll">
            {textList !== undefined
              ? textList.map((item, index) => {
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
                        className="w-full text-left py-2 pl-3"
                        onClick={() => {
                          addText(item, fabricCanvas as fabric.Canvas);
                        }}
                      >
                        {item}
                      </button>
                    </div>
                  );
                })
              : null}
          </div>
        ) : null}
        <div className="flex flex-col items-center mt-5">
          <input
            type="text"
            name=""
            id="addNewText"
            className=""
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className="" onClick={saveText}>
            確定
          </button>
          <label htmlFor="addNewText" className="flex flex-col items-center">
            {textList.length === 0 ? (
              <>
                <img src={addIcon} className="w-[80px] h-[80px]" alt="" />
                <span className="">新增文字</span>
              </>
            ) : (
              <img src={addIcon} className="w-[60px] h-[60px]" alt="" />
            )}
          </label>
        </div>
      </div>
    );
  };

  // 圖片上傳
  const handleUpload = () => {
    if (imgRef.current !== null) {
      const { files } = imgRef.current;
      const imgURL = URL.createObjectURL(files[0]);
      setImgList((pre: any) => {
        return [...pre, imgURL];
      });
    }
  };

  const getProps = <T extends object, K extends keyof T>(obj: T, key: K) => {
    return obj[key];
  };

  const collectionSelector = (collectionName: any) => {
    const collection = {
      簽名: <SignatureCollection></SignatureCollection>,
      圖片: <ImgCollection></ImgCollection>,
      文字: <TextCollection></TextCollection>,
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
      {isOpen ? (
        <NewSignModal
          closeModal={closeModal}
          setSignList={setSignList}
        ></NewSignModal>
      ) : null}
      <Navbar></Navbar>
      <FolderLayout>
        <FolderList
          title="簽署文件"
          next={true}
          prePath="upload"
          nextPath="finish"
          finalPDF={finalPDF}
        ></FolderList>
        {/* temp */}
        <div className="flex-grow grid grid-cols-12 gap-x-5 overflow-hidden">
          <div className="border-r-2 border-[rgb(183,236,93)] col-span-3 pr-5 flex flex-col overflow-hidden">
            {/* 選擇插入工具 */}
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
            {/* <SignatureCollection></SignatureCollection> */}
          </div>

          <div className="col-span-9 max-w-[70%] mt-6 mb-1 m-auto overflow-scroll">
            {/* <div className="w-fit max-w-[80%] m-auto verflow-y-scroll hidden">
              <div className="bg-[#b3b3b3] p-4 mx-auto overflow-x-auto flex">
                <canvas ref={signCanvasRef} className=""></canvas>
              </div>
            </div> */}
            {/* fabric canvas */}
            <div className="bg-[#b3b3b3] w-fit px-12 py-10 mx-auto">
              <canvas ref={fabricCanvasRef} id="canvas" className=""></canvas>
            </div>
          </div>
        </div>
        {/* temp */}
      </FolderLayout>
    </Container>
  );
};

export default SignaturePage;
