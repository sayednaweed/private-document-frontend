import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { validate } from "@/validation/validation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import React from "react";
import { AnimLockIcon } from "@/components/custom-ui/icons/AnimLockIcon";
import SecurityQuestion from "./steps/security-question";
import EmailVerification from "./steps/email-verification";
import ChangePassword from "./steps/change-password";

export type ForgotPassword = {
  Password: string;
  ConfirmPassword: string;
  Email: string;
  SecurityQuestion: string;
  Answer: string;
};
export default function ForgotPasswordPage() {
  const [userData, setUserData] = React.useState<ForgotPassword>({
    Password: "",
    ConfirmPassword: "",
    Email: "",
    SecurityQuestion: "",
    Answer: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();
  const [error, setError] = React.useState<Map<string, string>>(new Map());
  const [steps, setSteps] = useState<number>(0);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const verifyEmail = async () => {
    try {
      setLoading(true);
      let formData = new FormData();
      formData.append("Email", userData.Email);
      const response = await axiosClient.post("user/email", formData);
      if (response.status == 200) {
        const emailExist = response.data.message === true;
        if (emailExist) {
          // Email found
          setSteps(steps + 1);
        } else {
          const errMap = new Map<string, string>();
          errMap.set("Email", `${t("Email")} ${t("not exist in system")}`);
          setError(errMap);
        }
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("Error"),
        description: error.response.data.message,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const verifyAnswer = async () => {
    try {
      setLoading(true);
      let formData = new FormData();
      formData.append("Answer", userData.Answer);
      formData.append("Email", userData.Email);
      const response = await axiosClient.post("user/verify-answer", formData);
      if (response.status == 200) {
        const isCorrect = response.data.message === true;
        if (isCorrect) {
          // Email found
          setSteps(steps + 1);
        } else {
          const errMap = new Map<string, string>();
          errMap.set("Answer", `${t("Answer")} ${t("is incorrect")}`);
          setError(errMap);
        }
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("Error"),
        description: error.response.data.message,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const changePassword = async () => {
    try {
      setLoading(true);
      let formData = new FormData();
      formData.append("Email", userData.Email);
      formData.append("Password", userData.Password);
      formData.append("Answer", userData.Answer);
      formData.append("ConfirmPassword", userData.ConfirmPassword);
      const response = await axiosClient.post("auth/reset-password", formData);
      if (response.status == 200) {
        navigate("/login", { replace: true });
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("Error"),
        description: t(error.response.data.message),
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 0. Do not allow other operations until they are not completed
    if (loading) return;
    // 1. Check email check up
    if (steps === 0) {
      // 1.1 do validation
      const result: boolean = await validate(
        [{ name: "Email", rules: ["required"] }],
        userData,
        setError
      );
      if (!result) return;

      // 1.2 verify email
      await verifyEmail();
      return;
    }

    // 2. Check question answer
    if (steps === 1) {
      // 2.1 do validation
      const result: boolean = await validate(
        [{ name: "Answer", rules: ["required"] }],
        userData,
        setError
      );
      if (!result) return;

      // 1.2 verify email
      await verifyAnswer();
      return;
    }
    // 3. Change password
    try {
      // 3.1 Validate before submission
      const result: boolean = await validate(
        [
          { name: "Password", rules: ["required", "max:45", "min:8"] },
          { name: "ConfirmPassword", rules: ["required", "max:45", "min:8"] },
        ],
        userData,
        setError
      );
      if (!result) return;
      // 3.2 Call change password api
      await changePassword();
    } catch (error: any) {
      console.log(error, "Error");
    }
    setLoading(false);
  };

  return (
    <div className="px-16 h-screen flex flex-col items-center pt-8">
      {steps > 0 && (
        <div
          className="flex absolute text-primary top-4 ltr:left-4 rtl:right-4 hover:text-tertiary transition cursor-pointer"
          onClick={() => {
            setSteps(steps - 1);
          }}
        >
          <ChevronLeft className="rtl:rotate-180" />
          <h1 className="font-semibold text-md">{t("Back")}</h1>
        </div>
      )}

      <div className="shadow-md shadow-primary-box-shadow bg-tertiary w-fit mx-auto rounded-full p-5">
        <AnimLockIcon />
      </div>
      <h1 className="drop-shadow-lg text-center relative text-tertiary uppercase text-[24px] mb-16 font-bold">
        {t("Recovery")}
      </h1>
      <form className="flex flex-col w-[400px]" onSubmit={onFormSubmit}>
        {steps == 0 ? (
          <EmailVerification
            userData={userData}
            handleChange={handleChange}
            error={error}
          />
        ) : steps == 1 ? (
          <SecurityQuestion
            handleChange={handleChange}
            userData={userData}
            error={error}
          />
        ) : (
          <ChangePassword
            userData={userData}
            handleChange={handleChange}
            error={error}
          />
        )}

        <Button
          className={`shadow-lg hover:shadow hover:bg-primary bg-primary mt-16 hover:opacity-100 opacity-95  text-primary-foreground uppercase text-[14px] font-medium ${
            loading && "opacity-90"
          }`}
          type="submit"
        >
          <ButtonSpinner loading={loading}>{t("Continue")}</ButtonSpinner>
        </Button>
        <Link to="/login" className=" w-1/2" replace={true}>
          <Button
            className={`shadow-lg w-full hover:shadow hover:bg-tertiary hover:opacity-100 opacity-95 bg-tertiary mt-4 text-primary-foreground uppercase text-[14px] font-medium`}
            type="submit"
          >
            <ArrowLeft className="rtl:rotate-180" />
            {t("Login")}
          </Button>
        </Link>
      </form>
    </div>
  );
}
