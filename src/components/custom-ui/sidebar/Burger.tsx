import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export interface BurgerProps {
  className?: string;
}
export default function Burger(props: BurgerProps) {
  const { className } = props;
  let [nastranSidebar, setNastranSidebar] = useState<{
    sidebar: HTMLDivElement;
    sidebarbg: HTMLDivElement;
  } | null>(null);
  const { i18n } = useTranslation();
  const direction = i18n.dir();
  useEffect(() => {
    // Select elements by class name
    const sidebar: any = document.getElementById("nastran_sidebar");
    const sidebarBg: any = document.getElementById("nastran_sidebar--bg");

    if (sidebar != null && sidebarBg != null) {
      // The first element with that className
      setNastranSidebar({
        sidebar: sidebar,
        sidebarbg: sidebarBg,
      });
    }
  }, []);
  const resizeSidebar = () => {
    if (direction == "ltr") {
      nastranSidebar!.sidebar!.style.left = "8px";
    } else {
      nastranSidebar!.sidebar!.style.right = "8px";
    }
    nastranSidebar!.sidebarbg!.style.display = "block";
  };
  return (
    <div className={cn("self-center flex-1 px-2 lg:hidden", className)}>
      <Menu
        onClick={resizeSidebar}
        className="size-[24px] hover:opacity-50 cursor-pointer self-center"
      />
    </div>
  );
}
