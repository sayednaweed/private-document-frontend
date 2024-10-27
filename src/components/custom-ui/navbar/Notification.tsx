import { Bell, Trash2 } from "lucide-react";
import { memo, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { Notifications } from "@/database/tables";

function Notification() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<Notifications[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [information, setInformation] = useState({
    submitted: false,
    unreadCount: 0,
  });
  const initialize = async () => {
    try {
      const response = await axiosClient.get("notifications");
      if (response.status == 200) {
        setItems(response.data.notifications);
        setInformation({
          submitted: response.data.unread_count == 0 ? true : false,
          unreadCount: response.data.unread_count,
        });
      }
    } catch (error: any) {
      console.log(error);
      toast({
        toastType: "ERROR",
        title: t("Error"),
        description: t(error.response.data.message),
      });
    }
  };
  useEffect(() => {
    initialize();
  }, []);

  const year = t("year");
  const month = t("month");
  const day = t("day");
  const hour = t("hour");
  const minute = t("minute");
  const ago = t("ago");
  const justNow = t("Just now");
  const direction = i18n.dir();
  const notificationReadSubmit = async () => {
    if (loading) return;

    if (!information.submitted) {
      try {
        setLoading(true);
        const arr: string[] = [];
        items.forEach((item: Notifications) => {
          if (item.read_status == 0) arr.push(item.id);
        });
        const form = new FormData();
        form.append("ids", JSON.stringify(arr));
        const response = await axiosClient.post("notification-update", form);
        if (response.status == 200) {
          setInformation({
            submitted: true,
            unreadCount: 0,
          });
        }
      } catch (error: any) {
        console.log(error);
        toast({
          toastType: "ERROR",
          title: t("Error"),
          description: t(error.response.data.message),
        });
      } finally {
        setLoading(false);
      }
    }
  };
  const deleteNotification = async (id: string) => {
    if (loading) return;
    try {
      setLoading(true);

      const form = new FormData();
      form.append("id", id);
      const response = await axiosClient.delete("notification-delete/" + id);
      if (response.status == 200) {
        toast({
          toastType: "SUCCESS",
          description: t("Success"),
        });
        const updatedItems = items.filter((item) => item.id !== id);
        setItems(updatedItems);
      }
    } catch (error: any) {
      console.log(error);
      toast({
        toastType: "ERROR",
        title: t("Error"),
        description: t(error.response.data.message),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu dir={direction} onOpenChange={notificationReadSubmit}>
      <DropdownMenuTrigger asChild>
        <div className="ltr:mr-3 rtl:ml-2 mt-[6px] relative select-none cursor-pointer">
          <Bell className="fill-primary size-[18px]" />
          {information.unreadCount != 0 && (
            <h1 className="absolute my-auto top-[-6px] ltr:right-[-6px] rtl:right-[-6px] shadow-md font-bold min-h-[16px] max-w-[18px] min-w-[17px] text-center text-primary-foreground bg-red-400 text-[10px] rounded-full">
              {information.unreadCount}
            </h1>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-[50svh] overflow-y-auto z-10 rtl:text-md-rtl ltr:text-lg-ltr">
        <DropdownMenuLabel>
          <h1>{t("Notifications")}</h1>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.length == 0 ? (
          <h1 className="text-center py-4">{t("No Notification")}</h1>
        ) : (
          items.map((item: Notifications) => (
            <DropdownMenuItem className="rtl:justify-end" key={item.id}>
              <NotificationItem
                item={item}
                deleteOnClick={deleteNotification}
                year={year}
                month={month}
                day={day}
                hour={hour}
                minute={minute}
                ago={ago}
                justNow={justNow}
              />
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const NotificationItem = ({
  item,
  deleteOnClick,
  year,
  month,
  day,
  hour,
  minute,
  ago,
  justNow,
}: any) => {
  const calculateCreatedHours = (createdAt: string): string => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();

    const diffInMs = currentDate.getTime() - createdDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // Convert milliseconds to minutes
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60)); // Convert milliseconds to hours
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    const diffInMonths = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30)); // Approximate months
    const diffInYears = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365)); // Approximate years

    if (diffInYears > 0) {
      return `${diffInYears} ${year}${diffInYears !== 1 ? "s" : ""} ${ago}`;
    } else if (diffInMonths > 0) {
      return `${diffInMonths} ${month}${diffInMonths !== 1 ? "s" : ""} ${ago}`;
    } else if (diffInDays > 0) {
      return `${diffInDays} ${day}${diffInDays !== 1 ? "s" : ""} ${ago}`;
    } else if (diffInHours > 0) {
      return `${diffInHours} ${hour}${diffInHours !== 1 ? "s" : ""} ${ago}`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} ${minute}${
        diffInMinutes !== 1 ? "s" : ""
      } ${ago}`;
    } else {
      return justNow;
    }
  };
  return (
    <div className="flex flex-col items-start gap-x-[2px] w-full relative">
      <h1 className="flex-1">{item.message}</h1>
      <div className="flex justify-between w-full border-t pt-[3px]">
        <h1 className=" text-primary/80">
          {calculateCreatedHours(item.created_at)}
        </h1>
        <Trash2
          onClick={() => deleteOnClick(item.id)}
          className="size-[21px] p-[3px] text-red-400 bg-primary/85 hover:bg-primary cursor-pointer rounded-full"
        />
      </div>
    </div>
  );
};
export default memo(Notification);
