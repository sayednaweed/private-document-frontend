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
import { DocumentType } from "@/database/tables";
import DocumentTypeDialog from "./document-type-dialog";
export default function DocumentTypeTab() {
  const { t } = useTranslation();
  const [state] = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{
    visible: boolean;
    documentType: any;
  }>({
    visible: false,
    documentType: undefined,
  });
  const [documentTypes, setDocumentTypeS] = useState<{
    unFilterList: DocumentType[];
    filterList: DocumentType[];
  }>({
    unFilterList: [],
    filterList: [],
  });
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);

      // 2. Send data
      const response = await axiosClient.get(`document-types`);
      const fetch = response.data as DocumentType[];
      setDocumentTypeS({
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
    const filtered = documentTypes.unFilterList.filter((item: DocumentType) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setDocumentTypeS({
      ...documentTypes,
      filterList: filtered,
    });
  };
  const add = (documentType: DocumentType) => {
    setDocumentTypeS((prev) => ({
      unFilterList: [documentType, ...prev.unFilterList],
      filterList: [documentType, ...prev.filterList],
    }));
  };
  const update = (documentType: DocumentType) => {
    setDocumentTypeS((prevState) => {
      const updatedUnFiltered = prevState.unFilterList.map((item) =>
        item.id === documentType.id
          ? { ...item, name: documentType.name }
          : item
      );

      return {
        ...prevState,
        unFilterList: updatedUnFiltered,
        filterList: updatedUnFiltered,
      };
    });
  };
  const remove = async (documentType: DocumentType) => {
    try {
      // 1. Remove from backend
      const response = await axiosClient.delete(
        `document-type/${documentType.id}`
      );
      if (response.status === 200) {
        // 2. Remove from frontend
        setDocumentTypeS((prevDocumentTypes) => ({
          unFilterList: prevDocumentTypes.unFilterList.filter(
            (item) => item.id !== documentType.id
          ),
          filterList: prevDocumentTypes.filterList.filter(
            (item) => item.id !== documentType.id
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
            documentType: undefined,
          });
          return true;
        }}
      >
        <DocumentTypeDialog
          documentType={selected.documentType}
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
              {t("add document type")}
            </PrimaryButton>
          }
          showDialog={async () => true}
        >
          <DocumentTypeDialog onComplete={add} />
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
            documentTypes.filterList.map((documentType: DocumentType) => (
              <TableRowIcon
                read={false}
                remove={true}
                edit={true}
                onEdit={async (documentType: DocumentType) => {
                  setSelected({
                    visible: true,
                    documentType: documentType,
                  });
                }}
                key={documentType.name}
                item={documentType}
                onRemove={remove}
                onRead={async () => {}}
              >
                <TableCell className="font-medium">{documentType.id}</TableCell>
                <TableCell>{documentType.name}</TableCell>
                <TableCell>
                  {toLocaleDate(new Date(documentType.createdAt), state)}
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
