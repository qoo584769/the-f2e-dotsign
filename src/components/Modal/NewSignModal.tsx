import React, { useState, useEffect, useRef } from "react";

import { useAlertStore } from "../../store/useAlertStore";

import penBlack from "../../assets/icon/ic_color_black.svg";
import penBlack_h from "../../assets/icon/ic_color_black_h.svg";
import penBlue from "../../assets/icon/ic_color_blue.svg";
import penBlue_h from "../../assets/icon/ic_color_blue_h.svg";
import penRed from "../../assets/icon/ic_color_red.svg";
import penRed_h from "../../assets/icon/ic_color_red_h.svg";
import trashIcon from "../../assets/icon/ic_trash.svg";
import trashIcon_h from "../../assets/icon/ic_trash_h.svg";

interface NewSignModalProps {
  children?: React.ReactNode;
  closeModal(): void;
  signList: string[];
  setSignList: any;
}

const NewSignModal: React.FC<NewSignModalProps> = ({
  closeModal,
  signList,
  setSignList,
}) => {
  const { setAlertData } = useAlertStore();

  const signCanvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  const [isPainting, setIsPainting] = useState(false);
  const [penColor, setPenColor] = useState("black");

  // 取得滑鼠 / 手指在畫布的位置
  const getPaintPosition = (e: any) => {
    const canvasSize = (canvas as HTMLCanvasElement).getBoundingClientRect();
    // 判斷是滑鼠還是手指
    if (e.type === "mousemove") {
      return {
        x: e.clientX - canvasSize.left,
        y: e.clientY - canvasSize.top,
      };
    }
    return {
      x: e.touches[0].clientX - canvasSize.left,
      y: e.touches[0].clientY - canvasSize.top,
    };
  };
  // 開始繪圖
  const startPosition = (e: any) => {
    e.preventDefault();
    setIsPainting(true);
  };
  // 結束繪圖
  const finishPosition = () => {
    setIsPainting(false);
    (ctx as CanvasRenderingContext2D).beginPath();
  };
  // 繪圖過程
  const drow = (e: any) => {
    if (!isPainting) return;
    const paintPosition = getPaintPosition(e);
    if (ctx !== null) {
      ctx.lineWidth = 1;
      ctx.lineCap = "round"; // 繪制圓形的結束線帽
      ctx.lineJoin = "round"; // 兩條線條交匯時，建立圓形邊角
      ctx.shadowBlur = 1; // 邊緣模糊，防止直線邊緣出現鋸齒
      ctx.shadowColor = penColor;
      ctx.strokeStyle = penColor;
      ctx.lineTo(paintPosition.x, paintPosition.y);
      ctx.stroke();
    }
  };
  // 重設畫布
  const reset = () => {
    if (ctx !== null && canvas !== null) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
  // 產生圖片
  const saveImg = () => {
    (canvas as HTMLCanvasElement).toBlob(
      (blob: any) => {
        const url = URL.createObjectURL(blob);
        setSignList([...signList, url]);
        // setSignList((pre: any[]) => {
        //   return [...pre, url];
        // });
      },
      "image/png",
      1,
    );

    closeModal();
    const alertData = {
      msg: "新增簽名檔成功",
      showAlert: true,
      bgColor: "bg-[#648D1EE5]",
      bdColor: "border-[#B7EC5D]",
    };
    setAlertData(alertData);
  };
  const changePenColor = (color = "black") => {
    if (color === "trash") {
      reset();
    } else {
      setPenColor(color);
    }
  };
  // 筆刷顏色
  const PenColors = () => {
    const colors = ["black", "blue", "red", "trash"];
    const colorsIcon = [penBlack, penBlue, penRed, trashIcon];
    const colors_h = [penBlack_h, penBlue_h, penRed_h, trashIcon_h];
    const map = colorsIcon.map((item, index) => {
      return (
        <button key={item} className="">
          <img
            src={item}
            alt=""
            className=""
            onMouseEnter={(e) => (e.currentTarget.src = colors_h[index])}
            onMouseLeave={(e) => (e.currentTarget.src = item)}
            onClick={() => changePenColor(colors[index])}
          />
        </button>
      );
    });
    return map;
  };

  // 設定初始化簽名畫布
  useEffect(() => {
    const w = window.innerWidth;
    const c = signCanvasRef.current;
    if (w > 768) {
      (c as HTMLCanvasElement).width = 460;
      (c as HTMLCanvasElement).height = 250;
    } else {
      (c as HTMLCanvasElement).width = 300;
      (c as HTMLCanvasElement).height = 180;
    }
    setCanvas(c);
    if (c) setCtx(c.getContext("2d"));
  }, [window.innerWidth]);

  return (
    <div className="fixed w-full h-full top-0 left-0 transition-all bg-black/50 flex items-center justify-center z-20">
      <div className="w-[90%] max-w-[530px] min-h-[261px] px-8 pt-4 pb-7 rounded-[40px] flex flex-col justify-between bg-white">
        <div className="w-full text-center pb-4 border-b border-b-[#B7EC5D]">
          建立簽名檔
        </div>
        <div className="bg-white flex flex-col items-center mt-10">
          <div className="mb-3">
            <PenColors></PenColors>
          </div>
          <canvas
            ref={signCanvasRef}
            onTouchStart={startPosition}
            onTouchEnd={finishPosition}
            onTouchCancel={finishPosition}
            onTouchMove={drow}
            onMouseDown={startPosition}
            onMouseUp={finishPosition}
            onMouseLeave={finishPosition}
            onMouseMove={drow}
            className="border rounded-2xl border-[#B3B3B3] bg-[#F5F5F5]"
          ></canvas>
        </div>
        <div className="grid gap-5 grid-cols-2 mt-10 mb-4">
          <button
            className="border border-[#808080] py-2 rounded-full"
            onClick={closeModal}
          >
            取消
          </button>
          <button
            className="border border-[#b3b3b3] bg-[#ccc] py-2 rounded-full"
            onClick={saveImg}
          >
            確定
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewSignModal;
