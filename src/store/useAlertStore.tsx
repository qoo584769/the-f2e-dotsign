import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type TAlertType = {
  msg: string;
  showAlert: boolean;
};
interface IAlertState {
  alertData: {
    msg: string;
    showAlert: boolean;
  };
  setAlertData: (data: TAlertType) => void;
}

export const useAlertStore = create<IAlertState>()(
  immer((set) => ({
    alertData: {
      msg: "",
      showAlert: false,
    },
    setAlertData: (data) =>
      set((state) => {
        state.alertData = { ...data };
      }),
  })),
);
