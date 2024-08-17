"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "../ui/dialog";
import { Button } from "../ui/button";
import SymbolIcon from "../generalComponents/MaterialSymbol/SymbolIcon";
import UploadProfilePhoto from "./UploadFile";
import { Fragment, useState } from "react";
import { Loader2Icon } from "lucide-react";

interface Photo {
  id: string;
  path: string;
}

const ProfilePhoto = ({
  updatePhoto,
  removePhoto,
  photo,
  firstName,
  lastName,
  canEdit,
  showButtons,
}: {
  updatePhoto: (logo: Photo) => Promise<false | void>;
  removePhoto: () => Promise<false | void>;
  photo?: Photo;
  firstName?: string;
  lastName?: string;
  canEdit?: boolean;
  showButtons?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdatePhoto = async (logo: Photo) => {
    setOpen(false);
    setLoading(true);
    return updatePhoto(logo).then(() => {
      setLoading(false);
    });
  };

  const handleRemovePhoto = async () => {
    setLoading(true);
    return removePhoto().then(() => {
      setLoading(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer h-10 w-10 relative">
          {loading && (
            <Loader2Icon className="animate-spin absolute top-0 left-0 w-full h-full stroke-blue-600" />
          )}
          {photo ? (
            <Image
              src={photo.path}
              alt={`${firstName} ${lastName}`}
              height={100}
              width={100}
              className="rounded-lg object-cover"
              style={{
                maxHeight: "38px",
                maxWidth: "38px",
              }}
            />
          ) : (
            <div
              style={{
                fontSize: "18px",
                color: "#1e1e2a",
                fontWeight: "bold",
                lineHeight: "24px",
                textTransform: "uppercase",
                backgroundColor: "#cce8ea",
              }}
              className="flex flex-row items-center h-full w-full justify-center rounded-lg"
            >
              <span>{firstName?.slice(0, 1)}</span>
              <span>{lastName?.slice(0, 1)}</span>
            </div>
          )}
          <Fragment>
            {showButtons && canEdit && photo?.path && (
              <Button
                className="flex items-center text-background-primary p-0"
                variant="link"
              >
                <span className="mt-1">Edit</span>
                <SymbolIcon icon="chevron_right" color="#5265EB" size={14} />
              </Button>
            )}
            {showButtons && canEdit && !photo?.path && (
              <Button
                className="flex items-center text-background-primary p-0"
                variant="link"
              >
                <span className="mt-1">Add</span>
                <SymbolIcon icon="chevron_right" color="#5265EB" size={14} />
              </Button>
            )}
          </Fragment>
        </div>
      </DialogTrigger>
      <DialogContent className="z-[100] items-center rounded-md justify-center max-w-md">
        <DialogHeader className="text-start w-full">
          <DialogTitle>{`Edit profile image`}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-start my-2 justify-center">
          <p
            style={{
              fontSize: "15px",
              lineHeight: "24px",
            }}
          >
            Logos should be at least 600x600 and will be visible to your team
            members and optionally visible on invoices.
          </p>
          {photo && (
            <div className="my-8 flex flex-row items-center justify-between w-full">
              <div className="flex flex-row gap-4 items-center">
                <Image
                  src={photo.path}
                  className="rounded-lg"
                  alt={`${firstName} ${lastName}`}
                  height={30}
                  width={30}
                  style={{
                    maxHeight: "30px",
                  }}
                />
                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: "24px",
                  }}
                >
                  {`${firstName} ${lastName}`}
                </p>
              </div>
              <Button
                className="rounded-full gap-1 px-4 py-2 h-7  hover:bg-red-50 text-red-600"
                variant="secondary"
                onClick={handleRemovePhoto}
                disabled={loading}
              >
                <SymbolIcon icon="delete" size={20} />
                Remove
              </Button>
            </div>
          )}
          <UploadProfilePhoto onUploadSuccess={handleUpdatePhoto} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePhoto;
