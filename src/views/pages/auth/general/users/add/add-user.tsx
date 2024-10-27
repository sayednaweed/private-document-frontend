import AddUserAccount from "./steps/AddUserAccount";
import AddUserInformation from "./steps/AddUserInformation";
import AddUserPermission from "./steps/AddUserPermission";
import { useTranslation } from "react-i18next";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import CloseButton from "@/components/custom-ui/button/CloseButton";
import Stepper from "@/components/custom-ui/stepper/Stepper";
import CompleteStep from "@/components/custom-ui/stepper/CompleteStep";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { Dispatch, SetStateAction } from "react";
import { setServerError } from "@/validation/validation";
import { User } from "@/database/tables";
import { User as UserIcon } from "lucide-react";

export interface AddUserProps {
  onComplete: (user: User) => void;
}
export default function AddUser(props: AddUserProps) {
  const { onComplete } = props;
  const { t } = useTranslation();
  const { modelOnRequestHide } = useModelOnRequestHide();
  const beforeStepSuccess = async (
    userData: any,
    currentStep: number,
    setError: Dispatch<SetStateAction<Map<string, string>>>
  ) => {
    if (currentStep == 1) {
      try {
        let formData = new FormData();
        formData.append("email", userData?.email);
        const response = await axiosClient.post("user/email-exist", formData);
        if (response.status == 200) {
          const emailExist = response.data.message === true;
          if (emailExist) {
            const errMap = new Map<string, string>();
            errMap.set(
              "email",
              `${t("email")} ${t("is registered before in system")}`
            );
            setError(errMap);
            return false;
          }
        }
      } catch (error: any) {
        toast({
          toastType: "ERROR",
          title: t("Error"),
          description: error.response.data.message,
        });
        console.log(error);
        return false;
      }
    }
    return true;
  };
  const stepsCompleted = async (
    userData: any,
    setError: Dispatch<SetStateAction<Map<string, string>>>
  ) => {
    let formData = new FormData();
    formData.append("fullName", userData.name);
    formData.append("username", userData.username);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    if (userData.phone) formData.append("contact", userData.phone);
    formData.append("department", userData.department.id);
    formData.append("job", userData.job.id);
    formData.append("role", userData.role.id);
    formData.append("status", userData.status);
    if (!userData.grant) formData.append("grant", "false");
    else formData.append("grant", userData.grant);
    formData.append("Permission", JSON.stringify(userData?.Permission));
    try {
      const response = await axiosClient.post("user/store", formData);
      if (response.status == 200) {
        onComplete(response.data.user);
        toast({
          toastType: "SUCCESS",
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
      return false;
    }
    return true;
  };
  const closeModel = () => {
    modelOnRequestHide();
  };

  return (
    <>
      {/* Header */}
      <div className="flex px-1 py-1 fixed w-full justify-end">
        <CloseButton dismissModel={closeModel} />
      </div>
      {/* Body */}
      <Stepper
        progressText={{
          complete: t("Complete"),
          inProgress: t("In Progress"),
          pending: t("Pending"),
          step: t("Step"),
        }}
        loadingText={t("Loading")}
        backText={t("Back")}
        nextText={t("Next")}
        confirmText={t("Confirm")}
        size="lg"
        className=" dark:bg-card shadow-modelShadow"
        steps={[
          {
            description: t("Personal details"),
            icon: <UserIcon className="size-[16px]" />,
          },
          {
            description: t("Account information"),
            icon: <UserIcon className="size-[16px]" />,
          },
          {
            description: t("Permissions"),
            icon: <UserIcon className="size-[16px]" />,
          },
          {
            description: t("Complete"),
            icon: <UserIcon className="size-[16px]" />,
          },
        ]}
        components={[
          {
            component: <AddUserInformation />,
            validationRules: [
              { name: "name", rules: ["required", "max:45", "min:3"] },
              { name: "username", rules: ["required", "max:45", "min:3"] },
              { name: "email", rules: ["required"] },
              { name: "department", rules: ["required"] },
              { name: "job", rules: ["required"] },
            ],
          },
          {
            component: <AddUserAccount />,
            validationRules: [
              { name: "password", rules: ["required", "max:25", "min:8"] },
              { name: "role", rules: ["required"] },
              { name: "status", rules: ["required"] },
            ],
          },
          {
            component: <AddUserPermission />,
            validationRules: [],
          },
          {
            component: (
              <CompleteStep
                successText={t("Congratulation")}
                closeText={t("Close")}
                againText={t("Again")}
                closeModel={closeModel}
                description={t("User account has been created")}
              />
            ),
            validationRules: [],
          },
        ]}
        beforeStepSuccess={beforeStepSuccess}
        stepsCompleted={stepsCompleted}
      />
    </>
  );
}
