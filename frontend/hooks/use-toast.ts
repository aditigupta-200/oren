import { useCallback } from "react";
import { toast } from "react-toastify";

export function useToast() {
  const notify = useCallback((message: string, type: "success" | "error" = "success") => {
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  }, []);

  return { notify };
}
