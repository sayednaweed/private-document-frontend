import { Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { memo } from "react";
import { useTheme } from "@/context/theme-provider";
import { useTranslation } from "react-i18next";

function ThemeChanger() {
  const { setTheme, theme } = useTheme();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="z-10 shadow-sm">
        <div className="rounded-full w-[40px] border flex justify-center py-[8px] bg-card cursor-pointer hover:opacity-85">
          <Sun className="h-[16px] w-[16px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[16px] w-[16px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-10 rtl:text-md-rtl ltr:text-lg-ltr"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`rtl:justify-end ${
            theme == "light" ? " bg-slate-200 dark:bg-slate-900" : ""
          }`}
        >
          {t("Light")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`rtl:justify-end ${
            theme == "dark" ? " bg-slate-200 dark:bg-slate-900" : ""
          }`}
        >
          {t("Dark")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`rtl:justify-end ${
            theme == "system" ? " bg-slate-200 dark:bg-slate-900" : ""
          }`}
        >
          {t("System")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default memo(ThemeChanger);
