import { type Alert } from "../hooks/AlertsProvider";

let addAlertFunction;

export const setAddAlertFunction = (func) => {
  addAlertFunction = func;
};

export const addAlert = (alert: Alert) => {
  if (addAlertFunction) {
    addAlertFunction(alert);
  }
};
