import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  BaggageClaim,
  Briefcase,
  ClipboardMinus,
  Languages,
  MapPinHouse,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageTab from "./tabs/language/language-tab";
import JobTab from "./tabs/job/job-tab";
import UrgencyTab from "./tabs/urgency/urgency-tab";
import StatusTab from "./tabs/status/status-tab";
import SourceTab from "./tabs/source/source-tab";
import DocumentTypeTab from "./tabs/document-type/document-type-tab";
import DestinationTab from "./tabs/destination/destination-tab";

export default function SuperSettingsPage() {
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();

  return (
    <Tabs
      dir={direction}
      defaultValue="lang"
      className="flex flex-col items-center"
    >
      <TabsList className="px-0 pb-1 h-fit mt-2 flex-wrap overflow-x-auto overflow-y-hidden justify-center gap-y-1 gap-x-1">
        <TabsTrigger
          value="lang"
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <Languages className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("Language")}
        </TabsTrigger>
        <TabsTrigger
          value="job"
          className="gap-x-1 bg-card shadow  rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <Briefcase className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("job")}
        </TabsTrigger>
        <TabsTrigger
          value="urgency"
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <BaggageClaim className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("urgency")}
        </TabsTrigger>
        <TabsTrigger
          value="status"
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <Activity className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("status")}
        </TabsTrigger>
        <TabsTrigger
          value="source"
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("source")}
        </TabsTrigger>
        <TabsTrigger
          value="documenttype"
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <ClipboardMinus className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("documentType")}
        </TabsTrigger>
        <TabsTrigger
          value="destinationtype"
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("reference")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="lang" className="overflow-y-auto self-start w-1/2">
        <LanguageTab />
      </TabsContent>
      <TabsContent value="job" className="w-full px-4 pt-8">
        <JobTab />
      </TabsContent>
      <TabsContent value="urgency" className="w-full px-4 pt-8">
        <UrgencyTab />
      </TabsContent>
      <TabsContent value="status" className="w-full px-4 pt-8">
        <StatusTab />
      </TabsContent>
      <TabsContent value="source" className="w-full px-4 pt-8">
        <SourceTab />
      </TabsContent>
      <TabsContent value="documenttype" className="w-full px-4 pt-8">
        <DocumentTypeTab />
      </TabsContent>
      <TabsContent value="destinationtype" className="w-full px-4 pt-8">
        <DestinationTab />
      </TabsContent>
    </Tabs>
  );
}
