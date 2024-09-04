"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import SymbolIcon from "../../common/MaterialSymbol/SymbolIcon";
import { Card, CardContent, CardHeader } from "../../ui/card";
import Image from "next/image";

const actions = [
  {
    title: "Monthly check-in",
    description:
      "Do you have questions about your financial statements, We can go over them together on this call.",
    action: "",
  },
  {
    title: "15min check-in",
    description:
      "Usually for minor issues. Select 15min check-in if you have a quick question? Happy to answer over phone.",
    action: "",
  },
];

export function NotificationCenter() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="secondary"
          className="flex hover:bg-accent rounded-full min-w-8 h-8 mr-6 p-0 items-center justify-center"
        >
          <SymbolIcon icon="notifications" size={28} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 transform-none">
        <DrawerHeader className="flex flex-row justify-between">
          <DrawerTitle>Notifications</DrawerTitle>
          <DrawerClose>
            <Button
              asChild
              variant="ghost"
              className="w-7 h-7 rounded-full p-0"
              style={{
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "20px",
              }}
            >
              <SymbolIcon icon="close" size={28} />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="mx-auto mt-4 w-full max-w-sm">
          <div className="flex flex-col gap-2 items-center">
            <Image
              src={"/blank.svg"}
              alt="Otto Notifications"
              width={150}
              height={50}
            />
            <p
              style={{
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "22px",
              }}
            >
              There are no notifications to show
            </p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
