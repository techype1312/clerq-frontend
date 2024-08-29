import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";
import { Fragment } from "react";

const AccountsTable = ({
  accounts = [],
}: {
  accounts: Record<string, any>[];
}) => {
  if (accounts.length === 0) {
    return null;
  }
  return (
    <Table>
      {!!accounts.length && (
        <Fragment>
          <TableHeader>
            <TableRow>
              <TableHead>{"Account/Card"}</TableHead>
              <TableHead>{"Type"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts?.map((acc: any | any, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-medium pl-0 md:pl-4">
                  <div className="flex gap-2">
                    <span className="bg-[#5266EB29] flex items-center justify-center rounded-full px-3 py-0">
                      <SymbolIcon icon="account_balance" color="#5266EB" />
                    </span>
                    <div className="flex flex-col">
                      <p className="text-primary first-letter:capitalize text-base">
                        {acc.sub_type} ••{acc.mask}
                      </p>
                      <p className="text-muted text-sm">{`${acc.institution?.institution_name} (${acc.name})`}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-label text-start first-letter:capitalize">
                  {acc.type}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Fragment>
      )}
    </Table>
  );
};

export default AccountsTable;
