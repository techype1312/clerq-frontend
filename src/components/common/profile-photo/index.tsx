"use client";

import Image from "next/image";
import { Fragment, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { IImageFileType } from "@/types/file";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import SymbolIcon from "../MaterialSymbol/SymbolIcon";
import UploadProfilePhoto from "./UploadFile";
import ProfilePhotoPreview from "./ProfilePhotoPreview";
import { isDemoEnv } from "../../../../config";

const ProfilePhotoEditModel = ({
  updatePhoto,
  removePhoto,
  photo,
  firstName,
  lastName,
  canEdit,
  showButtons,
}: {
  updatePhoto?: (logo: IImageFileType) => Promise<false | void>;
  removePhoto?: () => Promise<false | void>;
  photo?: IImageFileType;
  firstName?: string;
  lastName?: string;
  canEdit?: boolean;
  showButtons?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdatePhoto = async (logo: IImageFileType) => {
    if (!updatePhoto) return;
    setOpen(false);
    setLoading(true);
    return updatePhoto(logo).then(() => {
      setLoading(false);
    });
  };

  const handleRemovePhoto = async () => {
    if (!removePhoto) return;
    setLoading(true);
    return removePhoto().then(() => {
      setLoading(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer relative">
          {loading && (
            <Loader2Icon className="animate-spin absolute top-0 left-0 w-full h-full stroke-blue-600" />
          )}
          <ProfilePhotoPreview
            firstName={firstName}
            lastName={lastName}
            photo={photo}
          />
          {!isDemoEnv() && (
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
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="max-md:min-w-full h-screen md:h-auto overflow-auto">
        <DialogHeader className="h-fit mt-auto text-start w-full">
          <DialogTitle>{`Edit profile image`}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="h-fit flex flex-col items-start my-2 justify-center">
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
              {!isDemoEnv() && (
                <Button
                  className="rounded-full gap-1 px-4 py-2 h-7 max-md:w-7 hover:bg-red-50 text-red-600"
                  variant="secondary"
                  onClick={handleRemovePhoto}
                  disabled={loading}
                >
                  <SymbolIcon icon="delete" size={20} />
                  <span className="max-md:hidden">Remove</span>
                </Button>
              )}
            </div>
          )}
          <UploadProfilePhoto onUploadSuccess={handleUpdatePhoto} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePhotoEditModel;
