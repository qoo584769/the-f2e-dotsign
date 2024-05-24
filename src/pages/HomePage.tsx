import { useState } from "react";
import jsPDF from "jspdf";

import { Link } from "react-router-dom";

import { useFolderStore } from "../store/useFolderTabStore";

import Container from "../utils/Container";
import Navbar from "../components/Navbar/Navbar";
import FolderLayout from "../components/Folder/FolderLayout";
import FolderList from "../components/Folder/FolderList";
import FolderTab from "../components/Folder/FolderTab";

import addIcon from "../assets/icon/ic_add_dark.svg";
import addTintIcon from "../assets/icon/ic_add_tint.svg";

import listIcon from "../assets/icon/ic_list.svg";
import listHIcon from "../assets/icon/ic_list_h.svg";

import cardIcon from "../assets/icon/ic_card.svg";
import cardHIcon from "../assets/icon/ic_card_h.svg";

import downloadHIcon from "../assets/icon/ic_download_h.svg";
import fileHIcon from "../assets/icon/ic_file_h.svg";
import archiveHIcon from "../assets/icon/ic_archive_h.svg";
import trashHIcon from "../assets/icon/ic_trash_h.svg";
import reductionHIcon from "../assets/icon/ic_reduction_h.svg";
import fileItemHIcon from "../assets/icon/ic_file_item_h.svg";

import downloadIcon from "../assets/icon/ic_download.svg";
import archiveIcon from "../assets/icon/ic_archive.svg";
import trashIcon from "../assets/icon/ic_trash.svg";
import reductionIcon from "../assets/icon/ic_reduction.svg";
import fileItemIcon from "../assets/icon/ic_file_item.svg";

