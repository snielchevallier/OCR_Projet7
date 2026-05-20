export default async function ProjetDetail({ params }: { params: { slug: string } }) {

  const { slug } = await params;
  return (
    <div className="">
      <main className="">
        <div className="">
          <h1 className="text-4xl font-bold text-center">
            Project Detail page
          </h1>
          <p>{slug}</p>
        </div>
      </main>
    </div>
  );
}