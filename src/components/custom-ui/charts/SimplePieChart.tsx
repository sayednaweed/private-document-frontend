import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Shimmer from "../shimmer/Shimmer";
import ShimmerItem from "../shimmer/ShimmerItem";
export interface SimplePieChartProps {
  title?: string;
  subtitle?: string;
  theme: string;
  series: {
    data: number[];
    label: string[];
  };
  loading: boolean;
}
export default function SimplePieChart(props: SimplePieChartProps) {
  const { theme, series, loading } = props;
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
    labels: series.label,
    dataLabels: {
      style: {
        fontSize: "10px",
      },
    },
    legend: {
      position: "bottom",
    },
  };

  return loading ? (
    <Shimmer className="hover:shadow-lg shadow-md min-h-full w-full overflow-hidden">
      <ShimmerItem className="pl-1 w-full h-[90%] animate-none mx-auto" />
      <ShimmerItem className="font-bold ml-1 mt-2 pl-1 w-1/2 rounded-[5px] mx-auto" />
    </Shimmer>
  ) : (
    <ReactApexChart
      options={options}
      series={series.data}
      type="pie"
      height={"100%"}
      width={"100%"}
    />
  );
}
