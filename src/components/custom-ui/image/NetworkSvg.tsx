import axiosClient from "@/lib/axois-client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
export interface NetworkSvgProps extends React.HtmlHTMLAttributes<HTMLElement> {
  src: string;
}

const NetworkSvg = React.forwardRef<HTMLElement, NetworkSvgProps>(
  (props, ref: any) => {
    const { src, className } = props;
    const [svgContent, setSvgContent] = useState<string | undefined>(undefined);
    const iconStyle =
      "opacity-90 min-h-[18px] min-w-[20px] w-[20px] h-[18px] ltr:ml-2 rtl:mr-2";
    useEffect(() => {
      const fetchSvg = async () => {
        try {
          const response = await axiosClient.get(src);
          if (response.status == 200) {
            const svgData = await response.data;
            setSvgContent(svgData);
          } else {
            console.error("Failed to fetch SVG:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching SVG:", error);
        }
      };

      fetchSvg();
    }, []);

    return svgContent == undefined ? (
      <div className={`${iconStyle} bg-primary rounded-full animate-pulse`} />
    ) : (
      <div
        ref={ref}
        className={cn(
          `[&>svg>path]:fill-tertiary [&>svg>g>*]:fill-tertiary ${iconStyle}`,
          className
        )}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    );
  }
);

export default NetworkSvg;
