import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Crown, Grid } from "lucide-react";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { DateObject } from "react-multi-date-picker";
import { Option } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import i18n from "@/lib/i18n";
import DeputyTab from "./tab/deputy-tab";
import DirectorateTab from "./tab/directorate-tab";
import Card from "@/components/custom-ui/card/Card";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { Button } from "@/components/ui/button";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import { ComboboxItem } from "@/components/custom-ui/combobox/APICombobox";

export interface Recieved {
  id: string;
  feedback: string;
  fromDestination: string;
  feedback_date: DateObject;
  reference: Option[];
  deadline: DateObject;
  scan: File | undefined;
  activeTab: string | undefined;
  hasFeedback: boolean;
}
export interface RecievedFromDirectorate {
  id: string;
  qaidSadiraNumber: string;
  qaidSadiraDate: DateObject;
  feedback: string;
  feedback_date: DateObject;
  fromDestination: {
    id: string;
    name: string;
  }[];
  scan: File | undefined;
  activeTab: string | undefined;
}

export interface DocumentReceivedDialogProps {
  documentId: string;
}
export default function DocumentReceivedDialog(
  props: DocumentReceivedDialogProps
) {
  const { documentId } = props;
  const { modelOnRequestHide } = useModelOnRequestHide();
  const [documentData, setDocumentData] = useState<
    Recieved | RecievedFromDirectorate
  >({
    id: "",
    feedback: "",
    feedback_date: new DateObject(new Date()),
    reference: [],
    deadline: new DateObject(new Date()),
    scan: undefined,

    fromDestination: "",
    activeTab: undefined,
    hasFeedback: false,
  });
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    retry();
  }, []);
  const retry = async () => {
    try {
      if (failed) setFailed(false);
      const form = new FormData();
      form.append("documentId", documentId);
      const response = await axiosClient.get(
        `document/destination/${documentId}`
      );
      if (response.status == 200) {
        const destination = response.data.destination;
        if (Array.isArray(destination)) {
          // Hence document was in Ministry
          if (destination.length == 1) {
            setDocumentData({
              id: documentId,
              fromDestination: destination.at(0).name,
              feedback: "",
              feedback_date: new DateObject(new Date()),
              reference: [],
              deadline: new DateObject(new Date()),
              activeTab: "deputy",
              hasFeedback: false,
              scan: undefined,
            });
          } else {
            // Hence came from Directorates
            setDocumentData({
              id: documentId,
              fromDestination: destination,
              qaidSadiraDate: new DateObject(new Date()),
              qaidSadiraNumber: "",
              feedback: "",
              feedback_date: new DateObject(new Date()),
              activeTab: "directorate",
              scan: undefined,
            });
          }
        }
        setFailed(false);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("Error"),
        description: error.response.data.message,
      });
      console.log(error);
      setFailed(true);
    }
    setLoading(false);
  };
  const direction = i18n.dir();
  const cancel = () => {
    setLoading(false);
    modelOnRequestHide();
  };
  return (
    <Card className=" w-full md:w-[80%] h-fit lg:w-[70%] self-center my-4 dark:!bg-black/40">
      <Tabs
        value={documentData.activeTab}
        onValueChange={(value: string) =>
          setDocumentData({ ...documentData, activeTab: value })
        }
        dir={direction}
        defaultValue="lang"
        className="flex flex-col items-center"
      >
        <TabsList className="px-0 pb-1 h-fit bg-transparent mt-2 flex-wrap overflow-x-auto overflow-y-hidden justify-center gap-y-1 gap-x-1">
          <TabsTrigger
            disabled={documentData.activeTab != "deputy"}
            value="deputy"
            className="gap-x-1 shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
          >
            <Crown className="size-[16px] ltr:mr-1 rtl:ml-1" />
            {t("deputy")}
          </TabsTrigger>
          <TabsTrigger
            disabled={documentData.activeTab != "directorate"}
            value="directorate"
            className="gap-x-1 shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
          >
            <Grid className="size-[16px] ltr:mr-1 rtl:ml-1" />
            {t("directorate")}
          </TabsTrigger>
        </TabsList>
        {loading ? (
          <NastranSpinner className=" mt-32" />
        ) : (
          <>
            <TabsContent value="deputy" className="w-full px-4 pt-8">
              <DeputyTab
                documentId={documentId}
                documentData={documentData as Recieved}
                setDocumentData={setDocumentData}
                retry={retry}
                failed={failed}
              />
            </TabsContent>
            <TabsContent value="directorate" className="w-full px-4 pt-8">
              <DirectorateTab
                documentId={documentId}
                documentData={documentData as RecievedFromDirectorate}
                setDocumentData={setDocumentData}
                retry={retry}
                failed={failed}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
      {loading ||
        (failed && (
          <div className="flex justify-end mt-8">
            <Button
              variant="outline"
              className="rtl:text-2xl-rtl ltr:text-lg-ltr"
              onClick={cancel}
            >
              {t("Cancel")}
            </Button>
          </div>
        ))}
    </Card>
  );
}
