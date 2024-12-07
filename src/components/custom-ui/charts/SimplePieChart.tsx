import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import Shimmer from "../shimmer/Shimmer";
import ShimmerItem from "../shimmer/ShimmerItem";

export interface SimplePieChartProps {
  title?: string;
  subtitle?: string;
  theme: string;
  series?: any[]; // Type adjusted for series data (counts)
  labels?: string[];  // Define type for labels
}

export default function SimplePieChart(props: SimplePieChartProps) {
  const { theme, series, labels } = props;
  const [chartSeries, setChartSeries] = useState<any[]>([]); // State to hold percentage data
  const sleep = async (seconds: number) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

  const loadData = async () => {
    // Simulating an API call with a 2-second delay
    await sleep(2);
    const counts = [44, 55, 13, 43, 22]; // Example counts for the pie chart

    // Calculate total count
    const total = counts.reduce((acc, val) => acc + val, 0);

    // Calculate percentages
    const percentages = counts.map(count => (total > 0 ? (count / total) * 100 : 0));

    setChartSeries(percentages); // Update the series state with percentage values
  };

  useEffect(() => {
    if (series) {
      const total = series.reduce((acc, val) => acc + val, 0); // Calculate total if series is passed
      const percentages = series.map(count => (total > 0 ? (count / total) * 100 : 0));
      setChartSeries(percentages);
    } else {
      loadData();
    }
  }, [series]);

  const options: ApexOptions = {
    theme: {
      mode: theme === "dark" ? "dark" : "light",
      palette: "palette4",
      monochrome: {
        enabled: false,
        color: "#000",
        shadeTo: "light",
        shadeIntensity: 0.65,
      },
    },
    chart: {
      background: "transparent", // Set background to transparent
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
    labels: labels || ["Team A", "Team B", "Team C", "Team D", "Team E"], // Use passed labels or default
    dataLabels: {
      style: {
        fontSize: "10px",
      },
    },
    legend: {
      position: "bottom",
    },
  };

  return chartSeries.length === 0 ? (
    <Shimmer className="hover:shadow-lg shadow-md min-h-full w-full overflow-hidden">
      <ShimmerItem className="pl-1 w-full h-[90%] animate-none mx-auto" />
      <ShimmerItem className="font-bold ml-1 mt-2 pl-1 w-1/2 rounded-[5px] mx-auto" />
    </Shimmer>
  ) : (
    <ReactApexChart
      options={options}
      series={chartSeries}
      type="pie"
      height={"100%"}
      width={"100%"}
    />
  );
}
