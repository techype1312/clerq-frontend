import { IImageFileType } from "@/types/file";
import { cn } from "@/utils/utils";
import Image from "next/image";
import { Fragment } from "react";

const ProfilePhotoPreview = ({
  size = 38,
  className,
  firstName,
  lastName,
  photo,
}: {
  className?: string;
  size?: number;
  firstName?: string;
  lastName?: string;
  photo?: IImageFileType;
}) => {
  return (
    <Fragment>
      {photo ? (
        <Image
          src={photo.path}
          alt={`${firstName} ${lastName}`}
          height={100}
          width={100}
          className={cn("rounded-lg object-cover", className)}
          style={{
            maxHeight: `${size}px`,
            maxWidth: `${size}px`,
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
            height: `${size}px`,
            width: `${size}px`,
          }}
          className={cn("flex flex-row items-center h-full w-full justify-center rounded-lg", className)}
        >
          <span>{firstName?.slice(0, 1)}</span>
          <span>{lastName?.slice(0, 1)}</span>
        </div>
      )}
    </Fragment>
  );
};

export default ProfilePhotoPreview;
