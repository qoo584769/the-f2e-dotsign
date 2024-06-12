import { HashRouter, Route, Routes } from "react-router-dom";

import { FileContextProvider } from "./store/FileContext";
import CustomAlert from "./components/Alert/CustomAlert";
import "./App.css";

import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import SignaturePage from "./pages/SignaturePage";
import FinishPage from "./pages/FinishPage";
import NotFonudPage from "./pages/NotFoundPage";

function App() {
  return (
    <HashRouter>
      <FileContextProvider>
        <CustomAlert></CustomAlert>
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
    </HashRouter>
  );
}

export default App;
