import React, { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { useRoom } from "@/hooks/useRoom"
import RoomDetailsLoader from "@/components/skeleton/RoomDetails"
import TaskCard from "@/components/Tasks/TaskCard"
import { getTasksForDate } from "@/utils/taskHelper"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { MessageCircle as ChatIcon } from "lucide-react"
import MobileRoomDetailsLoader from "../skeleton/RoomDetails/mobileLoader"

const PollCard = React.lazy(()=>import("@/components/Poll"))
const Chat = React.lazy(()=>import("@/pages/room/Chat/Chat"))

const MobileRoomDetails = () => {
  const { roomId } = useParams()
  const { roomQuery } = useRoom(roomId)
  const { data, isLoading, isError } = roomQuery

  const [date, setDate] = useState(new Date())

  const [isPollOpen, setIsPollOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  
    const scheduledTasks = useMemo(() => {
      if (!data?.tasks || !date) return [];
      return getTasksForDate(data.tasks, date);
    }, [data?.tasks, date]);

  if (isLoading) return <MobileRoomDetailsLoader />
  if (isError)   return <>Something went wrong. Please refresh.</>

  return (
    <div className="flex flex-col items-center px-5 py-2 gap-2">
      {/* Poll & Chat buttons */}
     
      <div className="flex w-full max-w-[25rem] justify-end gap-2 mx-2 ">
        <Dialog >

          <DialogTrigger asChild>
            <Button variant="ghost"  className="h-[30px] p-2">
             poll
            </Button>
          </DialogTrigger>
          
          <DialogContent className="rounded-lg p-4 shadow-md max-h-[420px] h-full max-w-md bg-card w-full ">
           
            <PollCard initialPolls={data.polls} />
           
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="h-[30px] p-2">
              <ChatIcon />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md w-full">
            
            <Chat messages={data?.chatMessages}/>
          
          </DialogContent>
        </Dialog>
      </div>
      
 <div  className="flex flex-col items-center gap-8 w-full ">
   {/* Calendar */}
          <div className="w-full max-w-[25rem] bg-card rounded-lg shadow-md p-4 border">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="h-[300px] w-full rounded-xl"
          classNames={{
            months:
              "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
            month: "space-y-4 w-full flex flex-col",
            table: "w-full h-full border-collapse space-y-1",
            head_row: "",
            row: "w-full mt-2",
          }}
        />
      </div>

      {/* Tasks */}
      <div className="w-full max-w-[25rem]">
        <TaskCard scheduledTasks={scheduledTasks} />
      </div>
      </div>
     
    
    </div>
  )
}

export default MobileRoomDetails
