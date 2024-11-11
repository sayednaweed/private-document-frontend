import CustomCheckbox from "@/components/custom-ui/checkbox/CustomCheckbox";
import FileChooser from "@/components/custom-ui/chooser/FileChooser";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

export default function ReferTab() {
  const { t } = useTranslation();
  const { userData, setUserData, error } = useContext(StepperContext);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  return (
    <div className="flex flex-col gap-y-6 md:w-[80%] lg:w-1/2">
      <CustomInput
        required={true}
        lable={t("qaidWarida")}
        requiredHint={`* ${t("Required")}`}
        size_="sm"
        name="qaidWarida"
        defaultValue={userData["qaidWarida"]}
        placeholder={t("Enter qaid warida")}
        type="text"
        errorMessage={error.get("qaidWarida")}
        onBlur={handleChange}
      />
      <FileChooser
        lable={t("initailScan")}
        defaultFile={userData.initailScan}
        errorMessage={error.get("initailScan")}
        onchange={(file: File | undefined) =>
          setUserData({ ...userData, initailScan: file })
        }
        validTypes={["application/pdf"]}
        maxSize={8}
        accept=".pdf"
      />
      <APICombobox
        placeholderText={t("Search item")}
        errorText={t("No item")}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["reference"]: selection })
        }
        lable={t("reference")}
        required={true}
        requiredHint={`* ${t("Required")}`}
        selectedItem={userData["reference"]?.name}
        placeHolder={t("Select a reference")}
        errorMessage={error.get("reference")}
        apiUrl={"destinations"}
        mode="single"
      />
      <CustomCheckbox
        checked={userData["feedback"] || false}
        onCheckedChange={(value: boolean) =>
          setUserData({ ...userData, feedback: value })
        }
        parentClassName="rounded-md py-[12px] gap-x-1 bg-card border px-[10px]"
        text={t("feedback")}
        description={t("Accept if document has feedback?")}
        errorMessage={error.get("feedback")}
      />
    </div>
  );
}
