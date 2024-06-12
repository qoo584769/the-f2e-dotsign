import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type TUploadInfo = {
  file: File | null;
  typedarray: Uint8Array | number[] | null;
  totalPages: number | null;
};

interface IUploadState {
  uploadInfo: TUploadInfo;
  setUploadInfo: (data: Partial<TUploadInfo>) => void;
}

interface IFinishPDFState {
  completedPDF: string;
  setCompletedPDF: (data: string) => void;
}

interface ISignState {
  signList: string[];
  setSignList: (data: string[]) => void;
}

interface ITextState {
  textList: string[];
  setTextList: (data: string[]) => void;
}

interface IImageState {
  imgList: string[];
  setImgList: (data: string[]) => void;
}

export const useFileStore = create<IUploadState>()(
  immer((set) => ({
    uploadInfo: {
      file: null,
      totalPages: null,
      typedarray: null,
    },
    setUploadInfo: (data) =>
      set((state) => {
        state.uploadInfo = { ...state.uploadInfo, ...data };
      }),
  })),
);

export const useFinalPDF = create<IFinishPDFState>()(
  immer((set) => ({
    completedPDF: "",
    setCompletedPDF: (data) =>
      set((state) => {
        state.completedPDF = data;
      }),
  })),
);

export const useToolbarStore = create<ISignState & ITextState & IImageState>()(
  immer((set) => ({
    signList: [],
    textList: [],
    imgList: [],

    setSignList: (data) =>
      set((state) => {
        state.signList = [...data];
      }),
    setTextList: (data) =>
      set((state) => {
        state.textList = [...data];
      }),
    setImgList: (data) =>
      set((state) => {
        state.imgList = [...data];
      }),
  })),
);
