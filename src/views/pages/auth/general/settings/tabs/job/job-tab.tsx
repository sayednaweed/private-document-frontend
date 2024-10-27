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
import JobDialog from "./job-dialog";
import { Job } from "@/database/tables";
export default function JobTab() {
  const { t } = useTranslation();
  const [state] = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{
    visible: boolean;
    job: any;
  }>({
    visible: false,
    job: undefined,
  });
  const [jobs, setJobs] = useState<{
    unFilterList: Job[];
    filterList: Job[];
  }>({
    unFilterList: [],
    filterList: [],
  });
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);

      // 2. Send data
      const response = await axiosClient.get(`jobs`);
      const fetch = response.data as Job[];
      setJobs({
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
    const filtered = jobs.unFilterList.filter((item: Job) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setJobs({
      ...jobs,
      filterList: filtered,
    });
  };
  const add = (job: Job) => {
    setJobs((prev) => ({
      unFilterList: [job, ...prev.unFilterList],
      filterList: [job, ...prev.filterList],
    }));
  };
  const update = (job: Job) => {
    setJobs((prevState) => {
      const updatedUnFiltered = prevState.unFilterList.map((item) =>
        item.id === job.id ? { ...item, name: job.name } : item
      );

      return {
        ...prevState,
        unFilterList: updatedUnFiltered,
        filterList: updatedUnFiltered,
      };
    });
  };
  const remove = async (job: Job) => {
    try {
      // 1. Remove from backend
      const response = await axiosClient.delete(`job/${job.id}`);
      if (response.status === 200) {
        // 2. Remove from frontend
        setJobs((prevJobs) => ({
          unFilterList: prevJobs.unFilterList.filter(
            (item) => item.id !== job.id
          ),
          filterList: prevJobs.filterList.filter((item) => item.id !== job.id),
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
            job: undefined,
          });
          return true;
        }}
      >
        <JobDialog job={selected.job} onComplete={update} />
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
              {t("add job")}
            </PrimaryButton>
          }
          showDialog={async () => true}
        >
          <JobDialog onComplete={add} />
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
            jobs.filterList.map((department: Job) => (
              <TableRowIcon
                read={false}
                remove={true}
                edit={true}
                onEdit={async (department: Job) => {
                  setSelected({
                    visible: true,
                    job: department,
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
