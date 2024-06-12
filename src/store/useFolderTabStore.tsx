import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type TPDFList = {
  pdf: string;
  updateDate: number;
  name: string | undefined;
  status?: string;
};

interface IFolderTabState {
  pdfList: TPDFList[];
  archiveList: TPDFList[];
  trashList: TPDFList[];

  setPdfList: (data: TPDFList[]) => void;
  setArchiveList: (data: TPDFList[]) => void;
  setTrashList: (data: TPDFList[]) => void;
}

export const useFolderStore = create<IFolderTabState>()(
  immer((set) => ({
    pdfList: [],
    archiveList: [],
    trashList: [],

    setPdfList: (data) =>
      set((state) => {
        state.pdfList = [...data];
      }),
    setArchiveList: (data) =>
      set((state) => {
        state.archiveList = [...data];
      }),
    setTrashList: (data) =>
      set((state) => {
        state.trashList = [...data];
      }),
  })),
);
