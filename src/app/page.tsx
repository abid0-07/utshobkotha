import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-markazi-text)]">
      <h1 className="text-4xl">DIU Events Hub</h1>
      <p className="font-markazi">Stories of celebrations</p>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex flex-row m-4 p-4 gap-8 items-center sm:items-start">
          <div className="flex flex-col gap-4 m-2 max-w-[400px]">
            <Image src="/Jobutsab2024.png" alt="" width={400} height={400} />
            <h2 className="text-2xl font-semibold">Job Utsob 2024</h2>
            <span>
              DIU successfully organized Jobutsob 2024 at DIU smart city (DSC)
              Birulia, Savar, Dhaka
            </span>
          </div>
          <div className="flex flex-col gap-4 m-2 max-w-[400px]">
            <Image src="/ICPCdhaka.png" alt="" width={400} height={400} />
            <h2 className="text-2xl font-semibold">
              ICPC Dhaka Regional content 2024
            </h2>
            <span>
              DIU hosted the biggest onsite programming contest in ICPC Dhaka
              Regional 2024
            </span>
          </div>
          <div className="flex flex-col gap-4 m-2 max-w-[400px]">
            <Image src="/12thconvocation.png" alt="" width={400} height={400} />
            <h2 className="text-2xl font-semibold">12th Convocation of DIU</h2>
            <span>
              12th Convocation of Daffodil International University held on 8th
              February 2025 with huge gathering
            </span>
          </div>
        </div>
        <Button className="self-center">Explore More</Button>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
