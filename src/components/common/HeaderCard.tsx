import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { cardDetails, textType } from "@/types/general";
import { DownloadButton } from "./DownloadButton";
import { formatDateRange } from "@/utils/utils";

const HeaderCard = ({ cardDetails }: { cardDetails: cardDetails }) => {
  const [formattedDateRange, setFormattedDateRange] = React.useState<string>();
  useEffect(() => {
    setFormattedDateRange(
      formatDateRange(
        cardDetails.dateRange.startDate,
        cardDetails.dateRange.endDate
      )
    );
  }, [cardDetails.dateRange.startDate, cardDetails.dateRange.endDate]);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between ">
        {!cardDetails.title && (
          <p className="text-sm">
            From {cardDetails.dateRange.startDate} to{" "}
            {cardDetails.dateRange.endDate}
          </p>
        )}
        {cardDetails.title && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted">From {formattedDateRange}</p>
            <h1 className="text-primary text-xl">{cardDetails.title}</h1>
          </div>
        )}
        <div className="w-fit max-md:hidden">
          <DownloadButton downloadLink={cardDetails.download} showText={true} />
        </div>
      </CardHeader>
      <CardContent className="mt-8 flex flex-wrap gap-8 md:gap-0">
        <ExpenseModule expense={cardDetails.leftText} />
        <div className="md:ml-auto flex gap-8">
          <ExpenseModule expense={cardDetails.centerText} />
          <ExpenseModule expense={cardDetails.rightText} />
        </div>
      </CardContent>
    </Card>
  );
};

const ExpenseModule = ({ expense }: { expense: textType }) => {
  return (
    <div className="flex flex-col">
      <h6 className="text-primary text-sm">{expense.title}</h6>
      <p className="text-background-primary md:text-[32px]">
        {expense.value < 0 && "-"}$
        {Math.abs(expense.value).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    </div>
  );
};

export default HeaderCard;
