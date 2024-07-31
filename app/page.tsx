import ProductPage from "@/components/layout/pages/ProductPage";
import CatalogPage from "@/components/layout/pages/CatalogPage";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between px-5 py-8 gap-16">
      <CatalogPage />

    </main>
  );
}