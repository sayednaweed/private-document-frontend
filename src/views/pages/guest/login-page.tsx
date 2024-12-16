import * as React from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { validate } from "@/validation/validation";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import AnimUserIcon from "@/components/custom-ui/icons/AnimUserIcon";
import { useNavigate } from "react-router";
import { useAuthState } from "@/context/AuthContextProvider";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuthState();
  const [userData, setUserData] = React.useState<any>({});
  const [error, setError] = React.useState<Map<string, string>>(new Map());
  const [loading, setLoading] = React.useState(false);
  // Password input
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loading) {
      setLoading(true);
      try {
        // 1. Validate before submission
        const result: boolean = await validate(
          [
            { name: "email", rules: ["required"] },
            { name: "password", rules: ["required", "max:45", "min:8"] },
          ],
          userData,
          setError
        );
        if (!result) {
          setLoading(false);
          return;
        }

        // 2. Attempt login
        const response: any = await login(userData.email, userData.password);
        if (response.code == "ERR_NETWORK")
          toast({
            title: t("Network problem"),
            toastType: "ERROR",
            description: t("Make sure you have internet access"),
          });
        else if (response.status == 200) {
          navigate("/dashboard", { replace: true });
          toast({
            title: t("Success"),
            toastType: "SUCCESS",
            description: response.data.message,
          });
        } else
          toast({
            title: t("Error"),
            toastType: "ERROR",
            description: response.response.data.message,
          });
      } catch (error: any) {
        toast({
          title: t("Error"),
          toastType: "ERROR",
          description: error.response.data.message,
        });
        console.log(error, "Error");
      }
      setLoading(false);
    }
  };
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="px-6 sm:px-16 pb-16 flex flex-col items-center h-screen pt-12">
      <div className="bg-red-500 shadow-primary-box-shadow bg-tertiary w-fit rounded-full p-4">
        <AnimUserIcon />
      </div>
      <h1 className="drop-shadow-lg text-center relative text-tertiary uppercase text-[34px] mb-8 font-bold">
        {t("Welcome")}
      </h1>
      <form
        className="flex flex-col space-y-3 w-full sm:w-[400px]"
        onSubmit={onFormSubmit}
      >
        <CustomInput
          size_="sm"
          placeholder={t("Enter your email")}
          type="email"
          name="email"
          dir="ltr"
          className="rtl:text-right"
          errorMessage={error.get("email")}
          onChange={handleChange}
          startContent={
            <Mail className="text-primary size-[20px] pointer-events-none" />
          }
        />
        <CustomInput
          size_="sm"
          name="password"
          onChange={handleChange}
          placeholder={t("Enter password")}
          errorMessage={error.get("password")}
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
        <PrimaryButton
          className={`w-full mt-8 uppercase ${loading && "opacity-90"}`}
          type="submit"
        >
          <ButtonSpinner
            loading={loading}
            className="rtl:text-2xl-rtl ltr:text-2xl-ltr"
          >
            {t("Login")}
          </ButtonSpinner>
        </PrimaryButton>
      </form>
    </div>
  );
}
