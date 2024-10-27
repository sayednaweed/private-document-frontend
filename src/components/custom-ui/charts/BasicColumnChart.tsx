import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Shimmer from "../shimmer/Shimmer";
import ShimmerItem from "../shimmer/ShimmerItem";
export interface BasicColumnChartProps {
  title: string;
  subtitle: string;
  theme: string;
}
export default function BasicColumnChart(props: BasicColumnChartProps) {
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
        name: t("Net Profit"),
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 11, 22, 4],
      },
      {
        name: t("Revenue"),
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 11, 22, 4],
      },
      {
        name: t("Free Cash Flow"),
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41, 11, 22, 4],
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
      background: "transparent", // Set the background to transparent
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
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
    xaxis: {
      categories: [
        t("Jan"),
        t("Feb"),
        t("Mar"),
        t("Apr"),
        t("May"),
        t("Jun"),
        t("Jul"),
        t("Aug"),
        t("Sep"),
        t("Oct"),
        t("Nov"),
        t("Dec"),
      ],
    },

    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$" + val;
        },
      },
    },
  };
  return series.length == 0 ? (
    <Shimmer className="hover:shadow-lg shadow-md min-h-full w-full overflow-hidden">
      <ShimmerItem className="font-bold ml-1 mt-1 pl-1 w-1/2 rounded-[5px] mx-auto" />
      <ShimmerItem className="ml-1 mt-1 pl-1 w-1/3 rounded-[5px] mx-auto" />
      <ShimmerItem className=" mt-1 pl-1 w-full h-full animate-none rounded-none" />
    </Shimmer>
  ) : (
    <ReactApexChart options={options} series={series} type="bar" height={350} />
  );
}
