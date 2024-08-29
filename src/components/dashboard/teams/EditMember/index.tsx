import React, { useState } from "react";
import startCase from "lodash/startCase";
import isObject from "lodash/isObject";
import { Loader2Icon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Permissions from "@/components/common/Permissions";
import { ErrorProps } from "@/types/general";
import { allowedRoles } from "@/utils/constants";
import TeamApis from "@/actions/data/team.data";
import Avatar from "../Avatar";
import { isDemoEnv } from "../../../../../config";

const EditMemberDialog = ({
  row,
  onUpdate,
}: {
  row: any;
  onUpdate?: (ucrmId: string, status: Record<string, any>) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [roleId, setRoleId] = useState(String(row.role));
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onUpdateSucess = (res: any) => {
    onUpdate &&
      onUpdate(res.id, {
        role: res.role,
        permissions: res.permissions,
      });
    setOpen(false);
    setLoading(false);
  };

  const updateRolePermissions = () => {
    if (loading) return false;
    setLoading(true);
    setServerError("");
    return TeamApis.updateTeamMember(row.id, { role: { id: roleId } }).then(
      onUpdateSucess,
      onError
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={loading}>
        <Button
          variant="secondary"
          className="gap-2 rounded-none px-4 py-1 h-10 justify-start bg-transparent hover:bg-blue-50 text-blue-600"
          style={{
            fontSize: "12px",
            lineHeight: "12px",
          }}
        >
          <SymbolIcon icon="edit" size={20} />
          {`Edit`}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-md:min-w-full h-screen md:h-auto overflow-auto">
        <DialogHeader className="h-fit mt-auto">
          <div className="flex w-full items-center justify-between min-w-64 mt-6 text-base font-normal text-left text-label">
            <div className="flex text-label text-base gap-4 items-center min-w-52">
              <Avatar firstName={row.firstName} lastName={row.lastName} />
              <div className="flex flex-col justify-center">
                <span className="text-[15px] font-normal text-[#363644]">
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
            <Select defaultValue={roleId} onValueChange={setRoleId}>
              <SelectTrigger className="flex h-10 text-black min-w-36 w-fit">
                <SelectValue placeholder="select value" />
              </SelectTrigger>
              <SelectContent>
                {allowedRoles.map((value, index) => (
                  <SelectItem
                    value={String(value.id) ?? "undefined"}
                    key={String(value.id) + index}
                    disabled={value.id === 3}
                  >
                    {startCase(value.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
        <DialogDescription className="h-fit">
          <Permissions />
          <div className="mt-4 ml-auto flex gap-2 justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="background-muted text-label hover:!background-muted h-10 px-8 rounded-full"
                disabled={loading}
              >
                Close
              </Button>
            </DialogClose>
            {!isDemoEnv() && (
              <Button
                type="button"
                className="background-primary px-8 rounded-full h-10"
                onClick={updateRolePermissions}
                disabled={loading}
              >
                {loading && <Loader2Icon className="animate-spin" size={20} />}
                Update
              </Button>
            )}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberDialog;
