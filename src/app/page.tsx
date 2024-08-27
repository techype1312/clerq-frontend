import { Servers } from "../../config";

export default function Home() {
  if (Servers.AppEnv !== "production") {
    console.log(`Welcome in Otto ${Servers.AppEnv}`);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col gap-4">Home</div>
    </main>
  );
}
