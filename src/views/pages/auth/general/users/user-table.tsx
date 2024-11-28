import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
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
import { User, UserPermission } from "@/database/tables";
import { PAGINATION_COUNT, SECTION_NAMES } from "@/lib/constants";
import useUserDB from "@/lib/indexeddb/useUserDB";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import axiosClient from "@/lib/axois-client";

import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";
import Pagination from "@/components/custom-ui/table/Pagination";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import { toLocaleDate } from "@/lib/utils";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { ListFilter, Search } from "lucide-react";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import SecondaryButton from "@/components/custom-ui/button/SecondaryButton";
import UserFilterDialog from "./user-filter-dialog";
import AddUser from "./add/add-user";
import CustomSelect from "@/components/custom-ui/select/CustomSelect";
import { DateObject } from "react-multi-date-picker";
import {
  Order,
  UserFilter,
  UserPaginationData,
  UserSearch,
  UserSort,
} from "@/lib/types";

export function UserTable() {
  const { user } = useAuthState();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const { updateAppCache, getAppCache } = useUserDB();

  const [searchParams] = useSearchParams();
  // Accessing individual search filters
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const order = searchParams.get("order");
  const [filters, setFilters] = useState<UserFilter>({
    sort: sort == null ? "date" : (sort as UserSort),
    order: order == null ? "asc" : (order as Order),
    search: {
      column: search == null ? "username" : (search as UserSearch),
      value: "",
    },
    date: [],
  });
  const loadList = async (count: number, dataFilters: UserFilter, page = 1) => {
    try {
      if (loading) return;
      setLoading(true);
      // 1. Organize date
      let dates: {
        startDate: string | null;
        endDate: string | null;
      };
      if (filters.date.length === 1) {
        // set start date
        dates = {
          startDate: filters.date[0].toDate().toISOString(),
          endDate: null,
        };
      } else if (filters.date.length === 2) {
        // set dates
        dates = {
          startDate: filters.date[0].toDate().toISOString(),
          endDate: filters.date[1].toDate().toISOString(),
        };
      } else {
        // Set null
        dates = {
          startDate: null,
          endDate: null,
        };
      }
      // 2. Send data
      const response = await axiosClient.get(`users/${page}`, {
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
      const fetch = response.data.users.data as User[];
      const lastPage = response.data.users.last_page;
      const totalItems = response.data.users.total;
      const perPage = response.data.users.per_page;
      const currentPage = response.data.users.current_page;
      setUsers({
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
  const initialize = async (dataFilters: UserFilter) => {
    const count = await getAppCache(PAGINATION_COUNT);
    loadList(count ? count.value : 10, dataFilters);
  };
  useEffect(() => {
    initialize(filters);
  }, [filters.order, filters.sort]);
  const [users, setUsers] = useState<{
    filterList: UserPaginationData;
    unFilterList: UserPaginationData;
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

  const addItem = (user: User) => {
    setUsers((prevState) => ({
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

  const deleteOnClick = async (user: User) => {
    try {
      const userId = user.id;
      const response = await axiosClient.delete("user/" + userId);
      if (response.status == 200) {
        const filtered = users.unFilterList.data.filter(
          (item: User) => userId != item?.id
        );
        const item = {
          data: filtered,
          lastPage: users.unFilterList.lastPage,
          totalItems: users.unFilterList.totalItems,
          perPage: users.unFilterList.perPage,
          currentPage: users.unFilterList.currentPage,
        };
        setUsers({ ...users, filterList: item, unFilterList: item });
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
    </TableRow>
  );
  const per: UserPermission | undefined = user?.permissions.get(
    SECTION_NAMES.users
  );
  const view = per ? per?.view : false;
  const remove = per ? per?.delete : false;
  const edit = per ? per?.edit : false;
  const add = per ? per?.add : false;
  const editOnClick = async (user: User) => {
    const userId = user.id;
    navigate(`/users/${userId}`);
  };
  const watchOnClick = async (user: User) => {
    const userId = user.id;
    navigate(`/users/${userId}`);
  };
  return (
    <>
      <div className="flex flex-col sm:items-baseline sm:flex-row rounded-md bg-card gap-2 flex-1 px-2 py-2 mt-4">
        {add && (
          <NastranModel
            size="lg"
            isDismissable={false}
            button={
              <PrimaryButton className="rtl:text-lg-rtl font-semibold ltr:text-md-ltr">
                {t("Add")}
              </PrimaryButton>
            }
            showDialog={async () => {
              if (user?.permissions.get(SECTION_NAMES.users)?.add) return true;
              toast({
                toastType: "ERROR",
                title: "Error!",
                description: t("You don't have the permission to add"),
              });
              return false;
            }}
          >
            <AddUser onComplete={addItem} />
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
            <UserFilterDialog
              filters={filters}
              sortOnComplete={async (filterName: UserSort) => {
                if (filterName != filters.sort) {
                  setFilters({
                    ...filters,
                    sort: filterName,
                  });
                  const queryParams = new URLSearchParams();
                  queryParams.set("search", filters.search.column);
                  queryParams.set("sort", filterName);
                  queryParams.set("order", filters.order);
                  navigate(`/users?${queryParams.toString()}`);
                  // sortList
                  const item = {
                    data: users.filterList.data,
                    lastPage: users.unFilterList.lastPage,
                    totalItems: users.unFilterList.totalItems,
                    perPage: users.unFilterList.perPage,
                    currentPage: users.unFilterList.currentPage,
                  };
                  setUsers({
                    ...users,
                    filterList: item,
                  });
                }
              }}
              searchOnComplete={async (filterName: UserSearch) => {
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
                  navigate(`/users?${queryParams.toString()}`, {
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
          getCache={async () => await getAppCache(PAGINATION_COUNT)}
          placeholder={`${t("select")}...`}
          emptyPlaceholder={t("No options found")}
          rangePlaceholder={t("count")}
          onChange={async (value: string) => {
            loadList(parseInt(value), filters);
          }}
        />
      </div>
      <Table className="bg-card rounded-md my-[2px] py-8">
        <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-center px-1 w-[60px]">
              {t("Profile")}
            </TableHead>
            <TableHead className="text-start px-1">{t("username")}</TableHead>
            <TableHead className="text-start px-1">{t("role")}</TableHead>
            <TableHead className="text-start px-1">{t("email")}</TableHead>
            <TableHead className="text-start px-1">{t("contact")}</TableHead>
            <TableHead className="text-start px-1">{t("Join date")}</TableHead>
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
            users.filterList.data.map((item: User) => (
              <TableRowIcon
                read={view}
                remove={remove}
                edit={edit}
                onEdit={editOnClick}
                key={item.email}
                item={item}
                onRemove={deleteOnClick}
                onRead={watchOnClick}
              >
                <TableCell className="px-1 py-0">
                  <CachedImage
                    src={item?.profile}
                    alt="Avatar"
                    iconClassName="size-[18px]"
                    loaderClassName="size-[36px] mx-auto shadow-lg border border-tertiary rounded-full"
                    className="size-[36px] object-center object-cover mx-auto shadow-lg border border-tertiary rounded-full"
                  />
                </TableCell>
                <TableCell className="rtl:text-md-rtl truncate px-1 py-0">
                  {item.username}
                </TableCell>
                <TableCell>
                  <h1 className="truncate">{item?.destination}</h1>
                  <h1 className="truncate">{item?.job}</h1>
                </TableCell>
                <TableCell
                  dir="ltr"
                  className="rtl:text-md-rtl truncate rtl:text-end px-0 py-0"
                >
                  {item.email}
                </TableCell>
                <TableCell dir="ltr" className="rtl:text-end">
                  {item?.contact == "null" ? "" : item?.contact}
                </TableCell>
                <TableCell>
                  {toLocaleDate(new Date(item.createdAt), state)}
                </TableCell>
                <TableCell>
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
        )} ${users.unFilterList.currentPage} ${t("of")} ${
          users.unFilterList.lastPage
        }`}</h1>
        <Pagination
          lastPage={users.unFilterList.lastPage}
          onPageChange={async (page) => {
            try {
              const count = await getAppCache(PAGINATION_COUNT);
              const response = await axiosClient.get(`users/${page}`, {
                params: {
                  per_page: count ? count.value : 10,
                },
              });
              const fetch = response.data.users.data as User[];

              const item = {
                currentPage: page,
                data: fetch,
                lastPage: users.unFilterList.lastPage,
                totalItems: users.unFilterList.totalItems,
                perPage: users.unFilterList.perPage,
              };
              setUsers({
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
    </>
  );
}
