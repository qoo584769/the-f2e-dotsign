import jsPDF from "jspdf";

import Container from "../utils/Container";
import Navbar from "../components/Navbar/Navbar";
import FolderLayout from "../components/Folder/FolderLayout";
import FolderList from "../components/Folder/FolderList";

import { useFinalPDF } from "../store/useFileStore";

const FinishPage = () => {
  const { completedPDF } = useFinalPDF();

  const download = () => {
    const pdf = new jsPDF();
    const w = pdf.internal.pageSize.width;
    const h = pdf.internal.pageSize.height;
    pdf.addImage(completedPDF, "png", 0, 0, w, h);
    pdf.save("download.pdf");
  };

  return (
    <Container>
      <Navbar step="complete"></Navbar>
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
              <img src={completedPDF} alt="" className="block m-auto" />
            </div>
          </div>
        </div>
      </FolderLayout>
    </Container>
  );
};

export default FinishPage;
