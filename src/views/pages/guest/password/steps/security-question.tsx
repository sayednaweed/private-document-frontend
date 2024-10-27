import CustomInput from "@/components/custom-ui/input/CustomInput";
import { useTranslation } from "react-i18next";
import { ForgotPassword } from "../forgot-password-page";
import { useEffect, useState } from "react";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { Label } from "@radix-ui/react-dropdown-menu";

interface SecurityQuestionProps {
  userData: ForgotPassword;
  error: Map<string, string>;
  handleChange: (e: any) => void;
}
export default function SecurityQuestion(props: SecurityQuestionProps) {
  const { userData, error, handleChange } = props;
  const { t } = useTranslation();
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const initialize = async () => {
    try {
      const response = await axiosClient.get("auth/forgot-password", {
        params: { Email: userData.Email },
      });
      if (response.status == 200) {
        setQuestion(response.data.message.question);
      }
    } catch (error: any) {
      console.log(error);
      toast({
        toastType: "ERROR",
        title: t("Error"),
        description: t(error.response.data.message),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <div className="space-y-2">
      <Label className="font-semibold">{t("SecurityQuestion")}</Label>
      <CustomInput
        size_="sm"
        defaultValue={question}
        readOnly={true}
        type="text"
        className="rtl:text-right"
        endContent={
          loading ? (
            <NastranSpinner label="" className=" size-[20px]" />
          ) : undefined
        }
      />
      <CustomInput
        size_="sm"
        name="Answer"
        defaultValue={userData.Answer}
        placeholder={t("Your answer")}
        type="text"
        errorMessage={error.get("Answer")}
        onChange={handleChange}
        dir="ltr"
        className="rtl:text-right"
      />
    </div>
  );
}
