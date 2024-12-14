import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import Shimmer from "../shimmer/Shimmer";
import ShimmerItem from "../shimmer/ShimmerItem";
import { cn } from "@/lib/utils";
// import { useTranslation } from "react-i18next";

export interface RadialBarChartProps {
  title?: string;
  subtitle?: string;
  theme: string;
  shimmerClassName?: string;
  showToolbar?: boolean;
  width?: number;
  heigth?: number;
}
export default function RadialBarChart(props: RadialBarChartProps) {
  const {
    theme,
    title,
    subtitle,
    width,
    heigth,
    showToolbar,
    shimmerClassName,
  } = props;
  const [series, setSeries] = useState<any>([]);
  const sleep = async (seconds: number) =>
    new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  const loadData = async () => {
    // Do data loading operation
    await sleep(2);
    setSeries([
      {
        name: "Series 1",
        data: [80, 50, 30, 40, 100, 20],
      },
      {
        name: "Series 2",
        data: [20, 30, 40, 80, 20, 80],
      },
      {
        name: "Series 3",
        data: [44, 76, 78, 13, 43, 10],
      },
    ]);
  };
  useEffect(() => {
    loadData();
  }, []);
  const options: ApexOptions = {
    theme: {
      mode: theme == "dark" ? "dark" : "light",
      palette: "palette3",
      monochrome: {
        enabled: false,
        color: "#000",
        shadeTo: "light",
        shadeIntensity: 0.65,
      },
    },
    chart: {
      height: width == undefined ? "100%" : width,
      type: "radar",
      dropShadow: {
        enabled: true,
        blur: 1,
        left: 1,
        top: 1,
      },
      toolbar: {
        show: showToolbar == undefined ? false : showToolbar,
      },
    },
    title: {
      text: title,
      align: "center",
      style: {
        fontSize: "15px",
      },
    },
    subtitle: {
      text: subtitle,
      align: "center",
      style: {
        fontSize: "15px",
      },
    },
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.1,
    },
    markers: {
      size: 0,
    },
    yaxis: {
      stepSize: 20,
    },
    xaxis: {
      categories: ["2011", "2012", "2013", "2014", "2015", "2016"],
    },
  };

  return series.length == 0 ? (
    <Shimmer
      className={cn(
        "hover:shadow-lg shadow-md min-h-full w-full overflow-hidden",
        shimmerClassName
      )}
    >
      {title && (
        <ShimmerItem className="font-bold ml-1 mt-1 pl-1 w-1/2 rounded-[5px] mx-auto" />
      )}
      {title && (
        <ShimmerItem className="ml-1 mt-1 pl-1 w-1/3 rounded-[5px] mx-auto" />
      )}
      <ShimmerItem className="pl-1 w-full h-full animate-none rounded-none" />
    </Shimmer>
  ) : (
    <ReactApexChart
      options={options}
      series={series}
      type="radar"
      height={heigth == undefined ? "100%" : heigth}
    />
  );
}
