import React from "react";
import Skeleton from "react-loading-skeleton";

const DashboardSkeleton = ({ duration }: { duration?: number }) => {
  return (
    <div className="flex flex-col gap-2 mx-2 w-full">
      <Skeleton height={180} className="my-2 flex-grow" duration={duration} />
      <div className="flex flex-col gap-4">
        <h2 className="text-primary font-medium text-base md:text-xl">
          Money movement
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton height={300} className="my-2" duration={duration} />
          <Skeleton height={300} className="my-2" duration={duration} />
        </div>
      </div>
      <h1 className="text-primary text-xl">Top Expenses</h1>
      <div className="grid md:grid-cols-3 w-full gap-4">
      <Skeleton height={50} className="my-2" duration={duration} count={5} />
      <Skeleton height={50} className="my-2" duration={duration} count={5} />
      <Skeleton height={50} className="my-2" duration={duration} count={5} />
      </div>
      <h1 className="text-primary font-medium text-xl">Profit & Loss</h1>
      <div className="grid md:grid-cols-3 w-full gap-4">
        <Skeleton height={150} className="my-2" duration={duration} />
        <Skeleton height={150} className="my-2" duration={duration} />
        <Skeleton height={150} className="my-2" duration={duration} />
      </div>
    </div>
  );
};

export default DashboardSkeleton;
