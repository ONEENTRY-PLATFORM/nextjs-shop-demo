import Image from "next/image";
import ProductPage from "@/components/layout/product/ProductPage";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between px-5 py-8">
      <div className="z-10 w-full max-w-[1240px] items-center justify-between font-mono text-sm lg:flex">
        <ProductPage 
          productName={"Test"} 
          productType={""} 
          price={2500} 
          stock={10} 
          description={""} 
          imageSrc={""} 
        />
      </div>
    </main>
  );
}