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
import { Urgency } from "@/database/tables";
import UrgencyDialog from "./urgency-dialog";
export default function UrgencyTab() {
  const { t } = useTranslation();
  const [state] = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{
    visible: boolean;
    urgency: any;
  }>({
    visible: false,
    urgency: undefined,
  });
  const [urgencies, setUrgencies] = useState<{
    unFilterList: Urgency[];
    filterList: Urgency[];
  }>({
    unFilterList: [],
    filterList: [],
  });
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);

      // 2. Send data
      const response = await axiosClient.get(`urgencies`);
      const fetch = response.data as Urgency[];
      setUrgencies({
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
    const filtered = urgencies.unFilterList.filter((item: Urgency) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setUrgencies({
      ...urgencies,
      filterList: filtered,
    });
  };
  const add = (urgency: Urgency) => {
    setUrgencies((prev) => ({
      unFilterList: [urgency, ...prev.unFilterList],
      filterList: [urgency, ...prev.filterList],
    }));
  };
  const update = (urgency: Urgency) => {
    setUrgencies((prevState) => {
      const updatedUnFiltered = prevState.unFilterList.map((item) =>
        item.id === urgency.id ? { ...item, name: urgency.name } : item
      );

      return {
        ...prevState,
        unFilterList: updatedUnFiltered,
        filterList: updatedUnFiltered,
      };
    });
  };
  const remove = async (urgency: Urgency) => {
    try {
      // 1. Remove from backend
      const response = await axiosClient.delete(`urgency/${urgency.id}`);
      if (response.status === 200) {
        // 2. Remove from frontend
        setUrgencies((prevUrgencys) => ({
          unFilterList: prevUrgencys.unFilterList.filter(
            (item) => item.id !== urgency.id
          ),
          filterList: prevUrgencys.filterList.filter(
            (item) => item.id !== urgency.id
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
            urgency: undefined,
          });
          return true;
        }}
      >
        <UrgencyDialog urgency={selected.urgency} onComplete={update} />
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
              {t("add urgency")}
            </PrimaryButton>
          }
          showDialog={async () => true}
        >
          <UrgencyDialog onComplete={add} />
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
              </TableRow>
            </>
          ) : (
            urgencies.filterList.map((urgency: Urgency) => (
              <TableRowIcon
                read={false}
                remove={true}
                edit={true}
                onEdit={async (urgency: Urgency) => {
                  setSelected({
                    visible: true,
                    urgency: urgency,
                  });
                }}
                key={urgency.name}
                item={urgency}
                onRemove={remove}
                onRead={async () => {}}
              >
                <TableCell className="font-medium">{urgency.id}</TableCell>
                <TableCell>{urgency.name}</TableCell>
                <TableCell>
                  {toLocaleDate(new Date(urgency.createdAt), state)}
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
