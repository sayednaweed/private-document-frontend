import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
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
import FileChooser from "@/components/custom-ui/chooser/FileChooser";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { RefreshCcw } from "lucide-react";
import { UserPermission } from "@/database/tables";
interface Scan {
  scanId: string;
  name: string;
  username: string;
  destination: string;
  color: string;
  path: string;
  uploadedDate: string;
}
export interface EditDocumentReferProps {
  id: string | undefined;
  permission: UserPermission;
}

export function EditDocumentScan(props: EditDocumentReferProps) {
  const { id } = props;
  const { t } = useTranslation();
  const [failed, setFailed] = useState(false);
  const [scanData, setScanData] = useState<Scan[] | undefined>();
  const loadScans = async () => {
    try {
      if (failed) setFailed(false);
      const response = await axiosClient.get(`document/scans/${id}`);
      if (response.status == 200) {
        setScanData(response.data.scans);
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
    loadScans();
  }, []);

  return (
    <Card className=" relative">
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("document_scan")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("document_scan_desc")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {failed ? (
          <h1>{t("You are not authorized!")}</h1>
        ) : !scanData ? (
          <NastranSpinner />
        ) : (
          <div className="grid gap-y-8 w-full md:w-[80%] pb-8 overflow-auto">
            {scanData.map((scan: Scan, index: number) => (
              <div key={scan.uploadedDate}>
                <h1
                  style={{
                    backgroundColor: scan.color,
                  }}
                  className="rounded-t-md py-1 px-[6px] text-primary/90 rtl:text-lg-rtl font-semibold"
                >
                  {scan.destination}
                </h1>
                <h1 className="bg-primary/20 mb-1 text-primary/90 rtl:text-md-rtl px-1 pt-[2px]">
                  {scan.username}
                </h1>
                <FileChooser
                  disabled={true}
                  downloadParam={{ path: scan.path, fileName: scan.name }}
                  key={scan.scanId}
                  lable={`${t("scan")} - ${index + 1}`}
                  required={true}
                  defaultFile={scan.name}
                  onchange={
                    (_file: File | undefined) => {}
                    // setScanData({ ...scanData, scan: file })
                  }
                  validTypes={["application/pdf"]}
                  maxSize={8}
                  accept=".pdf"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {failed && (
          <PrimaryButton
            onClick={async () => await loadScans()}
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
