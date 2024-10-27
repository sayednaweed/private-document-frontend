import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import Shimmer from "../shimmer/Shimmer";
import ShimmerItem from "../shimmer/ShimmerItem";
export interface SimplePieChartProps {
  title?: string;
  subtitle?: string;
  theme: string;
}
export default function SimplePieChart(props: SimplePieChartProps) {
  const { theme } = props;
  const [series, setSeries] = useState<any>([]);
  const sleep = async (seconds: number) =>
    new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  const loadData = async () => {
    // Do data loading operation
    await sleep(2);
    setSeries([44, 55, 13, 43, 22]);
  };
  useEffect(() => {
    loadData();
  }, []);

  const options: ApexOptions = {
    theme: {
      mode: theme == "dark" ? "dark" : "light",
      palette: "palette4",
      monochrome: {
        enabled: false,
        color: "#000",
        shadeTo: "light",
        shadeIntensity: 0.65,
      },
    },
    chart: {
      background: "transparent", // Set the background to transparent
      type: "pie",
      height: "100%",
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: true,
          selection: true,
          pan: false,
        },
      },
    },
    labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
    dataLabels: {
      style: {
        fontSize: "10px",
      },
    },
    legend: {
      position: "bottom",
    },
  };

  return series.length == 0 ? (
    <Shimmer className="hover:shadow-lg shadow-md min-h-full w-full overflow-hidden">
      <ShimmerItem className="pl-1 w-full h-[90%] animate-none mx-auto" />
      <ShimmerItem className="font-bold ml-1 mt-2 pl-1 w-1/2 rounded-[5px] mx-auto" />
    </Shimmer>
  ) : (
    <ReactApexChart
      options={options}
      series={series}
      type="pie"
      height={"100%"}
      width={"100%"}
    />
  );
}
