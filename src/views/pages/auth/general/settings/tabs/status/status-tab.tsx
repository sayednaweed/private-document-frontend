import NastranModel from "@/components/custom-ui/model/NastranModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useGlobalState } from "@/context/GlobalStateContext";
import axiosClient from "@/lib/axois-client";
import { toLocaleDate } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { Search } from "lucide-react";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";
import { Status } from "@/database/tables";
import StatusDialog from "./status-dialog";
export default function StatusTab() {
  const { t } = useTranslation();
  const [state] = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{
    visible: boolean;
    status: any;
  }>({
    visible: false,
    status: undefined,
  });
  const [statuses, setStatuses] = useState<{
    unFilterList: Status[];
    filterList: Status[];
  }>({
    unFilterList: [],
    filterList: [],
  });
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);

      // 2. Send data
      const response = await axiosClient.get(`statuses`);
      const fetch = response.data as Status[];
      setStatuses({
        unFilterList: fetch,
        filterList: fetch,
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
  useEffect(() => {
    initialize();
  }, []);

  const searchOnChange = (e: any) => {
    const { value } = e.target;
    // 1. Filter
    const filtered = statuses.unFilterList.filter((item: Status) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setStatuses({
      ...statuses,
      filterList: filtered,
    });
  };
  const add = (status: Status) => {
    setStatuses((prev) => ({
      unFilterList: [status, ...prev.unFilterList],
      filterList: [status, ...prev.filterList],
    }));
  };
  const update = (status: Status) => {
    setStatuses((prevState) => {
      const updatedUnFiltered = prevState.unFilterList.map((item) =>
        item.id === status.id
          ? { ...item, name: status.name, color: status.color }
          : item
      );

      return {
        ...prevState,
        unFilterList: updatedUnFiltered,
        filterList: updatedUnFiltered,
      };
    });
  };
  const remove = async (status: Status) => {
    try {
      // 1. Remove from backend
      const response = await axiosClient.delete(`status/${status.id}`);
      if (response.status === 200) {
        // 2. Remove from frontend
        setStatuses((prevStatueses) => ({
          unFilterList: prevStatueses.unFilterList.filter(
            (item) => item.id !== status.id
          ),
          filterList: prevStatueses.filterList.filter(
            (item) => item.id !== status.id
          ),
        }));
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const dailog = useMemo(
    () => (
      <NastranModel
        size="lg"
        visible={selected.visible}
        isDismissable={false}
        button={<button></button>}
        showDialog={async () => {
          setSelected({
            visible: false,
            status: undefined,
          });
          return true;
        }}
      >
        <StatusDialog status={selected.status} onComplete={update} />
      </NastranModel>
    ),
    [selected.visible]
  );
  return (
    <div className="relative">
      <div className="rounded-md bg-card p-2 flex gap-x-4 items-baseline mt-4">
        <NastranModel
          size="lg"
          isDismissable={false}
          button={
            <PrimaryButton className="text-primary-foreground">
              {t("add status")}
            </PrimaryButton>
          }
          showDialog={async () => true}
        >
          <StatusDialog onComplete={add} />
        </NastranModel>
        <CustomInput
          size_="lg"
          placeholder={`${t("search")}...`}
          parentClassName="flex-1"
          type="text"
          onChange={searchOnChange}
          startContent={
            <Search className="size-[18px] mx-auto rtl:mr-[4px] text-primary pointer-events-none" />
          }
        />
      </div>
      <Table className="bg-card rounded-md mt-1 py-8 w-full">
        <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-start">{t("id")}</TableHead>
            <TableHead className="text-start">{t("name")}</TableHead>
            <TableHead className="text-start">{t("color")}</TableHead>
            <TableHead className="text-start">{t("date")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {loading ? (
            <>
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
              </TableRow>
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
              </TableRow>
            </>
          ) : (
            statuses.filterList.map((status: Status) => (
              <TableRowIcon
                read={false}
                remove={true}
                edit={true}
                onEdit={async (status: Status) => {
                  setSelected({
                    visible: true,
                    status: status,
                  });
                }}
                key={status.name}
                item={status}
                onRemove={remove}
                onRead={async () => {}}
              >
                <TableCell className="font-medium">{status.id}</TableCell>
                <TableCell>{status.name}</TableCell>
                <TableCell>
                  <div
                    className="h-5 w-7 rounded !bg-center !bg-cover transition-all"
                    style={{ background: status.color }}
                  />
                </TableCell>
                <TableCell>
                  {toLocaleDate(new Date(status.createdAt), state)}
                </TableCell>
              </TableRowIcon>
            ))
          )}
        </TableBody>
      </Table>
      {dailog}
    </div>
  );
}
