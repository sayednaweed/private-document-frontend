import { useTranslation } from "react-i18next";

import {
  Select,
  SelectContent,
  SelectGroup,
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

export default function AppDropdown(props: AuditFilterProps) {
  const {
    sortOnComplete,
    searchOnComplete,
    orderOnComplete,
    dateOnComplete,
    filters,
  } = props;
  const [searchBy, setSearchBy] = useState<string | null>(null);
  const [filterBy, setFilterBy] = useState<string | null>(null);
  const { t } = useTranslation();
  const handleSort = (itemName: string) => {
    sortOnComplete(itemName as AuditSort);
  };
  const handleSearch = (itemName: string) => {
    searchOnComplete(itemName as AuditSearch);
  };
  const handleOrder = (itemName: string) => {
    orderOnComplete(itemName as Order);
  };
  const defaultGroupText = "rtl:[&>*]:text-lg-rtl ltr:[&>*]:text-xl-ltr";

  const defaultText = "rtl:text-xl-rtl ltr:text-xl-ltr";
  // State to manage card visibility

  return (
    <div className="flex flex-row">
      <section className="px-2 pt-2">
        <div>
          <Select onValueChange={setSearchBy}>
            <SelectTrigger className={`min-w-[180px] ${defaultText}`}>
              <SelectValue placeholder={t("Search By")} />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup className={defaultGroupText}>
                <FilterItem
                  selected={filters.search.column}
                  headerName={"Search by"}
                  items={[
                    {
                      name: "username",
                      translate: t("username"),
                      onClick: handleSearch,
                    },
                    {
                      name: "table",
                      translate: t("table"),
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
                  selected={filters.sort}
                  headerName={"Filter by"}
                  items={[
                    {
                      name: "username",
                      translate: t("username"),
                      onClick: handleSort,
                    },
                    {
                      name: "action",
                      translate: t("action"),
                      onClick: handleSort,
                    },
                    {
                      name: "table",
                      translate: t("table"),
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
