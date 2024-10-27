import CustomInput from "@/components/custom-ui/input/CustomInput";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ForgotPassword } from "../forgot-password-page";

export interface ChangePasswordProps {
  error: Map<string, string>;
  handleChange: (e: any) => void;
  userData: ForgotPassword;
}
export default function ChangePassword(props: ChangePasswordProps) {
  const { error, handleChange, userData } = props;
  const { t } = useTranslation();
  // Password input
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <div className="space-y-2">
      <CustomInput
        size_="sm"
        name="Password"
        onChange={handleChange}
        defaultValue={userData.Password}
        placeholder={t("Enter password")}
        errorMessage={error.get("Password")}
        startContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
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
      <CustomInput
        size_="sm"
        name="ConfirmPassword"
        onChange={handleChange}
        placeholder={t("ConfirmPassword")}
        defaultValue={userData.ConfirmPassword}
        errorMessage={error.get("ConfirmPassword")}
        startContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
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
    </div>
  );
}
