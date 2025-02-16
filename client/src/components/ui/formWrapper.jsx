import { cn } from "@/lib/utils";

const FormWrapper = ({ children, className }) => {
  return (
    <div
      className={cn(
        "bmain w-full max-w-[30rem] p-10 rounded-[2.5rem] ",
        className
      )}
    >
      {children}
    </div>
  );
};

export default FormWrapper;
