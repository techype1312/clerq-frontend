import { Card, CardContent } from "@/components/ui/card";
import SymbolIcon from "../MaterialSymbol/SymbolIcon";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const ComingSoonCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <Card className="w-full mb-5">
      <CardContent className="flex flex-row gap-2 p-0">
        <div className="p-6 flex flex-row gap-2">
          <div>
            <SymbolIcon icon="rocket_launch" size={24} />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <span className="text-[18px] font-[400]">{title}</span>
              <span></span>
            </div>
            <span className="text-[14px]">{description}</span>
            <Button className="w-max bg-[#233ed6] rounded-full gap-2 max-h-9 mt-4">
              Coming Soon
              <SymbolIcon icon="chevron_right" size={24} color="white" />
            </Button>
          </div>
        </div>
        <div className="min-w-[33%] flex items-center justify-center bg-slate-50 p-4">
          <Image
            src={"/otto_logo_large.png"}
            alt="Otto"
            width={77}
            height={32}
            className=""
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ComingSoonCard;
