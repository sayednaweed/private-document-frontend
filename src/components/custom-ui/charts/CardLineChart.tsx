import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import Card from "../card/Card";
import Shimmer from "../shimmer/Shimmer";
import ShimmerItem from "../shimmer/ShimmerItem";
import AnimatedNumber from "../card/AnimatedNumber";

export type Series = {
  data: number[];
  color: string;
}[];
export type Curve =
  | "smooth"
  | "straight"
  | "stepline"
  | "linestep"
  | "monotoneCubic";
export interface CardLineChartProps {
  curve: Curve;
  title: string;
  subtitle: string;
  color: string;
  theme: string;
  symbol?: string;
}
export default function CardLineChart(props: CardLineChartProps) {
  const { curve, title, subtitle, color, theme, symbol } = props;
  const [series, setSeries] = useState<Series>([]);
  const sleep = async (seconds: number) =>
    new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  const loadData = async () => {
    // Do data loading operation
    await sleep(2);
    setSeries([
      {
        data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
        color: color, // Custom color for Series 1
      },
    ]);
  };
  useEffect(() => {
    loadData();
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "line",
      sparkline: {
        enabled: true,
      },
      background: "transparent", // Set the background to transparent
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: false,
          selection: true,
          pan: false,
        },
      },
    },
    theme: {
      mode: theme == "dark" ? "dark" : "light",
      palette: "palette4",
      monochrome: {
        enabled: false,
        color: "transparent",
        shadeTo: "light",
        shadeIntensity: 0.65,
      },
    },
    stroke: {
      curve: curve,
    },
    fill: {
      opacity: 0.3,
    },
    yaxis: {
      min: 0,
      show: false,
    },
  };

  return (
    <Card className="hover:shadow-lg shadow-md h-[160px] p-0 overflow-hidden">
      {series.length == 0 ? (
        <Shimmer className="hover:shadow-lg shadow-md h-full overflow-hidden">
          <ShimmerItem className="font-bold ml-1 mt-1 pl-1 w-1/2 rounded-[5px]" />
          <ShimmerItem className="ml-1 mt-1 pl-1 w-1/3 rounded-[5px]" />
          <ShimmerItem className=" mt-1 pl-1 w-full h-full animate-none rounded-none" />
        </Shimmer>
      ) : (
        <>
          <AnimatedNumber
            className="font-bold px-2"
            min={0}
            symbol={symbol}
            max={parseInt(title.replace(/\$/g, "").replace(/,/g, ""), 10)}
          />
          <h1 className="px-2">{subtitle}</h1>
          <div className="rtl:scale-x-[-1]">
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              height="115px"
              width="100%"
            />
          </div>
        </>
      )}
    </Card>
  );
}
