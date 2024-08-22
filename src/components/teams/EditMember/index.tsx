import React, { useState } from "react";
import startCase from "lodash/startCase";
import isObject from "lodash/isObject";
import { Loader2Icon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Permissions from "@/components/generalComponents/Permissions";
import { ErrorProps } from "@/types/general";
import TeamApis from "@/actions/apis/TeamApis";
import { allowedRoles } from "@/utils/constants";
import Avatar from "../Avatar";

const EditMemberDialog = ({
  row,
  onUpdate,
}: {
  row: any;
  onUpdate?: (ucrmId: string, status: Record<string, any>) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [roleId, setRoleId] = useState(String(row.role));

  const onError = (err: string | ErrorProps) => {
    setError(isObject(err) ? err.message : err);
    setLoading(false);
  };

  const onUpdateSucess = (res: any) => {
    if (res.status === 200) {
      onUpdate &&
        onUpdate(res.data.id, {
          role: res.data.role,
          permissions: res.data.permissions,
        });
      setOpen(false);
    }
    setLoading(false);
  };

  const updateRolePermissions = () => {
    if (loading) return false;
    setLoading(true);
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
        <DialogDescription>
          <Permissions />
        </DialogDescription>
        <DialogFooter className="ml-auto h-10 flex gap-2 mt-4">
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
          <Button
            type="button"
            className="background-primary px-8 rounded-full h-10"
            onClick={updateRolePermissions}
            disabled={loading}
          >
            {loading && <Loader2Icon className="animate-spin" size={20} />}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberDialog;
