import { Skeleton } from "@/components/ui/skeleton";

const ExpensePageSkeleton = ({navbar=true}) => {
  return (
    <>
    {navbar && <div className="h-[40px]"></div>}
     <div className="flex w-full items-center justify-center lg:gap-16 h-[38rem] gap-4 px-3 ">
      {/* Scrollable expense history */}
      <Skeleton className="w-[25rem] md:h-[544px] h-[480px]"/>

      {/* Expense form */}
      <Skeleton className="w-[25rem] md:block hidden h-[544px]"/>
        
    </div>
    </>
   
  );
};

export default ExpensePageSkeleton;