import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white w-360 py-8 px-8 flex items-center justify-between">
      <Image src="/img/logo_footer.png" alt="Abricot" width={147} height={18} />
      <span className="text-sm text-black">Abricot 2025</span>
    </footer>
  );
}