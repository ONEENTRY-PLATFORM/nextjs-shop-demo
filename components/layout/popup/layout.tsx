import ClosePopup from "./ClosePopup";

export default function PopupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col px-10 max-md:px-6 pt-8 pb-16 bg-white rounded-3xl shadow-xl w-full max-w-[550px] max-md:max-w-[420px]">
      <div className="box-border flex relative flex-col shrink-0 items-end">
        <ClosePopup />
      </div>
      <div className="flex flex-col w-full max-md:mt-10">
        {children}
      </div>
    </div>
  );
}
