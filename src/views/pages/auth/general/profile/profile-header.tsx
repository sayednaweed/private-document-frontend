import CachedImage from "@/components/custom-ui/image/CachedImage";
import IconButton from "@/components/custom-ui/button/IconButton";
import { Pencil, Trash2 } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAuthState } from "@/context/AuthContextProvider";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
export default function ProfileHeader() {
  const { user, setUser } = useAuthState();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const onFileUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    // Handle execution
    if (loading) return;
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
    formData.append("profile", file);
    try {
      const response = await axiosClient.post(
        "profile/picture-update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == 200) {
        // Change logged in user data
        await setUser({
          ...user,
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
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosClient.delete("profile/picture-delete");
      if (response.status == 200) {
        // Change logged in user data
        await setUser({
          ...user,
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
        src={user.profile}
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
      <div className="flex self-center justify-center !mt-2 !mb-6 gap-x-4">
        <IconButton className="hover:bg-primary/20 transition-all text-primary">
          <label
            className={`flex w-fit gap-x-1 items-center cursor-pointer justify-center`}
          >
            <Pencil className={`size-[13px] pointer-events-none`} />
            <h1 className={`rtl:text-lg-rtl ltr:text-md-ltr`}>{t("Choose")}</h1>
            <input
              type="file"
              className={`block w-0 h-0`}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                onFileUploadChange(e);
              }}
            />
          </label>
        </IconButton>
        <IconButton
          className="hover:bg-red-400/30 transition-all border-red-400/40 text-red-400"
          onClick={async () => {
            if (user.profile == "")
              toast({
                toastType: "ERROR",
                title: "Error!",
                description: "No image is selected!",
                duration: 3000,
              });
            else {
              await deleteProfilePicture();
            }
          }}
        >
          <Trash2 className="size-[14px] pointer-events-none" />
          <h1 className="rtl:text-lg-rtl ltr:text-md-ltr">{t("Delete")}</h1>
        </IconButton>
      </div>
      <h1 className="text-primary font-semibold rtl:text-4xl-rtl ltr:text-4xl-ltr">
        {user.username}
      </h1>
      <h1 className="leading-6 rtl:text-sm-rtl ltr:text-2xl-ltr">
        {user.email}
      </h1>
      <h1 dir="ltr" className="text-primary rtl:text-md-rtl ltr:text-xl-ltr">
        {user.contact}
      </h1>
    </div>
  );
}
