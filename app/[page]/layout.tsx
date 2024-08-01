function Layout({ children }: { children: React.ReactNode }) {
  return <main className="flex flex-col gap-16 px-5 py-8">{children}</main>;
}

export default Layout;
