import { useRef } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const FormWrapper = ({ children, className, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-[#121212]/60 flex justify-center items-start pt-8 "
      onClick={onClose}
    >
      <div
        className={cn(
          "bmain w-full max-w-[30rem] p-10 rounded-[2.5rem] bg-black ",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <ScrollArea>
          <div className="max-h-[610px] mx-4 ">{children}</div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default FormWrapper;
