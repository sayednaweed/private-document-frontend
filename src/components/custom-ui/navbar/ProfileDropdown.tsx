import { memo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router";
import { useAuthState } from "@/context/AuthContextProvider";
import { useTranslation } from "react-i18next";
import CachedImage from "../image/CachedImage";
import { User2 } from "lucide-react";
export interface ProfileDropdownProps {
  root: string;
  rootPath: string;
}
function ProfileDropdown(props: ProfileDropdownProps) {
  const { root, rootPath } = props;
  const { user, logout } = useAuthState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="z-10 cursor-pointer ">
        <div>
          <CachedImage
            fallback={<User2 className="size-[18px]" />}
            src={user?.profile}
            alt="Avatar"
            iconClassName="size-[18px]"
            loaderClassName="size-[36px] ltr:mr-8 rtl:ml-8 shadow-lg border border-tertiary rounded-full size-[36px] select-none"
            className="size-[36px] ltr:mr-8 rtl:ml-8 object-center object-cover shadow-lg border border-tertiary  rounded-full"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-10 rtl:text-end rtl:[&>*]:text-md-rtl ltr:[&>*]:text-lg-ltr">
        <DropdownMenuLabel>
          <h1>{t("Signed in as")}</h1>
          <h1 className="text-[14px] ">{user?.username}</h1>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => navigate("/profile")}
        >
          {t("Profile")}
          <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => navigate(rootPath)}
        >
          {t(root)}
          <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            await logout();
            navigate("/login", { replace: true });
          }}
        >
          {t("Log out")}
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default memo(ProfileDropdown);
