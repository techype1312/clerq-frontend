"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import SymbolIcon from "../generalComponents/MaterialSymbol/SymbolIcon";
import { Card, CardContent, CardHeader } from "../ui/card";

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

export function HelpCenter() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="secondary"
          className="shadow-sm shadow-slate-500 hover:shadow-xl z-50 absolute bottom-6 right-6 rounded-full w-12 h-12 hover:bg-black bg-slate-800"
        >
          <SymbolIcon icon="question_mark" color="#ffffff" size={24} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 transform-none">
        <DrawerHeader className="justify-end">
          <DrawerClose>
            <Button
              asChild
              variant="ghost"
              className="h-5 w-5 rounded-full px-0 py-0"
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
        <div className="mx-auto my-auto w-full max-w-sm">
          <div className="flex flex-col gap-2 items-center">
            <SymbolIcon icon="calendar_add_on" size={34} color="#5266EB" />
            <p
              style={{
                fontWeight: 600,
                fontSize: "24px",
                lineHeight: "30px",
              }}
            >
              Book a meeting
            </p>
            <p
              style={{
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "22px",
              }}
            >
              Welcome to my scheduling page. Please follow the instructions to
              add an event to my calendar.
            </p>
            {actions.map((action, idx) => (
              <Card className="mt-4 cursor-pointer" key={idx}>
                <CardHeader className="flex flex-row items-center justify-between py-2 px-6">
                  <p className="text-lg text-[#1E1E2A]">{action.title}</p>
                </CardHeader>
                <CardContent className="py-2 px-6 pt-0 text-[#9D9DA7]">
                  <p>{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <DrawerFooter>
            <Button
              variant="link"
              className="text-[#5266EB]"
              style={{
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "20px",
              }}
            >
              Chat with us instead
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
