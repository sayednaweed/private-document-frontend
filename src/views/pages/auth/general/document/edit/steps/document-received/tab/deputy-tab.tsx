import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import { useTranslation } from "react-i18next";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { useState } from "react";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { Button } from "@/components/ui/button";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { DateObject } from "react-multi-date-picker";
import MultipleSelector from "@/components/custom-ui/select/MultipleSelector";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import { setServerError, validate } from "@/validation/validation";
import { Option } from "@/lib/types";
import FileChooser from "@/components/custom-ui/chooser/FileChooser";
import { ChevronsUpDown, RefreshCcw } from "lucide-react";
import { Recieved } from "../document-received-dialog";
import FakeCombobox from "@/components/custom-ui/combobox/FakeCombobox";
import CustomCheckbox from "@/components/custom-ui/checkbox/CustomCheckbox";
export interface MinisterTabProps {
  documentId: string;
  documentData: Recieved;
  setDocumentData: any;
  retry: () => void;
  failed: boolean;
}
export default function DeputyTab(props: MinisterTabProps) {
  const { documentId, retry, failed, documentData, setDocumentData } = props;
  const [error, setError] = useState<Map<string, string>>(new Map());
  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const saveData = async () => {
    if (loading) return;

    setLoading(true);
    // 1. Validate form
    const passed = await validate(
      [
        {
          name: "feedback",
          rules: ["required", "max:1000", "min:3"],
        },
        {
          name: "feedback_date",
          rules: ["required"],
        },
        {
          name: "reference",
          rules: ["required"],
        },
        {
          name: "deadline",
          rules: ["required"],
        },
        {
          name: "scan",
          rules: ["required"],
        },
      ],
      documentData,
      setError
    );
    if (!passed) {
      setLoading(false);
      return;
    }
    // 2. Store
    const feedback_date = documentData.feedback_date.toDate().toISOString();
    const deadline = documentData.deadline.toDate().toISOString();
    const formData = new FormData();
    formData.append("id", documentId);
    formData.append("feedback", documentData.feedback);
    formData.append("feedback_date", feedback_date);
    formData.append("deadline", deadline);
    if (documentData.scan) formData.append("document", documentData.scan);
    formData.append("hasFeedback", documentData.hasFeedback ? "true" : "false");
    formData.append("reference", JSON.stringify(documentData.reference));
    try {
      const response = await axiosClient.post(
        "document/recieved-from-deputy",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == 200) {
        toast({
          toastType: "SUCCESS",
          title: t("Success"),
          description: response.data.message,
        });
        cancel();
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("Error"),
        description: error.response.data.message,
      });
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const cancel = () => {
    setLoading(false);
    modelOnRequestHide();
  };

  return (
    <>
      {failed ? (
        <h1>{t("You are not authorized!")}</h1>
      ) : loading ? (
        <NastranSpinner />
      ) : (
        <div className="flex flex-col gap-y-2 pb-10">
          <FakeCombobox
            icon={
              <ChevronsUpDown className="size-[16px] absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
            }
            className="text-start [&>label]:px-1"
            title={t("previousPosition")}
            selected={documentData.fromDestination}
          />
          <CustomDatePicker
            placeholder={t("Select a date")}
            lable={t("feedback_date")}
            requiredHint={`* ${t("Required")}`}
            required={true}
            value={documentData.feedback_date}
            dateOnComplete={(date: DateObject) => {
              setDocumentData({ ...documentData, feedback_date: date });
            }}
            className="py-[12px]"
            errorMessage={error.get("feedback_date")}
          />
          <CustomTextarea
            onChange={(e: any) =>
              setDocumentData({ ...documentData, feedback: e.target.value })
            }
            required={true}
            name="feedback"
            parantClassName="mt-9"
            placeholder={`${t("enter")}`}
            requiredHint={`* ${t("Required")}`}
            defaultValue={documentData.feedback}
            lable={t("feedback")}
            errorMessage={error.get("feedback")}
          />
          <CustomDatePicker
            placeholder={t("Select a date")}
            lable={t("deadline")}
            requiredHint={`* ${t("Required")}`}
            required={true}
            value={documentData.deadline}
            dateOnComplete={(date: DateObject) => {
              setDocumentData({ ...documentData, deadline: date });
            }}
            className="py-[12px]"
            errorMessage={error.get("deadline")}
          />
          <MultipleSelector
            popoverClassName="h-36"
            commandProps={{
              label: "Select frameworks",
            }}
            onChange={(option: Option[]) => {
              setDocumentData({
                ...documentData,
                reference: option,
              });
            }}
            // defaultOptions={frameworks}
            label={t("reference")}
            errorMessage={error.get("reference")}
            selectedOptions={documentData.reference}
            required={true}
            requiredHint={`* ${t("Required")}`}
            apiUrl={"directorates"}
            placeholder={t("Select a reference")}
            emptyIndicator={
              <p className="text-center text-sm">{t("No item")}</p>
            }
          />
          <FileChooser
            lable={t("scan")}
            required={true}
            requiredHint={`* ${t("Required")}`}
            defaultFile={documentData.scan}
            errorMessage={error.get("scan")}
            onchange={(file: File | undefined) =>
              setDocumentData({ ...documentData, scan: file })
            }
            validTypes={["application/pdf"]}
            maxSize={8}
            accept=".pdf"
            parentClassName="mt-5"
          />
          <CustomCheckbox
            checked={documentData.hasFeedback}
            onCheckedChange={(value: boolean) =>
              setDocumentData({ ...documentData, hasFeedback: value })
            }
            parentClassName="rounded-md py-[12px] gap-x-1 bg-card border px-[10px]"
            text={t("hasFeedback")}
            description={t("feedback_desc")}
            required={true}
            requiredHint={`* ${t("Required")}`}
            errorMessage={error.get("hasFeedback")}
          />
        </div>
      )}
      <div className="flex justify-between w-full">
        {failed ? (
          <PrimaryButton
            onClick={async () => await retry()}
            className="bg-red-500 hover:bg-red-500/70"
          >
            {t("Failed Retry")}
            <RefreshCcw className="ltr:ml-2 rtl:mr-2" />
          </PrimaryButton>
        ) : (
          <div className="flex justify-between w-full">
            <PrimaryButton onClick={saveData} className={`shadow-lg`}>
              <ButtonSpinner loading={loading}>{t("Save")}</ButtonSpinner>
            </PrimaryButton>
            <Button
              variant="outline"
              className="rtl:text-2xl-rtl ltr:text-lg-ltr"
              onClick={cancel}
            >
              {t("Cancel")}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
