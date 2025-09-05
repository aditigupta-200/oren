import * as React from "react";
import { cn } from "@/components/ui/utils";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(
      "relative w-full rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive shadow-sm flex items-center gap-2",
      className
    )}
    {...props}
  >
    <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />
    <div>{props.children}</div>
  </div>
));
Alert.displayName = "Alert";

export { Alert };
