"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Servers } from "../../config";

const Homepage = () => {
  const router = useRouter();
  if (Servers.AppEnv !== "production") {
    console.log(`Welcome in Otto ${Servers.AppEnv}`);
  }

  const redirectToDashboard = () => {
    router.replace("/dashboard");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col gap-4 items-center justify-center">
        Home
        <Button onClick={redirectToDashboard}>Goto Dashboard</Button>
      </div>
    </main>
  );
};

export default Homepage;
