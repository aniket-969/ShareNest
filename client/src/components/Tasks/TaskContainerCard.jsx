import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Ellipsis } from "lucide-react";

const TaskContainerCard = ({ expense, userId }) => {
  return (
    <Card className="rounded-xl bg-card-muted shadow-lg border-none w-[300px] max-w-full">
      {/* ───── Card Header ───── */}
      <CardHeader className="px-6 text-center">
        <CardTitle className="text-base tracking-wide font-semibold text-gray-100 flex justify-between ">
          <p>Do the damn task</p>

          {/* Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-none">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
              <DropdownMenuItem>Swap your Turn</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
      </CardHeader>

      {/* ───── Card Content ───── */}
      <CardContent className="space-y-2">
        {/* Grouped avatars */}
        <div className="flex -space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="w-7 h-7 rounded-full overflow-visible">
                <AvatarImage
                  className="ring-2 ring-card-muted ring-offset-1 ring-offset-card-muted rounded-full"
                  src="https://avatar.iran.liara.run/public/10"
                />
                <AvatarFallback className="ring-2 ring-card-muted ring-offset-1 ring-offset-card-muted rounded-full">
                  CN
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>Srina Singh</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="w-7 h-7 rounded-full overflow-visible">
                <AvatarImage
                  className="ring-2 ring-card-muted ring-offset-1 ring-offset-card-muted rounded-full"
                  src="https://avatar.iran.liara.run/public/8"
                />
                <AvatarFallback className="ring-2 ring-card-muted ring-offset-2 ring-offset-card-muted rounded-full">
                  LR
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>Maria G</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="w-7 h-7 rounded-full overflow-visible">
                <AvatarImage
                  className="ring-2 ring-card-muted ring-offset-1 ring-offset-card-muted rounded-full"
                  src="https://avatar.iran.liara.run/public/9"
                />
                <AvatarFallback className="ring-2 ring-card-muted ring-offset-2 ring-offset-card-muted rounded-full">
                  ER
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>John Dough</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>

      <CardFooter>
        <p className="text-xs">
          Created by:
          <Badge className="mx-2 font-normal border-white" variant="outlined">
            Eti Shree
          </Badge>
        </p>
      </CardFooter>
    </Card>
  );
};

export default TaskContainerCard;
