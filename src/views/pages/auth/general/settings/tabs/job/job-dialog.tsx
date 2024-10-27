import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { useEffect, useState } from "react";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { setServerError, validate } from "@/validation/validation";
import { Job } from "@/database/tables";

export interface UserFilterDialogDialogProps {
  onComplete: (job: Job) => void;
  job?: Job;
}
export default function JobDialog(props: UserFilterDialogDialogProps) {
  const { onComplete, job } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(new Map<string, string>());
  const [userData, setUserData] = useState({
    Farsi: "",
    English: "",
    Pashto: "",
  });
  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();

  const fetch = async () => {
    try {
      const response = await axiosClient.get(`job/${job?.id}`);
      if (response.status === 200) {
        setUserData({
          Farsi: response.data.job.fa,
          English: response.data.job.en,
          Pashto: response.data.job.ps,
        });
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (job) fetch();
  }, []);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const store = async () => {
    try {
      if (loading) return;
      setLoading(true);
      // 1. Validate form
      const passed = await validate(
        [
          {
            name: "English",
            rules: ["required"],
          },
          {
            name: "Farsi",
            rules: ["required"],
          },
          {
            name: "Pashto",
            rules: ["required"],
          },
        ],
        userData,
        setError
      );
      if (!passed) return;
      // 2. Store
      let formData = new FormData();
      formData.append("english", userData.English);
      formData.append("farsi", userData.Farsi);
      formData.append("pashto", userData.Pashto);
      const response = await axiosClient.post("job/store", formData);
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(response.data.job);
        modelOnRequestHide();
      }
    } catch (error: any) {
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const update = async () => {
    try {
      if (loading) return;
      setLoading(true);
      // 1. Validate form
      const passed = await validate(
        [
          {
            name: "English",
            rules: ["required"],
          },
          {
            name: "Farsi",
            rules: ["required"],
          },
          {
            name: "Pashto",
            rules: ["required"],
          },
        ],
        userData,
        setError
      );
      if (!passed) return;
      // 2. update
      let formData = new FormData();
      if (job?.id) formData.append("id", job.id);
      formData.append("english", userData.English);
      formData.append("farsi", userData.Farsi);
      formData.append("pashto", userData.Pashto);
      const response = await axiosClient.post(`job/update`, formData);
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(response.data.job);
        modelOnRequestHide();
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        description: error.response.data.message,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-fit min-w-[400px] self-center [backdrop-filter:blur(20px)] bg-white/70 dark:!bg-black/40">
      <CardHeader className="relative text-start">
        <CardTitle className="rtl:text-4xl-rtl ltr:text-3xl-ltr text-tertiary">
          {job ? t("Edit") : t("Add")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CustomInput
          size_="sm"
          dir="ltr"
          className="rtl:text-end"
          required={true}
          requiredHint={`* ${t("Required")}`}
          placeholder={t("translate_en")}
          defaultValue={userData.English}
          type="text"
          name="English"
          errorMessage={error.get("English")}
          onChange={handleChange}
          startContentDark={true}
          startContent={
            <h1 className="font-bold text-primary-foreground text-[11px] mx-auto">
              {t("en")}
            </h1>
          }
        />
        <CustomInput
          size_="sm"
          required={true}
          requiredHint={`* ${t("Required")}`}
          placeholder={t("translate_fa")}
          defaultValue={userData.Farsi}
          type="text"
          name="Farsi"
          errorMessage={error.get("Farsi")}
          onChange={handleChange}
          startContentDark={true}
          startContent={
            <h1 className="font-bold text-primary-foreground text-[11px] mx-auto">
              {t("fa")}
            </h1>
          }
        />
        <CustomInput
          size_="sm"
          required={true}
          requiredHint={`* ${t("Required")}`}
          placeholder={t("translate_ps")}
          defaultValue={userData.Pashto}
          type="text"
          name="Pashto"
          errorMessage={error.get("Pashto")}
          onChange={handleChange}
          startContentDark={true}
          startContent={
            <h1 className="font-bold text-primary-foreground text-[11px] mx-auto">
              {t("ps")}
            </h1>
          }
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          className="rtl:text-xl-rtl ltr:text-lg-ltr"
          variant="outline"
          onClick={modelOnRequestHide}
        >
          {t("Cancel")}
        </Button>
        <PrimaryButton
          disabled={loading}
          onClick={job ? update : store}
          className={`${loading && "opacity-90"}`}
          type="submit"
        >
          <ButtonSpinner loading={loading}>{t("Save")}</ButtonSpinner>
        </PrimaryButton>
      </CardFooter>
    </Card>
  );
}
