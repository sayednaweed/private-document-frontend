import { useTranslation } from "react-i18next";
import React, { Suspense } from "react";
import Card from "@/components/custom-ui/card/Card";
import { useTheme } from "@/context/theme-provider";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import ShimmerItem from "@/components/custom-ui/shimmer/ShimmerItem";
import { BarChart2, PersonStanding } from "lucide-react";
import DashboardCard from "@/components/custom-ui/card/DashboardCard";
const LazySimplePieChart = React.lazy(
  () => import("@/components/custom-ui/charts/SimplePieChart")
);
const LazyCardLineChart = React.lazy(
  () => import("@/components/custom-ui/charts/CardLineChart")
);
const LazyDashedLineChart = React.lazy(
  () => import("@/components/custom-ui/charts/DashedLineChart")
);
const LazyColumnLabelBarChart = React.lazy(
  () => import("@/components/custom-ui/charts/ColumnLabelBarChart")
);

const LazyBasicColumnChart = React.lazy(
  () => import("@/components/custom-ui/charts/BasicColumnChart")
);

export default function SuperDashboardPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const cardLoader = (
    <Shimmer className="hover:shadow-lg shadow-md w-full h-full overflow-hidden">
      <ShimmerItem className="font-bold ml-1 mt-1 pl-1 w-1/2 rounded-[5px]" />
      <ShimmerItem className="ml-1 mt-1 pl-1 w-1/3 rounded-[5px]" />
      <ShimmerItem className=" mt-1 pl-1 w-full h-full animate-none rounded-none" />
    </Shimmer>
  );

  return (
    <>
      {/* Cards */}
      <div className="px-1 sm:px-2 md:px-6 pt-6 gap-2 sm:gap-4 grid grid-cols-2 sm:grid-cols-5">
        <Suspense fallback={cardLoader}>
          <LazyCardLineChart
            title="0"
            subtitle="User Activity"
            curve="straight"
            color="#FF5733"
            theme={theme}
          />
        </Suspense>
        <Suspense fallback={cardLoader}>
          <LazyCardLineChart
            title="52"
            subtitle="Expense"
            symbol="$"
            curve="linestep"
            color="#FF5733"
            theme={theme}
          />
        </Suspense>
        <Suspense fallback={cardLoader}>
          <LazyCardLineChart
            title="44"
            subtitle="Sales"
            curve="smooth"
            symbol="%"
            color="#Fa1255"
            theme={theme}
          />
        </Suspense>
        <div className="h-[162px] flex overflow-hidden min-w-full sm:col-span-2 p-0">
          <DashboardCard
            title={t("Total Visits")}
            description={t("January")}
            className="overflow-hidden flex-1 space-y-2 h-full p-4"
            value={70}
            symbol="%"
            icon={
              <BarChart2 className="absolute text-primary/90 top-10 hidden md:block md:right-2 lg:right-4 size-[70px]" />
            }
          />
          <DashboardCard
            title={t("users")}
            description={t("September")}
            className="overflow-hidden flex-1 space-y-2 h-full p-4"
            value={50}
            symbol="+"
            icon={
              <PersonStanding className="absolute text-primary/90 top-10 hidden md:block md:right-2 lg:right-4 size-[70px]" />
            }
          />
        </div>
      </div>
      {/* Charts */}
      <div className="grid md:grid-cols-5 md:grid-rows-1 gap-x-2 gap-y-4 px-2 mt-4">
        <Card className="h-[420px] min-w-full md:col-span-3 p-0">
          <Suspense fallback={cardLoader}>
            <LazyDashedLineChart
              subtitle={t("Category Names as DataLabels inside bars")}
              title={t("Total Register Documents")}
              theme={theme}
            />
          </Suspense>
        </Card>
        <Card className="h-[420px] min-w-full md:col-span-2 p-0">
          <Suspense fallback={cardLoader}>
            <LazySimplePieChart theme={theme} />
          </Suspense>
        </Card>
        <Card className="h-[420px] min-w-full md:col-span-5 xl:col-span-3 p-0">
          <Suspense fallback={cardLoader}>
            <LazyBasicColumnChart
              theme={theme}
              subtitle={t("Category Names as DataLabels inside bars")}
              title={t("Page statistic")}
            />
          </Suspense>
        </Card>
        <Card className="h-[420px] min-w-full md:col-span-5 xl:col-span-2 p-0">
          <Suspense fallback={cardLoader}>
            <LazyColumnLabelBarChart
              subtitle={t("Category Names as DataLabels inside bars")}
              title={t("Page statistic")}
              theme={theme}
            />
          </Suspense>
        </Card>
      </div>
    </>
  );
}
