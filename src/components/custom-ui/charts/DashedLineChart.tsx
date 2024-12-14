import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Shimmer from "../shimmer/Shimmer";
import ShimmerItem from "../shimmer/ShimmerItem";
import { useTranslation } from "react-i18next";
export interface DashedLineChartProps {
  title: string;
  subtitle: string;
  theme: string;
  series: {
    name: string;
    data: number[];
  }[];
  loading: boolean;
}
export default function DashedLineChart(props: DashedLineChartProps) {
  const { title, subtitle, theme, series, loading } = props;
  const { i18n } = useTranslation();

  const direction = i18n.dir();

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
        fontSize: direction == "ltr" ? "14px" : "18px",
      },
    },
    subtitle: {
      text: subtitle,
      align: "center",
      style: {
        fontSize: direction == "ltr" ? "14px" : "17px",
      },
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
        fontSize: "16px",
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

  return loading ? (
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
