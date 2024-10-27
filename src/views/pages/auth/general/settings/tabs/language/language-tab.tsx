import { useGlobalState } from "@/context/GlobalStateContext";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import useUserDB from "@/lib/indexeddb/useUserDB";
import { CALENDAR, CALENDAR_FORMAT, SYSTEM_CALENDAR } from "@/lib/constants";
import { getCalender } from "@/lib/utils";
import LanguageChanger from "@/components/custom-ui/navbar/LanguageChanger";
export default function LanguageTab() {
  const [state, dispatch] = useGlobalState();
  const { updateAppCache } = useUserDB();
  const [calender, setCalendar] = useState(
    state.systemLanguage.info.calendarId
  );
  const [locale, setLocale] = useState(state.systemLanguage.info.localeId);
  const [format, setFormat] = useState(state.systemLanguage.format);
  const { t } = useTranslation();
  const onChangeCalendar = (value: string) => {
    const { locale, calender, calendarId, localeId } = getCalender(
      value,
      state.systemLanguage.info.localeId
    );
    dispatch({
      type: "changeLanguage",
      payload: {
        calendar: calender,
        local: locale,
        info: {
          calendarId: calendarId,
          localeId: localeId,
        },
        format: state.systemLanguage.format,
      },
    });
    updateAppCache({
      key: SYSTEM_CALENDAR,
      value: {
        calendarId: calendarId,
        localeId: localeId,
        format: state.systemLanguage.format,
      },
    });
    setCalendar(value);
  };
  const onChangeLocale = (value: string) => {
    const { locale, calender, calendarId, localeId } = getCalender(
      state.systemLanguage.info.calendarId,
      value
    );
    dispatch({
      type: "changeLanguage",
      payload: {
        calendar: calender,
        local: locale,
        info: {
          calendarId: calendarId,
          localeId: localeId,
        },
        format: state.systemLanguage.format,
      },
    });
    updateAppCache({
      key: SYSTEM_CALENDAR,
      value: {
        calendarId: calendarId,
        localeId: localeId,
        format: state.systemLanguage.format,
      },
    });
    setLocale(value);
  };
  const onChangeFormat = (value: string) => {
    dispatch({
      type: "changeLanguage",
      payload: {
        calendar: state.systemLanguage.calendar,
        local: state.systemLanguage.local,
        info: {
          calendarId: state.systemLanguage.info.calendarId,
          localeId: state.systemLanguage.info.localeId,
        },
        format: value,
      },
    });
    updateAppCache({
      key: SYSTEM_CALENDAR,
      value: {
        calendarId: state.systemLanguage.info.calendarId,
        localeId: state.systemLanguage.info.localeId,
        format: value,
      },
    });
    setFormat(value);
  };
  const defaultGroupText = "rtl:[&>*]:text-lg-rtl ltr:[&>*]:text-xl-ltr";
  const defaultLabelText = "rtl:text-2xl-rtl ltr:text-lg-ltr rtl:px-1";
  const defaultText = "rtl:text-xl-rtl ltr:text-xl-ltr";
  return (
    <section className="px-2 pt-2">
      <div>
        <Label className={defaultLabelText}>{t("system Language")}</Label>
        <LanguageChanger className="rounded-md !w-1/3" />
      </div>
      <div>
        <Label className={defaultLabelText}>{t("System Calendar")}</Label>
        <Select onValueChange={onChangeCalendar} value={calender}>
          <SelectTrigger className={`min-w-[180px] ${defaultText}`}>
            <SelectValue placeholder={t("Select system calendar")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup className={defaultGroupText}>
              <SelectLabel className="">{t("Calendars")}</SelectLabel>
              <SelectItem value={CALENDAR.Gregorian}>
                {t("Gregorian")}
              </SelectItem>
              <SelectItem value={CALENDAR.SOLAR}>{t("Solar Hijri")}</SelectItem>
              <SelectItem value={CALENDAR.LUNAR}>{t("Lunar Hijri")}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className={defaultLabelText}>{t("Calendar Locale")}</Label>
        <Select onValueChange={onChangeLocale} value={locale}>
          <SelectTrigger className={`min-w-[180px] ${defaultText}`}>
            <SelectValue placeholder={t("Select calendar locale")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup className={defaultGroupText}>
              <SelectLabel>{t("Locales")}</SelectLabel>
              <SelectItem value={CALENDAR.Gregorian}>{t("English")}</SelectItem>
              <SelectItem value={CALENDAR.SOLAR}>{t("Farsi")}</SelectItem>
              <SelectItem value={CALENDAR.LUNAR}>{t("Arabic")}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className={defaultLabelText}>{t("Calendar Format")}</Label>
        <Select onValueChange={onChangeFormat} value={format}>
          <SelectTrigger className={`min-w-[180px] ${defaultText}`}>
            <SelectValue
              className="text-header2"
              placeholder={t("Select calendar format")}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup className={defaultGroupText}>
              <SelectLabel>{t("Formats")}</SelectLabel>
              <SelectItem value={CALENDAR_FORMAT.format_1}>
                {t("format_1")}
              </SelectItem>
              <SelectItem value={CALENDAR_FORMAT.format_2}>
                {t("format_2")}
              </SelectItem>
              <SelectItem value={CALENDAR_FORMAT.format_3}>
                {t("format_3")}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
