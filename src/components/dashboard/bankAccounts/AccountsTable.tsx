import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";
import ConnectAccount from "./ConnectAccount";
import { Fragment } from "react";

const AccountsTable = ({
  accounts = [],
  companyId,
}: {
  accounts: Record<string, any>[];
  companyId: string;
}) => {
  return (
    <Table className="gap-20">
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
                <TableCell className="font-medium">
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
      <TableFooter className="bg-white border-t-0 w-full">
        <TableRow>
          <TableCell colSpan={4} className="text-center p-0">
            <ConnectAccount companyId={companyId} />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default AccountsTable;
