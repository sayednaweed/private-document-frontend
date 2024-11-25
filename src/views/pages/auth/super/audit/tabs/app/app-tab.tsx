import { toast } from "@/components/ui/use-toast";
import { PAGINATION_COUNT } from "@/lib/constants";
import useUserDB from "@/lib/indexeddb/useUserDB";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import axiosClient from "@/lib/axois-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Audit } from "@/database/tables";
import {
  AuditFilter,
  AuditSearch,
  AuditSort,
  Order,
  PaginationAuditData,
} from "@/lib/types";
export function AppTab() {
  const { getAppCache } = useUserDB();
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
    <>
      <div>
        <Table className="min-w-full bg-white border rounded-lg shadow-xl">
          <TableHeader>
            <TableRow className="text-left text-gray-600">
              <TableHead className="p-3 border-b">ID</TableHead>
              <TableHead className="p-3 border-b">Username</TableHead>
              <TableHead className="p-3 border-b">Role</TableHead>
              <TableHead className="p-3 border-b">Table</TableHead>
              <TableHead className="p-3 border-b">Action</TableHead>
              <TableHead className="p-3 border-b">Date</TableHead>
              <TableHead className="p-3 border-b">Device</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {audits.filterList.data.map((item: Audit) => (
              <TableRow>
                <TableCell className="p-3 border-b">{item.id}</TableCell>
                <TableCell className="p-3 border-b">{item.username}</TableCell>
                <TableCell className="px-1 py-0">
                  <h1 className="truncate">{item?.department}</h1>
                  <h1 className="truncate">{item?.job}</h1>
                </TableCell>
                <TableCell className="p-3 border-b">{item.table}</TableCell>
                <TableCell className="p-3 border-b">{item.action}</TableCell>
                <TableCell className="p-3 border-b">{item.date}</TableCell>
                <TableCell className="p-3 border-b">{item.device}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
export default AppTab;
