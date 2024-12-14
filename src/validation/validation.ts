import { Dispatch, SetStateAction } from "react";
import { ValidateItem, ValidationRule } from "./types";
import { t } from "i18next";
import { isFile } from "./utils";
import { isString } from "@/lib/utils";

export const validate = async (
  inputs: ValidateItem[],
  vData: any,
  setVError: any
) => {
  const errMap = new Map<string, string>();

  inputs.forEach((item: ValidateItem) => {
    const value: string = vData[item.name];
    for (let index = 0; index < item.rules.length; index++) {
      const rule: ValidationRule = item.rules[index];
      if (rule == "required") {
        // 1. If value is object return hence has a value
        if (Array.isArray(value)) {
          if (value.length == 0) {
            errMap.set(item.name, `${t(item.name)} ${t("is required")}`);
            break;
          }
        } else if (typeof value === "object") {
          return;
        }
        // 1. If value is File return hence has a value
        if (isFile(value)) {
          return;
          // 1. If value is boolean return hence has a value
        } else if (typeof value === "boolean") {
          return;
        } else if (value == undefined) {
          errMap.set(item.name, `${t(item.name)} ${t("is required")}`);
          // Allow one validation per loop to eliminate to much Rerender
          break;
        } else if (isString(value) && value.trim() == "") {
          errMap.set(item.name, `${t(item.name)} ${t("is required")}`);
          // Allow one validation per loop to eliminate to much Rerender
          break;
        }
      }
      const parts = rule.split(":");
      const length: number = parseInt(parts[1]);
      if ("max" == parts[0]) {
        if (value.length > length) {
          errMap.set(
            item.name,
            `${t(item.name)} ${t("is more than")} ${length} ${t("character")}`
          );
          // Allow one validation per loop to eliminate to much Rerender
          break;
        }
      }
      if ("min" == parts[0]) {
        if (value.length < length) {
          errMap.set(
            item.name,
            `${t(item.name)} ${t("is less than")} ${length} ${t("character")}`
          );
          // Allow one validation per loop to eliminate to much Rerender
          break;
        }
      }
    }
  });

  // Set if errors founds or set empty map if sucessfull.
  setVError(errMap);
  if (errMap.size == 0) {
    return true;
  }
  return false;
};

export const setServerError = (
  serverErrors: any,
  setError: Dispatch<SetStateAction<Map<string, string>>>
) => {
  const errMap = new Map<string, string>();
  for (const key in serverErrors) {
    errMap.set(key, t(serverErrors[key][0]));
  }
  setError(errMap);
};

export const separateFieldName = (fieldName: string): string => {
  // Replace capital letters with space followed by lowercase letters
  let separatedString = fieldName.replace(/(?<!^)([A-Z])/g, " $1");

  // Capitalize the first letter of the first word
  separatedString =
    separatedString.charAt(0).toUpperCase() + separatedString.slice(1);

  return separatedString;
};
