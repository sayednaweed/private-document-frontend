import { useTranslation } from "react-i18next";
import React, { Suspense, useEffect, useState } from "react";
import Card from "@/components/custom-ui/card/Card";
import { useTheme } from "@/context/theme-provider";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import ShimmerItem from "@/components/custom-ui/shimmer/ShimmerItem";
import { BarChart2 } from "lucide-react";
import DashboardCard from "@/components/custom-ui/card/DashboardCard";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
const LazySimplePieChart = React.lazy(
  () => import("@/components/custom-ui/charts/SimplePieChart")
);
const LazyDashedLineChart = React.lazy(
  () => import("@/components/custom-ui/charts/DashedLineChart")
);

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState<{
    statuses: {
      status_name: string;
      document_count: number;
    }[];
    documentTypePercentages: {
      labels: string[];
      data: number[];
    };
    montlyTypeCount: {
      name: string;
      data: number[];
    }[];
    documenttypesixmonth: {
      document_type_name: string;
      document_count: number;
    }[];
    documentUrgencyCounts: {
      urgency_name: string;
      document_count: number;
    }[];
    monthlyDocumentCounts: {
      labels: string[];
      data: number[];
    };
  }>({
    statuses: [],
    documentTypePercentages: {
      labels: [],
      data: [],
    },
    montlyTypeCount: [],
    documenttypesixmonth: [],
    documentUrgencyCounts: [],
    monthlyDocumentCounts: {
      labels: [],
      data: [],
    },
  });
  const fetchDashboardData = async () => {
    try {
      const response = await axiosClient.get("/dashboard/info");
      const data = response.data;

      const documentTypePercentages = {
        labels: data.documentTypePercentages[0],
        data: data.documentTypePercentages[1],
      };
      setDashboardData({
        statuses: data.statuses,
        documentTypePercentages: documentTypePercentages,
        montlyTypeCount: data.montlyTypeCount,
        documenttypesixmonth: data.documenttypesixmonth,
        documentUrgencyCounts: data.documentUrgencyCounts,
        monthlyDocumentCounts: data.monthlyDocumentCounts,
      });
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        toastType: "ERROR",
        title: "Error!",
        description:
          error.response?.data?.message || "Failed to fetch dashboard data",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);

  console.log(dashboardData);
  const cardLoader = (
    <Shimmer className="hover:shadow-lg shadow-md w-full h-full overflow-hidden">
      <ShimmerItem className="font-bold ml-1 mt-1 pl-1 w-1/2 rounded-[5px]" />
      <ShimmerItem className="ml-1 mt-1 pl-1 w-1/3 rounded-[5px]" />
      <ShimmerItem className=" mt-1 pl-1 w-full h-full animate-none rounded-none" />
    </Shimmer>
  );

  const renderDashboardCards = (data: any[], icon: JSX.Element) =>
    data.map((item) => {
      return (
        <DashboardCard
          loading={loading}
          key={item.urgency_name}
          title={item.status_name || item.urgency_name}
          description={t("January")}
          className="overflow-hidden flex-1 space-y-2 h-full p-4"
          value={item.document_count}
          symbol="+"
          icon={icon}
        />
      );
    });
  return (
    <>
      {/* Cards */}
      <div className="px-1 sm:px-2 pt-4 gird columns-5">
        {renderDashboardCards(
          dashboardData.statuses,
          <BarChart2 className="absolute text-primary/90 top-10 hidden md:block rtl:md:left-2 rtl:lg:left-4 ltr:md:right-2 size-[70px]" />
        )}
        {renderDashboardCards(
          dashboardData.documentUrgencyCounts,
          <BarChart2 className="absolute text-primary/90 top-10 hidden md:block rtl:md:left-2 rtl:lg:left-4 ltr:md:right-2 size-[70px]" />
        )}
      </div>
      {/* Charts */}
      <div className="grid md:grid-cols-5 md:grid-rows-1 gap-x-2 gap-y-4 px-2 mt-4">
        <Card className="h-[420px] min-w-full md:col-span-3 p-0">
          <Suspense fallback={cardLoader}>
            <LazyDashedLineChart
              series={dashboardData.montlyTypeCount}
              subtitle={t("Category Names as DataLabels inside bars")}
              title={t("Total Register Documents")}
              theme={theme}
              loading={loading}
            />
          </Suspense>
        </Card>
        <Card className="h-[420px] min-w-full md:col-span-2 p-0">
          <Suspense fallback={cardLoader}>
            <LazySimplePieChart
              series={{
                label: dashboardData.documentTypePercentages.labels,
                data: dashboardData.documentTypePercentages.data,
              }}
              theme={theme}
              loading={loading}
            />
          </Suspense>
        </Card>
      </div>
    </>
  );
}
