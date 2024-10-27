import HeaderCard from "@/components/custom-ui/card/HeaderCard";
import {
  UserRoundPen,
  UserRoundPlus,
  UserRoundX,
  UsersRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function UserHeader() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 justify-items-center gap-y-2 mt-4">
      <HeaderCard
        title={t("Total Users")}
        total={"1000"}
        description1={t("total")}
        description2={t("user")}
        icon={
          <UsersRound className=" size-[22px] bg-tertiary rounded-sm p-1 text-secondary" />
        }
      />
      <HeaderCard
        title={t("Total Registered Today")}
        total={"10"}
        description1={t("total")}
        description2={t("user today")}
        icon={
          <UserRoundPlus className=" size-[22px] bg-orange-500 rounded-sm p-1 text-secondary" />
        }
      />
      <HeaderCard
        title={t("Total Deleted Today")}
        total={"40"}
        description1={t("total")}
        description2={t("user")}
        icon={
          <UserRoundX className=" size-[22px] bg-red-500 rounded-sm p-1 text-secondary" />
        }
      />
      <HeaderCard
        title={t("Total Edited Today")}
        total={"70"}
        description1={t("total")}
        description2={t("user")}
        icon={
          <UserRoundPen className=" size-[22px] bg-green-500 rounded-sm p-1 text-secondary" />
        }
      />
    </div>
  );
}
