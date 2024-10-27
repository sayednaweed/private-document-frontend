import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Shimmer from "../shimmer/Shimmer";
import ShimmerItem from "../shimmer/ShimmerItem";
export interface ColumnLabelBarChartProps {
  title: string;
  subtitle: string;
  theme: string;
}
export default function ColumnLabelBarChart(props: ColumnLabelBarChartProps) {
  const { theme, title, subtitle } = props;
  const { t } = useTranslation();
  const [series, setSeries] = useState<any>([]);
  const sleep = async (seconds: number) =>
    new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  const loadData = async () => {
    // Do data loading operation
    await sleep(2);
    setSeries([
      {
        name: "Inflation",
        data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2],
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
      height: 350,
      type: "bar",
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + "%";
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
      },
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
      position: "bottom",
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#BED1E6",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: function (val) {
          return val + "%";
        },
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
