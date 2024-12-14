import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { Progress, UserPermission } from "@/database/tables";
import FileProgress from "@/components/custom-ui/progress/FileProgress";
import { useGlobalState } from "@/context/GlobalStateContext";
export interface EditDocumentReferProps {
  id: string | undefined;
  permission: UserPermission;
}

export function EditDocumentProgress(props: EditDocumentReferProps) {
  const { id } = props;
  const [state] = useGlobalState();
  const { t } = useTranslation();
  const [failed, setFailed] = useState(false);
  const [documentProgress, setDocumentProgress] = useState<
    Progress[] | undefined
  >();
  const loadInformation = async () => {
    try {
      if (failed) setFailed(false);
      const response = await axiosClient.get(`document/progress/${id}`);
      if (response.status == 200) {
        setDocumentProgress(response.data.progress);
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
  };
  useEffect(() => {
    loadInformation();
  }, []);
  return (
    <Card className="relative">
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("document_ref")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("document_ref_desc")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {failed ? (
          <h1>{t("You are not authorized!")}</h1>
        ) : !documentProgress ? (
          <NastranSpinner />
        ) : (
          <div className="grid gap-4 w-full pb-8">
            <FileProgress state={state} list={documentProgress} />
          </div>
        )}
      </CardContent>
      <CardFooter>
        {failed && (
          <PrimaryButton
            onClick={async () => await loadInformation()}
            className="bg-red-500 hover:bg-red-500/70"
          >
            {t("Failed Retry")}
            <RefreshCcw className="ltr:ml-2 rtl:mr-2" />
          </PrimaryButton>
        )}
      </CardFooter>
    </Card>
  );
}
