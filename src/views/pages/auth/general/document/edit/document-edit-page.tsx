import { Link, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AnimHomeIcon from "@/components/custom-ui/icons/AnimHomeIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, FileScan, UserRound } from "lucide-react";
import { useAuthState } from "@/context/AuthContextProvider";
import { SECTION_NAMES } from "@/lib/constants";
import { UserPermission } from "@/database/tables";
import EditDocumentInformation from "./steps/tabs/edit-document-information";
import { EditDocumentProgress } from "./steps/tabs/edit-document-progress";
import { EditDocumentScan } from "./steps/tabs/edit-document-scan";

export default function DocumentEditPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuthState();
  let { id } = useParams();
  const direction = i18n.dir();

  const permission = user.permissions.get(
    SECTION_NAMES.documents
  ) as UserPermission;
  return (
    <div className="flex flex-col px-3 mt-2">
      <Breadcrumb className="rtl:text-2xl-rtl ltr:text-xl-ltr bg-card w-fit py-1 px-3 rounded-md border">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/dashboard">
              <AnimHomeIcon className=" text-primary" />
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="rtl:rotate-180" />
          <BreadcrumbItem
            onClick={() => navigate("/documents", { replace: true })}
            className="cursor-pointer"
          >
            <BreadcrumbPage className="text-primary/75">
              {t("documents")}
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="rtl:rotate-180" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-tertiary">{id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* Cards */}
      <Tabs
        dir={direction}
        defaultValue="information"
        className="flex flex-col items-center"
      >
        <TabsList className="px-0 pb-1 h-fit flex-wrap overflow-x-auto overflow-y-hidden justify-center gap-y-1 gap-x-1">
          <TabsTrigger
            value="information"
            className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr rtl:py-[2px] rtl:px-3 data-[state=active]:bg-primary data-[state=active]:text-tertiary"
          >
            <Database className="size-[18px]" />
            {t("information")}
          </TabsTrigger>
          <TabsTrigger
            value="reference"
            className="gap-x-1 bg-card shadow  rtl:text-2xl-rtl ltr:text-xl-ltr rtl:py-[2px] rtl:px-3 data-[state=active]:bg-primary data-[state=active]:text-tertiary"
          >
            <UserRound className="size-[18px]" />
            {t("progress")}
          </TabsTrigger>
          <TabsTrigger
            value="scan"
            className="gap-x-1 bg-card shadow  rtl:text-2xl-rtl ltr:text-xl-ltr rtl:py-[2px] rtl:px-3 data-[state=active]:bg-primary data-[state=active]:text-tertiary"
          >
            <FileScan className="size-[18px]" />
            {t("scan")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="information" className="w-full px-4 pt-11">
          <EditDocumentInformation permission={permission} id={id} />
        </TabsContent>
        <TabsContent value="reference" className="w-full px-4 pt-11">
          <EditDocumentProgress permission={permission} id={id} />
        </TabsContent>
        <TabsContent value="scan" className="w-full px-4 pt-11">
          <EditDocumentScan permission={permission} id={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
