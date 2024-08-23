import React, { useState } from "react";
import isObject from "lodash/isObject";
import { Loader2Icon } from "lucide-react";
import { toast } from "react-toastify";
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
import InviteTeamApis from "@/actions/apis/InviteApi";

const RemoveInviteDialog = ({
  row,
  onUpdate,
}: {
  row: any;
  onUpdate?: (inviteId: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const triggerBtnText = "Remove Invite";
  const triggerBtnIcon = <SymbolIcon icon="person_remove" size={20} />;
  const title = `Are you sure you want to delete this invite?`;
  const description = `${row.email} may have already received an email but will not be able to create an account.`;
  const actionBtnText = `Yes, Delete`;

  const onError = (err: string | ErrorProps) => {
    setError(isObject(err) ? err.message : err);
    setLoading(false);
  };

  const onSuccess = (res: any) => {
    if (res.status === 200) {
      onUpdate && onUpdate(row.id);
      setOpen(false);
      toast.success(`Invite removed!`, {
        position: "bottom-center",
        hideProgressBar: true,
      });
    }
    setLoading(false);
  };

  const updateStatus = () => {
    if (loading) return false;
    setLoading(true);
    return InviteTeamApis.removeInvite(row.id).then(onSuccess, onError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={loading}>
        <Button
          variant="secondary"
          className="gap-2 rounded-none px-4 py-1 h-10 justify-start bg-transparent hover:bg-red-50 text-red-600"
          style={{
            fontSize: "12px",
            lineHeight: "12px",
          }}
        >
          {triggerBtnIcon}
          {triggerBtnText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="ml-auto h-10 flex flex-row gap-2 mt-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="background-muted text-label hover:!background-muted h-10 px-8 rounded-full"
              disabled={loading}
            >
              Go Back
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
        <DialogDescription>{description}</DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveInviteDialog;
