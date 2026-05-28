import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-white flex items-center justify-between px-6 h-20 md:items-center">
        <Image src="/img/logo_footer.png" alt="Abricot" width={147} height={18} className="mx-4" />
        <span className="text-sm text-black mx-4">Abricot 2025</span>
    </footer>
  );
}