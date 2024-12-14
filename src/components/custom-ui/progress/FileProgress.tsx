import { SystemLanguage } from "@/context/GlobalStateContext";
import { Progress } from "@/database/tables";
import { toLocaleDate } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface FileProgressProps {
  list: Progress[] | undefined;
  state: any;
}
const FileProgress = (props: FileProgressProps) => {
  const { list, state } = props;
  return (
    <ol className="relative text-gray-500 border-gray-200 dark:border-gray-700 dark:text-gray-400">
      {list?.map((item: Progress, index: number) => {
        const lastStep = list.length - 1 == index;
        return (
          <Item
            state={state}
            key={item.destination}
            lastStep={lastStep}
            item={item}
            index={index}
          />
        );
      })}
    </ol>
  );
};

export default FileProgress;

interface ItemProps {
  item: Progress;
  lastStep: boolean;
  state: SystemLanguage;
  index: number;
}
const Item = (props: ItemProps) => {
  const { item, state, lastStep, index } = props;
  const { t } = useTranslation();
  return item.feedbackDate != null || item.step == null ? (
    <li className="mb-12 mx-8 relative">
      {/* Line */}
      {!lastStep && (
        <div className="absolute h-[130%] top-[31px] w-[1px] bg-primary rtl:-right-[29px] ltr:-left-[29px]" />
      )}
      {/* Circle */}
      <span
        className={`absolute z-10 bg-primary text-primary-foreground font-medium shadow-lg flex items-center justify-center w-8 h-8 rounded-full ltr:-start-11 rtl:-right-11`}
      >
        {item.step == null ? index + 1 : item.step}
      </span>
      <h3
        style={{ backgroundColor: item.color }}
        className={`font-medium w-fit ltr:text-xl-ltr rtl:text-4xl-rtl text-primary leading-tight p-2 rounded-sm`}
      >
        {item.destination}
      </h3>
      <p className={`ltr:text-xl-ltr text-primary/90 rtl:text-xl-rtl`}>
        <span
          className={`font-medium ltr:mr-2 rtl:ml-2 rtl:text-2xl-rtl ltr:text-xl-ltr`}
        >
          {t("send_date")}:
        </span>
        {toLocaleDate(new Date(item.sendDate), state)}
      </p>
      <p className={`ltr:text-xl-ltr text-primary/90 rtl:text-xl-rtl`}>
        <span
          className={`font-medium ltr:mr-2 rtl:ml-2 rtl:text-2xl-rtl ltr:text-xl-ltr`}
        >
          {t("submitted_by")}:
        </span>
        {item.username}
      </p>
      <p className={`ltr:text-xl-ltr text-primary/90 rtl:text-xl-rtl`}>
        <span
          className={`font-medium ltr:mr-2 rtl:ml-2 rtl:text-2xl-rtl ltr:text-xl-ltr`}
        >
          {t("feedback_date")}:
        </span>
        {toLocaleDate(new Date(item.feedbackDate), state)}
      </p>
      {item.feedback && (
        <p
          className={`ltr:text-xl-ltr text-primary/90 flex flex-col gap-y[2px] rtl:text-xl-rtl`}
        >
          <span
            className={`font-medium ltr:mr-2 rtl:ml-2  rtl:text-2xl-rtl ltr:text-xl-ltr`}
          >
            {t("feedback")}
          </span>
          <span className=" border p-2 rounded-md">{item.feedback}</span>
        </p>
      )}
    </li>
  ) : (
    <li className="mb-12 mx-8 relative">
      {/* Line */}
      {!lastStep && (
        <div className="absolute h-[130%] top-[31px] w-[1px] bg-primary/20 rtl:-right-[29px] ltr:-left-[29px]" />
      )}
      {/* Circle */}
      <span
        className={`absolute bg-gray-400 text-primary-foreground font-medium shadow-lg flex items-center justify-center w-8 h-8 rounded-full ltr:-start-11 rtl:-right-11`}
      >
        {item.step}
      </span>
      <h3
        className={`font-medium w-fit ltr:text-xl-ltr rtl:text-4xl-rtl text-primary/80 leading-tight p-2 rounded-sm bg-primary/20 `}
      >
        {item.destination}
      </h3>
      <p className={`ltr:text-xl-ltr text-primary/80 rtl:text-xl-rtl`}>
        <span
          className={`font-medium ltr:mr-2 rtl:ml-2 rtl:text-2xl-rtl ltr:text-xl-ltr`}
        >
          {t("send_date")}:
        </span>
        {toLocaleDate(new Date(item.sendDate), state)}
      </p>
      <p className={`ltr:text-xl-ltr text-primary/90 rtl:text-xl-rtl`}>
        <span
          className={`font-medium ltr:mr-2 rtl:ml-2 rtl:text-2xl-rtl ltr:text-xl-ltr`}
        >
          {t("submitted_by")}:
        </span>
        {item.username}
      </p>
    </li>
  );
};
