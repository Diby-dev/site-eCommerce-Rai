'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { AuthFormData } from '@/types/auth';

export default function SignUpForm() {
  // Tous les Hooks sont maintenant à l'intérieur de la fonction
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    
    const data: AuthFormData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      nom_client: formData.get('nom') as string,
      contact_client: formData.get('contact') as string,
    };

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password!,
      options: {
        data: {
          nom_client: data.nom_client,
          contact_client: data.contact_client,
        }
      }
    });

    if (error) {
       setMessage({ type: 'error', text: error.message });
       setLoading(false);
    } else {
       setIsSubmitted(true);
    }
  };

  // Page de succès après soumission
  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
        <div className="text-4xl mb-4">📧</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Vérifiez votre boîte mail</h2>
        <p className="text-gray-600 mb-8">
          Un lien de confirmation a été envoyé à votre adresse mail, vous verez un mail envoyé par Supabase. 
          Cliquez dessus (sur le lien en bleu Confirm email address) pour terminer la création de votre compte.
        </p>
      </div>
    );
  }

  // Formulaire d'inscription
  return (
    <form
      onSubmit={handleSignUp}
      className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-8"
    >
      <h2 className="text-3xl font-bold text-gray-900 text-center">
        Créer un compte
      </h2>

      <p className="text-sm text-gray-500 text-center mt-2 mb-8">
        Rejoignez KingShop.
      </p>

      <div className="space-y-5">
        <div>
          <label htmlFor="nom" className="block mb-2 text-sm font-medium text-slate-700">Nom</label>
          <input id="nom" name="nom" type="text" autoComplete="name" placeholder="Jean" required className="w-full border text-slate-700 border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 transition" />
        </div>

        <div>
          <label htmlFor="contact" className="block mb-2 text-sm font-medium text-slate-700">Numéro de téléphone</label>
          <input id="contact" name="contact" type="tel" autoComplete="tel" placeholder="+225 07 00 00 00 00" required className="w-full border text-slate-700 border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 transition" />
        </div>

        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-slate-700">Adresse email</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="exemple@email.com" required className="w-full border text-slate-700 border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 transition" />
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-slate-700">Créer un mot de passe</label>
          <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} placeholder="Minimum 8 caractères" required className="w-full border text-slate-700 border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 transition" />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-8 bg-sky-400 hover:bg-sky-950 text-white font-semibold py-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Inscription en cours..." : "Créer mon compte"}
      </button>

      <div className="mt-6 text-center text-sm text-gray-600">
        J&apos;ai déjà un compte ?{' '}
        <Link href="/login" className="text-sky-600 font-semibold hover:underline">
          Connectez-vous
        </Link>
      </div>

      {message && (
        <div className={`mt-5 rounded-md p-3 text-sm ${message.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
          {message.text}
        </div>
      )}
    </form>
  );
}