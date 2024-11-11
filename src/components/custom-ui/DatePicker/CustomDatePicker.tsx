import { useEffect, useRef, useState } from "react";
import { Calendar } from "react-multi-date-picker";
import DateObject from "react-date-object";
import { useTranslation } from "react-i18next";
import {
  afgMonthNamesEn,
  afgMonthNamesFa,
  CALENDAR,
  CALENDAR_LOCALE,
} from "@/lib/constants";
import { useGlobalState } from "@/context/GlobalStateContext";
import { cn, convertNumberToPersian } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

export interface CustomeDatePickerProps {
  dateOnComplete: (date: DateObject) => void;
  value: DateObject;
  className?: string;
  placeholder: string;
  place?: string;
  required?: boolean;
  requiredHint?: string;
  lable?: string;
  errorMessage?: string;
}

export default function CustomDatePicker(props: CustomeDatePickerProps) {
  const {
    dateOnComplete,
    value,
    className,
    placeholder,
    required,
    requiredHint,
    lable,
    errorMessage,
  } = props;
  const [state] = useGlobalState();
  const { i18n } = useTranslation();
  const direction = i18n.dir();
  const [visible, setVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState<DateObject>(value);
  const calendarRef = useRef<any>(null);

  useEffect(() => {
    // Add event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      calendarRef.current &&
      !calendarRef.current.contains(event.target as Node)
    ) {
      setVisible(false);
    }
  };
  const formatHijriDate = (date?: DateObject) => {
    try {
      if (date) {
        let month = "";
        let day: any;
        let year: any;
        if (state.systemLanguage.info.calendarId === CALENDAR.SOLAR) {
          if (state.systemLanguage.info.localeId === CALENDAR_LOCALE.farsi) {
            month = afgMonthNamesFa[date.monthIndex];
            day = convertNumberToPersian(date.day);
            year = convertNumberToPersian(date.year);
          } else if (
            state.systemLanguage.info.localeId === CALENDAR_LOCALE.english
          ) {
            month = afgMonthNamesEn[date.monthIndex];
            day = date.day;
            year = date.year;
          } else {
            month = date.month.name;
            day = date.day;
            year = date.year;
          }
        } else if (state.systemLanguage.info.calendarId === CALENDAR.LUNAR) {
          if (state.systemLanguage.info.localeId === CALENDAR_LOCALE.farsi) {
            month = afgMonthNamesFa[date.monthIndex];
            day = convertNumberToPersian(date.day);
            year = convertNumberToPersian(date.year);
          } else {
            month = date.month?.name;
            day = convertNumberToPersian(date.day);
            year = convertNumberToPersian(date.year);
          }
        } else {
          if (state.systemLanguage.info.localeId === CALENDAR_LOCALE.farsi) {
            day = convertNumberToPersian(date.day);
            year = convertNumberToPersian(date.year);
          } else {
            day = date.day;
            year = date.year;
          }
          month = date.month.name;
        }

        return `${month}, ${day}, ${year}`;
      }
    } catch (e: any) {
      console.log(e, "CustomDatePicker");
    }
    return undefined;
  };

  const handleDateChange = (date: DateObject) => {
    onVisibilityChange();
    // const format = "MM/DD/YYYY";
    // let object = { date, format };
    // const gre = new DateObject(object)
    // .convert(gregorian, gregorian_en)
    // .format();
    // const MiladiDate = date.toDate();
    dateOnComplete(date);

    if (date instanceof DateObject) setSelectedDates(date);
  };
  const onVisibilityChange = () => setVisible(!visible);

  let months: any = [];
  if (state.systemLanguage.info.calendarId === CALENDAR.SOLAR) {
    if (state.systemLanguage.info.localeId === CALENDAR_LOCALE.farsi) {
      months = afgMonthNamesFa;
    } else if (state.systemLanguage.info.localeId === CALENDAR_LOCALE.english) {
      months = afgMonthNamesEn;
    }
  }
  return (
    <div dir={direction} className="relative">
      {visible && (
        <Calendar
          ref={calendarRef}
          className="absolute top-10"
          onChange={handleDateChange}
          months={months}
          calendar={state.systemLanguage.calendar}
          locale={state.systemLanguage.local}
        />
      )}

      <div
        className={cn(
          `border relative px-3 py-1 rounded-md ${
            required || lable ? "mt-[20px]" : "mt-2"
          } ${errorMessage && "border-red-400"}`,
          className
        )}
        onClick={onVisibilityChange}
      >
        {required && (
          <span className="text-red-600 rtl:text-[13px] ltr:text-[11px] ltr:right-[10px] rtl:left-[10px] -top-[17px] absolute font-semibold">
            {requiredHint}
          </span>
        )}
        {selectedDates ? (
          <h1 className="flex items-center gap-x-2 text-ellipsis text-sm text-primary/80 text-nowrap">
            <CalendarDays className="size-[16px] inline-block text-tertiary rtl:ml-2 rtl:mr-2" />
            {formatHijriDate(selectedDates)}
          </h1>
        ) : (
          <h1 className="flex items-center gap-x-2 text-ellipsis text-sm text-primary/80 text-nowrap">
            <CalendarDays className="size-[16px] inline-block text-tertiary" />
            {placeholder}
          </h1>
        )}

        {lable && (
          <label
            htmlFor={lable}
            className="rtl:text-lg-rtl ltr:text-xl-ltr rtl:right-[4px] ltr:left-[4px] ltr:-top-[22px] rtl:-top-[24px] absolute font-semibold"
          >
            {lable}
          </label>
        )}
      </div>
      {errorMessage && (
        <h1 className="rtl:text-sm-rtl ltr:text-sm-ltr capitalize text-start text-red-400">
          {errorMessage}
        </h1>
      )}
    </div>
  );
}
