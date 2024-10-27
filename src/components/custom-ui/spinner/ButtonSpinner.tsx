import { cn } from "@/lib/utils";

export interface IButtonSpinnerProps {
  children: any;
  loading: boolean;
  className?: string;
}

export default function ButtonSpinner(props: IButtonSpinnerProps) {
  const { loading, children, className } = props;
  return (
    <>
      {loading && (
        <div className="relative w-[16px] h-[16px] ltr:mr-2 rtl:ml-2">
          {/* <!-- Outer Ring--> */}
          <div
            className="w-[16px] h-[16px] rounded-full absolute
              border border-solidborder-primary-border"
          />

          {/* <!-- Inner Ring --> */}
          <div
            className="w-[16px] h-[16px] rounded-full animate-spin absolute
              border border-solid border-primary-icon border-t-transparent"
          />
        </div>
      )}
      <h1 className={cn("", className)}>{children}</h1>
    </>
  );
}
