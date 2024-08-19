import CloseModal from './CloseModal';

function ModalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex w-full max-w-[550px] flex-col rounded-3xl bg-white px-10 pb-16 pt-8 shadow-xl max-md:max-w-[420px] max-md:px-6">
      <div className="relative box-border flex shrink-0 flex-col items-end">
        <CloseModal />
      </div>
      <div className="flex w-full flex-col max-md:mt-10">{children}</div>
    </div>
  );
}

export default ModalLayout;
