import { useRoom } from '@/hooks/useRoom';
import React from 'react'
import { useParams } from 'react-router-dom';

const RoomPayment = () => {

    const {roomId} = useParams()
    const {roomPaymentDetails} = useRoom(roomId)
    const {data,isLoading, isError} = roomPaymentDetails
    console.log(data)

  return (
    <div>RoomPayment</div>
  )
}

export default RoomPayment