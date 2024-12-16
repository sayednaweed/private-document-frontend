import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import {
  LanguageType,
  setLanguageDirection,
  supportedLangauges,
} from "@/lib/i18n";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";

export interface LanguageChangerProps {
  className?: string;
}

function LanguageChanger(props: LanguageChangerProps) {
  const { className } = props;
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const changeLanguageOnClick = async (language: string) => {
    try {
      const response = await axiosClient.get(`lang/${language}`);
      toast({
        toastType: "SUCCESS",
        description: response.data.message,
      });
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("Error"),
        description: error.response.data.message,
      });
    }
    const direction = language === "en" ? "ltr" : "rtl";
    localStorage.setItem(import.meta.env.VITE_LANGUAGE, language); // Store preference
    i18n.changeLanguage(language);
    setLanguageDirection(direction);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={`z-10 ${className}`}>
        <div className="rounded-full w-[40px] border flex justify-center py-[8px] bg-card cursor-pointer hover:opacity-85">
          <Languages className="text-md h-[16px] w-[16px] text-secondary-foreground pointer-events-none" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-10 rtl:[&>*]:text-md-rtl ltr:[&>*]:text-lg-ltr">
        <DropdownMenuLabel>
          <h1>{t("Choose a language")}</h1>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {supportedLangauges.map((item: LanguageType) => (
          <DropdownMenuItem
            className={`rtl:justify-end ${
              currentLanguage === item.code && "bg-slate-200 dark:bg-slate-900"
            }`}
            key={item.code}
            onClick={() => changeLanguageOnClick(item.code)}
          >
            {t(item.name)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default memo(LanguageChanger);
