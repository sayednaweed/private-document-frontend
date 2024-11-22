import ThemeSwitch from "./ThemeChanger";
import ProfileDropdown from "./ProfileDropdown";
import { useAuthState } from "@/context/AuthContextProvider";
import LanguageChanger from "./LanguageChanger";
import { Link } from "react-router";
import Notification from "./Notification";
import { useTranslation } from "react-i18next";

export default function SiteNavbar() {
  const { loading, authenticated } = useAuthState();
  const { t } = useTranslation();

  if (loading) return;
  return (
    <div
      className={`flex z-10 items-center ltr:pr-6 rtl:pl-4 py-1 border-b border-primary/5 bg-[rgba(0,0,0,0)] backdrop-blur-[10px] sticky top-0 justify-end gap-x-1`}
    >
      {authenticated ? (
        <>
          <Notification />
          <ProfileDropdown root={"dashboard"} rootPath="/dashboard" />
        </>
      ) : (
        <div className="flex justify-start px-8 items-center gap-x-3 w-full rtl:text-md-rtl ltr:text-lg-ltr">
          <Link
            to="/login"
            className="bg-card border border-tertiary hover:bg-tertiary duration-300 transition-all hover:text-primary-foreground rounded-full py-1 px-4 font-semibold"
          >
            {t("Login")}
          </Link>
        </div>
      )}

      <ThemeSwitch />
      <LanguageChanger />
    </div>
  );
}
