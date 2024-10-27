import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Building, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import DepartmentTab from "./tabs/department/department-tab";
import LanguageTab from "./tabs/language/language-tab";
import JobTab from "./tabs/job/job-tab";

export default function SuperSettingsPage() {
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();

  return (
    <Tabs
      dir={direction}
      defaultValue="lang"
      className="flex flex-col items-center"
    >
      <TabsList className="!p-0 h-fit bg-card mt-2 overflow-x-auto overflow-y-hidden justify-start border border-primary/10 dark:border-primary/20">
        <TabsTrigger
          value="lang"
          className="gap-x-1 rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <Languages className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("Language")}
        </TabsTrigger>
        <TabsTrigger
          value="Depart"
          className="gap-x-1 rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <Building className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("department")}
        </TabsTrigger>
        <TabsTrigger
          value="job"
          className="gap-x-1 rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <Briefcase className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("job")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="lang" className="overflow-y-auto self-start w-1/2">
        <LanguageTab />
      </TabsContent>
      <TabsContent value="Depart" className="w-full px-4 pt-8">
        <DepartmentTab />
      </TabsContent>
      <TabsContent value="job" className="w-full px-4 pt-8">
        <JobTab />
      </TabsContent>
    </Tabs>
  );
}
