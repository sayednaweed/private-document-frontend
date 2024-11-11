import { UserInformation } from "@/lib/types";
import { useTranslation } from "react-i18next";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthState } from "@/context/AuthContextProvider";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { RefreshCcw } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { SelectUserPermission, UserPermission } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import CustomCheckbox from "@/components/custom-ui/checkbox/CustomCheckbox";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { SECTION_NAMES } from "@/lib/constants";
export interface EditUserPermissionsProps {
  id: string | undefined;
  refreshPage: () => Promise<void>;
  userData: UserInformation | undefined;
  setUserData: Dispatch<SetStateAction<UserInformation | undefined>>;
  failed: boolean;
}

export default function EditUserPermissions(props: EditUserPermissionsProps) {
  const { t } = useTranslation();
  const { user } = useAuthState();
  const { id, userData, failed, refreshPage, setUserData } = props;
  const [loading, setLoading] = useState(false);
  const handleChange = (key: string, permission: SelectUserPermission) => {
    if (userData != undefined)
      setUserData({
        ...userData,
        permission: userData.permission.set(key, permission),
      });
  };
  const selectAllRows = (value: boolean) => {
    if (userData?.permission != undefined) {
      const permissionMap = new Map<string, SelectUserPermission>();

      for (const [_key, item] of userData?.permission) {
        console.log(item);
        const permission: SelectUserPermission = {
          id: item.id,
          edit: value,
          view: value,
          delete: value,
          add: value,
          icon: "", // No need to be added
          priority: 0, // No need to be added
          permission: item.permission,
          allSelected: value,
        };
        permissionMap.set(item.permission, permission);
      }
      setUserData({
        ...userData,
        permission: permissionMap,
        allSelected: value,
      });
    }
  };
  // Function to convert map to JSON object
  const mapToJsonObject = (map: Map<string, SelectUserPermission>): object => {
    return Object.fromEntries(map);
  };

  const saveData = async () => {
    if (id != undefined && !loading) {
      setLoading(true);
      const formData = new FormData();
      formData.append("user_id", id);
      // Convert map to JSON object
      if (userData?.permission != undefined) {
        const jsonObject = mapToJsonObject(userData?.permission);
        formData.append("permission", JSON.stringify(jsonObject));
      }
      try {
        const response = await axiosClient.post(
          "user/update/permission",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status == 200) {
          toast({
            toastType: "SUCCESS",
            title: t("Success"),
            description: t(response.data.message),
          });
        }
      } catch (error: any) {
        toast({
          toastType: "ERROR",
          title: t("Error"),
          description: t(error.response.data.message),
        });
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const per: UserPermission | undefined = user?.permissions.get(
    SECTION_NAMES.users
  );
  const hasEdit = per ? per?.edit : false;

  return (
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("Update account permissions")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("Update_Permissions_Description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {failed ? (
          <h1>{t("You are not authorized!")}</h1>
        ) : userData?.permission == undefined ? (
          <NastranSpinner />
        ) : (
          <div className="relative overflow-x-auto max-h-[500px]">
            <table className="w-full text-left rtl:text-right">
              <thead className="rtl:text-3xl-rtl ltr:text-xl-ltr text-primary/80 uppercase bg-secondary">
                <tr>
                  <th scope="col" className="p-4">
                    <CustomCheckbox
                      checked={userData.allSelected}
                      onCheckedChange={(value: boolean) => {
                        selectAllRows(value);
                      }}
                      className={`mx-auto ${!hasEdit && "cursor-not-allowed"}`}
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
                {userData?.permission ? (
                  Array.from(userData?.permission).map(
                    ([key, item], index: number) => {
                      return (
                        <tr className="bg-transparent border-b " key={index}>
                          <td className="w-4 p-4">
                            <CustomCheckbox
                              readOnly={!hasEdit}
                              checked={item.allSelected}
                              onCheckedChange={(value: boolean) => {
                                const permission: SelectUserPermission = {
                                  id: item.id,
                                  edit: value,
                                  view: value,
                                  delete: value,
                                  add: value,
                                  icon: "", // No need to be added
                                  priority: 0, // No need to be added
                                  permission: item.permission,
                                  allSelected: value,
                                };
                                handleChange(key, permission);
                              }}
                            />
                          </td>
                          <th
                            scope="row"
                            className="text-start py-4 font-medium text-primary whitespace-nowrap"
                          >
                            {t(key)}
                          </th>
                          <td className="py-4">
                            <CustomCheckbox
                              readOnly={!hasEdit}
                              checked={item.add}
                              onCheckedChange={(value: boolean) => {
                                const permission: SelectUserPermission = {
                                  id: item.id,
                                  edit: item.edit,
                                  view: item.view,
                                  icon: "", // No need to be added
                                  priority: 0, // No need to be added
                                  delete: item.delete,
                                  add: value,
                                  permission: item.permission,
                                  allSelected:
                                    item.edit &&
                                    item.view &&
                                    item.delete &&
                                    value
                                      ? true
                                      : false,
                                };
                                handleChange(key, permission);
                              }}
                            />
                          </td>
                          <td className="py-4">
                            <CustomCheckbox
                              readOnly={!hasEdit}
                              checked={item.view}
                              onCheckedChange={(value: boolean) => {
                                const permission: SelectUserPermission = {
                                  id: item.id,
                                  edit: item.edit,
                                  view: value,
                                  icon: "", // No need to be added
                                  priority: 0, // No need to be added
                                  delete: item.delete,
                                  add: item.add,
                                  permission: item.permission,
                                  allSelected:
                                    item.edit &&
                                    value &&
                                    item.delete &&
                                    item.add
                                      ? true
                                      : false,
                                };
                                handleChange(key, permission);
                              }}
                            />
                          </td>
                          <td className="py-4">
                            <CustomCheckbox
                              readOnly={!hasEdit}
                              checked={item.edit}
                              onCheckedChange={(value: boolean) => {
                                const permission: SelectUserPermission = {
                                  id: item.id,
                                  edit: value,
                                  icon: "", // No need to be added
                                  priority: 0, // No need to be added
                                  view: item.view,
                                  delete: item.delete,
                                  add: item.add,
                                  permission: item.permission,
                                  allSelected:
                                    value &&
                                    item.view &&
                                    item.delete &&
                                    item.add
                                      ? true
                                      : false,
                                };
                                handleChange(key, permission);
                              }}
                            />
                          </td>
                          <td className="py-4">
                            <CustomCheckbox
                              readOnly={!hasEdit}
                              checked={item.delete}
                              onCheckedChange={(value: boolean) => {
                                const permission: SelectUserPermission = {
                                  id: item.id,
                                  edit: item.edit,
                                  view: item.view,
                                  icon: "", // No need to be added
                                  priority: 0, // No need to be added
                                  delete: value,
                                  add: item.add,
                                  permission: item.permission,
                                  allSelected:
                                    item.edit && item.view && value && item.add
                                      ? true
                                      : false,
                                };
                                handleChange(key, permission);
                              }}
                            />
                          </td>
                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr className=" absolute left-1/2 mt-20">
                    <td>
                      <NastranSpinner className=" mx-auto" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {failed ? (
          <PrimaryButton
            onClick={async () => await refreshPage()}
            className="bg-red-500 hover:bg-red-500/70"
          >
            {t("Failed Retry")}
            <RefreshCcw className="ltr:ml-2 rtl:mr-2" />
          </PrimaryButton>
        ) : (
          userData &&
          hasEdit && (
            <PrimaryButton
              onClick={async () => {
                if (user.grantPermission) {
                  await saveData();
                }
              }}
              className={`shadow-lg`}
            >
              <ButtonSpinner loading={loading}>{t("Save")}</ButtonSpinner>
            </PrimaryButton>
          )
        )}
      </CardFooter>
    </Card>
  );
}
