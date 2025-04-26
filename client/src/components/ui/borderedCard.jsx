import { cn } from "@/lib/utils"; 
import { forwardRef } from "react";

const BorderedCard = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border bmain p-6 shadow-md bg-background/80",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

BorderedCard.displayName = "BorderedCard";

export default BorderedCard;
