import React from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { useSettleUpQuery } from "@/hooks/useExpense";

import OwedByList from "./owedbyList";
import OwedToList from "./owedtoList";

const BalanceDrawer = () => {
  const { roomId } = useParams();
  const { data: balanceData, isLoading, isError } = useSettleUpQuery(roomId);

  if (isLoading) return <Spinner />;
  if (isError) return <>Something went wrong. Please refresh</>;

  console.log(balanceData);

  return (
    <div className="flex items-center mx-6 justify-center md:gap-12 md:my-2 md:flex-row flex-col ">
      {/* Owed by you */}
      {balanceData?.youOwed.length > 0 && (
        <div className="w-full max-w-lg ">
          <h2 className="m-3">
            You owe to {balanceData?.youOwed.length}{" "}
            {balanceData?.youOwed.length > 1 ? <span> people </span> : <span> person </span>}
          </h2>

          <OwedByList items={balanceData.youOwed} currency={balanceData.currency} />
        </div>
      )}

      {/* Owed to you */}
      {balanceData?.owedToYou.length > 0 && (
        <div className="w-full max-w-lg ">
          <h2 className="m-3">
            {balanceData?.owedToYou.length}
            {balanceData?.owedToYou.length > 1 ? <span> people </span> : <span> person </span>}
            owe you
          </h2>

          <OwedToList items={balanceData.owedToYou} currency={balanceData.currency} />
        </div>
      )}
    </div>
  );
};

export default BalanceDrawer;
