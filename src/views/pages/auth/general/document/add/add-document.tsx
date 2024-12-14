import { Check, Database, UserRound } from "lucide-react";
import DocumentInformationTab from "./steps/document-information-tab";
import { Dispatch, SetStateAction } from "react";
import { toast } from "@/components/ui/use-toast";
import axiosClient from "@/lib/axois-client";
import { setServerError } from "@/validation/validation";
import Stepper from "@/components/custom-ui/stepper/Stepper";
import { useTranslation } from "react-i18next";
import { DocumentModel } from "@/database/tables";
import CloseButton from "@/components/custom-ui/button/CloseButton";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import ReferTab from "./steps/refer-tab";
import CompleteStep from "@/components/custom-ui/stepper/CompleteStep";

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
    formData.append("documentType", userData.documentType.id);
    formData.append("urgency", userData.urgency.id);
    formData.append("source", userData.source.id);
    formData.append(
      "documentDate",
      userData.documentDate?.toDate().toISOString()
    );
    formData.append("documentNumber", userData.documentNumber);
    formData.append("subject", userData.subject);
    formData.append("qaidWarida", userData.qaidWarida);
    formData.append(
      "qaidWaridaDate",
      userData.qaidWaridaDate?.toDate().toISOString()
    );
    formData.append("document", userData.initailScan);
    formData.append("reference", userData.reference.id);

    try {
      const response = await axiosClient.post("document/store", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status == 200) {
        onComplete(response.data.document);
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
            description: t("information"),
            icon: <Database className="size-[16px]" />,
          },
          {
            description: t("reference"),
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
              { name: "subject", rules: ["required"] },
              { name: "documentDate", rules: ["required"] },
              {
                name: "documentNumber",
                rules: ["required", "max:64", "min:3"],
              },
              { name: "source", rules: ["required"] },
              { name: "urgency", rules: ["required"] },
              { name: "documentType", rules: ["required"] },
            ],
          },
          {
            component: <ReferTab />,
            validationRules: [
              { name: "qaidWarida", rules: ["required", "max:64", "min:3"] },
              { name: "qaidWaridaDate", rules: ["required"] },
              { name: "initailScan", rules: ["required"] },
              { name: "reference", rules: ["required"] },
            ],
          },
          {
            component: (
              <CompleteStep
                successText={t("Congratulation")}
                closeText={t("Close")}
                againText={t("Again")}
                closeModel={closeModel}
                description={t("document_success")}
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
