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
import { Status } from "@/database/tables";
import ColorPicker from "@/components/custom-ui/picker/color-picker";

export interface StatusDialogProps {
  onComplete: (status: Status) => void;
  status?: Status;
}
export default function StatusDialog(props: StatusDialogProps) {
  const { onComplete, status } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(new Map<string, string>());
  const [userData, setUserData] = useState({
    Farsi: "",
    English: "",
    Pashto: "",
    Color: status ? "" : "#B4D455",
  });
  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();

  const fetch = async () => {
    try {
      const response = await axiosClient.get(`status/${status?.id}`);
      if (response.status === 200) {
        setUserData({
          Farsi: response.data.status.fa,
          English: response.data.status.en,
          Pashto: response.data.status.ps,
          Color: response.data.status.color,
        });
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (status) fetch();
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
          {
            name: "Color",
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
      formData.append("color", userData.Color);
      const response = await axiosClient.post("status/store", formData);
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(response.data.status);
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
      if (status?.id) formData.append("id", status.id);
      formData.append("english", userData.English);
      formData.append("farsi", userData.Farsi);
      formData.append("pashto", userData.Pashto);
      formData.append("color", userData.Color);
      const response = await axiosClient.post(`status/update`, formData);
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(response.data.status);
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
          {status ? t("Edit") : t("Add")}
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
        <div className="flex flex-col mt-3">
          <label className="w-fit capitalize font-semibold">{t("color")}</label>
          <ColorPicker
            gradientTitle={t("gradient")}
            solidTitle={t("solid")}
            background={userData.Color}
            setBackground={(background: string) =>
              setUserData({
                ...userData,
                Color: background,
              })
            }
            className=" self-start w-fit"
          />
        </div>
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
          onClick={status ? update : store}
          className={`${loading && "opacity-90"}`}
          type="submit"
        >
          <ButtonSpinner loading={loading}>{t("Save")}</ButtonSpinner>
        </PrimaryButton>
      </CardFooter>
    </Card>
  );
}
