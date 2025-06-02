import { useExpense } from '@/hooks/useExpense'
import React from 'react'
import { useParams } from 'react-router-dom';

const UserExpense = () => {
    const {roomId} = useParams()
    const {userExpenseQuery} = useExpense(roomId)
    const {data,isLoading,isError,error} = userExpenseQuery
    if(isError){
        console.log('error',error)
    }
    console.log("Userx",data)
  return (
    <div>UserExpense</div>
  )
}

export default UserExpense