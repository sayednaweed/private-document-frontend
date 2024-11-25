import { Eye, EyeOff } from "lucide-react";
import { useContext, useState } from "react";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import CustomCheckbox from "@/components/custom-ui/checkbox/CustomCheckbox";
import { useTranslation } from "react-i18next";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import PasswordInput from "@/components/custom-ui/input/PasswordInput";

export default function AddUserAccount() {
  const { userData, setUserData, error } = useContext(StepperContext);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  return (
    <div className="flex flex-col mt-10 w-full gap-y-3 sm:w-[86%] md:w-[60%] lg:w-[400px] mx-auto">
      <PasswordInput
        size_="sm"
        name="password"
        lable={t("password")}
        required={true}
        requiredHint={`* ${t("Required")}`}
        defaultValue={userData["password"]}
        onChange={handleChange}
        placeholder={t("enter password")}
        errorMessage={error.get("password")}
        startContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? (
              <Eye className="size-[20px] text-primary-icon pointer-events-none" />
            ) : (
              <EyeOff className="size-[20px] text-primary-icon pointer-events-none" />
            )}
          </button>
        }
        type={isVisible ? "text" : "password"}
      />

      <APICombobox
        placeholderText={t("Search item")}
        errorText={t("No item")}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["role"]: selection })
        }
        required={true}
        lable={t("role")}
        requiredHint={`* ${t("Required")}`}
        selectedItem={userData["role"]?.name}
        placeHolder={t("Select a role")}
        errorMessage={error.get("role")}
        apiUrl={"roles"}
        mode="single"
      />

      <CustomCheckbox
        checked={userData["status"]}
        onCheckedChange={(value: boolean) =>
          setUserData({ ...userData, status: value })
        }
        parentClassName="rounded-md py-[12px] gap-x-1 bg-card border px-[10px]"
        text={t("status")}
        description={t("set account to active or deactive")}
        required={true}
        requiredHint={`* ${t("Required")}`}
        errorMessage={error.get("status")}
      />
      <CustomCheckbox
        checked={userData["grant"] || false}
        onCheckedChange={(value: boolean) =>
          setUserData({ ...userData, grant: value })
        }
        parentClassName="rounded-md py-[12px] gap-x-1 bg-card border px-[10px]"
        text={t("grant")}
        description={t("Allows user to grant")}
        errorMessage={error.get("grant")}
      />
    </div>
  );
}
