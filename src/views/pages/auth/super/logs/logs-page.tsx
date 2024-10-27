import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import AnimHomeIcon from "@/components/custom-ui/icons/AnimHomeIcon";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "@/components/ui/use-toast";
import axiosClient from "@/lib/axois-client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function LogsPage() {
  const { t } = useTranslation();
  const [logContent, setLogContent] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const initialize = async () => {
    try {
      const response = await axiosClient.get("logs");
      if (response.status == 200) setLogContent(response.data);
    } catch (error: any) {
      console.log(error);
      toast({
        toastType: "ERROR",
        title: t("Error"),
        description: t(error.response.data.message),
      });
    }
  };
  useEffect(() => {
    initialize();
  }, []);
  const clearLog = async () => {
    if (loading) return;
    try {
      setLoading(true);

      const response = await axiosClient.post("logs/clear");
      if (response.status == 200) {
        setLogContent(undefined);
        toast({
          toastType: "SUCCESS",
          title: t("Success"),
        });
      }
    } catch (error: any) {
      console.log(error);
      toast({
        toastType: "ERROR",
        title: t("Error"),
        description: t(error.response.data.message),
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="px-[12px] space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/dashboard">
              <AnimHomeIcon />
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="rtl:rotate-180" />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("logs")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PrimaryButton
        className="rounded-full bg-red-500 hover:bg-red-500"
        onClick={clearLog}
      >
        <ButtonSpinner loading={loading}>{t("clear logs")}</ButtonSpinner>
      </PrimaryButton>
      <div className="whitespace-pre-wrap p-4 rounded-[5px] bg-primary text-primary-foreground">
        {logContent == undefined || logContent == "" ? (
          <h1 className="text-center">{t("No log exists!")}</h1>
        ) : (
          logContent
        )}
      </div>
    </div>
  );
}
