import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const FormWrapper = ({ children, className, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-[#121212]/60 flex z-10 justify-center items-start pt-12 px-2"
      onClick={onClose}
    >
      <div
        className={cn(
          " max-w-full w-[30rem] p-10 rounded-[2.5rem] bg-black mx-3 ",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <ScrollArea>
          <div className="max-h-[610px] mx-2 ">{children}</div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default FormWrapper;
