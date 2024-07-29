import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/utils/supabase/client";
import { useState } from "react";
import { PlaidAccount, PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { toast } from "react-toastify";

export type labels = {
  header1: string;
  header2: string;
  header3: string;
};

export function LinkedTable({
  details,
  labels,
}: {
  details: any;
  labels: labels;
}) {
  const [token, setToken] = useState<string>("");

  const config: PlaidLinkOptions = {
    onSuccess: () => {
      toast.success("Account linked successfully");
    },
    onExit: (err, metadata) => {},
    onEvent: (eventName, metadata) => {},
    token: token,
  };
  const { open, exit, ready } = usePlaidLink(config);
  //   if (ready) {
  //     open();
  //   }

  return (
    <Table className="gap-20">
      <TableHeader>
        <TableRow>
          <TableHead>{labels.header1}</TableHead>
          <TableHead className="text-center">{labels.header2}</TableHead>
          <TableHead className="text-center">{labels.header3}</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {details?.map((detail: PlaidAccount | any, index: number) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              <div className="flex gap-2">
                <span className="bg-[#5266EB29] flex items-center justify-center rounded-full px-2 py-0">
                  <SymbolIcon icon="account_balance" color="#5266EB" />
                </span>
                <div className="flex flex-col">
                  <p className="text-primary first-letter:capitalize text-base">
                    {detail.subtype} ••{detail.mask}
                  </p>
                  <p className="text-muted text-sm">{detail.name}</p>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-label text-center">
              **********{detail.mask}
            </TableCell>
            <TableCell className="text-center text-primary">
              {detail.type !== "credit" ? (
                detail.routing
              ) : (
                <span className="text-transparent">543543543</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <Button variant={"ghost"} className="pr-0 hover:bg-transparent">
                <SymbolIcon icon="more_vert" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter className="bg-white border-t-0 w-full">
        <TableRow>
          <TableCell colSpan={4} className="text-center">
            <Button
              variant={"ghost"}
              onClick={() => {
                supabase.functions.invoke("plaid-update").then((res) => {
                  setToken(res.data.link_token);
                });
              }}
              className="pl-0 flex items-center justify-start gap-2 w-full hover:bg-transparent"
            >
              <span className="background-muted flex items-center justify-center rounded-full p-2">
                <SymbolIcon icon="add" color="#70707C" />
              </span>
              <div className="text-primary">
                Add {labels.header1 === "Account" ? "bank account" : "card"}
              </div>
            </Button>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
