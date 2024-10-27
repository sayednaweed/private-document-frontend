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
import { convertNumberToPersian } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

export interface CustomeDatePickerProps {
  dateOnComplete: (date: Date) => void;
}

export default function CustomDatePicker(props: CustomeDatePickerProps) {
  const { dateOnComplete } = props;
  const [state] = useGlobalState();
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const [visible, setVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState<DateObject>();
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
          month = date.month.name;
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
    return undefined;
  };

  const handleDateChange = (date: DateObject) => {
    onVisibilityChange();
    // const format = "MM/DD/YYYY";
    // let object = { date, format };
    const MiladiDate = date.toDate();
    // const gre = new DateObject(object)
    // .convert(gregorian, gregorian_en)
    // .format();
    dateOnComplete(MiladiDate);

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
          className="absolute top-10 rtl:right-[-50%] ltr:left-[-50%]"
          onChange={handleDateChange}
          months={months}
          calendar={state.systemLanguage.calendar}
          locale={state.systemLanguage.local}
        />
      )}

      <div className="border px-3 py-1 rounded-md" onClick={onVisibilityChange}>
        {selectedDates ? (
          <h1 className="flex items-center gap-x-2 text-ellipsis text-sm text-primary/80 text-nowrap">
            <CalendarDays className="size-[16px] inline-block text-tertiary rtl:ml-2 rtl:mr-2" />
            {formatHijriDate(selectedDates)}
          </h1>
        ) : (
          <h1 className="flex items-center gap-x-2 text-ellipsis text-sm text-primary/80 text-nowrap">
            <CalendarDays className="size-[16px] inline-block text-tertiary" />
            {t("Select a date")}
          </h1>
        )}
      </div>
    </div>
  );
}
