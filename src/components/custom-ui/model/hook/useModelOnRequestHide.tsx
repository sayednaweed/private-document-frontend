import { useContext } from "react";
import { ModelContext } from "../context/ModelContext";

export const useModelOnRequestHide = () => {
  const context = useContext(ModelContext);

  if (!context) {
    throw new Error("useOnRequestHide must be used inside the ModelContext");
  }
  const { modelOnRequestHide } = context;
  return { modelOnRequestHide };
};
