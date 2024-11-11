import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { DateObject } from "react-multi-date-picker";

export default function DocumentInformationTab() {
  const { t } = useTranslation();
  const { userData, setUserData, error } = useContext(StepperContext);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="flex flex-col gap-y-6 md:w-[80%] lg:w-1/2">
      <APICombobox
        placeholderText={t("Search item")}
        errorText={t("No item")}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["documentType"]: selection })
        }
        lable={t("documentType")}
        required={true}
        requiredHint={`* ${t("Required")}`}
        selectedItem={userData["documentType"]?.name}
        placeHolder={t("Select a document")}
        errorMessage={error.get("documentType")}
        apiUrl={"document-types"}
        mode="single"
      />
      <APICombobox
        placeholderText={t("Search item")}
        errorText={t("No item")}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["urgency"]: selection })
        }
        lable={t("urgency")}
        required={true}
        requiredHint={`* ${t("Required")}`}
        selectedItem={userData["urgency"]?.name}
        placeHolder={t("Select urgency")}
        errorMessage={error.get("urgency")}
        apiUrl={"urgencies"}
        mode="single"
      />
      <APICombobox
        placeholderText={t("Search item")}
        errorText={t("No item")}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["source"]: selection })
        }
        lable={t("source")}
        required={true}
        requiredHint={`* ${t("Required")}`}
        selectedItem={userData["source"]?.name}
        placeHolder={t("Select source")}
        errorMessage={error.get("source")}
        apiUrl={"sources"}
        mode="single"
      />
      <CustomDatePicker
        placeholder={t("select a date")}
        lable={t("documentDate")}
        requiredHint={`* ${t("Required")}`}
        required={true}
        value={userData.documentDate}
        dateOnComplete={(date: DateObject) => {
          setUserData({ ...userData, documentDate: date });
        }}
        className="py-3 w-1/2"
        errorMessage={error.get("documentDate")}
      />
      <CustomInput
        required={true}
        lable={t("documentNumber")}
        requiredHint={`* ${t("Required")}`}
        size_="sm"
        name="documentNumber"
        defaultValue={userData["documentNumber"]}
        placeholder={t("Enter your document number")}
        type="text"
        errorMessage={error.get("documentNumber")}
        onBlur={handleChange}
      />
      <CustomTextarea
        onChange={handleChange}
        required={true}
        name="subject"
        requiredHint={`* ${t("Required")}`}
        placeholder={t("type document subject")}
        defaultValue={userData["subject"]}
        lable={t("subject")}
        errorMessage={error.get("subject")}
      />
    </div>
  );
}
