import { useExpense } from '@/hooks/useExpense'
import React from 'react'
import { useParams } from 'react-router-dom';
import PendingExpenseCard from './PendingExpenseCard';

const PendingExpense = ({userPendingExpenseQuery}) => {
    
    const {data,isLoading,isError} = userPendingExpenseQuery
    console.log("Pending",data)
  return (
    <div>
        <h3 className='font-semibold text-lg '>Personal expense</h3>
        <PendingExpenseCard/>
    </div>
  )
}

export default PendingExpense