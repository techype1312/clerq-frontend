import React from "react";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { cardDetails, textType } from "@/types/general";
import { DownloadButton } from "./DownloadButton";

const HeaderCard = ({ cardDetails }: { cardDetails: cardDetails }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between ">
        <p>
          From {cardDetails.dateRange.startDate} to{" "}
          {cardDetails.dateRange.endDate}
        </p>
        <DownloadButton downloadLink={cardDetails.download} />
      </CardHeader>
      <CardContent className="mt-8 flex">
        <ExpenseModule expense={cardDetails.leftText} />
        <div className="ml-auto flex gap-4">
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
      <p className="text-background-primary text-3.5xl">
        {expense.value < 0 && "-"}${Math.abs(expense.value).toFixed(2)}
      </p>
    </div>
  );
};

export default HeaderCard;
