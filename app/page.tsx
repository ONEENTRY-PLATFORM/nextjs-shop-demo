// import CalendarForm from '@/components/forms/CalendarForm';
// import ForgotPasswordForm from '@/components/forms/ForgotPasswordForm';
import PaymentForm from '@/components/forms/PaymentForm';
// import ResetPasswordForm from '@/components/forms/ResetPasswordForm';
// import SignInEmail from '@/components/forms/SignInEmail';
// import SignInPhone from '@/components/forms/SignInPhone';
// import SignUpForm from '@/components/forms/SignUpForm';
// import VerificationForm from '@/components/forms/VerificationForm';
// import CatalogPage from '@/components/layout/pages/CatalogPage';
// import ProductPage from '@/components/layout/pages/ProductPage';
import PopupLayout from '@/components/layout/popup/layout';

// import { useGetPage } from './api';

export default function Home() {
  // const { pageInfo } = useGetPage({ pageUrl: 'catalog_filters' });
  // console.log(pageInfo);
  return (
    <main className="flex flex-col items-center justify-between gap-16 px-5 py-8">
      {/* <ProductPage /> */}
      <PopupLayout>
        <PaymentForm />
      </PopupLayout>
    </main>
  );
}
