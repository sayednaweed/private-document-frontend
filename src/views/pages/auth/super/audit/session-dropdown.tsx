import { useTranslation } from "react-i18next";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

import { DateObject } from "react-multi-date-picker";
import { FilterItem } from "@/components/custom-ui/filter/FilterItem";
import { AuditFilter, AuditSearch, AuditSort, Order } from "@/lib/types";

export interface AuditFilterProps {
  sortOnComplete: (itemName: AuditSort) => void;
  searchOnComplete: (itemName: AuditSearch) => void;
  orderOnComplete: (itemName: Order) => void;
  dateOnComplete: (selectedDates: DateObject[]) => void;
  filters: AuditFilter;
}
export default function SessionDropdown(props: AuditFilterProps) {
  const {
    sortOnComplete,
    searchOnComplete,
    orderOnComplete,
    dateOnComplete,
    filters,
  } = props;

  const { t } = useTranslation();
  const [searchBy, setSearchBy] = useState<string | null>(null);
  const [filterBy, setFilterBy] = useState<string | null>(null);

  const defaultGroupText = "rtl:[&>*]:text-lg-rtl ltr:[&>*]:text-xl-ltr";
  const defaultText = "rtl:text-xl-rtl ltr:text-xl-ltr";
  const handleSort = (itemName: string) => {
    sortOnComplete(itemName as AuditSort);
  };
  const handleSearch = (itemName: string) => {
    searchOnComplete(itemName as AuditSearch);
  };
  const handleOrder = (itemName: string) => {
    orderOnComplete(itemName as Order);
  };
  return (
    <div className="flex flex-row justify-end">
      <section className="px-2 pt-2">
        <div>
          <Select onValueChange={setSearchBy}>
            <SelectTrigger className={`min-w-[180px] ${defaultText}`}>
              <SelectValue placeholder={t("Search")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className={defaultGroupText}>
                <FilterItem
                  selected={filters.search.column}
                  headerName={"Search By"}
                  items={[
                    {
                      name: "name",
                      translate: t("name"),
                      onClick: handleSearch,
                    },
                    {
                      name: "ipaddress",
                      translate: t("ipaddress"),
                      onClick: handleSearch,
                    },
                    {
                      name: "date",
                      translate: t("date"),
                      onClick: handleSearch,
                    },
                  ]}
                />
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </section>
      <section className="px-2 pt-2">
        <div>
          <Select onValueChange={setFilterBy}>
            <SelectTrigger className={`min-w-[180px] ${defaultText}`}>
              <SelectValue placeholder={t("Filter")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className={defaultGroupText}>
                <FilterItem
                  headerName={"Filter by"}
                  selected={filters.sort}
                  items={[
                    {
                      name: "name",
                      translate: t("name"),
                      onClick: handleSort,
                    },
                    {
                      name: "ipaddress",
                      translate: t("ipaddress"),
                      onClick: handleSort,
                    },
                    {
                      name: "status",
                      translate: t("status"),
                      onClick: handleSort,
                    },
                    {
                      name: "date",
                      translate: t("date"),
                      onClick: handleSort,
                    },
                  ]}
                />
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </section>
    </div>
  );
}
