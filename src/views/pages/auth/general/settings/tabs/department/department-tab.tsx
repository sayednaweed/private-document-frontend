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
import { Department } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import { toLocaleDate } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { Search } from "lucide-react";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";
import DepartmentDialog from "./department-dialog";
export default function DepartmentTab() {
  const { t } = useTranslation();
  const [state] = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{
    visible: boolean;
    department: any;
  }>({
    visible: false,
    department: undefined,
  });
  const [departments, setDepartments] = useState<{
    unFilterList: Department[];
    filterList: Department[];
  }>({
    unFilterList: [],
    filterList: [],
  });
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);

      // 2. Send data
      const response = await axiosClient.get(`departments`);
      const fetch = response.data as Department[];
      setDepartments({
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
    const filtered = departments.unFilterList.filter((item: Department) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setDepartments({
      ...departments,
      filterList: filtered,
    });
  };
  const add = (department: Department) => {
    setDepartments((prev) => ({
      unFilterList: [department, ...prev.unFilterList],
      filterList: [department, ...prev.filterList],
    }));
  };
  const update = (department: Department) => {
    setDepartments((prevState) => {
      const updatedUnFiltered = prevState.unFilterList.map((dep) =>
        dep.id === department.id ? { ...dep, name: department.name } : dep
      );

      return {
        ...prevState,
        unFilterList: updatedUnFiltered,
        filterList: updatedUnFiltered,
      };
    });
  };
  const remove = async (department: Department) => {
    try {
      // 1. Remove from backend
      const response = await axiosClient.delete(`department/${department.id}`);
      if (response.status === 200) {
        // 2. Remove from frontend
        setDepartments((prevDepartments) => ({
          unFilterList: prevDepartments.unFilterList.filter(
            (dept) => dept.id !== department.id
          ),
          filterList: prevDepartments.filterList.filter(
            (dept) => dept.id !== department.id
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
            department: undefined,
          });
          return true;
        }}
      >
        <DepartmentDialog
          department={selected.department}
          onComplete={update}
        />
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
              {t("add department")}
            </PrimaryButton>
          }
          showDialog={async () => true}
        >
          <DepartmentDialog onComplete={add} />
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
            <TableHead className="text-start">{t("created date")}</TableHead>
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
            departments.filterList.map((department: Department) => (
              <TableRowIcon
                read={false}
                remove={true}
                edit={true}
                onEdit={async (department: Department) => {
                  setSelected({
                    visible: true,
                    department: department,
                  });
                }}
                key={department.name}
                item={department}
                onRemove={remove}
                onRead={async () => {}}
              >
                <TableCell className="font-medium">{department.id}</TableCell>
                <TableCell>{department.name}</TableCell>
                <TableCell>
                  {toLocaleDate(new Date(department.createdAt), state)}
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
