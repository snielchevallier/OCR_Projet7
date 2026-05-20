import Link from 'next/link'
import Image from 'next/image';

export default function Login() {
  return (
    
      <main className="w-full ">
        <div className="bg-background w-120">
          <h1 className="text-4xl text-orange font-bold text-center">
            Connexion
          </h1>
          <form >
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange focus:border-orange"
                placeholder="Votre email"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange focus:border-orange"
                placeholder="Votre mot de passe"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-orange text-white font-semibold rounded-md hover:bg-orange/90 focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
            >
              Se connecter
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Mot de passe oublié? <Link href="/reset-password" className="text-orange hover:underline">Réinitialiser</Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            Pas de compte? <Link href="/register" className="text-orange hover:underline">S'inscrire</Link>
          </p>
        </div>
      </main>
    
  );
}