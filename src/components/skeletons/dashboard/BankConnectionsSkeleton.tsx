import React from "react";
import Skeleton from "react-loading-skeleton";

const BankConnectionsSkeleton = ({duration}:{duration?:number}) => {
  return (
    <div className="flex gap-2 mx-2 w-full">
      <Skeleton height={50} width={50} duration={duration} className="my-2" circle count={3} />
      <div className="w-full flex-1">
        <Skeleton height={50} className="my-2" duration={duration} count={3} />
      </div>
    </div>
  );
};

export default BankConnectionsSkeleton;
