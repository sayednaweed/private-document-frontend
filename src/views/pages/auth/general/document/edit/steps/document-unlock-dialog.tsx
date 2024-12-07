import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import { useTranslation } from "react-i18next";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { useEffect, useState } from "react";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";

export interface DocumentUnlockDialogProps {
  documentId: string;
}
export default function DocumentUnlockDialog(props: DocumentUnlockDialogProps) {
  const { documentId } = props;
  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    retry();
  }, []);
  const retry = async () => {
    try {
      if (loading) return;
      setLoading(true);
      const form = new FormData();
      form.append("documentId", documentId);
      const response = await axiosClient.post(`document/unlock`, form);
      if (response.status == 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
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

  const cancel = () => {
    setLoading(false);
    modelOnRequestHide();
  };

  return (
    <Card className="w-fit self-center [backdrop-filter:blur(20px)] bg-white/70 dark:!bg-black/40">
      <CardContent
        className={`pt-4 flex flex-col items-start ${
          failed && "w-[60vw] h-[20vh] gap-y-2"
        }`}
      >
        {failed ? (
          <>
            <p className="ltr:text-xl-ltr rtl:text-xl-rtl text-start text-red-500">
              {t(
                "Operation failed to unclock document, Contact administration!"
              )}
            </p>
            <PrimaryButton
              onClick={async () => await retry()}
              className="bg-red-500 hover:bg-red-500/70"
            >
              {t("Retry")}
              <RefreshCcw className="ltr:ml-2 rtl:mr-2 size-[18px]" />
            </PrimaryButton>
          </>
        ) : (
          <NastranSpinner label={t("Requesting in progress!")} />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          className="rtl:text-2xl-rtl ltr:text-lg-ltr"
          onClick={cancel}
        >
          {t("Cancel")}
        </Button>
      </CardFooter>
    </Card>
  );
}
