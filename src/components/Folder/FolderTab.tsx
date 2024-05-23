import fileIcon from "../../assets/icon/ic_file_h.svg";
import archiveIcon from "../../assets/icon/ic_archive_h.svg";
import trashIcon from "../../assets/icon/ic_trash_h.svg";

const FolderTab = () => {
  return (
    <ul className="absolute right-[100%]">
      <li className="">
        123
        <img src={fileIcon} alt="" className="block w-10 h-10" />
      </li>
      <li className="">
        <img src={archiveIcon} alt="" className="block" />
      </li>
      <li className="">
        <img src={trashIcon} alt="" className="block" />
      </li>
    </ul>
  );
};

export default FolderTab;
