import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-markazi-text)]">
      <h1 className="text-4xl">DIU Events Hub</h1>
      <p className="font-markazi">Stories of celebrations</p>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start"></main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
