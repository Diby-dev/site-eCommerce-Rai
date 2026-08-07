import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/** Vérifie la session Supabase et le rôle administrateur. */
export async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect('/admin/login?error=Connexion%20administrateur%20requise.');
  }

  const { data: admin, error } = await supabase
    .from('admis')
    .select('email_admis, nom_admis')
    .eq('email_admis', user.email)
    .maybeSingle();

  if (error || !admin) {
    redirect('/admin/login?error=Acc%C3%A8s%20administrateur%20refus%C3%A9.');
  }

  return { supabase, user, admin };
}
