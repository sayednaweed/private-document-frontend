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
import { RefreshCcw } from "lucide-react";
import { Recieved } from "../document-received-dialog";
import CustomCheckbox from "@/components/custom-ui/checkbox/CustomCheckbox";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import { isString } from "@/lib/utils";
import { ValidateItem } from "@/validation/types";
import CustomInput from "@/components/custom-ui/input/CustomInput";

export interface MinisterTabProps {
  documentId: string;
  documentData: Recieved;
  setDocumentData: any;
  retry: () => void;
  onComplete: () => void;
  failed: boolean;
}
export default function DeputyTab(props: MinisterTabProps) {
  const {
    documentId,
    retry,
    failed,
    documentData,
    setDocumentData,
    onComplete,
  } = props;
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
    ];
    if (!documentData.hasFeedback) {
      validations.push({
        name: "reference",
        rules: ["required"],
      });
      validations.push({
        name: "qaidSadiraDate",
        rules: ["required"],
      });
      validations.push({
        name: "qaidSadiraNumber",
        rules: ["required"],
      });
      validations.push({
        name: "savedFile",
        rules: ["required"],
      });
    } else if (!documentData.keep) {
      validations.push({
        name: "reference",
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
    formData.append("id", documentId);
    formData.append("feedback", documentData.feedback);
    formData.append("keep", documentData.keep ? "true" : "false");
    formData.append(
      "feedback_date",
      documentData.feedback_date.toDate().toISOString()
    );
    if (!documentData.hasFeedback) {
      formData.append("qaidSadiraNumber", documentData.qaidSadiraNumber);
      formData.append(
        "qaidSadiraDate",
        documentData!.qaidSadiraDate!.toDate().toISOString()
      );
      formData.append("savedFile", documentData.savedFile);
    }
    if (documentData.deadline)
      formData.append("deadline", documentData.deadline.toDate().toISOString());
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
        onComplete();
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
  const changeDocumentDeputy = async () => {
    if (loading) return;

    setLoading(true);
    // 1. Validate form
    if (documentData.keep) {
    } else {
    }
    const passed = await validate(
      [
        {
          name: "previousPosition",
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
    const formData = new FormData();
    formData.append("document_id", documentId);
    if (!isString(documentData.previousPosition))
      formData.append("destination", documentData.previousPosition.id);
    try {
      const response = await axiosClient.post(
        "document/change-deputy",
        formData
      );
      if (response.status == 200) {
        toast({
          toastType: "SUCCESS",
          title: t("Success"),
          description: response.data.message,
        });
        onComplete();
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
        <div className="flex flex-col gap-y-4 pb-14">
          <CustomCheckbox
            checked={documentData.changeDeputy}
            onCheckedChange={(value: boolean) =>
              setDocumentData({ ...documentData, changeDeputy: value })
            }
            parentClassName="rounded-md py-[12px] gap-x-1 border px-[10px]"
            text={t("changeDeputy")}
            description={t("changeDeputy_desc")}
            required={true}
            requiredHint={`* ${t("optional")}`}
            hintColor="text-primary/50"
            errorMessage={error.get("changeDeputy")}
          />
          {!documentData.changeDeputy && (
            <>
              <CustomCheckbox
                checked={documentData.hasFeedback}
                onCheckedChange={(value: boolean) =>
                  setDocumentData({ ...documentData, hasFeedback: value })
                }
                parentClassName="rounded-md py-[12px] gap-x-1 bg-card border px-[10px]"
                text={t("hasFeedback")}
                description={t("feedback_desc")}
                required={true}
                requiredHint={`* ${t("optional")}`}
                hintColor="text-primary/50"
                errorMessage={error.get("hasFeedback")}
              />
              <CustomCheckbox
                checked={documentData.keep}
                onCheckedChange={(value: boolean) =>
                  setDocumentData({
                    ...documentData,
                    hasFeedback: true,
                    keep: value,
                  })
                }
                parentClassName="rounded-md py-[12px] gap-x-1 bg-card border px-[10px]"
                text={t("keep")}
                description={t("keep_desc")}
                errorMessage={error.get("keep")}
              />
            </>
          )}

          <APICombobox
            placeholderText={t("Search item")}
            errorText={t("No item")}
            onSelect={(selection: any) =>
              setDocumentData({
                ...documentData,
                previousPosition: selection,
              })
            }
            placeHolder={`${t("select")} ${t("type")}`}
            lable={t("previousPosition")}
            required={true}
            requiredHint={`* ${t("Required")}`}
            selectedItem={
              isString(documentData.previousPosition)
                ? documentData.previousPosition
                : documentData.previousPosition.name
            }
            errorMessage={error.get("previousPosition")}
            apiUrl={"muqams"}
            mode="single"
            readonly={!documentData.changeDeputy}
          />

          {!documentData.changeDeputy && (
            <>
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
                  setDocumentData({
                    ...documentData,
                    feedback: e.target.value,
                  })
                }
                required={true}
                name="feedback"
                className="bg-transparent"
                parantClassName="mt-9"
                placeholder={`${t("enter")}`}
                requiredHint={`* ${t("Required")}`}
                defaultValue={documentData.feedback}
                lable={t("feedback")}
                errorMessage={error.get("feedback")}
              />
              {!documentData.keep && (
                <>
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
                  {documentData.hasFeedback && (
                    <CustomDatePicker
                      placeholder={t("Select a date")}
                      lable={t("deadline")}
                      requiredHint={`* ${t("optional")}`}
                      required={true}
                      value={documentData.deadline}
                      dateOnComplete={(date: DateObject) => {
                        setDocumentData({ ...documentData, deadline: date });
                      }}
                      className="py-[12px]"
                      errorMessage={error.get("deadline")}
                      hintColor="text-primary/50"
                    />
                  )}
                  {!documentData.hasFeedback && (
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
                          setDocumentData({
                            ...documentData,
                            qaidSadiraNumber: value,
                          });
                        }}
                      />
                      <CustomDatePicker
                        placeholder={t("Select a date")}
                        lable={t("qaidSadiraDate")}
                        requiredHint={`* ${t("Required")}`}
                        required={true}
                        value={documentData.qaidSadiraDate}
                        dateOnComplete={(date: DateObject) => {
                          setDocumentData({
                            ...documentData,
                            qaidSadiraDate: date,
                          });
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
                </>
              )}
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
            </>
          )}
        </div>
      )}
      <div className="flex justify-between w-full">
        {failed ? (
          <PrimaryButton
            onClick={async () => retry()}
            className="bg-red-500 hover:bg-red-500/70"
          >
            {t("Failed Retry")}
            <RefreshCcw className="ltr:ml-2 rtl:mr-2" />
          </PrimaryButton>
        ) : (
          !loading && (
            <div className="flex justify-between w-full mt-12">
              <PrimaryButton
                onClick={async () => {
                  if (documentData.changeDeputy) await changeDocumentDeputy();
                  else await saveData();
                }}
                className={`shadow-lg`}
              >
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
