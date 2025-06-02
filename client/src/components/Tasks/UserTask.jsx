import { useRoom } from '@/hooks/useRoom';
import React from 'react'
import { useParams } from 'react-router-dom';
import { Spinner } from '../ui/spinner';

const UserTask = () => {
    const {roomId} = useParams()
    const {roomQuery} = useRoom(roomId)
    const {data,isLoading,isError}= roomQuery
const sessionData = JSON.parse(localStorage.getItem("session"))


    if(isLoading){
        return<><Spinner/></>
    }
    if(isError){
        return <>Something went wrong , Refresh</>
    }
const userTasks = data.tasks?.filter((task)=>task.createdBy == sessionData._id)
console.log(userTasks)
  return (
    <div className=''>
      <h3>Your Tasks</h3>
      
    </div>
  )
}

export default UserTask