import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, CircleX } from "lucide-react";
import CustomMultiDatePicker from "@/components/custom-ui/DatePicker/CustomMultiDatePicker";
import { DateObject } from "react-multi-date-picker";
import TableContent from "./TableContent";
import DropMenu from "./DropMenu";
import { documentStatusData, documentTypeData } from "./dummy-data";

export default function SuperReportsPage() {
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();

  const [dates, setDates] = useState<DateObject[]>([]);
  const handleClearButton = () => {
    setDates([]);
  };

  const [activeTab, setActiveTab] = useState<string>("Status"); // Track the active tab

  let dateOnComplete = (selectedDates: DateObject[]) => {
    setDates(selectedDates);
  };

  return (
    <>
      <Card className="ml-2 mr-2 py-12">
        <CardContent className="flex justify-between items-center gap-x-4">
          <div className="flex gap-x-4 items-baseline">
            <CustomMultiDatePicker
              value={dates}
              dateOnComplete={dateOnComplete}
            />
            {/* Conditionally render dropdowns based on active tab */}
            {activeTab !== "Type" && (
              <DropMenu label="Types" list={documentTypeData} />
            )}
            {activeTab !== "Status" && (
              <DropMenu label="Status" list={documentTypeData} />
            )}
            {activeTab !== "Urgencey" && (
              <DropMenu label="Urgency" list={documentTypeData} />
            )}
            {activeTab !== "Source" && (
              <DropMenu label="Source" list={documentStatusData} />
            )}
          </div>
          <div className="ltr:border-l rtl:border-r ltr:pl-6 rtl:pr-6 flex flex-col gap-y-4">
            <Button onClick={handleClearButton} variant="outline">
              <CircleX />
              Clear
            </Button>
            <Button
              onClick={handleClearButton}
              variant="outline"
              className="bg-primary text-white rtl:text-2xl-rtl ltr:text-lg-ltr"
            >
              {t("submit")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <Tabs
          dir={direction}
          defaultValue="Status"
          className="flex flex-col items-center"
          onValueChange={(value) => setActiveTab(value)} // Set active tab when tab changes
        >
          <TabsList className="!p-0 h-fit bg-card mt-2 overflow-x-auto overflow-y-hidden justify-start border border-primary/10 dark:border-primary/20">
            <TabsTrigger
              value="Status"
              className="gap-x-1 rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
            >
              <Building className="size-[16px] ltr:mr-1 rtl:ml-1" />
              {t("Status")}
            </TabsTrigger>
            <TabsTrigger
              value="Source"
              className="gap-x-1 rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
            >
              <Building className="size-[16px] ltr:mr-1 rtl:ml-1" />
              {t("Source")}
            </TabsTrigger>
            <TabsTrigger
              value="Urgencey"
              className="gap-x-1 rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
            >
              <Building className="size-[16px] ltr:mr-1 rtl:ml-1" />
              {t("Urgencey")}
            </TabsTrigger>
            <TabsTrigger
              value="Type"
              className="gap-x-1 rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
            >
              <Building className="size-[16px] ltr:mr-1 rtl:ml-1" />
              {t("Type")}
            </TabsTrigger>
            <TabsTrigger
              value="Reffer"
              className="gap-x-1 rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
            >
              <Building className="size-[16px] ltr:mr-1 rtl:ml-1" />
              {t("Reffer")}
            </TabsTrigger>
            <TabsTrigger
              value="Duration"
              className="gap-x-1 rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
            >
              <Building className="size-[16px] ltr:mr-1 rtl:ml-1" />
              {t("Duration")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="Status" className="w-full px-4 pt-8">
            <TableContent />
          </TabsContent>
          <TabsContent value="Source" className="w-full px-4 pt-8">
            <TableContent />
          </TabsContent>
          <TabsContent value="Urgencey" className="w-full px-4 pt-8">
            <TableContent />
          </TabsContent>
          <TabsContent value="Type" className="w-full px-4 pt-8">
            <TableContent />
          </TabsContent>
          <TabsContent value="Reffer" className="w-full px-4 pt-8">
            <TableContent />
          </TabsContent>
          <TabsContent value="Duration" className="w-full px-4 pt-8">
            <TableContent />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
