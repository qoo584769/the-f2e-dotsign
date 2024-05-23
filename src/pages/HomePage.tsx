import { useEffect, useState } from "react";
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
import cardIcon from "../assets/icon/ic_card.svg";

import downloadHIcon from "../assets/icon/ic_download_h.svg";
import fileHIcon from "../assets/icon/ic_file_h.svg";
import archiveHIcon from "../assets/icon/ic_archive_h.svg";
import trashHIcon from "../assets/icon/ic_trash_h.svg";
import reductionHIcon from "../assets/icon/ic_reduction_h.svg";
import fileItemHIcon from "../assets/icon/ic_file_item_h.svg";

import downloadIcon from "../assets/icon/ic_download.svg";
import fileIcon from "../assets/icon/ic_file.svg";
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
      [trashIcon, trashHIcon, trashFile],
    ],
  };

  const FolderTabList = ({ list, iconObj }: any) => {
    const mouseEnter = (
      e: React.MouseEvent<HTMLImageElement, MouseEvent>,
      src: string,
    ) => {
      (e.target as HTMLImageElement).src = src;
    };
    const mouseLeave = (
      e: React.MouseEvent<HTMLImageElement, MouseEvent>,
      src: string,
    ) => {
      (e.target as HTMLImageElement).src = src;
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
                onMouseEnter={(e) => mouseEnter(e, addTintIcon)}
                onMouseLeave={(e) => mouseLeave(e, addIcon)}
              />
            </Link>
          </div>
          <table className="grow w-full table-fixed border-separate border-spacing-0 text-left">
            <thead className="">
              <tr className="">
                <td className="pl-5 pr-3 w-max ">
                  <img src={fileHIcon} alt="" className="block invisible" />
                </td>
                <td className="w-1/5">建立時間</td>
                <td className="">專案名稱</td>
                <td className="pr-6 flex justify-end">
                  <img src={listIcon} alt="" className="" />
                  <img src={cardIcon} alt="" className="" />
                </td>
              </tr>
            </thead>
          </table>
        </div>

        <div className="p-4 pt-0 flex flex-col overflow-y-auto">
          <table className="grow w-full table-fixed border-separate border-spacing-y-4 text-left">
            <thead className="">
              <tr className="">
                <td className="pl-4 pr-3 w-max border-l border-y rounded-l-2xl">
                  <img src={fileItemIcon} alt="" className="" />
                </td>
                <td className="w-1/5 border-y">{localTime(list[0])}</td>
                <td className="border-y">{list[0].name}</td>
                <td className="py-4 pr-6 border-r border-y rounded-r-2xl flex justify-end">
                  {iconObj.map((item: any, index: any) => {
                    return (
                      <img
                        key={index}
                        src={item[0]}
                        alt=""
                        className="cursor-pointer"
                        onMouseEnter={(e) => mouseEnter(e, item[1])}
                        onMouseLeave={(e) => mouseLeave(e, item[0])}
                        onClick={() => item[2](list[0], list[0].updateDate)}
                      />
                    );
                  })}
                </td>
              </tr>
            </thead>

            <tbody className="">
              {list
                .filter((_item: any, index: number) => index !== 0)
                .map((listItem: any) => {
                  return (
                    <>
                      <tr key={listItem.updateDate} className="">
                        <td className="pl-4 py-4 border-l border-y rounded-l-2xl">
                          <img src={fileItemIcon} alt="" className="" />
                        </td>
                        <td className="border-y">{localTime(listItem)}</td>
                        <td className="border-y">{listItem.name}</td>
                        <td className="py-4 pr-6 border-r border-y rounded-r-2xl flex justify-end">
                          {iconObj.map((item: any, index: any) => {
                            return (
                              <img
                                key={index}
                                src={item[0]}
                                alt=""
                                className="cursor-pointer"
                                onMouseEnter={(e) => mouseEnter(e, item[1])}
                                onMouseLeave={(e) => mouseLeave(e, item[0])}
                                onClick={() =>
                                  item[2](listItem, listItem.updateDate)
                                }
                              />
                            );
                          })}
                        </td>
                      </tr>
                    </>
                  );
                })}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const FileTab = () => {
    return (
      <FolderTabList list={pdfList} iconObj={iconObj.file}></FolderTabList>
    );
  };

  const ArchiveTab = () => {
    return (
      <FolderTabList
        list={archiveList}
        iconObj={iconObj.archive}
      ></FolderTabList>
    );
  };

  const TrashTab = () => {
    return (
      <FolderTabList list={trashList} iconObj={iconObj.trash}></FolderTabList>
    );
  };

  const getProps = <T extends object, K extends keyof T>(obj: T, key: K) => {
    return obj[key];
  };

  const selectTab = (curTab: any) => {
    const data = {
      file: <FileTab></FileTab>,
      archive: <ArchiveTab></ArchiveTab>,
      trash: <TrashTab></TrashTab>,
    };
    return getProps(data, curTab);
  };

  return (
    <Container>
      <Navbar step="home"></Navbar>
      <FolderLayout>
        <FolderList title="我的文件" finalPDF={() => {}}>
          <ul className="absolute flex md:flex-col md:right-[100%] gap-3">
            <li
              className={`w-max cursor-pointer shadow-[inset_-2px_0px_10px_rgba(0,0,0,0.25)] rounded-none rounded-t-full md:rounded-none md:rounded-l-full p-4 pr-[10px] ${curTab === "file" ? "bg-white border-2 border-r-0 border-y-[#B7EC5D] border-l-[#B7EC5D]" : "bg-[#4d4d4d] border-2 border-r-0 border-y-[#4D4D4D] border-l-[#4D4D4D]"}`}
              onClick={() => setCurTab("file")}
            >
              <img src={fileHIcon} alt="" className="" />
            </li>
            <li
              className={`w-max cursor-pointer shadow-[inset_-2px_0px_10px_0px_rgba(0,0,0,0.25)] rounded-none rounded-t-full md:rounded-none md:rounded-l-full p-4 pr-[10px] ${curTab === "archive" ? "bg-white border-2 border-r-0 border-y-[#B7EC5D] border-l-[#B7EC5D]" : "bg-[#4d4d4d] border-2 border-r-0 border-y-[#4D4D4D] border-l-[#4D4D4D]"}`}
              onClick={() => setCurTab("archive")}
            >
              <img src={archiveHIcon} alt="" className="" />
            </li>
            <li
              className={`w-max cursor-pointer shadow-[inset_-2px_0px_10px_0px_rgba(0,0,0,0.25)] rounded-none rounded-t-full md:rounded-none md:rounded-l-full p-4 pr-[10px] ${curTab === "trash" ? "bg-white border-2 border-r-0 border-y-[#B7EC5D] border-l-[#B7EC5D]" : "bg-[#4d4d4d] border-2 border-r-0 border-y-[#4D4D4D] border-l-[#4D4D4D]"}`}
              onClick={() => setCurTab("trash")}
            >
              <img src={trashHIcon} alt="" className="" />
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
