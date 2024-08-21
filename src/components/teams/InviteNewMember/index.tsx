import React, { useState } from "react";
import { toast } from "react-toastify";
import find from "lodash/find";
import isObject from "lodash/isObject";
import { Loader2Icon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";
import { Button } from "@/components/ui/button";
import Permissions from "@/components/generalComponents/Permissions";
import AutoForm from "@/components/ui/auto-form";
import { inviteUserSchema } from "@/types/schema-embedded";
import { ErrorProps } from "@/types/general";
import { allowedRoles } from "@/utils/constants";
import InviteTeamApis from "@/actions/apis/InviteApi";

const InviteNewMemberDialog = ({ onAddSuccess }: { onAddSuccess: (data: Record<string, any>) => void}) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onError = (err: string | ErrorProps) => {
    setError(isObject(err) ? err.message : err);
    setLoading(false);
  };

  const onSuccess = (res: any) => {
    setLoading(false);
    if (res.status === 201) {
      onAddSuccess(res.data);
      setOpen(false);
      toast.success(`Invite Sent`, {
        position: "bottom-center",
        hideProgressBar: true,
      });
    }
  };

  const sendNewInvite = (values: Record<string, any>) => {
    if (loading) return false;
    setLoading(true);
    const selectedRoleId = find(allowedRoles, { name: values.role })?.id;
    return InviteTeamApis.createInvite({
      email: values.email,
      firstName: values.name.firstName,
      lastName: values.name.lastName,
      role: {
        id: selectedRoleId,
      },
      permissions: {},
    }).then(onSuccess, onError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              formSchema={inviteUserSchema(allowedRoles.map((r) => r.name))}
              fieldConfig={{}}
              defaultValues={{
                role: allowedRoles[0].name,
              }}
              className="flex flex-col gap-4 max-w-lg mx-auto"
              zodItemClass="flex flex-row grow gap-4 space-y-0 w-full"
              withSubmitButton={false}
              submitButtonText="Get started"
              submitButtonClass="background-primary"
              labelClass="text-primary"
              onSubmit={sendNewInvite}
            >
              <Permissions />
              <div className="ml-auto h-10 flex gap-2 mt-4">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="background-muted text-label hover:!background-muted h-10 px-8 rounded-full"
                    disabled={loading}
                  >
                    {"Close"}
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="background-primary px-8 rounded-full h-10"
                  disabled={loading}
                >
                  {loading && (
                    <Loader2Icon className="animate-spin" size={20} />
                  )}
                  {"Send Invite"}
                </Button>
              </div>
            </AutoForm>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default InviteNewMemberDialog;
