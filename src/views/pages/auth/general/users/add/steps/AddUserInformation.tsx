import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { Mail, Phone, UserRound } from "lucide-react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

export default function AddUserInformation() {
  const { t } = useTranslation();
  const { userData, setUserData, error } = useContext(StepperContext);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  return (
    <div className="flex flex-col mt-10 w-full sm:w-[86%] md:w-[60%] lg:w-[400px] gap-y-6 pb-12 mx-auto">
      <CustomInput
        required={true}
        lable={t("name")}
        requiredHint={`* ${t("Required")}`}
        size_="sm"
        name="name"
        defaultValue={userData["name"]}
        placeholder={t("Enter your name")}
        type="text"
        errorMessage={error.get("name")}
        onBlur={handleChange}
        startContent={
          <UserRound className="text-tertiary size-[18px] pointer-events-none" />
        }
      />
      <CustomInput
        required={true}
        requiredHint={`* ${t("Required")}`}
        size_="sm"
        lable={t("username")}
        name="username"
        defaultValue={userData["username"]}
        placeholder={t("Enter username")}
        type="text"
        errorMessage={error.get("username")}
        onBlur={handleChange}
        startContent={
          <UserRound className="text-tertiary size-[18px] pointer-events-none" />
        }
      />
      <CustomInput
        size_="sm"
        name="email"
        required={true}
        lable={t("email")}
        requiredHint={`* ${t("Required")}`}
        defaultValue={userData["email"]}
        placeholder={t("Enter your email")}
        type="email"
        errorMessage={error.get("email")}
        onChange={handleChange}
        dir="ltr"
        className="rtl:text-right"
        startContent={
          <Mail className="text-tertiary size-[18px] pointer-events-none" />
        }
      />
      <CustomInput
        size_="sm"
        dir="ltr"
        className="rtl:text-end"
        lable={t("contact")}
        placeholder={t("Enter your phone number")}
        defaultValue={userData["phone"]}
        type="text"
        name="phone"
        errorMessage={error.get("phone")}
        onChange={handleChange}
        startContent={
          <Phone className="text-tertiary size-[18px] pointer-events-none" />
        }
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
        placeHolder={t("select_destination")}
        errorMessage={error.get("destination")}
        apiUrl={"destinations"}
        mode="single"
      />
      <APICombobox
        placeholderText={t("Search item")}
        errorText={t("No item")}
        required={true}
        requiredHint={`* ${t("Required")}`}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["job"]: selection })
        }
        lable={t("job")}
        selectedItem={userData["job"]?.name}
        placeHolder={t("Select a job")}
        errorMessage={error.get("job")}
        apiUrl={"jobs"}
        mode="single"
      />
    </div>
  );
}
