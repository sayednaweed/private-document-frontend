import CustomInput from "@/components/custom-ui/input/CustomInput";
import {
  CalendarDays,
  ChevronsUpDown,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import CustomCheckbox from "@/components/custom-ui/checkbox/CustomCheckbox";
import { toast } from "@/components/ui/use-toast";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import { useAuthState } from "@/context/AuthContextProvider";
import { setServerError, validate } from "@/validation/validation";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { Role } from "@/database/tables";
import { toLocaleDate } from "@/lib/utils";
import { useGlobalState } from "@/context/GlobalStateContext";
import FakeCombobox from "@/components/custom-ui/combobox/FakeCombobox";

interface ProfileInformation {
  id: string;
  name: string;
  username: string;
  email: string;
  status: boolean;
  grantPermission: boolean;
  role: Role;
  contact: string | null;
  job: string;
  destination: string;
  createdAt: string;
  imagePreviewUrl: any;
}
export default function EditProfileInformation() {
  const { user, setUser } = useAuthState();
  const [state] = useGlobalState();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Map<string, string>>(new Map());
  const [userData, setUserData] = useState<ProfileInformation>({
    id: user.id,
    imagePreviewUrl: undefined,
    username: user.username,
    name: user.fullName,
    email: user.email.value,
    contact: user.contact?.value,
    destination: user.destination.name,
    job: user.job.name,
    role: user.role,
    createdAt: user.createdAt,
    status: user.status,
    grantPermission: user.grantPermission,
  });
  const handleChange = (e: any) => {
    if (userData) {
      const { name, value } = e.target;
      setUserData({ ...userData, [name]: value });
    }
  };
  const saveData = async () => {
    if (loading) return;
    setLoading(true);
    // 1. Validation
    if (
      !(await validate(
        [
          { name: "username", rules: ["required", "max:45", "min:3"] },
          { name: "name", rules: ["required", "max:45", "min:3"] },
          { name: "email", rules: ["required", "max:45", "min:3"] },
        ],
        userData,
        setError
      ))
    ) {
      setLoading(false);
      return;
    }
    // 2. Send data
    const formData = new FormData();
    formData.append("id", userData.id);
    formData.append("username", userData.username);
    formData.append("name", userData.name);
    formData.append("contact", userData.contact ? userData.contact : "");
    formData.append("email", userData.email);
    try {
      const response = await axiosClient.post("profile/update", formData);
      if (response.status == 200) {
        // Change logged in user data

        await setUser({
          ...user,
          username: userData.username,
          fullName: userData.name,
          email: {
            id: "0",
            value: userData.email,
            createdAt: Date.now().toLocaleString(),
          },
          contact: {
            id: "0",
            value: userData.contact ? userData?.contact : "",
            createdAt: Date.now().toLocaleString(),
          },
        });

        toast({
          toastType: "SUCCESS",
          title: t("Success"),
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-0 ">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("Account information")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("Update user account information")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 w-full sm:w-[70%] md:w-1/2">
          <CustomInput
            size_="md"
            lable={t("name")}
            name="name"
            defaultValue={userData.name}
            placeholder={t("enter your name")}
            type="text"
            errorMessage={error.get("name")}
            onBlur={handleChange}
            startContent={
              <UserRound className="text-secondary-foreground size-[18px] pointer-events-none" />
            }
          />
          <CustomInput
            size_="md"
            name="username"
            lable={t("username")}
            defaultValue={userData.username}
            placeholder={t("Enter username")}
            type="text"
            errorMessage={error.get("username")}
            onBlur={handleChange}
            startContent={
              <UserRound className="text-secondary-foreground size-[18px] pointer-events-none" />
            }
          />
          <CustomInput
            size_="sm"
            name="email"
            defaultValue={userData.email}
            placeholder={t("Enter your email")}
            lable={t("email")}
            type="email"
            errorMessage={error.get("email")}
            onChange={handleChange}
            startContent={
              <Mail className="text-secondary-foreground size-[18px] pointer-events-none" />
            }
          />
          <CustomInput
            size_="sm"
            className={`rtl:text-right`}
            placeholder={t("enter your contact")}
            defaultValue={userData.contact ? userData.contact : ""}
            lable={t("contact")}
            type="text"
            name="contact"
            dir="ltr"
            errorMessage={error.get("contact")}
            onChange={handleChange}
            startContent={
              <Phone className="text-primary-icon size-[18px] pointer-events-none" />
            }
          />
          <FakeCombobox
            icon={
              <ChevronsUpDown className="size-[16px] absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
            }
            title={t("department")}
            selected={user.destination.name}
          />
          <FakeCombobox
            icon={
              <ChevronsUpDown className="size-[16px] absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
            }
            title={t("job")}
            selected={user.job.name}
          />
          <FakeCombobox
            icon={
              <ChevronsUpDown className="size-[16px] absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
            }
            title={t("role")}
            selected={user.role.name}
          />
          <FakeCombobox
            icon={
              <CalendarDays className="size-[16px] text-tertiary absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
            }
            title={t("Join date")}
            selected={toLocaleDate(new Date(user.createdAt), state)}
          />
          <CustomCheckbox
            readOnly={true}
            checked={userData["status"]}
            onCheckedChange={(value: boolean) =>
              setUserData({ ...userData, status: value })
            }
            parentClassName="rounded-md py-[12px] gap-x-1 bg-card border px-[10px]"
            text={t("status")}
            description={t("set account to active or deactive")}
            required={true}
            errorMessage={error.get("status")}
          />
          <CustomCheckbox
            readOnly={true}
            checked={userData.grantPermission}
            onCheckedChange={(value: boolean) =>
              setUserData({ ...userData, grantPermission: value })
            }
            parentClassName="rounded-md py-[12px] gap-x-1 bg-card border px-[10px]"
            text={t("grant")}
            description={t("Allows user to grant")}
            errorMessage={error.get("grant")}
          />
        </div>
      </CardContent>
      <CardFooter>
        <PrimaryButton
          onClick={async () => {
            await saveData();
          }}
          className={`shadow-lg`}
        >
          <ButtonSpinner loading={loading}>{t("Save")}</ButtonSpinner>
        </PrimaryButton>
      </CardFooter>
    </Card>
  );
}
