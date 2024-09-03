import React, { createContext, ReactNode, useEffect, useState } from "react";
import AlertsWrapper from "../components/AlertsWrapper";
import Alert from "../components/Alert";
import { setAddAlertFunction } from "../services/alerts.services";

export interface AlertType {
  alerts: any[];
  addAlert: (alert: Alert) => string;
  dismissAlert: (id: string) => void;
}

export const AlertsContext = createContext<AlertType | null>(null);

const AlertsProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = (alert: any) => {
    const id = crypto.randomUUID();
    setAlerts((prev) => [{ ...alert, id: id }, ...prev]);
    return id;
  };

  const dismissAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  useEffect(() => {
    setAddAlertFunction(addAlert);
  }, [addAlert]);

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, dismissAlert }}>
      <AlertsWrapper>
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            {...alert}
            handleDismiss={() => {
              dismissAlert(alert.id);
            }}
          />
        ))}
      </AlertsWrapper>
      {children}
    </AlertsContext.Provider>
  );
};

export default AlertsProvider;

export type Alert = {
  id?: string;
  severity: "info" | "success" | "warning" | "error";
  message: string;
  timeout: number;
  inner?: boolean;
  handleDismiss?: () => void;
};
