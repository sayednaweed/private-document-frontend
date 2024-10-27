import ThemeSwitch from "./ThemeChanger";
import ProfileDropdown from "./ProfileDropdown";
import Notification from "./Notification";
import { useAuthState } from "@/context/AuthContextProvider";
import Burger from "../sidebar/Burger";

export default function DashboardNavbar() {
  const { loading, authenticated } = useAuthState();
  if (loading) return;
  return (
    <div
      className={`flex z-10 items-center ltr:pr-6 rtl:pl-4 py-1 border-b border-primary/5 bg-[rgba(0,0,0,0)] backdrop-blur-[10px] sticky justify-end top-0 gap-x-1`}
    >
      {authenticated && (
        <>
          <Burger />
          <Notification />
          <ProfileDropdown root={"Visit Site"} rootPath="/" />
        </>
      )}

      <ThemeSwitch />
    </div>
  );
}
