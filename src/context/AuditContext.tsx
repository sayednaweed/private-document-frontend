import { Audit } from "@/database/tables";
import React from "react";
import { createContext, useContext, useState } from "react";

type AuditProviderProps = {
  children: React.ReactNode;
};
const defaultValue: Audit = {
  id: "",
  username: "",
  role: "",
  table: "",
  action: "",
  device: "",
  department: "",
  job: "",
  name: "",
  status: "",
  ipaddress: "",
  date: "",
};

type AuditProviderState = {
  audit: Audit;
  setAudit: (audit: Audit) => void;
};

const initialState: AuditProviderState = {
  audit: defaultValue,
  setAudit: () => null,
};

const AuditProviderContext = createContext<AuditProviderState>(initialState);

export function AuditProvider({ children, ...props }: AuditProviderProps) {
  const [audit, setAudit] = useState<Audit>(defaultValue);

  return (
    <AuditProviderContext.Provider
      {...props}
      value={{
        audit: audit,
        setAudit: setAudit,
      }}
    >
      {children}
    </AuditProviderContext.Provider>
  );
}

export const useReport = () => {
  const context = useContext(AuditProviderContext);

  if (context === undefined)
    throw new Error("useAudit must be used within a AuditProvider");

  return context;
};
