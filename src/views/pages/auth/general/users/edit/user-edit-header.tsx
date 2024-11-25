import CachedImage from "@/components/custom-ui/image/CachedImage";
import IconButton from "@/components/custom-ui/button/IconButton";
import { Pencil, Trash2 } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { UserInformation } from "@/lib/types";
import { UserPermission } from "@/database/tables";
import { SECTION_NAMES } from "@/lib/constants";
import { useAuthState } from "@/context/AuthContextProvider";

export interface UserEditHeaderProps {
  id: string | undefined;
  userData: UserInformation | undefined;
  failed: boolean;
  setUserData: Dispatch<SetStateAction<UserInformation | undefined>>;
}

export default function UserEditHeader(props: UserEditHeaderProps) {
  const { id, userData, setUserData, failed } = props;
  const { user } = useAuthState();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const per: UserPermission | undefined = user?.permissions.get(
    SECTION_NAMES.users
  );
  const hasEdit = per ? per?.edit : false;
  const hasRemove = per ? per?.delete : false;

  const onFileUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    // Handle execution
    if (loading) return;
    //
    setLoading(true);

    const fileInput = e.target;
    const maxFileSize = 2 * 1024 * 1024; // 2MB

    if (!fileInput.files) {
      toast({
        toastType: "ERROR",
        title: t("Error"),
        description: t("No file was chosen"),
      });
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      toast({
        toastType: "ERROR",
        title: t("Error"),
        description: t("Files list is empty"),
      });
      return;
    }

    const file = fileInput.files[0];
    if (file.size >= maxFileSize) {
      toast({
        toastType: "ERROR",
        title: t("Error"),
        description: t("Image size should be less than 2MB"),
      });
      return;
    }
    /** Type validation */
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast({
        toastType: "ERROR",
        title: t("Error"),
        description: t("Please select a valid image file (jpg, png, jpeg)."),
      });
      return;
    }

    // Update profile
    const formData = new FormData();
    if (id !== undefined) formData.append("id", id);
    formData.append("profile", file);
    try {
      const response = await axiosClient.post("user/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status == 200 && userData) {
        // Change logged in user data
        setUserData({
          ...userData,
          profile: response.data.profile,
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
      console.log(error);
    } finally {
      setLoading(false);
    }
    /** Reset file input */
    if (e.currentTarget) {
      e.currentTarget.type = "text";
      e.currentTarget.type = "file"; // Reset to file type
    }
  };
  const deleteProfilePicture = async () => {
    if (userData?.profile == "") {
      toast({
        toastType: "ERROR",
        title: "Error!",
        description: "No image is selected!",
        duration: 3000,
      });
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosClient.delete("user/delete-profile/" + id);
      if (response.status == 200 && userData) {
        // Change logged in user data
        setUserData({
          ...userData,
          profile: undefined,
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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="self-center text-center">
      <CachedImage
        src={userData?.profile}
        alt="Avatar"
        loaderClassName="size-[86px] !mt-6 mx-auto shadow-lg border border-primary/30 rounded-full"
        className="size-[86px] !mt-6 object-center object-cover mx-auto shadow-lg border border-primary/50 rounded-full"
      />
      {loading && (
        <NastranSpinner
          label={t("in progress")}
          className="size-[14px] mt-2"
          labelclassname="text-primary/80 rtl:text-sm-rtl ltr:text-sm-ltr"
        />
      )}
      {userData && !failed && (
        <div className="flex self-center justify-center !mt-2 !mb-6 gap-x-4">
          {hasEdit && (
            <IconButton className="hover:bg-primary/20 transition-all text-primary">
              <label
                className={`flex w-fit gap-x-1 items-center cursor-pointer justify-center`}
              >
                <Pencil className={`size-[13px] pointer-events-none`} />
                <h1 className={`rtl:text-lg-rtl ltr:text-md-ltr`}>
                  {t("Choose")}
                </h1>
                <input
                  type="file"
                  className={`block w-0 h-0`}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    onFileUploadChange(e);
                  }}
                />
              </label>
            </IconButton>
          )}
          {hasRemove && (
            <IconButton
              className="hover:bg-red-400/30 transition-all border-red-400/40 text-red-400"
              onClick={deleteProfilePicture}
            >
              <Trash2 className="size-[13px] pointer-events-none" />
              <h1 className="rtl:text-lg-rtl ltr:text-md-ltr">{t("Delete")}</h1>
            </IconButton>
          )}
        </div>
      )}

      <h1 className="text-primary font-semibold rtl:text-4xl-rtl ltr:text-4xl-ltr">
        {userData?.username}
      </h1>
      <h1 className="leading-6 rtl:text-sm-rtl ltr:text-2xl-ltr">
        {userData?.email}
      </h1>
      <h1 dir="ltr" className="text-primary rtl:text-md-rtl ltr:text-xl-ltr">
        {userData?.contact}
      </h1>
    </div>
  );
}
