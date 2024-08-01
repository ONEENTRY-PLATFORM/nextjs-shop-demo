export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <main className="flex flex-col px-5 py-8 gap-16">
      {children}
    </main>
    </>
  );
}
