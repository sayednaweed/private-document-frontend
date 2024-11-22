import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import SecondaryButton from "@/components/custom-ui/button/SecondaryButton";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import CustomSelect from "@/components/custom-ui/select/CustomSelect";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import Pagination from "@/components/custom-ui/table/Pagination";
import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useAuthState } from "@/context/AuthContextProvider";
import { useGlobalState } from "@/context/GlobalStateContext";
import { DocumentModel, UserPermission } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import {
  DOCUMENT_PAGINATION_COUNT,
  PAGINATION_COUNT,
  SECTION_NAMES,
} from "@/lib/constants";
import useUserDB from "@/lib/indexeddb/useUserDB";
import {
  DocumentFilter,
  DocumentPaginationData,
  DocumentSearch,
  DocumentSort,
  Order,
} from "@/lib/types";
import { toLocaleDate } from "@/lib/utils";
import { ListFilter, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { DateObject } from "react-multi-date-picker";
import { useNavigate, useSearchParams } from "react-router";
import AddDocument from "./add/add-document";
import DocumentFilterDialog from "./document-filter-dialog";

export default function DocumentTable() {
  const { user } = useAuthState();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const { updateAppCache, getAppCache } = useUserDB();

  const [searchParams] = useSearchParams();
  // Accessing individual search filters
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const order = searchParams.get("order");
  const [filters, setFilters] = useState<DocumentFilter>({
    sort: sort == null ? "document no" : (sort as DocumentSort),
    order: order == null ? "asc" : (order as Order),
    search: {
      column: search == null ? "document no" : (search as DocumentSearch),
      value: "",
    },
    date: [],
  });

  const loadList = async (
    count: number,
    dataFilters: DocumentFilter,
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
      const response = await axiosClient.get(`documents/${page}`, {
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
      const fetch: any = [];
      // const fetch = response.data.users.data as DocumentModel[];
      const lastPage = response.data.users.last_page;
      const totalItems = response.data.users.total;
      const perPage = response.data.users.per_page;
      const currentPage = response.data.users.current_page;
      setDocuments({
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
  const initialize = async (dataFilters: DocumentFilter) => {
    const count = await getAppCache(DOCUMENT_PAGINATION_COUNT);
    loadList(count ? count.value : 10, dataFilters);
  };
  useEffect(() => {
    initialize(filters);
  }, [filters.order, filters.sort]);
  const [documents, setDocuments] = useState<{
    filterList: DocumentPaginationData;
    unFilterList: DocumentPaginationData;
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
  const { t } = useTranslation();

  const [state] = useGlobalState();

  const addItem = (user: DocumentModel) => {
    setDocuments((prevState) => ({
      filterList: {
        ...prevState.filterList,
        data: [user, ...prevState.filterList.data],
      },
      unFilterList: {
        ...prevState.unFilterList,
        data: [user, ...prevState.unFilterList.data],
      },
    }));
  };

  const deleteOnClick = async (user: DocumentModel) => {
    try {
      const userId = user.id;
      const response = await axiosClient.delete("user/" + userId);
      if (response.status == 200) {
        const filtered = documents.unFilterList.data.filter(
          (item: DocumentModel) => userId != item?.id
        );
        const item = {
          data: filtered,
          lastPage: documents.unFilterList.lastPage,
          totalItems: documents.unFilterList.totalItems,
          perPage: documents.unFilterList.perPage,
          currentPage: documents.unFilterList.currentPage,
        };
        setDocuments({ ...documents, filterList: item, unFilterList: item });
      }
      toast({
        toastType: "SUCCESS",
        title: t("Success"),
        description: response.data.message,
      });
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: "Error!",
        description: error.response.data.message,
      });
    }
  };
  const skeleton = (
    <TableRow>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
    </TableRow>
  );
  const editOnClick = async (user: DocumentModel) => {
    const userId = user.id;
    navigate(`/documents/${userId}`);
  };
  const watchOnClick = async (user: DocumentModel) => {
    const userId = user.id;
    navigate(`/documents/${userId}`);
  };
  const per: UserPermission | undefined = user?.permissions.get(
    SECTION_NAMES.documents
  );
  const view = per ? per?.view : false;
  const remove = per ? per?.delete : false;
  const edit = per ? per?.edit : false;
  const add = per ? per?.add : false;
  return (
    <div className="px-2 pt-2 flex flex-col gap-y-[2px] relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr">
      <div className="flex flex-col sm:items-baseline sm:flex-row rounded-md bg-card gap-2 flex-1 px-2 py-2 mt-4">
        {add && (
          <NastranModel
            size="lg"
            className="bg-transparent pt-2"
            isDismissable={false}
            button={
              <PrimaryButton className="rtl:text-lg-rtl font-semibold ltr:text-md-ltr">
                {t("new document")}
              </PrimaryButton>
            }
            showDialog={async () => true}
          >
            <AddDocument onComplete={addItem} />
          </NastranModel>
        )}

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
        <div className="sm:px-4 col-span-3 flex-1 self-start sm:self-baseline flex justify-end items-center">
          <NastranModel
            size="lg"
            isDismissable={false}
            button={
              <SecondaryButton
                className="px-8 rtl:text-md-rtl ltr:text-md-ltr"
                type="button"
              >
                {t("filter")}
                <ListFilter className="text-secondary mx-2 size-[15px]" />
              </SecondaryButton>
            }
            showDialog={async () => true}
          >
            <DocumentFilterDialog
              filters={filters}
              sortOnComplete={async (filterName: DocumentSort) => {
                if (filterName != filters.sort) {
                  setFilters({
                    ...filters,
                    sort: filterName,
                  });
                  const queryParams = new URLSearchParams();
                  queryParams.set("search", filters.search.column);
                  queryParams.set("sort", filterName);
                  queryParams.set("order", filters.order);
                  navigate(`/documents?${queryParams.toString()}`);
                  // sortList
                  const item = {
                    data: documents.filterList.data,
                    lastPage: documents.unFilterList.lastPage,
                    totalItems: documents.unFilterList.totalItems,
                    perPage: documents.unFilterList.perPage,
                    currentPage: documents.unFilterList.currentPage,
                  };
                  setDocuments({
                    ...documents,
                    filterList: item,
                  });
                }
              }}
              searchOnComplete={async (filterName: DocumentSearch) => {
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
                  navigate(`/documents?${queryParams.toString()}`, {
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
          </NastranModel>
        </div>
        <CustomSelect
          options={[
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "50", label: "50" },
          ]}
          className="w-fit sm:self-baseline"
          updateCache={updateAppCache}
          getCache={getAppCache}
          placeholder={`${t("select")}...`}
          emptyPlaceholder={t("No options found")}
          rangePlaceholder={t("count")}
          onChange={async (value: string) => {
            loadList(parseInt(value), filters);
          }}
        />
      </div>
      <Table className="bg-card rounded-md my-[2px] py-8 table-fixed">
        <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-1 text-center w-[60px]">
              {t("id")}
            </TableHead>
            <TableHead className="text-start px-1">{t("type")}</TableHead>
            <TableHead className="text-start px-1">{t("urgency")}</TableHead>
            <TableHead className="text-start px-1">
              {t("document no")}
            </TableHead>
            <TableHead className="text-start px-1">
              {t("document date")}
            </TableHead>
            <TableHead className="text-start px-1">
              {t("remaining time")}
            </TableHead>
            <TableHead className="text-start px-1">{t("source")}</TableHead>
            <TableHead className="text-start px-1 w-[60px]">
              {t("status")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="rtl:text-xl-rtl ltr:text-2xl-ltr">
          {loading ? (
            <>
              {skeleton}
              {skeleton}
              {skeleton}
            </>
          ) : (
            documents.filterList.data.map((item: DocumentModel) => (
              <TableRowIcon
                read={view}
                remove={remove}
                edit={edit}
                onEdit={editOnClick}
                key={item.createdAt}
                item={item}
                onRemove={deleteOnClick}
                onRead={watchOnClick}
              >
                <TableCell className="px-1 py-0">{item.id}</TableCell>
                <TableCell className="px-1 py-0">{item.type.name}</TableCell>
                <TableCell className="px-1 py-0">{item.urgency.name}</TableCell>
                <TableCell className="px-1 py-0">
                  {item.documentNumber}
                </TableCell>
                <TableCell className="px-1 py-0">{item.documentDate}</TableCell>
                <TableCell className="px-1 py-0">
                  {item.submittedDuration}
                </TableCell>

                <TableCell
                  dir="ltr"
                  className="rtl:text-md-rtl truncate rtl:text-end px-0 py-0"
                >
                  {item.scan.muqamScan}
                </TableCell>
                <TableCell className="px-1 py-0">
                  {toLocaleDate(new Date(item.createdAt), state)}
                </TableCell>
                <TableCell className="px-1 py-0">
                  {item?.status ? (
                    <h1 className="truncate text-center rtl:text-md-rtl ltr:text-lg-ltr bg-green-500 px-1 py-[2px] shadow-md text-primary-foreground font-bold rounded-sm">
                      {t("Active")}
                    </h1>
                  ) : (
                    <h1 className="truncate text-center rtl:text-md-rtl ltr:text-lg-ltr bg-red-400 px-1 py-[2px] shadow-md text-primary-foreground font-bold rounded-sm">
                      {t("Lock")}
                    </h1>
                  )}
                </TableCell>
              </TableRowIcon>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between rounded-md bg-card flex-1 p-3 items-center">
        <h1 className="rtl:text-lg-rtl ltr:text-md-ltr font-medium">{`${t(
          "page"
        )} ${documents.unFilterList.currentPage} ${t("of")} ${
          documents.unFilterList.lastPage
        }`}</h1>
        <Pagination
          lastPage={documents.unFilterList.lastPage}
          onPageChange={async (page) => {
            try {
              const count = await getAppCache(PAGINATION_COUNT);
              const response = await axiosClient.get(`users/${page}`, {
                params: {
                  per_page: count ? count.value : 10,
                },
              });
              const fetch = response.data.documents.data as DocumentModel[];

              const item = {
                currentPage: page,
                data: fetch,
                lastPage: documents.unFilterList.lastPage,
                totalItems: documents.unFilterList.totalItems,
                perPage: documents.unFilterList.perPage,
              };
              setDocuments({
                filterList: item,
                unFilterList: item,
              });
            } catch (error: any) {
              toast({
                toastType: "ERROR",
                title: "Error!",
                description: error.response.data.message,
              });
            }
          }}
        />
      </div>
    </div>
  );
}
