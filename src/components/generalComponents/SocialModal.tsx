import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import ProfileItem from "../dashboard/profile/item";
import SymbolIcon from "./MaterialSymbol/SymbolIcon";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import AuthApis from "@/actions/apis/AuthApis";

const SocialModal = ({
  rowData,
  updateLocalUserData,
}: {
  rowData: any;
  updateLocalUserData: any;
}) => {
  const [openedState, setOpenedState] = useState(false);
  const [link, setLink] = useState("");
  const [platform, setPlatform] = useState("");
  const handleSaveSocialMedia = async () => {
    AuthApis.updateUser([...rowData.value, { [platform]: link }].flat(4));
  };

  return (
    <div className="col-span-2">
      <Dialog>
        {rowData?.value.map((data: any, index: number) => {
          const key = Object.keys(data)[0];
          const value = data[key];
          return (
            <div key={index} className="border-b p-4 pl-0">
              <ProfileItem
                rowData={{
                  id: key,
                  title: key,
                  value: value,
                  isEditable: false,
                }}
                updateLocalUserData={updateLocalUserData}
                editButton={
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setOpenedState(true);
                        setLink(value);
                        setPlatform(key);
                      }}
                      className="w-fit pl-0 hover:bg-transparent flex items-center text-background-primary gap-1"
                      variant={"ghost"}
                    >
                      Edit
                      <SymbolIcon
                        icon="chevron_right"
                        color="#5265EB"
                        size={20}
                      />
                    </Button>
                  </DialogTrigger>
                }
              />
            </div>
          );
        })}
        <div className="p-4 pl-0 grid grid-cols-2 gap-4">
          <div className="text-primary flex flex-col gap-1 w-64">
            <span
              style={{ fontSize: "15px", fontWeight: 400, lineHeight: "24px " }}
            >
              Social
            </span>
          </div>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setOpenedState(false);
                setLink("");
                setPlatform("");
              }}
              className="w-fit pl-0 hover:bg-transparent flex items-center text-background-primary gap-1"
              variant={"ghost"}
            >
              Add another
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent className="py-8">
          <DialogHeader>
            {openedState ? "Edit social media" : "Add social media"}
          </DialogHeader>
          <DialogDescription className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-primary">Platform</Label>
              <Input
                disabled={openedState}
                value={platform}
                onChange={(e) => {
                  setPlatform(e.target.value);
                }}
                className="text-primary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-primary">Link</Label>
              <Input
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                }}
                className="text-primary"
              />
            </div>
          </DialogDescription>
          <DialogFooter className="flex gap-2">
            {openedState && (
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    handleSaveSocialMedia();
                  }}
                  className="background-text-destructive text-white hover:!background-text-destructive hover:opacity-90"
                >
                  Remove
                </Button>
              </DialogClose>
            )}
            <DialogClose asChild>
              <Button
                onClick={() => {
                  handleSaveSocialMedia();
                }}
              >
                {openedState ? "Save" : "Add"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialModal;
