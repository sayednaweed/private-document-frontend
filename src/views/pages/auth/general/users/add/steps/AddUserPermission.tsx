import { useContext, useEffect, useState } from "react";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import { Permission } from "@/database/tables";
import { toast } from "@/components/ui/use-toast";
import CustomCheckbox from "@/components/custom-ui/checkbox/CustomCheckbox";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { PERMISSIONS_OPERATION } from "@/lib/constants";
export default function AddUserPermission() {
  const { t } = useTranslation();
  const { userData, setUserData } = useContext(StepperContext);
  const [items, setItems] = useState<Permission[] | undefined>(undefined);
  const initialize = async () => {
    try {
      const response = await axiosClient.get(
        "permissions/" + userData?.role?.id
      );
      if (response.status == 200) {
        setItems(response.data);
      }
    } catch (error: any) {
      console.log(error);
      setItems([]);
      toast({
        toastType: "ERROR",
        title: "Error!",
        description: error.response.data.message,
      });
    }
  };
  useEffect(() => {
    initialize();
  }, []);
  const handleChange = (value: boolean, operation: string, section: string) => {
    let newList = { ...userData };
    const permissions = newList["Permission"];
    if (permissions == undefined) {
      newList = {
        ...newList,
        ["Permission"]: {
          [section]: { [operation]: value },
        },
      };
    } else {
      const sect = permissions[section];
      newList = {
        ...newList,
        ["Permission"]: {
          ...permissions,
          [section]: { ...sect, [operation]: value },
        },
      };
    }
    setUserData({ ...newList });
  };
  const selectRow = (selecterName: string, value: boolean, section: string) => {
    let newList = { ...userData };
    PERMISSIONS_OPERATION.forEach((operation: string) => {
      const permissions = newList["Permission"];
      if (permissions == undefined) {
        newList = {
          ...newList,
          ["Permission"]: {
            [section]: { [operation]: value },
          },
        };
      } else {
        const sect = permissions[section];
        newList = {
          ...newList,
          ["Permission"]: {
            ...permissions,
            [section]: { ...sect, [operation]: value },
          },
        };
      }
    });
    setUserData({ ...newList, [selecterName]: value });
  };
  const selectAllRows = (
    value: boolean,
    selecterName: string,
    individualSelecter: string
  ) => {
    let newList = { ...userData };
    items?.forEach((item: Permission, index: number) => {
      PERMISSIONS_OPERATION.forEach((operation: string) => {
        const permissions = newList["Permission"];
        if (permissions == undefined) {
          newList = {
            ...newList,
            ["Permission"]: {
              [item.name]: { [operation]: value },
            },
          };
        } else {
          const sect = permissions[item.name];
          newList = {
            ...newList,
            ["Permission"]: {
              ...permissions,
              [item.name]: { ...sect, [operation]: value },
            },
          };
        }
      });
      newList = { ...newList, [`${individualSelecter}${index}`]: value };
    });
    setUserData({
      ...newList,
      [selecterName]: value,
    });
  };
  return (
    <div className="relative overflow-x-auto h-full mt-10">
      <table className="w-full text-left rtl:text-right">
        <thead className="rtl:text-3xl-rtl ltr:text-xl-ltr text-primary/80 uppercase bg-secondary">
          <tr>
            <th scope="col" className="p-4">
              <CustomCheckbox
                className="mx-auto"
                checked={userData["select_all"]}
                onCheckedChange={(value: boolean) =>
                  selectAllRows(value, "select_all", "select_row_")
                }
              />
            </th>
            <th scope="col" className="text-start py-3">
              {t("Section")}
            </th>
            <th scope="col" className="text-start py-3">
              {t("Add")}
            </th>
            <th scope="col" className="text-start py-3">
              {t("View")}
            </th>
            <th scope="col" className="text-start py-3">
              {t("Edit")}
            </th>
            <th scope="col" className="text-start py-3">
              {t("Delete")}
            </th>
          </tr>
        </thead>
        <tbody className="relative rtl:text-3xl-rtl ltr:text-lg-ltr">
          {items == undefined ? (
            <tr>
              <td colSpan={8}>
                <h1 className="pt-32">
                  <NastranSpinner className=" mx-auto" />
                </h1>
              </td>
            </tr>
          ) : items.length == 0 ? (
            <tr>
              <td
                colSpan={8}
                className="text-red-500 text-center font-semibold"
              >
                <h1 className="pt-32">{t("permission_description")}</h1>
              </td>
            </tr>
          ) : (
            items.map((item: Permission, index: number) => {
              return (
                <tr className="bg-transparent border-b " key={index}>
                  <td className="w-4 p-4">
                    <CustomCheckbox
                      className="mx-auto"
                      checked={userData[`select_row_${index}` || ""]}
                      onCheckedChange={(value: boolean) =>
                        selectRow(`select_row_${index}`, value, item.name)
                      }
                    />
                  </td>
                  <th
                    scope="row"
                    className="text-start py-4 font-medium text-primary whitespace-nowrap"
                  >
                    {t(item.name)}
                  </th>
                  <td className="py-4">
                    <CustomCheckbox
                      className="ltr:ml-1"
                      checked={
                        userData["Permission"] == undefined
                          ? undefined
                          : userData["Permission"][item.name] == undefined
                          ? undefined
                          : userData["Permission"][item.name]["Add"]
                      }
                      onCheckedChange={(value: boolean) =>
                        handleChange(value, "Add", item.name)
                      }
                    />
                  </td>
                  <td className="py-4">
                    <CustomCheckbox
                      className="ltr:ml-1"
                      checked={
                        userData["Permission"] == undefined
                          ? undefined
                          : userData["Permission"][item.name] == undefined
                          ? undefined
                          : userData["Permission"][item.name]["View"]
                      }
                      onCheckedChange={(value: boolean) =>
                        handleChange(value, "View", item.name)
                      }
                    />
                  </td>
                  <td className="py-4">
                    <CustomCheckbox
                      className="ltr:ml-1"
                      checked={
                        userData["Permission"] == undefined
                          ? undefined
                          : userData["Permission"][item.name] == undefined
                          ? undefined
                          : userData["Permission"][item.name]["Edit"]
                      }
                      onCheckedChange={(value: boolean) =>
                        handleChange(value, "Edit", item.name)
                      }
                    />
                  </td>
                  <td className="py-4">
                    <CustomCheckbox
                      className="ltr:ml-1"
                      checked={
                        userData["Permission"] == undefined
                          ? undefined
                          : userData["Permission"][item.name] == undefined
                          ? undefined
                          : userData["Permission"][item.name]["Delete"]
                      }
                      onCheckedChange={(value: boolean) =>
                        handleChange(value, "Delete", item.name)
                      }
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
