import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

export interface IDocumentInformationProps {}

export default function DocumentInformationTab(
  props: IDocumentInformationProps
) {
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
        lable={t("document type")}
        required={true}
        requiredHint={`* ${t("Required")}`}
        selectedItem={userData["documentType"]?.name}
        placeHolder={t("Select a document")}
        errorMessage={error.get("documentType")}
        apiUrl={"departments"}
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
        apiUrl={"urgency"}
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
        apiUrl={"source"}
        mode="single"
      />
      <APICombobox
        placeholderText={t("Search item")}
        errorText={t("No item")}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["destination"]: selection })
        }
        lable={t("destination")}
        required={true}
        requiredHint={`* ${t("Required")}`}
        selectedItem={userData["destination"]?.name}
        placeHolder={t("Select destination")}
        errorMessage={error.get("destination")}
        apiUrl={"destination"}
        mode="single"
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
      <CustomInput
        required={true}
        lable={t("description")}
        requiredHint={`* ${t("Required")}`}
        size_="sm"
        name="documentNumber"
        defaultValue={userData["description"]}
        placeholder={t("documentNumber")}
        type="text"
        errorMessage={error.get("documentNumber")}
        onBlur={handleChange}
      />
    </div>
  );
}
