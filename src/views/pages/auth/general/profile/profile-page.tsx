import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AnimHomeIcon from "@/components/custom-ui/icons/AnimHomeIcon";
import { useAuthState } from "@/context/AuthContextProvider";
import EditProfileInformation from "./steps/edit-profile-information";
import { EditProfilePassword } from "./steps/edit-profile-password";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, KeyRound } from "lucide-react";
import ProfileHeader from "./profile-header";

export default function ProfilePage() {
  const { user } = useAuthState();
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();

  const selectedTabStyle = `after:duration-500 data-[state=active]:after:opacity-100 after:opacity-0 data-[state=active]:after:translate-x-0
                            ltr:after:translate-x-[-20px] rtl:after:translate-x-[20px] after:transition-[transform,opacity] data-[state=active]:after:content-[""] data-[state=active]:after:absolute ltr:after:rotate-180 data-[state=active]:after:top-0 data-[state=active]:after:w-0 data-[state=active]:after:h-full rtl:data-[state=active]:after:left-[-17px]  ltr:data-[state=active]:after:right-[-17px] 
                      data-[state=active]:after:border-b-[19px] data-[state=active]:after:border-b-transparent 
                      data-[state=active]:after:border-t-[18px] data-[state=active]:after:border-t-transparent 
                     data-[state=active]:after:border-r-[19px] data-[state=active]:after:border-r-tertiary relative
                     w-[95%] ltr:py-2 rtl:py-[5px] bg-card-foreground/5 data-[state=active]:bg-tertiary font-semibold data-[state=active]:text-primary-foreground gap-x-3 justify-start`;
  return (
    <div className="flex flex-col gap-y-6 px-3 mt-2">
      <Breadcrumb className="rtl:text-2xl-rtl ltr:text-xl-ltr">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/dashboard">
              <AnimHomeIcon className=" text-primary" />
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="rtl:rotate-180" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-primary/75">
              {t("Profile")}
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="rtl:rotate-180" />
          <BreadcrumbItem>
            <BreadcrumbPage>{user?.username}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* Cards */}
      <Tabs
        dir={direction}
        defaultValue="Account"
        className="flex flex-col sm:flex-row gap-x-3 mt-2 gap-y-2 sm:gap-y-0"
      >
        <TabsList className="min-h-fit sm:min-h-[80vh] overflow-y-auto pb-8 sm:w-[300px] gap-y-4 items-start justify-start flex flex-col bg-card border">
          <ProfileHeader />
          <TabsTrigger
            className={`mt-6 rtl:text-2xl-rtl ltr:text-2xl-ltr  ${selectedTabStyle}`}
            value="Account"
          >
            <Database className="size-[18px]" />
            {t("Account information")}
          </TabsTrigger>
          <TabsTrigger
            className={`rtl:text-2xl-rtl ltr:text-2xl-ltr ${selectedTabStyle}`}
            value="password"
          >
            <KeyRound className="size-[18px]" />
            {t("Update account password")}
          </TabsTrigger>
        </TabsList>
        <TabsContent className="flex-1 m-0" value="Account">
          <EditProfileInformation />
        </TabsContent>
        <TabsContent className="flex-1 m-0" value="password">
          <EditProfilePassword />
        </TabsContent>
      </Tabs>
    </div>
  );
}