const HomePage = () => {
  const {
    pdfList,
    archiveList,
    trashList,
    setPdfList,
    setArchiveList,
    setTrashList,
  } = useFolderStore();

  const [curTab, setCurTab] = useState("file");
  const [curShowStatus, setCurShowStatus] = useState("list");

  const localTime = (item: any) => {
    const [date, time] = new Date(item.updateDate)
      .toLocaleString("en-GB")
      .split(",");
    const [day, month, year] = date.split("/");

    return `${year}-${month}-${day} ${time}`;
  };

  // 下載檔案
  const downloadFile = (file: any, _updateDate: number) => {
    const pdf = new jsPDF();
    const w = pdf.internal.pageSize.width;
    const h = pdf.internal.pageSize.height;
    pdf.addImage(file.pdf, "png", 0, 0, w, h);
    pdf.save("download.pdf");
  };
  // 封存檔案
  const archiveFile = (file: any, updateDate: number) => {
    const data = [...archiveList, file];
    const filterData = pdfList.filter((item) => item.updateDate !== updateDate);
    setArchiveList(data);
    setPdfList(filterData);
  };
  // 垃圾桶檔案
  const trashFile = (file: any, updateDate: number) => {
    const data = [...trashList, file];
    const filterPdfData = pdfList.filter(
      (item) => item.updateDate !== updateDate,
    );
    const filterArchiveData = archiveList.filter(
      (item) => item.updateDate !== updateDate,
    );
    setArchiveList(filterArchiveData);
    setPdfList(filterPdfData);
    setTrashList(data);
  };
  // 回復檔案
  const reductionFile = (file: any, updateDate: number) => {
    const data = [...pdfList, file];
    const filterTrashData = trashList.filter(
      (item) => item.updateDate !== updateDate,
    );
    const filterArchiveData = archiveList.filter(
      (item) => item.updateDate !== updateDate,
    );
    setArchiveList(filterArchiveData);
    setTrashList(filterTrashData);
    setPdfList(data);
  };
  // 刪除檔案
  const deleteFile = (_file: any, updateDate: number) => {
    const filterTrashData = trashList.filter(
      (item) => item.updateDate !== updateDate,
    );
    setTrashList(filterTrashData);
  };

  const iconObj = {
    file: [
      [downloadIcon, downloadHIcon, downloadFile],
      [archiveIcon, archiveHIcon, archiveFile],
      [trashIcon, trashHIcon, trashFile],
    ],
    archive: [
      [reductionIcon, reductionHIcon, reductionFile],
      [trashIcon, trashHIcon, trashFile],
    ],
    trash: [
      [reductionIcon, reductionHIcon, reductionFile],
      [trashIcon, trashHIcon, deleteFile],
    ],
  };

  const FolderTabList = ({ list, iconObj }: any) => {
    const liMouseEnter = (
      e: React.MouseEvent<HTMLLIElement, MouseEvent>,
      src: string,
    ) => {
      e.stopPropagation();
      ((e.currentTarget as HTMLLIElement).firstChild as HTMLImageElement).src =
        src;
    };
    const liMouseLeave = (
      e: React.MouseEvent<HTMLLIElement, MouseEvent>,
      src: string,
    ) => {
      e.stopPropagation();
      ((e.currentTarget as HTMLLIElement).firstChild as HTMLImageElement).src =
        src;
    };
    const imgMouseEnter = (
      e: React.MouseEvent<HTMLImageElement, MouseEvent>,
      src: string,
    ) => {
      e.stopPropagation();
      (e.currentTarget as HTMLImageElement).src = src;
    };
    const imgMouseLeave = (
      e: React.MouseEvent<HTMLImageElement, MouseEvent>,
      src: string,
    ) => {
      e.stopPropagation();
      (e.currentTarget as HTMLImageElement).src = src;
    };

    if (!list.length) {
      return (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <Link to="upload">
            <img src={addIcon} alt="" className="" />
          </Link>
          <span className="block mt-7 text-4xl text-[#1e1e1e]">
            快來建立新檔吧
          </span>
        </div>
      );
    }

    return (
      <>
        <div className="px-4 pb-0 pt-4 flex flex-col relative">
          <div className="w-max absolute left-[100%] bottom-[100%] -translae-x-1/2 translate-y-1/2">
            <Link to="upload">
              <img
                src={addIcon}
                alt=""
                className="w-[80px] h-[80px]"
                onMouseEnter={(e) => imgMouseEnter(e, addTintIcon)}
                onMouseLeave={(e) => imgMouseLeave(e, addIcon)}
              />
            </Link>
          </div>
        </div>

        <ul className="px-8">
          <li className="grid grid-flow-col grid-rows-1 grid-cols-[fit-content(100px)_2fr_4fr_1fr]">
            {curShowStatus === "list" && (
              <>
                <img src={listIcon} alt="" className="invisible" />
                <div className="my-auto">建立時間</div>
                <div className="my-auto">專案名稱</div>
              </>
            )}
            <div className="col-span-4 flex justify-end">
              <img
                src={curShowStatus === "list" ? listHIcon : listIcon}
                alt=""
                className=""
                onClick={() => setCurShowStatus("list")}
              />
              <img
                src={curShowStatus === "card" ? cardHIcon : cardIcon}
                alt=""
                className=""
                onClick={() => setCurShowStatus("card")}
              />
            </div>
          </li>
        </ul>
        {curShowStatus === "card" ? (
          <div className="grid grid-flow-row grid-cols-1 gap-x-4 gap-y-5 px-4 py-2 md:grid-cols-4 overflow-y-auto">
            {list.map((listItem: any, index: any) => {
              return (
                <div
                  key={index}
                  className="p-4 flex flex-col items-center border rounded-2xl shadow-[0px_2px_8px_0px_rgba(215,215,215,0.4),0px_1px_5px_0px_rgba(179,179,179,0.4)] hover:border-1 hover:border-[#B7EC5D4D] hover:bg-gradient-to-t from-[#B7EC5D4D] via-[#B7EC5D1A] via-86.46% to-[#B7EC5D00)]"
                >
                  <div className="mb-4">
                    <img
                      src={listItem.pdf}
                      className="block m-auto w-1/3"
                      alt=""
                    />
                  </div>
                  <div className="">{listItem.name}</div>
                  <div className="">{localTime(listItem)}</div>
                  <div className="flex justify-end mt-4">
                    {iconObj.map((item: any, index: any) => {
                      return (
                        <img
                          key={index}
                          src={item[0]}
                          alt=""
                          className="cursor-pointer"
                          onMouseEnter={(e) => imgMouseEnter(e, item[1])}
                          onMouseLeave={(e) => imgMouseLeave(e, item[0])}
                          onClick={() => item[2](listItem, listItem.updateDate)}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-y-auto p-4 ">
            <ul className="grid grid-rows-1">
              {list.map((listItem: any) => {
                return (
                  <li
                    className=" box-border mb-4 last:mb-0 grid grid-cols-[fit-content(100px)_2fr_2fr_1fr] rounded-2xl border p-4 md:grid-cols-[fit-content(100px)_2fr_4fr_1fr] shadow-[0px_2px_8px_0px_rgba(215,215,215,0.4),0px_1px_5px_0px_rgba(179,179,179,0.4)] hover:border-1 hover:border-[#B7EC5D4D] hover:bg-gradient-to-t from-[#B7EC5D4D] via-[#B7EC5D1A] via-86.46% to-[#B7EC5D00)]"
                    onMouseEnter={(e) => liMouseEnter(e, fileItemHIcon)}
                    onMouseLeave={(e) => liMouseLeave(e, fileItemIcon)}
                  >
                    <img src={fileItemIcon} alt="" className="" />
                    <div className="my-auto">{localTime(listItem)}</div>
                    <div className="my-auto">{listItem.name}</div>
                    <div className="flex justify-end">
                      {iconObj.map((item: any, index: any) => {
                        return (
                          <img
                            key={index}
                            src={item[0]}
                            alt=""
                            className="cursor-pointer"
                            onMouseEnter={(e) => imgMouseEnter(e, item[1])}
                            onMouseLeave={(e) => imgMouseLeave(e, item[0])}
                            onClick={() =>
                              item[2](listItem, listItem.updateDate)
                            }
                          />
                        );
                      })}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </>
    );
  };

  const getProps = <T extends object, K extends keyof T>(obj: T, key: K) => {
    return obj[key];
  };

  const selectTab = (curTab: any) => {
    const data = {
      file: (
        <FolderTabList list={pdfList} iconObj={iconObj.file}></FolderTabList>
      ),
      archive: (
        <FolderTabList
          list={archiveList}
          iconObj={iconObj.archive}
        ></FolderTabList>
      ),
      trash: (
        <FolderTabList list={trashList} iconObj={iconObj.trash}></FolderTabList>
      ),
    };
    return getProps(data, curTab);
  };

  return (
    <Container>
      <Navbar step="home"></Navbar>
      <FolderLayout>
        <FolderList title="我的文件" finalPDF={() => {}}>
          <ul className="absolute flex max-[768px]:bottom-[100%] max-[768px]:left-[30px] md:flex-col md:right-[100%] gap-3">
            <li
              className={`flex justify-center items-center w-max h-max cursor-pointer shadow-[inset_-2px_0px_10px_rgba(0,0,0,0.25)] rounded-none rounded-t-full md:rounded-none md:rounded-l-full p-3 pb-1 md:p-4 md:pr-[10px] ${curTab === "file" ? "bg-white border-2 border-r-0 border-y-[#B7EC5D] border-l-[#B7EC5D]" : "bg-[#4d4d4d] border-2 border-r-0 border-y-[#4D4D4D] border-l-[#4D4D4D]"}`}
              onClick={() => setCurTab("file")}
            >
              <img src={fileHIcon} alt="" className="w-6 h-6 md:w-10 md:h-10" />
            </li>
            <li
              className={`flex justify-center items-center w-max h-max cursor-pointer shadow-[inset_-2px_0px_10px_0px_rgba(0,0,0,0.25)] rounded-none rounded-t-full md:rounded-none md:rounded-l-full p-3 pb-1 md:p-4 md:pr-[10px] ${curTab === "archive" ? "bg-white border-2 border-r-0 border-y-[#B7EC5D] border-l-[#B7EC5D]" : "bg-[#4d4d4d] border-2 border-r-0 border-y-[#4D4D4D] border-l-[#4D4D4D]"}`}
              onClick={() => setCurTab("archive")}
            >
              <img
                src={archiveHIcon}
                alt=""
                className="w-6 h-6 md:w-10 md:h-10"
              />
            </li>
            <li
              className={`flex justify-center items-center w-max h-max cursor-pointer shadow-[inset_-2px_0px_10px_0px_rgba(0,0,0,0.25)] rounded-none rounded-t-full md:rounded-none md:rounded-l-full p-3 pb-1 md:p-4 md:pr-[10px] ${curTab === "trash" ? "bg-white border-2 border-r-0 border-y-[#B7EC5D] border-l-[#B7EC5D]" : "bg-[#4d4d4d] border-2 border-r-0 border-y-[#4D4D4D] border-l-[#4D4D4D]"}`}
              onClick={() => setCurTab("trash")}
            >
              <img
                src={trashHIcon}
                alt=""
                className="w-6 h-6 md:w-10 md:h-10"
              />
            </li>
          </ul>
        </FolderList>

        {/* <div className="w-full h-full flex flex-col justify-center items-center">
          <Link to="upload">
            <img src={addIcon} alt="" className="" />
          </Link>
          <span className="block mt-7 text-4xl text-[#1e1e1e]">
            快來建立新檔吧
          </span>
        </div> */}

        {selectTab(curTab)}
      </FolderLayout>
    </Container>
  );
};

export default HomePage;
