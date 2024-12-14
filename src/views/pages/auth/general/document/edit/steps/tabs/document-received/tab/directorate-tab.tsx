import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import { useTranslation } from "react-i18next";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { useState } from "react";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { Button } from "@/components/ui/button";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { DateObject } from "react-multi-date-picker";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import { setServerError, validate } from "@/validation/validation";
import FileChooser from "@/components/custom-ui/chooser/FileChooser";
import { RefreshCcw } from "lucide-react";
import { RecievedFromDirectorate } from "../document-received-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { ValidateItem } from "@/validation/types";
export interface DirectorateTabProps {
  documentData: RecievedFromDirectorate;
  setDocumentData: any;
  documentId: string;
  retry: () => void;
  failed: boolean;
  onComplete: () => void;
}
export default function DirectorateTab(props: DirectorateTabProps) {
  const { documentData, retry, failed, setDocumentData, onComplete } = props;
  const [error, setError] = useState<Map<string, string>>(new Map());
  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const saveData = async () => {
    if (loading) return;

    setLoading(true);
    // 1. Validate form
    let validations: ValidateItem[] = [
      {
        name: "feedback",
        rules: ["required", "max:1000", "min:3"],
      },
      {
        name: "feedback_date",
        rules: ["required"],
      },
      {
        name: "scan",
        rules: ["required"],
      },
      {
        name: "reference",
        rules: ["required"],
      },
    ];

    if (documentData.previousPosition.length == 1) {
      validations.push({
        name: "qaidSadiraNumber",
        rules: ["required"],
      });
      validations.push({
        name: "qaidSadiraDate",
        rules: ["required"],
      });
      validations.push({
        name: "savedFile",
        rules: ["required"],
      });
    }
    const passed = await validate(validations, documentData, setError);
    if (!passed) {
      setLoading(false);
      return;
    }
    // 2. Store
    const formData = new FormData();
    formData.append("destination_id", documentData.reference);
    formData.append("feedback", documentData.feedback);
    formData.append(
      "feedback_date",
      documentData.feedback_date.toDate().toISOString()
    );
    if (documentData.previousPosition.length == 1) {
      formData.append("last", "true");
      formData.append("savedFile", documentData.savedFile);
    } else formData.append("last", "false");
    if (documentData.scan) formData.append("document", documentData.scan);
    formData.append("qaidSadiraNumber", documentData.qaidSadiraNumber);
    formData.append(
      "qaidSadiraDate",
      documentData.qaidSadiraDate.toDate().toISOString()
    );
    try {
      const response = await axiosClient.post(
        "document/recieved-from-directorate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == 200) {
        // 1. Remove reference from documentData
        toast({
          toastType: "SUCCESS",
          title: t("Success"),
          description: response.data.message,
        });
        if (documentData.previousPosition.length == 1) {
          onComplete();
        } else {
          const filteredItems = documentData.previousPosition.filter(
            (item) => item.id !== documentData.reference
          );
          setDocumentData({ ...documentData, previousPosition: filteredItems });
        }
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

  const SelectedDirectorates = documentData.previousPosition.map((item) => (
    <SelectItem key={item.name} value={item.id} className="rtl:justify-end">
      {item.name}
    </SelectItem>
  ));
  return (
    <>
      {failed ? (
        <h1>{t("You are not authorized!")}</h1>
      ) : loading ? (
        <NastranSpinner />
      ) : (
        <div className="flex flex-col gap-y-2 pb-10">
          <div>
            <h1 className="text-start font-semibold ps-1 ltr:text-xl-ltr">
              {t("reference")}
            </h1>
            <Select
              onValueChange={(value: string) =>
                setDocumentData({ ...documentData, reference: value })
              }
            >
              <SelectTrigger
                className={`w-full ltr:text-xl-ltr rtl:text-xl-rtl ${
                  error.get("reference") && "border border-red-400"
                }`}
              >
                <SelectValue placeholder={`${t("select")} ${t("reference")}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="ltr:text-xl-ltr rtl:text-xl-rtl">
                  {SelectedDirectorates}
                </SelectGroup>
              </SelectContent>
            </Select>
            <h1 className="text-red-400 ltr:text-[11px] text-start rtl:text-[15px] mb-3">
              {error.get("reference")}
            </h1>
          </div>
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
          {documentData.previousPosition.length == 1 && (
            <>
              <CustomInput
                required={true}
                lable={t("qaidSadiraNumber")}
                requiredHint={`* ${t("Required")}`}
                size_="sm"
                name="qaidSadiraNumber"
                defaultValue={documentData.qaidSadiraNumber}
                placeholder={`${t("enter")} ${t("qaidSadiraNumber")}`}
                type="text"
                errorMessage={error.get("qaidSadiraNumber")}
                onBlur={(e: any) => {
                  const { value } = e.target;
                  setDocumentData({ ...documentData, qaidSadiraNumber: value });
                }}
              />
              <CustomDatePicker
                placeholder={t("Select a date")}
                lable={t("qaidSadiraDate")}
                requiredHint={`* ${t("Required")}`}
                required={true}
                value={documentData.qaidSadiraDate}
                dateOnComplete={(date: DateObject) => {
                  setDocumentData({ ...documentData, qaidSadiraDate: date });
                }}
                className="py-3 w-1/2"
                errorMessage={error.get("qaidSadiraDate")}
              />
              <CustomTextarea
                onChange={(e: any) =>
                  setDocumentData({
                    ...documentData,
                    savedFile: e.target.value,
                  })
                }
                required={true}
                name="savedFile"
                parantClassName="mt-9"
                placeholder={`${t("enter")}`}
                requiredHint={`* ${t("Required")}`}
                defaultValue={documentData.savedFile}
                lable={t("savedFile")}
                errorMessage={error.get("savedFile")}
              />
            </>
          )}
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
          !loading && (
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
          )
        )}
      </div>
    </>
  );
}
