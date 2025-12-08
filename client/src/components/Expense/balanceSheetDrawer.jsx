import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area';
import BalanceParticipantsList from './balanceParticipantsList';
import SettleUp from './settleUp';
import { useSettleUpQuery } from '@/hooks/useExpense';
import { Spinner } from '@/components/ui/spinner';
import { useParams } from 'react-router-dom';

    export const fakeBalances = {
  currency: "₹",
  owedByYou: [
    {
      userId: "u201",
      fullName: "Aisha Khan",
      avatar: "https://avatar.iran.liara.run/public/49",
      amount: 950,
      pendingCount: 2,
    },
    {
      userId: "u202",
      fullName: "Dev Patel",
      avatar: "https://avatar.iran.liara.run/public/50",
      amount: 870,
      pendingCount: 1,
    },
    {
      userId: "u203",
      fullName: "Sara Mehta",
      avatar: "https://avatar.iran.liara.run/public/51",
      amount: 660,
      pendingCount: 1,
    },
    {
      userId: "u282",
      fullName: "Anik",
      avatar: "https://avatar.iran.liara.run/public/52",
      amount: 87,
      pendingCount: 1,
    },
  ],
  owedToYou: [
    {
      userId: "u301",
      fullName: "Rohit Sharma",
      avatar: "https://avatar.iran.liara.run/public/52",
      amount: 600,
      pendingCount: 1,
    },
    {
      userId: "u302",
      fullName: "Nikhil Rao",
      avatar: "https://avatar.iran.liara.run/public/53",
      amount: 475,
      pendingCount: 1,
    },
    // {
    //   userId: "u303",
    //   fullName: "Priya Singh",
    //   avatar: "https://avatar.iran.liara.run/public/54",
    //   amount: 300,
    //   pendingCount: 1,
    // },
  ],
};
const BalanceSheetDrawer = () => {
 const {roomId} = useParams()
  const onParticipantClick = () => {
    console.log("clicked");
  };
const {data:balanceData,isLoading,isError} = useSettleUpQuery(roomId)
if(isLoading)return <Spinner/>
if(isError)return <>Something went wrong. Please refresh</>
console.log(balanceData)
  return (
     <div className="flex items-center mx-6 justify-center md:gap-12 md:my-2 md:flex-row flex-col ">
          {/* Owed by you */}
          <div className="w-full max-w-lg ">
            <h2 className="m-3">
              You owe to {fakeBalances.owedByYou.length} people
            </h2>
            <ScrollArea className="h-[135px] md:h-[196px] px-3 py-1">
              <div className="flex flex-col gap-2 justify-center ">
                {fakeBalances.owedByYou.map((data) => (
                  <SettleUp
                    key={data.userId}
                    userData={data}
                    currency={fakeBalances.currency}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Owed to you */}
          <div className="w-full max-w-lg ">
            <h2 className="m-3">
              {fakeBalances.owedToYou.length} people owe you
            </h2>

            <BalanceParticipantsList
              userData={fakeBalances.owedToYou}
              currency={fakeBalances.currency}
            />
          </div>
        </div>
  )
}

export default BalanceSheetDrawer