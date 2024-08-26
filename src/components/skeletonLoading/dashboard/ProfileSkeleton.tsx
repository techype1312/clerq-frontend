import React from "react";
import Skeleton from "react-loading-skeleton";

const ProfileSkeleton = ({ duration }: { duration?: number }) => {
  return (
    <div className="flex flex-col w-full">
      <Skeleton height={30} className="my-2" duration={duration} count={1} />
      <div className="grid grid-cols-2 gap-6">
        <Skeleton
          height={30}
          className="my-2 w-20"
          duration={duration}
          count={10}
        />
        <Skeleton
          height={30}
          className="my-2 w-20"
          duration={duration}
          count={10}
        />
      </div>
    </div>
  );
};

export default ProfileSkeleton;
