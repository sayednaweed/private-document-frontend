import { useTranslation } from "react-i18next";
import React, { Suspense, useState, useEffect } from "react";
import Card from "@/components/custom-ui/card/Card";
import { useTheme } from "@/context/theme-provider";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import ShimmerItem from "@/components/custom-ui/shimmer/ShimmerItem";
import { BarChart2 } from "lucide-react";
import DashboardCard from "@/components/custom-ui/card/DashboardCard";
import { toast } from "@/components/ui/use-toast";
import axiosClient from "@/lib/axois-client";

// Lazy-loaded components
const LazySimplePieChart = React.lazy(() => import("@/components/custom-ui/charts/SimplePieChart"));
const LazyColumnLabelBarChart = React.lazy(() => import("@/components/custom-ui/charts/ColumnLabelBarChart"));
const LazyDashedLineChart = React.lazy(() => import("@/components/custom-ui/charts/DashedLineChart"));

export default function SuperDashboardPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    statuses: [],
    documentTypePercentages: [],
    documentCountLastSixMonths: [],
    documentTypeSixMonth: [],
    documentUrgencyCounts: [],
    monthlyDocumentCounts: [],
    monthlyTypeCounts: [],
  });

  const fetchDashboardData = async () => {
    try {
      const response = await axiosClient.get("/dashboard/info");
      const data = response.data;

      setDashboardData({
        statuses: data.statuses,
        documentTypePercentages: data.documentTypePercentages,
        documentTypeSixMonth: data.documenttypesixmonth,
        documentCountLastSixMonths: data.documentCountLastSixMonths,
        documentUrgencyCounts: data.documentUrgencyCounts,
        monthlyDocumentCounts: data.monthlyDocumentCounts,
        monthlyTypeCounts: data.montlyTypeCount,
      });
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        toastType: "ERROR",
        title: "Error!",
        description: error.response?.data?.message || "Failed to fetch dashboard data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Common Loader UI
  const cardLoader = (
    <Shimmer className="hover:shadow-lg shadow-md w-full h-full overflow-hidden">
      <ShimmerItem className="font-bold ml-1 mt-1 pl-1 w-1/2 rounded-[5px]" />
      <ShimmerItem className="ml-1 mt-1 pl-1 w-1/3 rounded-[5px]" />
      <ShimmerItem className="mt-1 pl-1 w-full h-full animate-none rounded-none" />
    </Shimmer>
  );

  // Render loading state
  if (loading) {
    return <div>Loading Dashboard...</div>;
  }

  // Helper function for rendering cards
  const renderDashboardCards = (data: any[], icon: JSX.Element) =>
    data.map((item, index) => (
      <DashboardCard
        key={index}
        title={item.status_name || item.urgency_name}
        description=""
        className="overflow-hidden flex-1 space-y-2 h-full p-4"
        value={item.document_count}
        symbol=""
        icon={icon}
      />
    ));

  // Main dashboard layout
  return (
    <>
      {/* Status Cards */}
      <div className="px-1 sm:px-2 md:px-6 pt-6 gap-2 sm:gap-4 grid grid-cols-2 sm:grid-cols-5">
        {renderDashboardCards(dashboardData.statuses, <BarChart2 className="absolute text-primary/90 top-10 hidden md:block md:right-2 lg:right-4 size-[70px]" />)}
        <div className="h-[162px] flex overflow-hidden min-w-full sm:col-span-2 p-0">
          {renderDashboardCards(dashboardData.documentUrgencyCounts, <BarChart2 className="absolute text-primary/90 top-10 hidden md:block md:right-2 lg:right-4 size-[70px]" />)}
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-5 md:grid-rows-1 gap-x-2 gap-y-4 px-2 mt-4">
        <Card className="h-[420px] min-w-full xl:col-span-3 md:col-span-3 p-0">
          <Suspense fallback={cardLoader}>
            <LazySimplePieChart
              theme={theme}
              labels={dashboardData.documentTypePercentages[0]}
              series={dashboardData.documentTypePercentages[1]}
            />
          </Suspense>
        </Card>

        <Card className="h-[420px] min-w-full md:col-span-5 xl:col-span-2 p-0">
          <Suspense fallback={cardLoader}>
            <LazyColumnLabelBarChart
              subtitle={t("Document Store Statistic As Months")}
              title={t("Document statistic")}
              theme={theme}
              setseries={dashboardData.monthlyDocumentCounts[1]}
            />
          </Suspense>
        </Card>

        <Card className="h-[420px] min-w-full md:col-span-5 p-0">
          <Suspense fallback={cardLoader}>
            <LazyDashedLineChart
              subtitle={t("Category Names as DataLabels inside bars")}
              title={t("Total Register Documents")}
              theme={theme}
              seriesData={dashboardData.monthlyTypeCounts.map((type, index) => ({
                name: type?.document_type_name || '',
                data: type?.monthly_data || [],
              }))}
            />
          </Suspense>
        </Card>
      </div>
    </>
  );
}
