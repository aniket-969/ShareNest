import { Skeleton } from "@/components/ui/skeleton"; 

const QrCodeSkeleton = () => {
  return (
    <Skeleton className="w-full max-w-[14rem] md:max-w-[20rem] sm:max-w-[15rem] h-[250px] sm:h-[300px] md:ml-4 ml-0"/>
  ); 
};

export default QrCodeSkeleton;
