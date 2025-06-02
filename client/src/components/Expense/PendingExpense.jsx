import { useExpense } from '@/hooks/useExpense'
import React from 'react'
import { useParams } from 'react-router-dom';

const PendingExpense = ({userPendingExpenseQuery}) => {
    
    const {data,isLoading,isError} = userPendingExpenseQuery
    // console.log("Pending",data.data)
  return (
    <div>
        <h3>Paid by you</h3>
    </div>
  )
}

export default PendingExpense