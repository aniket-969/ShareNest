import React from 'react'
import CalendarSkeleton from '../Calendar/calendarSkeleton'
import PollSkeleton from '../Polls/pollSkeleton'
import TaskSkeleton from '../Task/taskSkeleton'
import ChatSkeleton from '../Chat/chatSkeleton'

const RoomDetailsLoader = () => {
  return (
      <div className=" flex w-full items-center justify-center  gap-10 my-5 ">

      {/* calendar and poll container */}
      <div className="flex flex-col gap-5 ">
      
          <CalendarSkeleton/>
 
        {/* Polls */}
        <PollSkeleton />
      </div>

      {/* Tasks and chat container */}
      <div className="flex flex-col gap-5 ">
        {/* Scheduled Tasks */}
        <TaskSkeleton />

        {/* Chat */}
        <ChatSkeleton />
      </div>
    </div>
  )
}

export default RoomDetailsLoader