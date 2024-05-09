import jsPDF from "jspdf";

import Container from "../utils/Container";
import Navbar from "../components/Navbar/Navbar";
import FolderLayout from "../components/Folder/FolderLayout";
import FolderList from "../components/Folder/FolderList";

import { useFileContext } from "../store/FileContext";

const FinishPage = () => {
  const { finishPDF } = useFileContext();

  const download = () => {
    const pdf = new jsPDF();
    const w = pdf.internal.pageSize.width;
    const h = pdf.internal.pageSize.height;
    pdf.addImage(finishPDF as string, "png", 0, 0, w, h);
    pdf.save("download.pdf");
  };

  return (
    <Container>
      <Navbar></Navbar>
      <FolderLayout>
        <FolderList
          title="簽署完成"
          next={false}
          prePath="signature"
          nextPath="none"
          download={download}
        ></FolderList>
        <div className="flex-grow overflow-hidden mt-5">
          <div className="bg-[#bbb] max-w-[80%] flex flex-col h-full items-center m-auto">
            <div className="w-fit p-10 h-full overflow-scroll">
              <img src={finishPDF} alt="" className="block m-auto" />
            </div>
          </div>
        </div>
      </FolderLayout>
    </Container>
  );
};

export default FinishPage;
