import ClosePopup from "./ClosePopup";

export default function PopupLayout({ children }: Readonly<{children: React.ReactNode;}>) {

  return (
    <div className="flex flex-col px-10 pt-8 pb-16 bg-white rounded-3xl w-full max-w-[550px]">
      <div className="box-border flex relative flex-col shrink-0 mb-16 items-end">
        <ClosePopup />
      </div>
      <div className="flex flex-col w-full max-md:px-5 max-md:mt-10">
        {children}
      </div>
    </div>
  );
}