import React, { useState } from "react";
import { toast } from "react-toastify";
import isObject from "lodash/isObject";
import { Loader2Icon } from "lucide-react";
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";
import { Button } from "@/components/ui/button";
import { ErrorProps } from "@/types/general";
import InviteTeamApis from "@/actions/data/invite.data";

const ResendInviteButton = ({ row }: { row: any }) => {
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onSuccess = (res: any) => {
    setLoading(false);
    toast.success(`Invite Sent`, {
      position: "bottom-center",
      hideProgressBar: true,
    });
  };

  const sendNewInvite = () => {
    if (loading) return false;
    setLoading(true);
    setServerError("");
    return InviteTeamApis.resendInviteLink(row.id).then(onSuccess, onError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  return (
    <Button
      variant="secondary"
      className="gap-2 rounded-none px-4 py-1 h-10 justify-start bg-transparent hover:bg-blue-50 text-blue-600"
      style={{
        fontSize: "12px",
        lineHeight: "12px",
      }}
      onClick={sendNewInvite}
      disabled={loading}
    >
      {loading ? (
        <Loader2Icon className="animate-spin" size={20} />
      ) : (
        <SymbolIcon icon="send" size={20} className="-rotate-45" />
      )}
      {"Resend Invite"}
    </Button>
  );
};

export default ResendInviteButton;
