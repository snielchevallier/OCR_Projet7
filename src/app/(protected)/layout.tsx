
import Header from "../components/layout/header/page";
import Footer from "../components/layout/footer/page";

import { getProfileAction } from '@/actions/profile'
import { UserProvider } from '@/context/UserContext'

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null
  try {
    user = await getProfileAction()
  } catch {
    // middleware redirige déjà si token absent — user null = cas dégradé
  }
  return (
    <UserProvider initialUser={user}>
      <Header/>
      <main className="w-full max-w-360 flex-1 px-4 py-8">{children}</main>
      <Footer />
    </UserProvider>
  );
}
