export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <div>with header</div>
    {children}
    <div>with footer</div>
    </>
  );
}
