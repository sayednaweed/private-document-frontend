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
import { Source } from "@/database/tables";
import SourceDialog from "./source-dialog";
export default function SourceTab() {
  const { t } = useTranslation();
  const [state] = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{
    visible: boolean;
    source: any;
  }>({
    visible: false,
    source: undefined,
  });
  const [sources, setSources] = useState<{
    unFilterList: Source[];
    filterList: Source[];
  }>({
    unFilterList: [],
    filterList: [],
  });
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);

      // 2. Send data
      const response = await axiosClient.get(`sources`);
      const fetch = response.data as Source[];
      setSources({
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
    const filtered = sources.unFilterList.filter((item: Source) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setSources({
      ...sources,
      filterList: filtered,
    });
  };
  const add = (source: Source) => {
    setSources((prev) => ({
      unFilterList: [source, ...prev.unFilterList],
      filterList: [source, ...prev.filterList],
    }));
  };
  const update = (source: Source) => {
    setSources((prevState) => {
      const updatedUnFiltered = prevState.unFilterList.map((item) =>
        item.id === source.id ? { ...item, name: source.name } : item
      );

      return {
        ...prevState,
        unFilterList: updatedUnFiltered,
        filterList: updatedUnFiltered,
      };
    });
  };
  const remove = async (source: Source) => {
    try {
      // 1. Remove from backend
      const response = await axiosClient.delete(`source/${source.id}`);
      if (response.status === 200) {
        // 2. Remove from frontend
        setSources((prevSources) => ({
          unFilterList: prevSources.unFilterList.filter(
            (item) => item.id !== source.id
          ),
          filterList: prevSources.filterList.filter(
            (item) => item.id !== source.id
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
            source: undefined,
          });
          return true;
        }}
      >
        <SourceDialog source={selected.source} onComplete={update} />
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
              {t("add source")}
            </PrimaryButton>
          }
          showDialog={async () => true}
        >
          <SourceDialog onComplete={add} />
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
            sources.filterList.map((source: Source) => (
              <TableRowIcon
                read={false}
                remove={true}
                edit={true}
                onEdit={async (source: Source) => {
                  setSelected({
                    visible: true,
                    source: source,
                  });
                }}
                key={source.name}
                item={source}
                onRemove={remove}
                onRead={async () => {}}
              >
                <TableCell className="font-medium">{source.id}</TableCell>
                <TableCell>{source.name}</TableCell>
                <TableCell>
                  {toLocaleDate(new Date(source.createdAt), state)}
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
