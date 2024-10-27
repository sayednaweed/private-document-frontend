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
import DatePanel from "react-multi-date-picker/plugins/date_panel";

export interface CustomMultiDatePickerProps {
  dateOnComplete: (selectedDates: DateObject[]) => void;
  value: DateObject[];
}

export default function CustomMultiDatePicker(
  props: CustomMultiDatePickerProps
) {
  const { dateOnComplete, value } = props;
  const [state] = useGlobalState();
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const [visible, setVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState<DateObject[]>(value);
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

  const handleDateChange = (selectedDates: DateObject[]) => {
    // let object = { date, format };
    // const gre = new DateObject(object)
    // .convert(gregorian, gregorian_en)
    // .format();
    dateOnComplete(selectedDates);
    setSelectedDates(selectedDates);
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
          value={selectedDates}
          ref={calendarRef}
          className="absolute font-segoe top-10 rtl:right-[-50%] ltr:left-[-50%]"
          onChange={handleDateChange}
          months={months}
          range
          plugins={[<DatePanel />]}
          calendar={state.systemLanguage.calendar}
          locale={state.systemLanguage.local}
        />
      )}

      <div className="border px-3 py-1 rounded-md" onClick={onVisibilityChange}>
        {selectedDates && selectedDates.length > 0 ? (
          <div className="flex items-center gap-x-2 text-ellipsis rtl:text-lg-rtl ltr:text-lg-ltr text-primary/80 text-nowrap">
            <CalendarDays className="size-[16px] inline-block text-tertiary rtl:ml-2 rtl:mr-2" />
            {selectedDates.map((date: DateObject, index: number) => (
              <div key={index} className="flex gap-x-2">
                {index % 2 == 1 && (
                  <h1 className="text-tertiary font-semibold">
                    {state.systemLanguage.info.localeId ===
                      CALENDAR_LOCALE.farsi ||
                    state.systemLanguage.info.localeId ===
                      CALENDAR_LOCALE.arabic
                      ? "به"
                      : "to"}
                  </h1>
                )}
                <h1>{formatHijriDate(date)}</h1>
              </div>
            ))}
          </div>
        ) : (
          <h1 className="flex items-center gap-x-2 text-ellipsis rtl:text-lg-rtl ltr:text-lg-ltr text-primary/80 text-nowrap">
            <CalendarDays className="size-[16px] inline-block text-tertiary" />
            {t("Select a date")}
          </h1>
        )}
      </div>
    </div>
  );
}
