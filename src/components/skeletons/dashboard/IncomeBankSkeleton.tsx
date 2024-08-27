import React from "react";
import Skeleton from "react-loading-skeleton";

const IncomeBankSkeleton = ({showLastSkeleton} : {showLastSkeleton: boolean}) => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton height={220} />
      {!showLastSkeleton && (
        <Skeleton height={35} />
      )}
      <div className="grid grid-cols-2 gap-4 w-full">
        <Skeleton height={35} className="my-2" count={8} />
        <Skeleton height={35} className="my-2" count={8} />
      </div>
      {showLastSkeleton && (
        <Skeleton height={35} />
      )}
    </div>
  );
};

export default IncomeBankSkeleton;
