import { cn } from "@/lib/utils";

export const AnimatedGradientBg = ({ className }) => {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-red-900/20" />

      <div className="absolute top-0 left-0 w-full h-full">
        {/* Top-left glow */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 
bg-gradient-to-r from-pink-500/30 to-purple-500/30 
rounded-full blur-3xl 
animate-[glow_8s_ease-in-out_infinite]"
        />

        {/* Bottom-right glow */}
        {/* <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse delay-1000" /> */}

        {/* Center glow */}
        <div
          className="absolute top-1/2 left-[60%] 
  -translate-x-1/2 -translate-y-1/2 
  w-[500px] h-[300px] 
  bg-gradient-to-r from-red-500/30 to-pink-500/30 
  rounded-full blur-3xl 
  animate-[glow_10s_ease-in-out_infinite]"
        />
      </div>
    </div>
  );
};
