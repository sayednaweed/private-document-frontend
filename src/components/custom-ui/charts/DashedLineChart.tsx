import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Shimmer from "../shimmer/Shimmer";
import ShimmerItem from "../shimmer/ShimmerItem";
export interface DashedLineChartProps {
  title: string;
  subtitle: string;
  theme: string;
}
export default function DashedLineChart(props: DashedLineChartProps) {
  const { title, subtitle, theme } = props;
  const { t } = useTranslation();

  const [series, setSeries] = useState<any>([]);
  const sleep = async (seconds: number) =>
    new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  const loadData = async () => {
    // Do data loading operation
    await sleep(2);
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
  };
  useEffect(() => {
    loadData();
  }, []);
  const options: ApexOptions = {
    theme: {
      mode: theme == "dark" ? "dark" : "light",
      palette: "palette1",
      monochrome: {
        enabled: false,
        color: "#000",
        shadeTo: "light",
        shadeIntensity: 0.65,
      },
    },
    chart: {
      type: "line",
      zoom: {
        enabled: false,
      },
      height: "100%",
      background: "transparent", // Set the background to transparent
    },
    title: {
      text: title,
      align: "center",
      style: {
        fontSize: "14px",
      },
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
    legend: {
      tooltipHoverFormatter: function (val, opts) {
        return (
          val +
          " - <strong>" +
          opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
          "</strong>"
        );
      },
    },
    markers: {
      size: 0,
      hover: {
        sizeOffset: 6,
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
      },
      y: [
        {
          title: {
            formatter: function (val) {
              return val + " (mins)";
            },
          },
        },
        {
          title: {
            formatter: function (val) {
              return val + " per session";
            },
          },
        },
        {
          title: {
            formatter: function (val) {
              return val;
            },
          },
        },
      ],
    },
    grid: {
      borderColor: "#f1f1f1",
    },
  };

  return series.length == 0 ? (
    <Shimmer className="hover:shadow-lg shadow-md min-h-full w-full overflow-hidden">
      <ShimmerItem className="font-bold ml-1 mt-1 pl-1 w-1/2 rounded-[5px] mx-auto" />
      <ShimmerItem className="ml-1 mt-1 pl-1 w-1/3 rounded-[5px] mx-auto" />
      <ShimmerItem className=" mt-1 pl-1 w-full h-full animate-none rounded-none" />
    </Shimmer>
  ) : (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height={"100%"}
      width={"100%"}
    />
  );
}
