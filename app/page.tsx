import Image from "next/image";
import ProductPage from "@/components/layout/product/ProductPage";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between px-5 py-8">
      <div className="z-10 w-full max-w-[1240px] items-center justify-between lg:flex">
        <ProductPage 
          productName={"Test"} 
          productType={"productType"} 
          price={2500} 
          stock={10} 
          description={"The developers' and CMS users' vast, unique experience became the basis of HeadlessCMS OneEntry. We know what the users want, so we took into account the needs of business owners, users and developers to create our product. All the tools we've developed are aimed to improve the processes of project management."} 
          imageSrc={"./images/catalog-img-4.svg"} 
        />
      </div>
    </main>
  );
}