import { createContext } from "react";

interface StepperContextProps {
  userData: any;
  setUserData: any;
  handleDirection: any;
  error: Map<string, string>;
}
export const StepperContext = createContext<StepperContextProps>({
  userData: "",
  setUserData: () => {},
  handleDirection: (_direction: string) => {},
  error: new Map<string, string>(),
});
