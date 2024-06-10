import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type TAlertType = {
  msg: string;
  showAlert: boolean;
  bgColor: string;
  bdColor: string;
};
interface IAlertState {
  alertData: {
    msg: string;
    showAlert: boolean;
    bgColor: string;
    bdColor: string;
  };
  setAlertData: (data: TAlertType) => void;
}

export const useAlertStore = create<IAlertState>()(
  immer((set) => ({
    alertData: {
      msg: "",
      showAlert: false,
      bgColor: "",
      bdColor: "",
    },
    setAlertData: (data) =>
      set((state) => {
        state.alertData = { ...data };
      }),
  })),
);
