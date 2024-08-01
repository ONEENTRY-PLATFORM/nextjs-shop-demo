import ProductPage from "@/components/layout/pages/ProductPage";
import CatalogPage from "@/components/layout/pages/CatalogPage";
import PopupLayout from "@/components/layout/popup/layout";
import CalendarForm from "@/components/forms/CalendarForm";
import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";
import PaymentForm from "@/components/forms/PaymentForm";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between px-5 py-8 gap-16">
      {/* <ProductPage /> */}
        <PopupLayout children={<PaymentForm />} />
    </main>
  );
}