import HeaderCard from "@/components/custom-ui/card/HeaderCard";
import { toast } from "@/components/ui/use-toast";
import axiosClient from "@/lib/axois-client";
import { DocumentRecordCount } from "@/lib/types";
import { FileBox, FileChartColumn, FileCheck, FileClock } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function DocumentHeader() {
  const { t } = useTranslation();
  const [recordCount, setRecordCount] = useState<DocumentRecordCount>({
    inProgress: null,
    completed: null,
    keep: null,
    total: null,
  });
  const [loading, setLoading] = useState(true);
  const fetchCount = async () => {
    try {
      const response = await axiosClient.get(`users/record/count`);
      if (response.status == 200) {
        setRecordCount({
          inProgress: response.data.counts.inProgress,
          completed: response.data.counts.completed,
          keep: response.data.counts.keep,
          total: response.data.counts.total,
        });
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: "Error!",
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 justify-items-center gap-y-2 mt-4">
      <HeaderCard
        title={t("documents in progress")}
        total={recordCount.inProgress}
        description1={t("total")}
        description2={t("documents")}
        icon={
          <FileClock className=" size-[22px] bg-tertiary rounded-sm p-1 text-secondary" />
        }
        loading={loading}
      />
      <HeaderCard
        title={t("documents completed")}
        total={recordCount.completed}
        description1={t("total")}
        description2={t("documents")}
        icon={
          <FileCheck className=" size-[22px] bg-orange-500 rounded-sm p-1 text-secondary" />
        }
        loading={loading}
      />
      <HeaderCard
        title={t("documents keep")}
        total={recordCount.keep}
        description1={t("total")}
        description2={t("documents")}
        icon={
          <FileBox className=" size-[22px] bg-red-500 rounded-sm p-1 text-secondary" />
        }
        loading={loading}
      />
      <HeaderCard
        title={t("all documents")}
        total={recordCount.total}
        description1={t("total")}
        description2={t("documents")}
        icon={
          <FileChartColumn className=" size-[22px] bg-green-500 rounded-sm p-1 text-secondary" />
        }
        loading={loading}
      />
    </div>
  );
}
