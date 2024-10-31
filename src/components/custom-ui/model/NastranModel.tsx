import React, { useEffect } from "react";
import { useState } from "react";

import NastranCard, { ModelSize } from "./NastranCard";
import { ModelContextProvider } from "./context/ModelContext";
import { cn } from "@/lib/utils";

export interface INastranModelProps {
  button: any;
  children?: any;
  isDismissable: boolean;
  size: ModelSize;
  visible?: boolean;
  showDialog: () => Promise<boolean>;
  className?: string;
}

const NastranModel: React.FunctionComponent<INastranModelProps> = ({
  visible,
  ...props
}) => {
  const [modelVisible, setModelVisible] = useState(false);
  const { children, isDismissable, button, size, showDialog, className } =
    props;
  const dismissOnClick = () => {
    if (isDismissable) setModelVisible(false);
  };
  useEffect(() => {
    if (visible != undefined) setModelVisible(visible);
  }, [visible]);
  const buttonOnClick = async () => {
    const allowed = await showDialog();
    if (!allowed) return;
    setModelVisible(!modelVisible);
  };
  const mapButton = React.Children.map(button, (el) => {
    return React.cloneElement(el, {
      onClick: buttonOnClick,
    });
  });
  return (
    <>
      {button && !modelVisible ? (
        mapButton
      ) : (
        <ModelContextProvider modelOnRequestHide={buttonOnClick}>
          <div
            onClick={dismissOnClick}
            // className="fixed z-40 grid grid-cols-1 justify-items-center content-center overflow-y-auto left-0 top-0 h-screen w-screen [backdrop-filter:blur(10px)]"
            className={cn(
              "fixed z-40 grid grid-cols-1 justify-items-center items-center overflow-y-auto left-0 top-0 h-screen w-screen [backdrop-filter:blur(10px)]",
              className
            )}
          >
            <NastranCard size={size}>{children}</NastranCard>
          </div>
        </ModelContextProvider>
      )}
    </>
  );
};

export default NastranModel;
