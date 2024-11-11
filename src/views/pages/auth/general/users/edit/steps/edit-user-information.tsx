import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { CalendarDays, Mail, Phone, RefreshCcw, UserRound } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CustomCheckbox from "@/components/custom-ui/checkbox/CustomCheckbox";
import { toast } from "@/components/ui/use-toast";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import axiosClient from "@/lib/axois-client";
import { useAuthState } from "@/context/AuthContextProvider";
import { SECTION_NAMES } from "@/lib/constants";
import { setServerError, validate } from "@/validation/validation";
import { toLocaleDate } from "@/lib/utils";
import { UserInformation } from "@/lib/types";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { useGlobalState } from "@/context/GlobalStateContext";
import FakeCombobox from "@/components/custom-ui/combobox/FakeCombobox";
import { UserPermission } from "@/database/tables";
export interface EditUserInformationProps {
  id: string | undefined;
  failed: boolean;
  userData: UserInformation | undefined;
  setUserData: Dispatch<SetStateAction<UserInformation | undefined>>;
  refreshPage: () => Promise<void>;
}
export default function EditUserInformation(props: EditUserInformationProps) {
  const { id, failed, userData, setUserData, refreshPage } = props;
  const [tempUserData, setTempUserData] = useState<UserInformation | undefined>(
    userData
  );
  const { user } = useAuthState();
  const [state] = useGlobalState();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Map<string, string>>(new Map());
  const per: UserPermission | undefined = user?.permissions.get(
    SECTION_NAMES.users
  );
  const hasEdit = per ? per?.edit : false;

  useEffect(() => {
    setTempUserData(userData);
  }, [userData]);
  const handleChange = (e: any) => {
    if (tempUserData) {
      const { name, value } = e.target;
      setTempUserData({ ...tempUserData, [name]: value });
    }
  };
  const saveData = async () => {
    if (loading || tempUserData === undefined || id === undefined) {
      setLoading(false);
      return;
    }
    setLoading(true);
    // 1. Validate form
    const passed = await validate(
      [
        {
          name: "fullName",
          rules: ["required", "max:45", "min:3"],
        },
        {
          name: "username",
          rules: ["required", "max:45", "min:3"],
        },
        {
          name: "email",
          rules: ["required", "max:45", "min:3"],
        },
        {
          name: "destination",
          rules: ["required"],
        },
        {
          name: "job",
          rules: ["required"],
        },
        {
          name: "role",
          rules: ["required"],
        },
        {
          name: "status",
          rules: ["required"],
        },
        {
          name: "grantPermission",
          rules: ["required"],
        },
      ],
      tempUserData,
      setError
    );
    if (!passed) {
      setLoading(false);
      return;
    }
    // 2. Store
    const formData = new FormData();
    formData.append("id", id);
    formData.append("fullName", tempUserData.fullName);
    formData.append("username", tempUserData.username);
    formData.append("contact", tempUserData.contact);
    formData.append("email", tempUserData.email);
    formData.append("destination", tempUserData.destination.id);
    formData.append("job", tempUserData.job.id);
    formData.append("role", tempUserData.role.id);
    formData.append("status", tempUserData.status ? "true" : "false");
    formData.append("grant", tempUserData.grantPermission ? "true" : "false");
    try {
      const response = await axiosClient.post("user/update", formData);
      if (response.status == 200) {
        // Update user state
        setUserData(tempUserData);
        toast({
          toastType: "SUCCESS",
          title: t("Success"),
          description: response.data.message,
        });
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("Error"),
        description: error.response.data.message,
      });
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("Account information")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("Update user account information")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {failed ? (
          <h1>{t("You are not authorized!")}</h1>
        ) : tempUserData === undefined ? (
          <NastranSpinner />
        ) : (
          <div className="grid gap-4 w-full sm:w-[70%] md:w-1/2">
            <CustomInput
              required={true}
              lable={t("name")}
              requiredHint={`* ${t("Required")}`}
              size_="sm"
              name="fullName"
              defaultValue={tempUserData["fullName"]}
              placeholder={t("Enter your name")}
              type="text"
              errorMessage={error.get("fullName")}
              onBlur={handleChange}
              startContent={
                <UserRound className="text-tertiary size-[18px] pointer-events-none" />
              }
            />
            <CustomInput
              required={true}
              requiredHint={`* ${t("Required")}`}
              size_="sm"
              lable={t("username")}
              name="username"
              defaultValue={tempUserData["username"]}
              placeholder={t("Enter username")}
              type="text"
              errorMessage={error.get("username")}
              onBlur={handleChange}
              startContent={
                <UserRound className="text-tertiary size-[18px] pointer-events-none" />
              }
            />
            <CustomInput
              size_="sm"
              name="email"
              required={true}
              lable={t("email")}
              requiredHint={`* ${t("Required")}`}
              defaultValue={tempUserData["email"]}
              placeholder={t("Enter your email")}
              type="email"
              errorMessage={error.get("email")}
              onChange={handleChange}
              startContent={
                <Mail className="text-tertiary size-[18px] pointer-events-none" />
              }
            />
            <CustomInput
              dir="ltr"
              className="rtl:text-end"
              size_="sm"
              lable={t("contact")}
              placeholder={t("Enter your phone number")}
              defaultValue={tempUserData["contact"]}
              type="text"
              name="contact"
              errorMessage={error.get("contact")}
              onChange={handleChange}
              startContent={
                <Phone className="text-tertiary size-[18px] pointer-events-none" />
              }
            />

            <APICombobox
              placeholderText={t("Search item")}
              errorText={t("No item")}
              onSelect={(selection: any) =>
                setTempUserData({ ...tempUserData, ["destination"]: selection })
              }
              lable={t("destination")}
              required={true}
              requiredHint={`* ${t("Required")}`}
              selectedItem={tempUserData["destination"]?.name}
              placeHolder={t("Select a destination")}
              errorMessage={error.get("destination")}
              apiUrl={"destinations"}
              mode="single"
            />
            <APICombobox
              placeholderText={t("Search item")}
              errorText={t("No item")}
              required={true}
              requiredHint={`* ${t("Required")}`}
              onSelect={(selection: any) =>
                setTempUserData({ ...tempUserData, ["job"]: selection })
              }
              lable={t("job")}
              selectedItem={tempUserData["job"]?.name}
              placeHolder={t("Select a job")}
              errorMessage={error.get("job")}
              apiUrl={"jobs"}
              mode="single"
            />
            <APICombobox
              placeholderText={t("Search item")}
              errorText={t("No item")}
              onSelect={(selection: any) =>
                setTempUserData({ ...tempUserData, ["role"]: selection })
              }
              required={true}
              lable={t("role")}
              requiredHint={`* ${t("Required")}`}
              selectedItem={tempUserData["role"]?.name}
              placeHolder={t("Select a role")}
              errorMessage={error.get("role")}
              apiUrl={"roles"}
              mode="single"
            />
            <FakeCombobox
              icon={
                <CalendarDays className="size-[16px] text-tertiary absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
              }
              title={t("Join date")}
              selected={toLocaleDate(new Date(tempUserData.createdAt), state)}
            />
            <CustomCheckbox
              checked={tempUserData["status"]}
              onCheckedChange={(value: boolean) =>
                setTempUserData({ ...tempUserData, status: value })
              }
              parentClassName="rounded-md py-[12px] gap-x-1 bg-card border px-[10px]"
              text={t("status")}
              description={t("set account to active or deactive")}
              required={true}
              requiredHint={`* ${t("Required")}`}
              errorMessage={error.get("status")}
            />
            <CustomCheckbox
              checked={tempUserData["grantPermission"]}
              onCheckedChange={(value: boolean) =>
                setTempUserData({ ...tempUserData, grantPermission: value })
              }
              parentClassName="rounded-md py-[12px] gap-x-1 bg-card border px-[10px]"
              text={t("grant")}
              description={t("Allows user to grant")}
              errorMessage={error.get("grantPermission")}
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        {failed ? (
          <PrimaryButton
            onClick={async () => await refreshPage()}
            className="bg-red-500 hover:bg-red-500/70"
          >
            {t("Failed Retry")}
            <RefreshCcw className="ltr:ml-2 rtl:mr-2" />
          </PrimaryButton>
        ) : (
          tempUserData &&
          hasEdit && (
            <PrimaryButton
              onClick={async () => {
                if (user?.permissions.get(SECTION_NAMES.users)?.edit)
                  await saveData();
              }}
              className={`shadow-lg`}
            >
              <ButtonSpinner loading={loading}>{t("Save")}</ButtonSpinner>
            </PrimaryButton>
          )
        )}
      </CardFooter>
    </Card>
  );
}
