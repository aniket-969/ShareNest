import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function Spinner({ size = "md", className }) {
  const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-16 w-16" }
  return (
   <div className="flex items-center justify-center w-full h-full">
      <Loader2
        className={cn("animate-spin text-muted-foreground", sizes[size], className)}
        aria-hidden="true"
      />
    </div>
  )
}
