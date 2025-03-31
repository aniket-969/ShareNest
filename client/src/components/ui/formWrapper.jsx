import { useRef } from "react";
import { cn } from "@/lib/utils";

const FormWrapper = ({ children, className, onClose }) => {
  const wrapperRef = useRef(null);

  return (
    <div
      className="fixed inset-0 bg-[#121212]/60 flex justify-center items-center"
      onClick={onClose} // Clicking on overlay will close the modal
    >
      <div
        ref={wrapperRef}
        className={cn(
          "bmain w-full max-w-[30rem] p-10 rounded-[2.5rem] bg-black",
          className
        )}
        onClick={(e) => e.stopPropagation()} 
      >
        {children}
      </div>
    </div>
  );
};

export default FormWrapper;
