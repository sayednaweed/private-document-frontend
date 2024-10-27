import { useTranslation } from "react-i18next";
export default function Unauthorized() {
  const { t } = useTranslation();

  return (
    <div className="h-screen flex justify-center items-center">
      <h1 className=" rtl:text-[36px] text-red-500">{t("unauthorized")}</h1>
    </div>
  );
}
