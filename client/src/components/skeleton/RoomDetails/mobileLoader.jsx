import CalendarSkeleton from '../Calendar/calendarSkeleton'
import TaskSkeleton from '../Task/taskSkeleton'

const MobileRoomDetailsLoader = () => {
  return (
      <div className="flex flex-col items-center px-5 py-2 gap-2">
     
     
 <div  className="flex flex-col items-center gap-8 w-full ">
          <div className="w-full max-w-[25rem] ">
       <CalendarSkeleton/>
      </div>

      {/* Tasks */}
      <div className="w-full max-w-[25rem]">
       <TaskSkeleton/>
      </div>
      </div>
    
    </div>
  )
}

export default MobileRoomDetailsLoader