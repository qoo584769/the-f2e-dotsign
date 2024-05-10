"use client";
import React, { useState, useContext, createContext } from "react";

interface ProviderProps {
  children?: React.ReactNode;
}
interface FileContext {
  uploadInfo: {
    file: { name?: "" };
    totalPages?: number | string | null;
    typedarray?: any;
  };
  setUploadInfo: React.Dispatch<React.SetStateAction<{ file: {} }>>;
  finishPDF: string;
  setFinishPDF: React.Dispatch<React.SetStateAction<string>>;
}
const FileContext = createContext<FileContext | null>(null);

export const FileContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const [uploadInfo, setUploadInfo] = useState({
    file: {},
  });
  const [finishPDF, setFinishPDF] = useState("");
  return (
    <FileContext.Provider
      value={{ uploadInfo, setUploadInfo, finishPDF, setFinishPDF }}
    >
      {children}
    </FileContext.Provider>
  );
};
export const useFileContext = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("context 必須在 context provider 裡面使用");
  }
  return context;
};
