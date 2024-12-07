import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Shimmer from "../shimmer/Shimmer";
import ShimmerItem from "../shimmer/ShimmerItem";

export interface DashedLineChartProps {
  title?: string;
  subtitle?: string;
  theme?: string;
  seriesData?: any[];
}

export default function DashedLineChart(props: DashedLineChartProps) {
  const { title, subtitle, theme, seriesData } = props;
  const { t } = useTranslation();

  const [series, setSeries] = useState<any>(seriesData || []);

  const loadData = () => {
    if (!seriesData || seriesData.length === 0) {
      setSeries([
        {
          name: t("Session Duration"),
          data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
        },
        {
          name: t("Page Views"),
          data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35],
        },
        {
          name: t("Total Visits"),
          data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47],
        },
      ]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const options: ApexOptions = {
    theme:  {
      mode:  theme === "dark" ? "dark" : "light",
    },
    chart: {
      type: "line",
      height: "100%",
    },
    title: {
      text: title,
      align: "center",
    },
    subtitle: {
      text: subtitle,
      align: "center",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [2, 3, 4],
      curve: "straight",
      dashArray: [0, 8, 5],
    },
    tooltip: {
      style: {
        fontSize: "12px",
      },
    },
  };

  return series.length === 0 ? (
    <Shimmer>
      <ShimmerItem className="font-bold ml-1 mt-1 pl-1 w-1/2 rounded-[5px] mx-auto" />
      <ShimmerItem className="ml-1 mt-1 pl-1 w-1/3 rounded-[5px] mx-auto" />
      <ShimmerItem className="mt-1 pl-1 w-full h-full animate-none rounded-none" />
    </Shimmer>
  ) : (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height="100%"
      width="100%"
    />
  );
}

DashedLineChart.defaultProps = {
  title: "Default Title",
  subtitle: "Default Subtitle",
  theme: "light",
  seriesData: [],
};
