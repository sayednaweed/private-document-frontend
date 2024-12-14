import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        toastType,
        action,
        ...props
      }) {
        return (
          <Toast
            key={id}
            {...props}
            className={`grid gap-1 h-fit ltr:text-lg-ltr rtl:text-xl-rtl fixed rtl:left-4 ltr:right-4 bottom-5 p-4 w-fit min-w-[400px] max-w-[400px] ${
              toastType == "ERROR" ? "bg-red-400" : "bg-green-400"
            }`}
          >
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
            {action}
            <ToastClose className="rtl:left-0 rtl:flex rtl:items-start rtl:justify-end" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
