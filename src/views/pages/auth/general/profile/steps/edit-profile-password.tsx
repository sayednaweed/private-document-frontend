import CustomInput from "@/components/custom-ui/input/CustomInput";
import { useState } from "react";
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
import axiosClient from "@/lib/axois-client";
import { useAuthState } from "@/context/AuthContextProvider";
import { setServerError, validate } from "@/validation/validation";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";

export function EditProfilePassword() {
  const { logout } = useAuthState();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Map<string, string>>(new Map());
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
    oldPassword: "",
  });
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };
  const saveData = async () => {
    if (loading) return;
    try {
      setLoading(true);
      // 1. Validate before submission
      const result: boolean = await validate(
        [
          { name: "newPassword", rules: ["required", "max:45", "min:8"] },
          { name: "confirmPassword", rules: ["required", "max:45", "min:8"] },
          { name: "oldPassword", rules: ["required", "max:45", "min:8"] },
        ],
        passwordData,
        setError
      );
      if (!result) {
        setLoading(false);
        return;
      }

      // 2. Add data
      const formData = new FormData();
      formData.append("newPassword", passwordData.newPassword);
      formData.append("oldPassword", passwordData.oldPassword);
      formData.append("confirmPassword", passwordData.confirmPassword);
      const response = await axiosClient.post(
        "profile/change-password",
        formData
      );
      if (response.status == 200) {
        toast({
          toastType: "SUCCESS",
          title: t("Success"),
          description: response.data.message,
        });
        // If user changed his password he must login again
        await logout();
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
      <CardHeader className="space-y-2">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("Update account password")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("Update_Password_Description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 w-full sm:w-[70%] md:w-1/2">
          <CustomInput
            size_="sm"
            lable={t("password")}
            name="oldPassword"
            defaultValue={passwordData.oldPassword}
            onChange={handleChange}
            placeholder={t("oldPassword")}
            errorMessage={error.get("oldPassword")}
            type={"password"}
          />
          <CustomInput
            size_="sm"
            name="newPassword"
            defaultValue={passwordData.newPassword}
            onChange={handleChange}
            lable={t("newPassword")}
            placeholder={t("newPassword")}
            errorMessage={error.get("newPassword")}
            type={"password"}
          />
          <CustomInput
            size_="sm"
            name="confirmPassword"
            defaultValue={passwordData.confirmPassword}
            onChange={handleChange}
            placeholder={t("confirmPassword")}
            lable={t("newPassword")}
            errorMessage={error.get("confirmPassword")}
            type={"password"}
          />
        </div>
      </CardContent>
      <CardFooter>
        <PrimaryButton
          onClick={async () => {
            await saveData();
          }}
          className={`shadow-lg`}
        >
          <ButtonSpinner loading={loading}>{t("Save")}</ButtonSpinner>
        </PrimaryButton>
      </CardFooter>
    </Card>
  );
}
