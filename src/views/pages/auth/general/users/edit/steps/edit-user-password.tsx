import CustomInput from "@/components/custom-ui/input/CustomInput";
import { Eye, EyeOff, RefreshCcw } from "lucide-react";
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
import { UserInformation, UserPassword } from "@/lib/types";
import axiosClient from "@/lib/axois-client";
import { useAuthState } from "@/context/AuthContextProvider";
import { ROLE_SUPER, SECTION_NAMES } from "@/lib/constants";
import { setServerError } from "@/validation/validation";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { UserPermission } from "@/database/tables";
export interface EditUserPasswordProps {
  id: string | undefined;
  refreshPage: () => Promise<void>;
  userData: UserInformation | undefined;
  failed: boolean;
}

export function EditUserPassword(props: EditUserPasswordProps) {
  const { id, userData, failed, refreshPage } = props;
  const { user, logout } = useAuthState();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [passwordData, setPasswordData] = useState<UserPassword>({
    newPassword: "",
    confirmPassword: "",
    oldPassword: "",
  });
  const [error, setError] = useState<Map<string, string>>(new Map());

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };
  const saveData = async () => {
    if (id != undefined && !loading) {
      setLoading(true);
      const formData = new FormData();
      formData.append("id", id);
      formData.append("newPassword", passwordData.newPassword);
      if (user.role.role != ROLE_SUPER)
        formData.append("oldPassword", passwordData.oldPassword);
      formData.append("confirmPassword", passwordData.confirmPassword);
      try {
        const response = await axiosClient.post(
          "user/change-password",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status == 200) {
          toast({
            toastType: "SUCCESS",
            title: t("Success"),
            description: t(response.data.message),
          });
          // If user changed his password he must login again
          if (user?.id == id) await logout();
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
    }
  };

  const per: UserPermission | undefined = user?.permissions.get(
    SECTION_NAMES.users
  );
  const hasEdit = per ? per?.edit : false;

  return (
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("Update account password")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("Update_Password_Description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {failed ? (
          <h1>{t("You are not authorized!")}</h1>
        ) : !userData ? (
          <NastranSpinner />
        ) : (
          <div className="grid gap-4 w-full sm:w-[70%] md:w-1/2">
            {user.role.role != ROLE_SUPER && (
              <CustomInput
                size_="sm"
                name="oldPassword"
                lable={t("oldPassword")}
                required={true}
                requiredHint={`* ${t("Required")}`}
                defaultValue={passwordData["oldPassword"]}
                onChange={handleChange}
                placeholder={t("Enter password")}
                errorMessage={error.get("oldPassword")}
                startContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? (
                      <Eye className="size-[20px] text-primary-icon pointer-events-none" />
                    ) : (
                      <EyeOff className="size-[20px] text-primary-icon pointer-events-none" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
              />
            )}
            <CustomInput
              size_="sm"
              name="newPassword"
              lable={t("newPassword")}
              required={true}
              requiredHint={`* ${t("Required")}`}
              defaultValue={passwordData["newPassword"]}
              onChange={handleChange}
              placeholder={t("newPassword")}
              errorMessage={error.get("newPassword")}
              type={"password"}
            />
            <CustomInput
              size_="sm"
              name="confirmPassword"
              lable={t("confirmPassword")}
              required={true}
              requiredHint={`* ${t("Required")}`}
              defaultValue={passwordData["confirmPassword"]}
              onChange={handleChange}
              placeholder={t("confirmPassword")}
              errorMessage={error.get("confirmPassword")}
              type={"password"}
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
          userData &&
          hasEdit && (
            <PrimaryButton
              onClick={async () => {
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
