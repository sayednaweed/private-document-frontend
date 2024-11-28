import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { FilterItem } from "@/components/custom-ui/filter/FilterItem";
import CustomMultiDatePicker from "@/components/custom-ui/DatePicker/CustomMultiDatePicker";
import { DateObject } from "react-multi-date-picker";
import {
  DocumentFilter,
  DocumentSearch,
  DocumentSort,
  Order,
} from "@/lib/types";

export interface DocumentFilterDialogProps {
  sortOnComplete: (itemName: DocumentSort) => void;
  searchOnComplete: (itemName: DocumentSearch) => void;
  orderOnComplete: (itemName: Order) => void;
  dateOnComplete: (selectedDates: DateObject[]) => void;
  filters: DocumentFilter;
}
export default function DocumentFilterDialog(props: DocumentFilterDialogProps) {
  const {
    sortOnComplete,
    searchOnComplete,
    orderOnComplete,
    dateOnComplete,
    filters,
  } = props;
  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();
  const handleSort = (itemName: string) => {
    sortOnComplete(itemName as DocumentSort);
    modelOnRequestHide();
  };
  const handleSearch = (itemName: string) => {
    searchOnComplete(itemName as DocumentSearch);
    modelOnRequestHide();
  };
  const handleOrder = (itemName: string) => {
    orderOnComplete(itemName as Order);
    modelOnRequestHide();
  };
  return (
    <Card className="w-fit self-center [backdrop-filter:blur(20px)] bg-white/70 dark:!bg-black/40">
      <CardHeader className="relative text-start">
        <CardTitle className="rtl:text-4xl-rtl ltr:text-lg-ltr text-tertiary">
          {t("Search filters")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:flex sm:flex-row gap-x-4">
        <FilterItem
          selected={filters.sort}
          headerName={t("Sort by")}
          items={[
            {
              name: "source",
              translate: t("source"),
              onClick: handleSort,
            },
            { name: "status", translate: t("status"), onClick: handleSort },
            {
              name: "documentNumber",
              translate: t("documentNumber"),
              onClick: handleSort,
            },
            {
              name: "urgency",
              translate: t("urgency"),
              onClick: handleSort,
            },
            {
              name: "type",
              translate: t("type"),
              onClick: handleSort,
            },
            {
              name: "documentDate",
              translate: t("documentDate"),
              onClick: handleSort,
            },
            {
              name: "deadline",
              translate: t("deadline"),
              onClick: handleSort,
            },
          ]}
        />
        <section className="min-w-[120px] space-y-2">
          <h1
            className={
              "uppercase text-start font-semibold border-b border-primary/20 pb-2 rtl:text-2xl-rtl ltr:text-lg-ltr text-primary"
            }
          >
            {t("date")}
          </h1>
          <CustomMultiDatePicker
            value={filters.date}
            dateOnComplete={dateOnComplete}
          />
        </section>
        <FilterItem
          selected={filters.search.column}
          headerName={t("search")}
          items={[
            {
              name: "id",
              translate: t("id"),
              onClick: handleSearch,
            },
            {
              name: "documentNumber",
              translate: t("documentNumber"),
              onClick: handleSearch,
            },
          ]}
        />
        <FilterItem
          selected={filters.order}
          headerName={t("Order")}
          items={[
            {
              name: "asc",
              translate: t("asc"),
              onClick: handleOrder,
            },
            {
              name: "desc",
              translate: t("desc"),
              onClick: handleOrder,
            },
          ]}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          className="rtl:text-2xl-rtl ltr:text-lg-ltr"
          onClick={modelOnRequestHide}
        >
          {t("Cancel")}
        </Button>
      </CardFooter>
    </Card>
  );
}
