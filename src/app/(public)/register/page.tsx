import Link from 'next/link'

export default function Register() {
  return (
    <div className="">
      <main className="">
        <div className="">
          <h1 className="text-4xl font-bold text-center">
            Register page
          </h1>
          <p>
            <Link href="/login" className="text-blue-500 hover:underline">
              Already have an account? Login here.
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}