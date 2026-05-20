import Link from 'next/link'

export default function Projets() {
  return (
    <div className="">
      <main className="">
        <div className="">
          <h1 className="text-4xl font-bold text-center">
            Project List page
          </h1>
          <p>
            <Link href="/projets/le_nom_du_projet" className="text-blue-500 hover:underline">
              le_nom_du_projet
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}