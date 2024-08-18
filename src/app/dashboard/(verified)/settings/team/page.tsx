"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import startCase from "lodash/startCase";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";
import { DataTable } from "@/components/dashboard/transactions/DataTable";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Permissions from "@/components/generalComponents/Permissions";
import AutoForm from "@/components/ui/auto-form";
import { inviteUserSchema } from "@/types/schema-embedded";

const roles = [
  "owner",
  "admin",
  "accountant",
  "cpa",
  "lawyer",
  "agency",
  "management",
];

const rows = [
  {
    id: "123jdji838",
    name: "Anurag Patel",
    firstName: "Anurag",
    lastName: "Patel",
    email: "anurag@joinclerq.com",
    role: "owner",
    status: "active",
    lastActive: "Today",
  },
  {
    id: "123jdji8kd02",
    name: "Jane Black",
    firstName: "Jane",
    lastName: "Black",
    email: "jane@joinclerq.com",
    role: "admin",
    status: "active",
    lastActive: "July 31",
  },
  {
    id: "123jdji8299",
    name: "Noel Kim",
    firstName: "Noel",
    lastName: "Kim",
    email: "noel@joinclerq.com",
    role: "accountant",
    status: "active",
    lastActive: "Today",
  },
  {
    id: "123jdji2998",
    name: "Phil",
    firstName: "Kim",
    lastName: "",
    email: "phil@joinclerq.com",
    role: "lawyer",
    status: "inactive",
    lastActive: "Yesterday",
  },
];

const InviteNewUserDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="rounded-full gap-2 px-4 py-2 h-8 hover:bg-gray-200"
        >
          <SymbolIcon icon="person_add" color="#535460" size={22} />
          Invite a Team member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{`Add member`}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="flex flex-col w-full items-center min-w-64 mt-6 mb-4">
            <AutoForm
              formSchema={inviteUserSchema}
              fieldConfig={{}}
              defaultValues={{
                role: "Owner",
              }}
              className="flex flex-col gap-4 max-w-lg mx-auto"
              zodItemClass="flex flex-row grow gap-4 space-y-0 w-full"
              withSubmitButton={false}
              submitButtonText="Get started"
              submitButtonClass="background-primary"
              labelClass="text-primary"
            ></AutoForm>
          </div>
          <Permissions />
        </DialogDescription>
        <DialogFooter className="ml-auto my-2 h-12 flex gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="background-muted text-label hover:!background-muted h-8 px-10 rounded-full"
            >
              {"Close"}
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="background-primary px-10 rounded-full h-8"
          >
            {"Send Invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RemoveUserDialog = ({ row }: { row: any }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="rounded-full gap-1 px-2 py-1 h-6  hover:bg-red-50 text-red-600"
          style={{
            fontSize: "12px",
            lineHeight: "12px",
          }}
        >
          <SymbolIcon icon="delete" size={20} />
          {`Remove`}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{`Remove ${row.firstName}?`}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {
            "They’ll lose account access immediately and any cards will be canceled. You can easily restore access later if you change your mind."
          }
        </DialogDescription>
        <DialogFooter className="ml-auto my-2 h-12 flex gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="background-muted text-label hover:!background-muted h-8 px-10 rounded-full"
            >
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="background-primary px-10 rounded-full h-8"
          >
            {`Remove ${row.firstName}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditUserDialog = ({ row }: { row: any }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="rounded-full gap-1 px-2 py-1 h-6 hover:bg-blue-50 text-blue-600"
          style={{
            fontSize: "12px",
            lineHeight: "12px",
          }}
        >
          <SymbolIcon icon="edit" size={20} />
          {`Edit`}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div
            className="flex w-full items-center justify-between min-w-64 mt-6"
            style={{
              color: "#535460",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "22.4px",
              textAlign: "left",
            }}
          >
            <div className="flex text-label text-base gap-4 items-center min-w-52">
              <Avatar firstName={row.firstName} lastName={row.lastName} />
              <div className="flex flex-col justify-center">
                <span
                  style={{
                    color: "#363644",
                    fontSize: "15px",
                    fontWeight: 400,
                    lineHeight: "24px",
                  }}
                >
                  {`${row.firstName} ${row.lastName}`}
                </span>
                <span
                  style={{
                    color: "#70707d",
                    fontSize: "13px",
                    letterSpacing: ".1px",
                    lineHeight: "20px",
                  }}
                >
                  {row.email}
                </span>
              </div>
            </div>
            <Select defaultValue={row.role}>
              <SelectTrigger className="flex h-8 text-black min-w-36 w-fit">
                <SelectValue placeholder="select value">
                  {startCase(row.role)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {roles.map((value, index) => (
                  <SelectItem value={value ?? "undefined"} key={value + index}>
                    {startCase(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
        <DialogDescription>
          <Permissions />
        </DialogDescription>
        <DialogFooter className="ml-auto my-2 h-12 flex gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="background-muted text-label hover:!background-muted h-8 px-10 rounded-full"
            >
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="background-primary px-10 rounded-full h-8"
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Avatar = ({
  profileUrl,
  firstName,
  lastName,
}: {
  firstName?: string;
  lastName?: string;
  profileUrl?: string;
}) => {
  return (
    <div
      style={{
        fontSize: "12px",
        height: "38px",
        minWidth: "38px",
        width: "38px",
        color: "#1e1e2a",
        borderRadius: "50%",
        alignItems: "center",
        display: "flex",
        fontWeight: 480,
        justifyContent: "center",
        lineHeight: "24px",
        textTransform: "uppercase",
        userSelect: "none",
        backgroundColor: "#cce8ea",
      }}
    >
      <span>{firstName?.slice(0, 1)}</span>
      <span>{lastName?.slice(0, 1)}</span>
    </div>
  );
};

const ColumnProfileItem = ({ label, row }: { label: string; row: any }) => {
  return (
    <div
      className="flex w-full items-center justify-between min-w-56"
      style={{
        color: "#535460",
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "22.4px",
        textAlign: "left",
      }}
    >
      <div className="flex text-label text-base gap-4 items-center">
        <Avatar firstName={row.firstName} lastName={row.lastName} />
        <div className="flex flex-col justify-center">
          <span
            style={{
              color: "#363644",
              fontSize: "15px",
              fontWeight: 400,
              lineHeight: "24px",
            }}
          >
            {label}
          </span>
          <span
            style={{
              color: "#70707d",
              fontSize: "13px",
              letterSpacing: ".1px",
              lineHeight: "20px",
            }}
          >
            {row.email}
          </span>
        </div>
      </div>
    </div>
  );
};

const ColumnRoleItem = ({ label, row }: { label: string; row: any }) => {
  return (
    <div
      className="flex w-full items-center justify-between"
      style={{
        width: "160px",
      }}
    >
      <div
        className="flex flex-col justify-center"
        style={{
          borderRadius: "4px",
          whiteSpace: "nowrap",
          color: "#1e1e2a",
          textTransform: "capitalize",
        }}
      >
        <span
          style={{
            border: "1px solid #cce8ea",
            borderRadius: "4px",
            padding: "0 8px",
            fontWeight: 400,
            fontSize: "12px",
            letterSpacing: ".2px",
            lineHeight: "20px",
          }}
          className="hover:bg-teal-100"
        >
          {label}
        </span>
      </div>
    </div>
  );
};

const teamsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ cell, row }) => {
      return (
        <ColumnProfileItem
          label={cell.getValue() as string}
          row={row.original}
        />
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ cell, row }) => {
      return (
        <ColumnRoleItem label={cell.getValue() as string} row={row.original} />
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ cell, row }) => {
      return (
        <ColumnRoleItem label={cell.getValue() as string} row={row.original} />
      );
    },
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
    cell: ({ cell }) => {
      return (
        <div className="flex flex-row gap-2">
          <span
            style={{
              fontWeight: 400,
              fontSize: "12px",
              letterSpacing: ".2px",
              lineHeight: "20px",
              color: "#535461",
            }}
          >
            {cell.getValue() as string}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-2 justify-end mx-2 z-10">
          <EditUserDialog row={row.original} />
          <RemoveUserDialog row={row.original} />
        </div>
      );
    },
  },
];

const Page = () => {
  return (
    <div className="flex gap-24 flex-row">
      <div className="w-full mx-16">
        <div className="flex flex-row justify-between">
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "500",
              lineHeight: "28.8px",
              textAlign: "left",
              color: "#1E1E2A",
            }}
          >
            Team
          </h1>
          <InviteNewUserDialog />
        </div>
        <div className="mt-6 flex gap-1 flex-col items-start">
          <DataTable
            showPagination={false}
            showHeader={true}
            showDownloadButton={false}
            showUploadButton={false}
            columns={teamsColumns}
            data={rows}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
