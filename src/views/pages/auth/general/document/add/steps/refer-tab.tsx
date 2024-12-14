import FileChooser from "@/components/custom-ui/chooser/FileChooser";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { DateObject } from "react-multi-date-picker";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";

export default function ReferTab() {
  const { t } = useTranslation();
  const { userData, setUserData, error } = useContext(StepperContext);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  return (
    <div className="flex flex-col gap-y-6 md:w-[80%] lg:w-1/2 pb-12">
      <CustomInput
        required={true}
        lable={t("qaidWarida")}
        requiredHint={`* ${t("Required")}`}
        size_="sm"
        name="qaidWarida"
        defaultValue={userData["qaidWarida"]}
        placeholder={`${t("enter")} ${t("qaidWarida")}`}
        type="text"
        errorMessage={error.get("qaidWarida")}
        onBlur={handleChange}
      />
      <CustomDatePicker
        placeholder={t("Select a date")}
        lable={t("qaidWaridaDate")}
        requiredHint={`* ${t("Required")}`}
        required={true}
        value={userData.qaidWaridaDate}
        dateOnComplete={(date: DateObject) => {
          setUserData({ ...userData, qaidWaridaDate: date });
        }}
        className="py-3 w-1/2"
        errorMessage={error.get("qaidWaridaDate")}
      />
      <FileChooser
        lable={t("initailScan")}
        required={true}
        requiredHint={`* ${t("Required")}`}
        defaultFile={userData.initailScan}
        errorMessage={error.get("initailScan")}
        onchange={(file: File | undefined) =>
          setUserData({ ...userData, initailScan: file })
        }
        validTypes={["application/pdf"]}
        maxSize={8}
        accept=".pdf"
      />

      {/* <MultipleSelector
        commandProps={{
          label: "Select frameworks",
        }}
        onChange={(option: Option[]) => {
          setUserData({
            ...userData,
            reference: option,
          });
        }}
        // defaultOptions={frameworks}
        label={t("reference")}
        errorMessage={error.get("reference")}
        selectedOptions={userData.reference}
        required={true}
        requiredHint={`* ${t("Required")}`}
        apiUrl={"destinations"}
        placeholder={t("Select a reference")}
        emptyIndicator={<p className="text-center text-sm">{t("No item")}</p>}
      /> */}

      <APICombobox
        placeholderText={t("Search item")}
        errorText={t("No item")}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["reference"]: selection })
        }
        placeHolder={`${t("select")} ${t("reference")}`}
        lable={t("reference")}
        required={true}
        requiredHint={`* ${t("Required")}`}
        selectedItem={userData["reference"]?.name}
        errorMessage={error.get("reference")}
        apiUrl={"muqams"}
        mode="single"
      />
    </div>
  );
}
