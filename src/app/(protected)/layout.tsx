
import Header from "../components/layout/header/page";
import Footer from "../components/layout/footer/page";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <Header/>
    <main className="max-w-360 flex-1">{children}</main>
    <Footer />
    </>
  );
}
