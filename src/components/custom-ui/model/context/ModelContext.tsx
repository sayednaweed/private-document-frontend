import { createContext } from "react";

interface IModelContext {
  modelOnRequestHide: () => void;
}

const initialState: IModelContext = {
  modelOnRequestHide: () => {},
};

export const ModelContext = createContext<IModelContext>(initialState);
export interface IModelContextProviderProps {
  children: any;
  modelOnRequestHide: () => void;
}
export const ModelContextProvider = (props: IModelContextProviderProps) => {
  const { children, modelOnRequestHide } = props;

  return (
    <ModelContext.Provider value={{ modelOnRequestHide }}>
      {children}
    </ModelContext.Provider>
  );
};
