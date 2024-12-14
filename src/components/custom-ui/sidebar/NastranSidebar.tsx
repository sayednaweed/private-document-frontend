import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { useAuthState } from "@/context/AuthContextProvider";
import NetworkSvg from "../image/NetworkSvg";
import { SECTION_NAMES } from "@/lib/constants";
import { X } from "lucide-react";

export default function NastranSidebar() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthState();
  const direction = i18n.dir();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const bgSidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const activeTab = location.pathname;
  const [data, setData] = useState<JSX.Element[]>([]);
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    // resizeSidebar();
    navigate(path, { replace: true });
  };

  useEffect(() => {
    if (user?.permissions != undefined) {
      let items: JSX.Element[] = [];
      for (const [key, value] of user?.permissions) {
        const path = `/${value.permission}`;
        const active = activeTab === "/" ? `/dashboard` : activeTab;
        const isActive = active.startsWith(path);

        if (value.permission == SECTION_NAMES.settings)
          items.push(
            <Separator className="opacity-90 my-4 relative" key="Separator" />
          );

        items.push(
          <div
            onClick={() => navigateTo(path)}
            className={`flex gap-x-3 cursor-pointer items-center py-[8px] mx-2 rounded-[8px] ${
              isActive
                ? " bg-blue-500/30 text-tertiary font-semibold ltr:text-lg-ltr rtl:text-3xl-rtl"
                : "hover:opacity-75 rtl:text-xl-rtl ltr:text-md-ltr"
            }`}
            key={key}
          >
            <NetworkSvg src={"media/" + value.icon} />
            <h1 className="truncate">{t(key)}</h1>
          </div>
        );
      }
      setData(items);
    }
  }, [location.pathname, direction]);
  const resizeSidebar = () => {
    if (direction == "ltr") {
      sidebarRef.current!.style.left = "-300px";
    } else {
      sidebarRef.current!.style.right = "-300px";
    }
    bgSidebarRef.current!.style.display = "none";
  };
  return (
    <>
      <div
        onClick={resizeSidebar}
        ref={bgSidebarRef}
        className="absolute z-20 transition-[display] duration-1000 hidden lg:!hidden top-0 left-0 w-screen h-screen bg-primary/25"
        id="nastran_sidebar--bg"
      />
      <nav
        ref={sidebarRef}
        id="nastran_sidebar"
        className={`z-20 bg-primary dark:bg-card dark:text-card-foreground text-primary-foreground overflow-auto absolute lg:relative top-[50%] lg:top-0 ltr:left-[-300px] ltr:lg:!left-0 rtl:lg:!right-0 rtl:right-[-300px] translate-y-[-50%] lg:translate-y-0 rounded-[12px] lg:rounded-none h-[98vh] lg:h-screen w-[240px] dark:border-primary/10`}
      >
        <X
          className="size-[18px] lg:hidden text-primary mt-2 ltr:ml-2 rtl:mr-2 cursor-pointer"
          onClick={resizeSidebar}
        />
        {/* Header */}
        <div className="flex items-center gap-x-4 pb-2 mb-8 ltr:pl-3 rtl:pr-3 lg:pt-1 border-b border-secondary/5">
          <img
            src="http://127.0.0.1:8000/images/app-logo.png"
            className="size-[56px] text-primary/70 max-h-[76px] rounded-lg max-w-[76px]"
          />

          <h1 className="line-clamp-1 ltr:text-xl-ltr rtl:text-3xl-rtl font-semibold text-center">
            {t("App Name")}
          </h1>
        </div>
        {/* Body */}
        {data}
      </nav>
    </>
  );
}
