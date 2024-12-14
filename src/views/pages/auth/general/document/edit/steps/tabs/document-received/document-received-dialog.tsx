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
import { DestinationTypeEnum } from "@/lib/constants";

export interface Recieved {
  id: string;
  feedback: string;
  previousPosition:
    | string
    | {
        id: string;
        name: string;
      };
  feedback_date: DateObject;
  reference: Option[];
  deadline: DateObject | undefined;
  scan: File | undefined;
  qaidSadiraNumber: string;
  qaidSadiraDate: DateObject | undefined;
  savedFile: string;
  activeTab: string | undefined;
  hasFeedback: boolean;
  keep: boolean;
  changeDeputy: boolean;
}
export interface RecievedFromDirectorate {
  id: string;
  qaidSadiraNumber: string;
  qaidSadiraDate: DateObject;
  feedback: string;
  reference: string;
  savedFile: string;
  feedback_date: DateObject;
  previousPosition: {
    id: string;
    name: string;
  }[];
  scan: File | undefined;
  activeTab: string | undefined;
}

export interface DocumentReceivedDialogProps {
  documentId: string;
  onComplete: () => void;
}
export default function DocumentReceivedDialog(
  props: DocumentReceivedDialogProps
) {
  const { documentId, onComplete } = props;
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
    qaidSadiraDate: undefined,
    qaidSadiraNumber: "",
    previousPosition: "",
    savedFile: "",
    activeTab: undefined,
    hasFeedback: true,
    keep: false,
    changeDeputy: false,
  });
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [noReference, setNoReference] = useState(false);
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
          if (destination.length == 0) {
            // Show no data is transfered
            setNoReference(true);
          }
          let isMuqam = false;
          for (let i = 0; i < destination.length; i++) {
            const item = destination[i];
            if (item.destination_type_id == DestinationTypeEnum.muqam) {
              isMuqam = true;
              break;
            }
          }
          if (isMuqam) {
            setDocumentData({
              id: documentId,
              previousPosition: destination.at(0).name,
              feedback: "",
              feedback_date: new DateObject(new Date()),
              reference: [],
              deadline: undefined,
              qaidSadiraDate: undefined,
              savedFile: "",
              qaidSadiraNumber: "",
              activeTab: "deputy",
              hasFeedback: true,
              keep: false,
              scan: undefined,
              changeDeputy: false,
            });
          } else {
            // Hence came from Directorates
            setDocumentData({
              id: documentId,
              previousPosition: destination,
              qaidSadiraDate: new DateObject(new Date()),
              qaidSadiraNumber: "",
              feedback: "",
              savedFile: "",
              feedback_date: new DateObject(new Date()),
              activeTab: "directorate",
              scan: undefined,
              reference: "",
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
    onComplete();
  };
  return (
    <Card className=" w-full md:w-[80%] h-fit lg:w-[70%] self-center my-4 dark:!bg-black/40 bg-card">
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
            className="gap-x-1 shadow rtl:text-3xl-rtl rtl:py-[2px] rtl:px-3 ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
          >
            <Crown className="size-[16px] ltr:mr-1 rtl:ml-1" />
            {t("deputy")}
          </TabsTrigger>
          <TabsTrigger
            disabled={documentData.activeTab != "directorate"}
            value="directorate"
            className="gap-x-1 shadow rtl:text-3xl-rtl rtl:py-[2px] rtl:px-3 ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
          >
            <Grid className="size-[16px] ltr:mr-1 rtl:ml-1" />
            {t("directorate")}
          </TabsTrigger>
        </TabsList>
        {loading ? (
          <NastranSpinner className=" mt-32" />
        ) : noReference ? (
          <h1>{t("no_refrence_desc")}</h1>
        ) : (
          <>
            <TabsContent value="deputy" className="w-full px-4 pt-8">
              <DeputyTab
                documentId={documentId}
                documentData={documentData as Recieved}
                setDocumentData={setDocumentData}
                retry={retry}
                failed={failed}
                onComplete={cancel}
              />
            </TabsContent>
            <TabsContent value="directorate" className="w-full px-4 pt-8">
              <DirectorateTab
                documentId={documentId}
                documentData={documentData as RecievedFromDirectorate}
                setDocumentData={setDocumentData}
                retry={retry}
                onComplete={cancel}
                failed={failed}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
      {loading ||
        failed ||
        (noReference && (
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
