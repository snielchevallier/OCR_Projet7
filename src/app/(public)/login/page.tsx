import Link from 'next/link'
import Image from 'next/image';
export default function Login() {
  return (

    <main className="w-full bg-login bg-cover bg-center">
      <div className="bg-background w-full md:w-140 
        flex flex-col
        px-6
        min-h-screen">
        <div className="pt-16">
          <Image
            src="/img/logo.png"
            alt="Logo Abricot.co"
            width={252}
            height={32}
            className="mx-auto"
            preload={true}
          />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl text-orange font-manrope font-bold text-center">
            Connexion
          </h1>
          <form className="w-70 mx-auto mt-8 gap-4 flex flex-col">
            <div className="mb-2">
              <label htmlFor="email" className="block text-sm font-normal text-black">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 p-2 block w-full 
                border border-grey-border rounded-md 
                focus:outline-none focus:ring-orange focus:border-orange"
                placeholder="Votre email"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="password" className="block text-sm font-normal text-black">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-2 block w-full 
                border border-grey-border rounded-md 
                focus:outline-none focus:ring-orange focus:border-orange"
                placeholder="Votre mot de passe"
              />
            </div>
            <button
              type="submit"
              className="
              w-full py-2 px-4 
              bg-black text-white text-base font-medium
              rounded-md 
              hover:bg-orange/90 
              focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
            >
              Se connecter
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            <Link href="/reset-password" className="text-orange hover:underline">Mot de passe oublié?</Link>
          </p>
        </div>
        <div className="pb-8">
          
          <p className="mt-2 text-center text-sm text-gray-600">
            Pas de compte ? <Link href="/register" className="text-orange hover:underline">S'inscrire</Link>
          </p>
        </div>
      </div>
    </main>

  );
}