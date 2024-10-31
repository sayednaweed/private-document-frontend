import { Check, Database, UserRound } from "lucide-react";
import DocumentInformationTab from "./steps/document-information-tab";
import SourceReferredTab from "./steps/source-referred-tab";
import { Dispatch, SetStateAction } from "react";
import { toast } from "@/components/ui/use-toast";
import axiosClient from "@/lib/axois-client";
import { setServerError } from "@/validation/validation";
import Stepper from "@/components/custom-ui/stepper/Stepper";
import { useTranslation } from "react-i18next";
import { DocumentModel } from "@/database/tables";
import CloseButton from "@/components/custom-ui/button/CloseButton";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";

export interface AddDocumentProps {
  onComplete: (user: DocumentModel) => void;
}

export default function AddDocument(props: AddDocumentProps) {
  const { t } = useTranslation();
  const { modelOnRequestHide } = useModelOnRequestHide();
  const { onComplete } = props;
  const beforeStepSuccess = async (
    _userData: any,
    _currentStep: number,
    _setError: Dispatch<SetStateAction<Map<string, string>>>
  ) => {
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
  return (
    <>
      <div className="flex px-1 py-1 fixed w-full justify-end">
        <CloseButton dismissModel={modelOnRequestHide} />
      </div>
      <Stepper
        isCardActive={true}
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
        size="wrap-height"
        className="bg-transparent dark:!bg-transparent"
        steps={[
          {
            description: t("Information"),
            icon: <Database className="size-[16px]" />,
          },
          {
            description: t("source & referred"),
            icon: <UserRound className="size-[16px]" />,
          },
          {
            description: t("Complete"),
            icon: <Check className="size-[16px]" />,
          },
        ]}
        components={[
          {
            component: <DocumentInformationTab />,
            validationRules: [
              // { name: "language", rules: ["required"] },
            ],
          },
          {
            component: <SourceReferredTab />,
            validationRules: [
              // { name: "files", rules: ["required"] }
            ],
          },
        ]}
        beforeStepSuccess={beforeStepSuccess}
        stepsCompleted={stepsCompleted}
      />
    </>
  );
}
