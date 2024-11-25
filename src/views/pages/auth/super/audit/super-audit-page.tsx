import { AuditProvider } from "@/context/AuditContext";

import { toast } from "@/components/ui/use-toast";

import { PAGINATION_COUNT } from "@/lib/constants";
import useUserDB from "@/lib/indexeddb/useUserDB";
import { useEffect, useState } from "react";

import { useNavigate, useSearchParams } from "react-router";
import axiosClient from "@/lib/axois-client";

import { DateObject } from "react-multi-date-picker";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { Search } from "lucide-react";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import SecondaryButton from "@/components/custom-ui/button/SecondaryButton";
import SessionTab from "./tabs/session/session-tab";
import AppTab from "./tabs/app/app-tab";
import PrintDropdwon from "./print-dropdown";
import { Audit } from "@/database/tables";
import AppDropdown from "./app-dropdwon";
import SessionDropdown from "./session-dropdown";
import {
  AuditFilter,
  AuditSearch,
  AuditSort,
  Order,
  PaginationAuditData,
} from "@/lib/types";

export default function SuperReportsPage() {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const { getAppCache } = useUserDB();
  const [activeTab, setActiveTab] = useState("Session");
  const [searchParams] = useSearchParams();
  // Accessing individual search filters
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const order = searchParams.get("order");
  const [filters, setFilters] = useState<AuditFilter>({
    sort: sort == null ? "name" : (sort as AuditSort),
    order: order == null ? "asc" : (order as Order),
    search: {
      column: search == null ? "username" : (search as AuditSearch),
      value: "",
    },
    date: [],
  });

  const loadList = async (
    count: number,
    dataFilters: AuditFilter,
    page = 1
  ) => {
    try {
      if (loading) return;
      setLoading(true);
      // 1. Organize date
      let dates: {
        startDate: Date | null;
        endDate: Date | null;
      };
      if (filters.date.length === 1) {
        // set start date
        dates = {
          startDate: filters.date[0].toDate(),
          endDate: null,
        };
      } else if (filters.date.length === 2) {
        // set dates
        dates = {
          startDate: filters.date[0].toDate(),
          endDate: filters.date[1].toDate(),
        };
      } else {
        // Set null
        dates = {
          startDate: null,
          endDate: null,
        };
      }
      // 2. Send data
      const response = await axiosClient.get(`audits/${page}`, {
        params: {
          per_page: count,
          filters: {
            sort: dataFilters.sort,
            order: dataFilters.order,
            search: {
              column: dataFilters.search.column,
              value: dataFilters.search.value,
            },
            date: dates,
          },
        },
      });
      const fetch = response.data.audits.data as Audit[];
      const lastPage = response.data.audits.last_page;
      const totalItems = response.data.audits.total;
      const perPage = response.data.audits.per_page;
      const currentPage = response.data.audits.current_page;
      setAudits({
        filterList: {
          data: fetch,
          lastPage: lastPage,
          totalItems: totalItems,
          perPage: perPage,
          currentPage: currentPage,
        },
        unFilterList: {
          data: fetch,
          lastPage: lastPage,
          totalItems: totalItems,
          perPage: perPage,
          currentPage: currentPage,
        },
      });
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: "Error!",
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };
  const initialize = async (dataFilters: AuditFilter) => {
    const count = await getAppCache(PAGINATION_COUNT);
    loadList(count ? count.value : 10, dataFilters);
  };
  useEffect(() => {
    initialize(filters);
  }, [filters.order, filters.sort]);
  const [audits, setAudits] = useState<{
    filterList: PaginationAuditData;
    unFilterList: PaginationAuditData;
  }>({
    filterList: {
      data: [],
      lastPage: 1,
      totalItems: 0,
      perPage: 0,
      currentPage: 0,
    },
    unFilterList: {
      data: [],
      lastPage: 1,
      totalItems: 0,
      perPage: 0,
      currentPage: 0,
    },
  });
  const [loading, setLoading] = useState(false);

  return (
    <AuditProvider>
      <div>
        <Tabs
          dir={direction}
          defaultValue="Session"
          className="flex flex-col m-2 "
          onValueChange={(value) => setActiveTab(value)} // Update activeTab on tab change
        >
          <TabsList className="  !p-0 bg-card mt-2 overflow-x-auto h-16 w-full overflow-y-hidden border border-primary/10 dark:border-primary/20 flex justify-start">
            <TabsTrigger
              value="Session"
              className="gap-x-1 rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
            >
              <Building className="size-[16px] ltr:mr-1 rtl:ml-1" />
              {t("Session")}
            </TabsTrigger>
            <TabsTrigger
              value="App"
              className="gap-x-1 rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
            >
              <Building className="size-[16px] ltr:mr-1 rtl:ml-1" />
              {t("App")}
            </TabsTrigger>
            {/* Filter and search box */}
            <div className="flex flex-row w-2/5 rounded-md ml-4 mr-4">
              <CustomInput
                size_="lg"
                placeholder={`${t(filters.search.column)}...`}
                parentClassName="sm:flex-1 col-span-3"
                type="text"
                ref={searchRef}
                startContent={
                  <Search className="size-[18px] mx-auto rtl:mr-[4px] text-primary pointer-events-none" />
                }
                endContent={
                  <SecondaryButton
                    onClick={async () => {
                      if (searchRef.current != undefined) {
                        const newfilter = {
                          ...filters,
                          search: {
                            column: filters.search.column,
                            value: searchRef.current.value,
                          },
                        };

                        await initialize(newfilter);
                        setFilters(newfilter);
                      }
                    }}
                    className="w-[72px] absolute rtl:left-[6px] ltr:right-[6px] -top-[7px] h-[32px] rtl:text-sm-rtl ltr:text-md-ltr hover:shadow-sm shadow-lg"
                  >
                    {t("search")}
                  </SecondaryButton>
                }
              />
            </div>
            {/* Conditional Dropdowns */}
            <div className="flex flex-row">
              {activeTab === "Session" && (
                <SessionDropdown
                  filters={filters}
                  sortOnComplete={async (filterName: AuditSort) => {
                    if (filterName != filters.sort) {
                      setFilters({
                        ...filters,
                        sort: filterName,
                      });
                      const queryParams = new URLSearchParams();
                      queryParams.set("search", filters.search.column);
                      queryParams.set("sort", filterName);
                      queryParams.set("order", filters.order);
                      navigate(`/audit?${queryParams.toString()}`);
                      // sortList
                      const item = {
                        data: audits.filterList.data,
                        lastPage: audits.unFilterList.lastPage,
                        totalItems: audits.unFilterList.totalItems,
                        perPage: audits.unFilterList.perPage,
                        currentPage: audits.unFilterList.currentPage,
                      };
                      setAudits({
                        ...audits,
                        filterList: item,
                      });
                    }
                  }}
                  searchOnComplete={async (filterName: AuditSearch) => {
                    const search = filters.search;
                    setFilters({
                      ...filters,
                      search: { ...search, column: filterName },
                    });
                  }}
                  orderOnComplete={async (filterName: Order) => {
                    if (filterName != filters.order) {
                      setFilters({
                        ...filters,
                        order: filterName,
                      });
                      const queryParams = new URLSearchParams();
                      queryParams.set("sort", filters.sort);
                      queryParams.set("order", filterName);
                      navigate(`/audit?${queryParams.toString()}`, {
                        replace: true,
                      });
                    }
                  }}
                  dateOnComplete={(selectedDates: DateObject[]) => {
                    setFilters({
                      ...filters,
                      date: selectedDates,
                    });
                  }}
                />
              )}
              {activeTab === "App" && (
                <AppDropdown
                  filters={filters}
                  sortOnComplete={async (filterName: AuditSort) => {
                    if (filterName != filters.sort) {
                      setFilters({
                        ...filters,
                        sort: filterName,
                      });
                      const queryParams = new URLSearchParams();
                      queryParams.set("search", filters.search.column);
                      queryParams.set("sort", filterName);
                      queryParams.set("order", filters.order);
                      navigate(`/audits?${queryParams.toString()}`);
                      // sortList
                      const item = {
                        data: audits.filterList.data,
                        lastPage: audits.unFilterList.lastPage,
                        totalItems: audits.unFilterList.totalItems,
                        perPage: audits.unFilterList.perPage,
                        currentPage: audits.unFilterList.currentPage,
                      };
                      setAudits({
                        ...audits,
                        filterList: item,
                      });
                    }
                  }}
                  searchOnComplete={async (filterName: AuditSearch) => {
                    const search = filters.search;
                    setFilters({
                      ...filters,
                      search: { ...search, column: filterName },
                    });
                  }}
                  orderOnComplete={async (filterName: Order) => {
                    if (filterName != filters.order) {
                      setFilters({
                        ...filters,
                        order: filterName,
                      });
                      const queryParams = new URLSearchParams();
                      queryParams.set("sort", filters.sort);
                      queryParams.set("order", filterName);
                      navigate(`/audits?${queryParams.toString()}`, {
                        replace: true,
                      });
                    }
                  }}
                  dateOnComplete={(selectedDates: DateObject[]) => {
                    setFilters({
                      ...filters,
                      date: selectedDates,
                    });
                  }}
                />
              )}

              <PrintDropdwon />
            </div>
          </TabsList>
          <TabsContent value="Session" className="w-full">
            <div className="overflow-x-auto">
              <SessionTab />
            </div>
          </TabsContent>
          <TabsContent value="App" className="w-full ">
            <div className="overflow-x-auto">
              <AppTab />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AuditProvider>
  );
}
