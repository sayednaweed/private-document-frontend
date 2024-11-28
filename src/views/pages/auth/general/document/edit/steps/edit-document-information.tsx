import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomInput from "@/components/custom-ui/input/CustomInput";
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
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import axiosClient from "@/lib/axois-client";
import { useAuthState } from "@/context/AuthContextProvider";
import { SECTION_NAMES } from "@/lib/constants";
import { setServerError, validate } from "@/validation/validation";
import { toLocaleDate } from "@/lib/utils";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { UserPermission } from "@/database/tables";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import { DateObject } from "react-multi-date-picker";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";
interface Information {
  id: string;
  documentNumber: string;
  subject: string;
  muqamStatement: string;
  qaidWaridaNumber: string;
  qaidSadiraNumber: string;
  savedFile: string;
  documentDate: DateObject;
  userRecievedDate: string;
  qaidSadiraDate: DateObject;
  qaidWaridaDate: DateObject;
  deadline: number | null;
  status: string;
  statusColor: string;
  urgency: string;
  source: string;
  reciverUserId: {
    id: string;
    username: string;
  };
  createdAt: string;
  documentType: string;
}
export interface EditDocumentInformationProps {
  id: string | undefined;
}
export default function EditDocumentInformation(
  props: EditDocumentInformationProps
) {
  const { id } = props;
  const { user } = useAuthState();
  const { t } = useTranslation();
  const [failed, setFailed] = useState(false);
  const [documentData, setDocumentData] = useState<Information | undefined>();
  const loadInformation = async () => {
    try {
      if (failed) setFailed(false);
      const response = await axiosClient.get(`document/information/${id}`);
      if (response.status == 200) {
        setDocumentData(response.data.document);
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
        {
          name: "email",
          rules: ["required", "max:45", "min:3"],
        },
        {
          name: "destination",
          rules: ["required"],
        },
        {
          name: "job",
          rules: ["required"],
        },
        {
          name: "role",
          rules: ["required"],
        },
        {
          name: "status",
          rules: ["required"],
        },
        {
          name: "grantPermission",
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

  return (
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("document_info")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("document_desc")}
        </CardDescription>
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
                  setDocumentData({ ...documentData, documentType: selection })
                }
                placeHolder={`${t("select")} ${t("status")}`}
                lable={t("status")}
                required={true}
                requiredHint={`* ${t("Required")}`}
                selectedItem={documentData["status"]}
                errorMessage={error.get("status")}
                apiUrl={"statuses"}
                mode="single"
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
                  setDocumentData({ ...documentData, subject: e.target.value })
                }
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
              />
              {documentData.qaidSadiraDate && (
                <>
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
              placeholder={`${t("enter")} ${t("subject")}`}
              requiredHint={`* ${t("Required")}`}
              defaultValue={documentData["subject"]}
              lable={t("subject")}
              errorMessage={error.get("subject")}
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
          hasEdit && (
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
