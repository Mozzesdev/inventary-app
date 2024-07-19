let addAlertFunction;

export const setAddAlertFunction = (func) => {
  addAlertFunction = func;
};

export const addAlert = (alert) => {
  if (addAlertFunction) {
    addAlertFunction(alert);
  }
  console.log("alerting");
};
