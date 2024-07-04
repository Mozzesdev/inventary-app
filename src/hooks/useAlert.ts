import { useContext } from "react";
import { AlertsContext, AlertType } from "./AlertsProvider";

export const useAlert = () => {
  const { addAlert, alerts, dismissAlert } = useContext(
    AlertsContext
  ) as AlertType;
  return { addAlert, alerts, dismissAlert };
};
