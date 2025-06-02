import { useExpense } from '@/hooks/useExpense'
import React from 'react'
import { useParams } from 'react-router-dom';

const PendingExpense = ({userPendingExpenseQuery}) => {
    
    const {data,isLoading,isError} = userPendingExpenseQuery
    console.log(data)
  return (
    <div>PendingExpense</div>
  )
}

export default PendingExpense