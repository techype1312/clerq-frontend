import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import React from "react";
import Skeleton from "react-loading-skeleton";

const TransactionSkeleton = ({ duration }: { duration?: number }) => {
  return (
    <TableBody>
      <TableRow>
        <TableCell>
          <Skeleton
            height={25}
            className="my-2"
            duration={duration}
            count={10}
          />
        </TableCell>
        <TableCell>
          <Skeleton
            height={25}
            className="my-2"
            duration={duration}
            count={10}
          />
        </TableCell>
        <TableCell>
          <Skeleton
            height={25}
            className="my-2"
            duration={duration}
            count={10}
          />
        </TableCell>
        <TableCell>
          <Skeleton
            height={25}
            className="my-2"
            duration={duration}
            count={10}
          />
        </TableCell>
        <TableCell>
          <Skeleton
            height={25}
            className="my-2"
            duration={duration}
            count={10}
          />
        </TableCell>
        <TableCell>
          <Skeleton
            height={25}
            className="my-2"
            duration={duration}
            count={10}
          />
        </TableCell>
      </TableRow>
    </TableBody>
  );
};

export default TransactionSkeleton;
