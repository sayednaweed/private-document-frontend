import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { FileDown, LockKeyhole, RefreshCcw, UnlockKeyhole } from "lucide-react";
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
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import axiosClient from "@/lib/axois-client";
import { useAuthState } from "@/context/AuthContextProvider";
import { SECTION_NAMES, StatusEnum } from "@/lib/constants";
import { setServerError, validate } from "@/validation/validation";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { UserPermission } from "@/database/tables";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import { DateObject } from "react-multi-date-picker";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DocumentReceivedDialog from "./document-received/document-received-dialog";
import Countdown from "@/components/custom-ui/counter/Countdown";
interface Information {
  id: string;
  status: string;
  statusId: string;
  documentType: string;
  urgency: string;
  source: string;
  documentDate: DateObject;
  documentNumber: string;
  qaidWaridaNumber: string;
  qaidWaridaDate: DateObject;
  qaidSadiraDate?: DateObject;
  qaidSadiraNumber?: string;
  subject: string;
  savedFile: string;
  deadline: string | null;
  feedbackDate: string | null;
  locked: boolean;
  oldDoc: boolean;
}
export interface EditDocumentInformationProps {
  id: string | undefined;
  permission: UserPermission;
}
export default function EditDocumentInformation(
  props: EditDocumentInformationProps
) {
  const { id, permission } = props;
  const { user } = useAuthState();
  const { t } = useTranslation();
  const [failed, setFailed] = useState(false);
  const [documentData, setDocumentData] = useState<Information | undefined>();
  const loadInformation = async () => {
    try {
      if (failed) setFailed(false);
      const response = await axiosClient.get(`document/information/${id}`);
      if (response.status == 200) {
        const info = response.data.information;
        setDocumentData({
          id: info.id,
          status: info.status,
          statusId: info.status_id,
          documentType: info.documentType,
          urgency: info.urgency,
          source: info.source,
          documentDate: info.documentDate,
          documentNumber: info.documentNumber,
          qaidWaridaNumber: info.qaidWaridaNumber,
          qaidWaridaDate: info.qaidWaridaDate,
          qaidSadiraDate: info.qaidSadiraDate,
          qaidSadiraNumber: info.qaidSadiraNumber,
          subject: info.subject,
          savedFile: info.savedFile,
          deadline: info.deadline,
          feedbackDate: info.feedbackDate,
          locked: info.locked == "1" ? true : false,
          oldDoc: info.oldDoc == "1" ? true : false,
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
  };
  useEffect(() => {
    loadInformation();
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Map<string, string>>(new Map());
  const per: UserPermission | undefined = user?.permissions.get(
    SECTION_NAMES.documents
  );
  const hasEdit = per ? per?.edit : false;
  const saveData = async () => {
    if (loading || documentData === undefined || id === undefined) {
      setLoading(false);
      return;
    }
    setLoading(true);
    // 1. Validate form
    const passed = await validate(
      [
        {
          name: "fullName",
          rules: ["required", "max:45", "min:3"],
        },
        {
          name: "username",
          rules: ["required", "max:45", "min:3"],
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
    formData.append("id", id);
    formData.append("fullName", documentData.documentNumber);
    try {
      const response = await axiosClient.post("user/update", formData);
      if (response.status == 200) {
        // Update user state
        setDocumentData(documentData);
        toast({
          toastType: "SUCCESS",
          title: t("Success"),
          description: response.data.message,
        });
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

  const lock = documentData?.locked == true ? true : hasEdit ? false : true;

  let recieveButton = undefined;
  let keepButton = undefined;
  if (permission?.add && documentData) {
    if (documentData.statusId == StatusEnum.keep) {
      keepButton = (
        <NastranModel
          size="lg"
          isDismissable={false}
          button={
            <PrimaryButton className="gap-x-2 px-2 h-[32px]">
              <FileDown className="size-[18px]" />
              {t("continue_process")}
            </PrimaryButton>
          }
          showDialog={async () => true}
        >
          <DocumentReceivedDialog
            onComplete={loadInformation}
            documentId={id ? id : ""}
          />
        </NastranModel>
      );
    } else if (documentData.statusId != StatusEnum.complete) {
      recieveButton = (
        <NastranModel
          size="lg"
          isDismissable={false}
          button={
            <PrimaryButton className="gap-x-2 px-2 h-[32px]">
              <FileDown className="size-[18px]" />
              {t("documentReceived")}
            </PrimaryButton>
          }
          showDialog={async () => true}
        >
          <DocumentReceivedDialog
            onComplete={loadInformation}
            documentId={id ? id : ""}
          />
        </NastranModel>
      );
    }
  }
  return (
    <Card className=" relative">
      <div className="absolute inset-0 -top-10 flex gap-x-3">
        {recieveButton}
        {keepButton}
      </div>
      <CardHeader className="space-y-0 justify-between relative">
        <div>
          <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
            {t("document_info")}
          </CardTitle>
          <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
            {t("document_desc")}
          </CardDescription>
        </div>
        {documentData && documentData?.locked == true ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <LockKeyhole className="size-[22px] cursor-pointer absolute top-4 rtl:left-4 ltr:right-4 text-red-500 text:bg-red-400" />
              </TooltipTrigger>

              <TooltipContent>
                <p>{t("lock_desc")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <UnlockKeyhole className="size-[22px] absolute top-4 rtl:left-4 ltr:right-4 text-green-500 hover:text-green-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("unlock_desc")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {documentData?.deadline && (
          <Countdown
            className="border p-4 rounded-lg shadow"
            targetDate={new Date(documentData?.deadline)}
            feedbackDate={
              documentData?.feedbackDate
                ? new Date(documentData?.feedbackDate)
                : null
            }
            info={{
              remaining: {
                title: t("remaining_time"),
                color: "bg-tertiary",
                startDay: 4,
              },
              warning: {
                title: t("remaining_time"),
                color: "bg-red-400",
                startDay: 3,
              },
              completed: {
                title: t("Complete"),
                color: "bg-green-400",
              },
              expire: {
                title: t("expired_time"),
                color: "bg-gray-500",
                startDay: 0,
              },
            }}
          />
        )}
      </CardHeader>
      <CardContent>
        {failed ? (
          <h1>{t("You are not authorized!")}</h1>
        ) : documentData === undefined ? (
          <NastranSpinner />
        ) : (
          <>
            <div className="grid gap-4 w-full sm:w-[70%] md:w-1/2">
              <APICombobox
                placeholderText={t("Search item")}
                errorText={t("No item")}
                onSelect={(selection: any) =>
                  setDocumentData({ ...documentData, status: selection })
                }
                placeHolder={`${t("select")} ${t("status")}`}
                lable={t("status")}
                required={true}
                requiredHint={`* ${t("Required")}`}
                selectedItem={documentData["status"]}
                errorMessage={error.get("status")}
                apiUrl={"statuses"}
                mode="single"
                readonly={lock}
              />
              <APICombobox
                placeholderText={t("Search item")}
                errorText={t("No item")}
                onSelect={(selection: any) =>
                  setDocumentData({ ...documentData, documentType: selection })
                }
                placeHolder={`${t("select")} ${t("type")}`}
                lable={t("documentType")}
                required={true}
                requiredHint={`* ${t("Required")}`}
                selectedItem={documentData["documentType"]}
                errorMessage={error.get("documentType")}
                apiUrl={"document-types"}
                mode="single"
                readonly={lock}
              />
              <APICombobox
                placeholderText={t("Search item")}
                errorText={t("No item")}
                onSelect={(selection: any) =>
                  setDocumentData({ ...documentData, urgency: selection })
                }
                placeHolder={`${t("select")} ${t("urgency")}`}
                lable={t("urgency")}
                required={true}
                requiredHint={`* ${t("Required")}`}
                selectedItem={documentData["urgency"]}
                errorMessage={error.get("urgency")}
                apiUrl={"urgencies"}
                mode="single"
                readonly={lock}
              />
              <APICombobox
                placeholderText={t("Search item")}
                errorText={t("No item")}
                onSelect={(selection: any) =>
                  setDocumentData({ ...documentData, ["source"]: selection })
                }
                lable={t("source")}
                required={true}
                requiredHint={`* ${t("Required")}`}
                selectedItem={documentData["source"]}
                placeHolder={`${t("select")} ${t("source")}`}
                errorMessage={error.get("source")}
                apiUrl={"sources"}
                mode="single"
                readonly={lock}
              />
              <CustomDatePicker
                placeholder={t("Select a date")}
                lable={t("documentDate")}
                requiredHint={`* ${t("Required")}`}
                required={true}
                value={documentData.documentDate}
                dateOnComplete={(date: DateObject) => {
                  setDocumentData({ ...documentData, documentDate: date });
                }}
                className="py-[12px]"
                errorMessage={error.get("documentDate")}
                readonly={lock}
              />
              <CustomInput
                required={true}
                lable={t("documentNumber")}
                requiredHint={`* ${t("Required")}`}
                size_="sm"
                name="documentNumber"
                defaultValue={documentData["documentNumber"]}
                placeholder={`${t("enter")} ${t("documentNumber")}`}
                type="text"
                errorMessage={error.get("documentNumber")}
                onBlur={(e: any) =>
                  setDocumentData({
                    ...documentData,
                    documentNumber: e.target.value,
                  })
                }
                readOnly={lock}
              />
              <CustomInput
                required={true}
                lable={t("qaidWarida")}
                requiredHint={`* ${t("Required")}`}
                size_="sm"
                name="qaidWaridaNumber"
                defaultValue={documentData["qaidWaridaNumber"]}
                placeholder={`${t("enter")} ${t("qaidWarida")}`}
                type="text"
                errorMessage={error.get("qaidWaridaNumber")}
                onBlur={(e: any) =>
                  setDocumentData({
                    ...documentData,
                    qaidWaridaNumber: e.target.value,
                  })
                }
                readOnly={lock}
              />
              <CustomDatePicker
                placeholder={t("Select a date")}
                lable={t("qaidWaridaDate")}
                requiredHint={`* ${t("Required")}`}
                required={true}
                value={documentData.qaidWaridaDate}
                dateOnComplete={(date: DateObject) => {
                  setDocumentData({ ...documentData, qaidWaridaDate: date });
                }}
                className="py-[12px]"
                errorMessage={error.get("qaidWaridaDate")}
                readonly={lock}
              />
              {documentData.qaidSadiraDate && (
                <>
                  <CustomDatePicker
                    readonly={lock}
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
                    className="py-[12px]"
                    errorMessage={error.get("qaidSadiraDate")}
                  />
                  <CustomInput
                    required={true}
                    lable={t("qaidSadiraNumber")}
                    requiredHint={`* ${t("Required")}`}
                    size_="sm"
                    name="qaidSadiraNumber"
                    defaultValue={documentData["qaidSadiraNumber"]}
                    placeholder={`${t("enter")} ${t("qaidWarida")}`}
                    type="text"
                    errorMessage={error.get("qaidSadiraNumber")}
                    onBlur={(e: any) =>
                      setDocumentData({
                        ...documentData,
                        qaidSadiraNumber: e.target.value,
                      })
                    }
                    readOnly={lock}
                  />
                </>
              )}
            </div>
            <CustomTextarea
              onChange={(e: any) =>
                setDocumentData({ ...documentData, subject: e.target.value })
              }
              required={true}
              name="subject"
              parantClassName="mt-9"
              placeholder={`${t("enter")}`}
              requiredHint={`* ${t("Required")}`}
              defaultValue={documentData["subject"]}
              lable={t("subject")}
              errorMessage={error.get("subject")}
              readOnly={lock}
            />
            <CustomTextarea
              onChange={(e: any) =>
                setDocumentData({ ...documentData, savedFile: e.target.value })
              }
              required={true}
              name="savedFile"
              parantClassName="mt-9"
              placeholder={`${t("enter")}`}
              requiredHint={`* ${t("Required")}`}
              defaultValue={documentData["savedFile"]}
              lable={t("savedFile")}
              errorMessage={error.get("savedFile")}
              readOnly={lock}
            />
          </>
        )}
      </CardContent>
      <CardFooter>
        {failed ? (
          <PrimaryButton
            onClick={async () => await loadInformation()}
            className="bg-red-500 hover:bg-red-500/70"
          >
            {t("Failed Retry")}
            <RefreshCcw className="ltr:ml-2 rtl:mr-2" />
          </PrimaryButton>
        ) : (
          documentData &&
          hasEdit &&
          !documentData?.locked && (
            <PrimaryButton
              onClick={async () => {
                if (user?.permissions.get(SECTION_NAMES.users)?.edit)
                  await saveData();
              }}
              className={`shadow-lg`}
            >
              <ButtonSpinner loading={loading}>{t("Save")}</ButtonSpinner>
            </PrimaryButton>
          )
        )}
      </CardFooter>
    </Card>
  );
}
