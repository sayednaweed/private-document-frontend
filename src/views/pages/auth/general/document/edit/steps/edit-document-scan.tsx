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
import { useAuthState } from "@/context/AuthContextProvider";
import { SECTION_NAMES } from "@/lib/constants";
import { setServerError, validate } from "@/validation/validation";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { UserPermission } from "@/database/tables";
import FileChooser from "@/components/custom-ui/chooser/FileChooser";
interface Scan {
  id: string;
  initailScan: File | undefined;
  initailScanCreatedAt: string;
  muqamScan: File | undefined;
  muqamScanCreatedAt: string;
  finalScan: File | undefined;
  finalScanCreatedAt: string;
}
export interface EditDocumentReferProps {
  id: string | undefined;
}

export function EditDocumentScan(props: EditDocumentReferProps) {
  const { id } = props;
  const { user } = useAuthState();
  const { t } = useTranslation();
  const [failed, setFailed] = useState(false);
  const [scanData, setScanData] = useState<Scan | undefined>();
  const loadInformation = async () => {
    try {
      if (failed) setFailed(false);
      const response = await axiosClient.get(`document/${id}`);
      if (response.status == 200) {
        setScanData(response.data.document);
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
    if (loading || scanData === undefined || id === undefined) {
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
      ],
      scanData,
      setError
    );
    if (!passed) {
      setLoading(false);
      return;
    }
    // 2. Store
    const formData = new FormData();
    formData.append("id", id);
    try {
      const response = await axiosClient.post("user/update", formData);
      if (response.status == 200) {
        // Update user state
        setScanData(scanData);
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

  console.log(scanData);
  return (
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("Update account password")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("Update_Password_Description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {failed ? (
          <h1>{t("You are not authorized!")}</h1>
        ) : !scanData ? (
          <NastranSpinner />
        ) : (
          <div className="grid gap-4 w-full sm:w-[70%] md:w-1/2">
            <FileChooser
              lable={t("initailScan")}
              required={true}
              requiredHint={`* ${t("Required")}`}
              defaultFile={scanData.initailScan}
              errorMessage={error.get("initailScan")}
              onchange={(file: File | undefined) =>
                setScanData({ ...scanData, initailScan: file })
              }
              validTypes={["application/pdf"]}
              maxSize={8}
              accept=".pdf"
            />
          </div>
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
          scanData &&
          hasEdit && (
            <PrimaryButton
              onClick={async () => {
                if (user?.permissions.get(SECTION_NAMES.users)?.edit)
                  await saveData();
              }}
              className={`shadow-lg`}
            >
              <ButtonSpinner loading={loading}>{t("Add")}</ButtonSpinner>
            </PrimaryButton>
          )
        )}
      </CardFooter>
    </Card>
  );
}
