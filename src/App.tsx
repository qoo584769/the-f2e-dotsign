import { BrowserRouter, Route, Routes } from "react-router-dom";

import { FileContextProvider } from "./store/FileContext";

import "./App.css";

import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import SignaturePage from "./pages/SignaturePage";
import FinishPage from "./pages/FinishPage";
import NotFonudPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <FileContextProvider>
        <Routes>
          <Route path="/" element={<HomePage></HomePage>}></Route>
          <Route path="/upload" element={<UploadPage></UploadPage>}></Route>
          <Route
            path="/signature"
            element={<SignaturePage></SignaturePage>}
          ></Route>
          <Route path="/finish" element={<FinishPage></FinishPage>}></Route>
          <Route path="*" element={<NotFonudPage></NotFonudPage>}></Route>
        </Routes>
      </FileContextProvider>
    </BrowserRouter>
  );
}
{
  /* <div className="bg-[#333333] w-full h-screen">
  <Layout>
    <Navbar></Navbar>
    <FolderLayout>
      <FolderList></FolderList>
    </FolderLayout>
  </Layout>
</div> */
}

export default App;
