import { SelectUserPermission, UserPermission } from "@/database/tables";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserInformation } from "./types";
import axiosClient from "./axois-client";
import arabic_ar from "react-date-object/locales/arabic_ar";
import arabic_en from "react-date-object/locales/arabic_en";
import arabic_fa from "react-date-object/locales/arabic_fa";
import gregorian_fa from "react-date-object/locales/gregorian_fa";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import persian_ar from "react-date-object/locales/persian_ar";
import persian_en from "react-date-object/locales/persian_en";
import { CALENDAR, CALENDAR_LOCALE } from "./constants";
import gregorian from "react-date-object/calendars/gregorian";
import arabic from "react-date-object/calendars/arabic";
import persian from "react-date-object/calendars/persian";
import { DateObject } from "react-multi-date-picker";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const isString = (value: any) => typeof value === "string";

export const returnPermissions = (
  permissions: any
): Map<string, UserPermission> => {
  const permissionMap = new Map<string, UserPermission>();
  if (permissions != null || permissions != undefined) {
    for (let i = 0; i < permissions.length; i++) {
      const item: any = permissions[i];
      const permission: UserPermission = {
        id: item.id,
        edit: item.edit == "1" ? true : false,
        view: item.view == "1" ? true : false,
        delete: item.delete == "1" ? true : false,
        add: item.add == "1" ? true : false,
        icon: item.icon,
        priority: item.priority,
        permission: item.permission,
      };
      permissionMap.set(item.permission, permission);
    }
  }
  return permissionMap;
};
export const userWithPermissions = (response: any): UserInformation => {
  const user = response.data.user as UserInformation;
  const permissions = response.data.permission;

  const permissionMap = new Map<string, SelectUserPermission>();
  if (permissions != null || permissions != undefined) {
    let allSelected: boolean = false;
    let counter: number = 0;
    for (let i = 0; i < permissions.length; i++) {
      const item: any = permissions[i];
      const edit = item.edit;
      const view = item.view;
      // When variable name is delete arises delete is not allowed
      const erase = item.delete;
      const add = item.add;
      allSelected = edit && view && erase && add ? true : false;
      if (!allSelected) counter++;
      const permission: SelectUserPermission = {
        id: item.id,
        edit: edit,
        view: view,
        delete: erase,
        add: add,
        icon: item.icon,
        priority: item.priority,
        permission: item.permission,
        allSelected: allSelected,
      };
      permissionMap.set(permission.permission, permission);
    }
    user.allSelected = counter == 0 ? true : false;
  }

  user.permission = permissionMap;
  return user;
};

export const loadFont = async (direction: string) => {
  if (direction == "rtl") {
    try {
      const response = await axiosClient.get("system-font/" + direction, {
        responseType: "blob",
        // headers: {
        //   "Cache-Control": "no-cache", // Prevent caching
        // },
      });

      const fontBlob = response.data;
      const fontUrl = URL.createObjectURL(fontBlob);

      const fontFace = new FontFace("customFont", `url(${fontUrl})`);
      await fontFace.load();
      document.fonts.add(fontFace);

      // Optionally set it as the default font
      document.body.style.fontFamily = "customFont, sans-serif";
    } catch (error) {
      console.error("Error loading font:", error);
    }
  } else document.body.style.fontFamily = "Segoe UI";
};

export const getCalender = (calendar: string, locale: string) => {
  //
  if (calendar === CALENDAR.Gregorian) {
    if (locale === CALENDAR_LOCALE.english) {
      return {
        locale: gregorian_en,
        calender: gregorian,
        calendarId: CALENDAR.Gregorian,
        localeId: CALENDAR_LOCALE.english,
      };
    } else if (locale === CALENDAR_LOCALE.arabic) {
      return {
        locale: gregorian_ar,
        calender: gregorian,
        calendarId: CALENDAR.Gregorian,
        localeId: CALENDAR_LOCALE.arabic,
      };
    } else {
      return {
        locale: gregorian_fa,
        calender: gregorian,
        calendarId: CALENDAR.Gregorian,
        localeId: CALENDAR_LOCALE.farsi,
      };
    }
  } else if (calendar === CALENDAR.SOLAR) {
    if (locale === CALENDAR_LOCALE.english) {
      return {
        locale: persian_en,
        calender: persian,
        calendarId: CALENDAR.SOLAR,
        localeId: CALENDAR_LOCALE.english,
      };
    } else if (locale === CALENDAR_LOCALE.arabic) {
      return {
        locale: persian_ar,
        calender: persian,
        calendarId: CALENDAR.SOLAR,
        localeId: CALENDAR_LOCALE.arabic,
      };
    } else {
      return {
        locale: persian_fa,
        calender: persian,
        calendarId: CALENDAR.SOLAR,
        localeId: CALENDAR_LOCALE.farsi,
      };
    }
  } else {
    if (locale === CALENDAR_LOCALE.english) {
      return {
        locale: arabic_en,
        calender: arabic,
        calendarId: CALENDAR.LUNAR,
        localeId: CALENDAR_LOCALE.english,
      };
    } else if (locale === CALENDAR_LOCALE.arabic) {
      return {
        locale: arabic_ar,
        calender: arabic,
        calendarId: CALENDAR.LUNAR,
        localeId: CALENDAR_LOCALE.arabic,
      };
    } else {
      return {
        locale: arabic_fa,
        calender: arabic,
        calendarId: CALENDAR.LUNAR,
        localeId: CALENDAR_LOCALE.farsi,
      };
    }
  }
};
export const convertNumberToPersian = (num: number): string => {
  // Map English digits to Persian digits
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  // Convert the number to a string and replace each digit
  return num
    .toString()
    .replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

export const toLocaleDate = (date: Date, state: any) => {
  const format = state.systemLanguage.format;
  let object = { date, format };
  const gre = new DateObject(object)
    .convert(state.systemLanguage.calendar, state.systemLanguage.local)
    .format();
  return gre;
};
