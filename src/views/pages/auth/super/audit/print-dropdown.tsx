import { useTranslation } from "react-i18next";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";

export default function PrintDropdwon() {
  const { t } = useTranslation();

  const defaultGroupText = "rtl:[&>*]:text-lg-rtl ltr:[&>*]:text-xl-ltr";

  const defaultText = "rtl:text-xl-rtl ltr:text-xl-ltr";
  // State to manage card visibility

  return (
    <div className="flex flex-row">
      <section className="px-2 pt-2">
        <div>
          <Select>
            <SelectTrigger className={`min-w-[130px] ${defaultText}`}>
              <SelectValue placeholder={t("Select Print")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className={defaultGroupText}>
                <div>
                  <div className="flex flex-row justify-center cursor-pointer mb-2">
                    <Upload className="text-center size-4 mr-6" />
                    <h1 className="font-bold">Pdf</h1>
                  </div>
                  <div className="flex flex-row justify-center cursor-pointer">
                    <Upload className="text-center size-4  mr-3" />
                    <h1 className="font-bold">Excel</h1>
                  </div>
                </div>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </section>
    </div>
  );
}
