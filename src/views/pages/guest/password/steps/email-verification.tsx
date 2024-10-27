import CustomInput from "@/components/custom-ui/input/CustomInput";
import { Mail } from "lucide-react";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ForgotPassword } from "../forgot-password-page";

export interface EmailVerificationProps {
  error: Map<string, string>;
  handleChange: (e: any) => void;
  userData: ForgotPassword;
}
export default function EmailVerification(props: EmailVerificationProps) {
  const { error, handleChange, userData } = props;
  const { t } = useTranslation();
  const [emailChecking] = useState(false);

  return (
    <CustomInput
      size_="sm"
      placeholder={t("Enter your email")}
      type="email"
      name="Email"
      dir="ltr"
      defaultValue={userData.Email}
      className="rtl:text-right"
      errorMessage={error.get("Email")}
      onBlur={handleChange}
      endContent={
        emailChecking ? (
          <NastranSpinner label="" className=" size-[20px]" />
        ) : undefined
      }
      startContent={
        <Mail className="text-primary-icon size-[20px] pointer-events-none" />
      }
    />
  );
}
