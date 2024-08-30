import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import React from "react";
import Skeleton from "react-loading-skeleton";

const TeamSkeleton = ({ duration }: { duration?: number }) => {
  return (
    <TableBody>
      <TableRow>
        <TableCell>
          <Skeleton
            height={25}
            className="my-2 flex-1"
            duration={duration}
            count={5}
          />
        </TableCell>
        <TableCell>
          <Skeleton
            height={25}
            className="my-2"
            duration={duration}
            count={5}
          />
        </TableCell>
        <TableCell>
          <Skeleton
            height={25}
            className="my-2"
            duration={duration}
            count={5}
          />
        </TableCell>
        <TableCell>
          <Skeleton
            height={25}
            className="my-2"
            duration={duration}
            count={5}
          />
        </TableCell>
        <TableCell>
          <Skeleton
            height={25}
            className="my-2"
            duration={duration}
            count={5}
          />
        </TableCell>
      </TableRow>
    </TableBody>
  );
};

export default TeamSkeleton;
