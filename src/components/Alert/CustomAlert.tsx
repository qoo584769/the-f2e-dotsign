import { useEffect } from "react";

import { useAlertStore } from "../../store/useAlertStore";
import closeIcon from "../../assets/icon/ic_close_s_white.svg";

const CustomAlert = () => {
  const { alertData, setAlertData } = useAlertStore();
  useEffect(() => {
    const timer = setTimeout(() => {
      closeAlert();
    }, 2000);
    if (!alertData.showAlert) {
      clearTimeout(timer);
    }
  }, [alertData.msg, alertData.showAlert]);

  const closeAlert = () => {
    const data = {
      msg: "",
      showAlert: false,
    };
    setAlertData(data);
  };

  return (
    <>
      {alertData.showAlert && (
        <div className="pl-6 pr-2 border-2 border-[#B7EC5D] fixed top-[50px] left-2/4 -translate-x-2/4 md:absolute md:translate-y-5 rounded-full bg-[#648D1EE5] z-30">
          <span className="w-max text-white flex justify-center items-center">
            {alertData.msg}
            <img
              src={closeIcon}
              alt=""
              className="cursor-pointer"
              onClick={closeAlert}
            />
          </span>
        </div>
      )}
    </>
  );
};

export default CustomAlert;
