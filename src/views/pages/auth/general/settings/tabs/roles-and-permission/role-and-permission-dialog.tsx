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
import { Destination, DestinationType } from "@/database/tables";
import ColorPicker from "@/components/custom-ui/picker/color-picker";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";

export interface RoleAndPermissionDialogProps {
  onComplete: (destination: Destination) => void;
  destination?: Destination;
}
export default function RoleAndPermissionDialog(
  props: RoleAndPermissionDialogProps
) {
  const { onComplete, destination } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(new Map<string, string>());
  const [userData, setUserData] = useState<{
    Farsi: string;
    English: string;
    Pashto: string;
    destinationType: DestinationType | undefined;
    Color: string;
  }>({
    Farsi: "",
    English: "",
    Pashto: "",
    destinationType: undefined,
    Color: destination ? "" : "#B4D455",
  });
  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();

  const fetch = async () => {
    try {
      const response = await axiosClient.get(`destination/${destination?.id}`);
      if (response.status === 200) {
        setUserData({
          Farsi: response.data.destination.fa,
          English: response.data.destination.en,
          Pashto: response.data.destination.ps,
          Color: response.data.destination.color,
          destinationType: response.data.destination.type,
        });
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (destination) fetch();
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
            name: "destinationType",
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
      if (userData.destinationType)
        formData.append("destination_type_id", userData.destinationType.id);
      const response = await axiosClient.post("destination/store", formData);
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(response.data.destination);
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
          {
            name: "destinationType",
            rules: ["required"],
          },
        ],
        userData,
        setError
      );
      if (!passed) return;
      // 2. update
      let formData = new FormData();
      if (destination?.id) formData.append("id", destination.id);
      formData.append("english", userData.English);
      formData.append("farsi", userData.Farsi);
      formData.append("pashto", userData.Pashto);
      formData.append("color", userData.Color);
      if (userData.destinationType)
        formData.append("destination_type_id", userData.destinationType.id);
      const response = await axiosClient.post(`destination/update`, formData);
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(response.data.destination);
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
          {destination ? t("Edit") : t("Add")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
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
        <APICombobox
          placeholderText={t("Search item")}
          errorText={t("No item")}
          onSelect={(selection: any) =>
            setUserData({ ...userData, ["destinationType"]: selection })
          }
          required={true}
          requiredHint={`* ${t("Required")}`}
          selectedItem={userData.destinationType?.name}
          placeHolder={t("select a type")}
          errorMessage={error.get("destinationType")}
          apiUrl={"destination-types"}
          mode="single"
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
          onClick={destination ? update : store}
          className={`${loading && "opacity-90"}`}
          type="submit"
        >
          <ButtonSpinner loading={loading}>{t("Save")}</ButtonSpinner>
        </PrimaryButton>
      </CardFooter>
    </Card>
  );
}
