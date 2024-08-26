import React, { useState } from "react";
import isObject from "lodash/isObject";
import { Loader2Icon } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { ErrorProps } from "@/types/general";
import TeamApis from "@/actions/data/team-data";

const MemberStatusUpdateDialog = ({
  row,
  onUpdate,
}: {
  row: any;
  onUpdate?: (ucrmId: string, status: Record<string, any>) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onStatusUpdateSuccess = (res: any) => {
    onUpdate && onUpdate(res.id, res.status);
    setOpen(false);
    setLoading(false);
  };

  const updateStatus = () => {
    if (loading) return false;
    setLoading(true);
    setServerError("");
    const handler =
      row.status === 1
        ? TeamApis.deactivateTeamMember
        : TeamApis.activateTeamMember;
    return handler(row.id).then(onStatusUpdateSuccess, onError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const triggerBtnText = row.status === 1 ? "Remove" : "Restore";
  const triggerBtnIcon =
    row.status === 1 ? (
      <SymbolIcon icon="person_remove" size={20} />
    ) : (
      <SymbolIcon icon="restore" size={20} />
    );
  const title =
    row.status === 1 ? `Remove ${row.firstName}?` : `Restore ${row.firstName}?`;
  const description =
    row.status === 1
      ? "They’ll lose account access immediately and any cards will be canceled. You can easily restore access later if you change your mind."
      : "They’ll be able to log in immediately with their previous role.";
  const actionBtnText =
    row.status === 1 ? `Remove ${row.firstName}` : `Yes, Restore`;

  const hoverClass =
    row.status === 1
      ? "hover:bg-red-50 text-red-600"
      : "hover:bg-blue-50 text-blue-600";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={loading}>
        <Button
          variant="secondary"
          className={`gap-2 rounded-none px-4 py-1 h-10 justify-start bg-transparent ${hoverClass}`}
          style={{
            fontSize: "12px",
            lineHeight: "12px",
          }}
        >
          {triggerBtnIcon}
          {triggerBtnText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg rounded-lg">
        <DialogHeader className="text-left">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {description}

          <div className="ml-auto h-10 flex flex-row justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="background-muted text-label hover:!background-muted h-10 px-8 rounded-full"
                disabled={loading}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="background-primary px-8 rounded-full h-10 gap-2"
              onClick={updateStatus}
              disabled={loading}
            >
              {loading && <Loader2Icon className="animate-spin" size={20} />}
              {actionBtnText}
            </Button>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default MemberStatusUpdateDialog;
