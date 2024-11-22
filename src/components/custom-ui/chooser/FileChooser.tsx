import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Paperclip, Trash2 } from "lucide-react";
import React, { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";

export interface FileChooserProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  requiredHint?: string;
  lable: string;
  errorMessage?: string;
  defaultFile: File | undefined;
  maxSize: number;
  validTypes: string[];
  onchange: (file: File | undefined) => void;
}
const FileChooser = React.forwardRef<HTMLInputElement, FileChooserProps>(
  (props, ref: any) => {
    const {
      className,
      requiredHint,
      errorMessage,
      required,
      lable,
      defaultFile,
      maxSize,
      validTypes,
      onchange,
      ...rest
    } = props;
    const { t } = useTranslation();
    const [userData, setUserData] = useState<File | undefined>(defaultFile);
    const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const fileInput = e.target;
      const maxFileSize = maxSize * 1024 * 1024; // 2MB

      if (!fileInput.files) {
        toast({
          toastType: "ERROR",
          title: t("Error"),
          description: t("No file was chosen"),
        });
        resetFile(e);
        return;
      }

      if (!fileInput.files || fileInput.files.length === 0) {
        toast({
          toastType: "ERROR",
          title: t("Error"),
          description: t("Files list is empty"),
        });
        resetFile(e);
        return;
      }

      const file = fileInput.files[0];
      if (file.size >= maxFileSize) {
        toast({
          toastType: "ERROR",
          title: t("Error"),
          description: t(`File size should be less than ${maxSize}MB`),
        });
        resetFile(e);
        return;
      }
      /** Type validation */
      if (!validTypes.includes(file.type)) {
        toast({
          toastType: "ERROR",
          title: t("Error"),
          description: t(validTypes.join(", ")),
        });
        resetFile(e);
        return;
      }
      setUserData(file);
      onchange(file);
      /** Reset file input */
      resetFile(e);
    };
    const deleteFile = async () => {
      setUserData(undefined);
      onchange(undefined);
    };
    const resetFile = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.currentTarget) {
        e.currentTarget.type = "text";
        e.currentTarget.type = "file"; // Reset to file type
      }
    };
    return (
      <div className="grid grid-cols-[auto_1fr]  relative">
        <Label
          htmlFor="initail_scan"
          className={`w-fit rounded-s-md shadow-md bg-primary px-4 hover:opacity-90 transition-opacity cursor-pointer py-2 flex items-center gap-x-3 text-primary-foreground`}
        >
          <h1 className="rtl:text-lg-rtl ltr:text-lg-ltr pb-[1px] cursor-pointer">
            {lable}
          </h1>
          <input
            onChange={onFileChange}
            {...rest}
            ref={ref}
            type="file"
            id="initail_scan"
            className={cn("hidden cursor-pointer", className)}
          />
          <Paperclip className="size-[20px] cursor-pointer" />
        </Label>
        <label
          htmlFor="initail_scan"
          className="font-semibold flex items-center justify-between px-3 border rounded-e-md flex-1 text-[12px]"
        >
          {userData ? (
            <>
              {userData?.name}
              <Trash2
                onClick={deleteFile}
                className="inline-block cursor-pointer text-red-500 size-[18px] ltr:ml-2 rtl:mr-2"
              />
            </>
          ) : (
            "No File Chosen"
          )}
        </label>

        {required && (
          <span className="text-red-600 rtl:text-[13px] ltr:text-[11px] ltr:right-[10px] rtl:left-[10px] -top-[17px] absolute font-semibold">
            {requiredHint}
          </span>
        )}
        {errorMessage && (
          <>
            <h1 className="rtl:text-sm-rtl ltr:text-sm-ltr capitalize text-start text-red-400">
              {errorMessage}
            </h1>
          </>
        )}
      </div>
    );
  }
);

export default FileChooser;
