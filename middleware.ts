import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  if (!request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    return response;
  }

  // getUser vérifie le jeton auprès de Supabase, contrairement à getSession.
  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;

  if (user?.email) {
    const { data: admin } = await supabase
      .from('admis')
      .select('email_admis')
      .eq('email_admis', user.email)
      .maybeSingle();
    isAdmin = Boolean(admin);
  }

  if (isAdmin) return response;

  const url = request.nextUrl.clone();
  url.pathname = '/admin/login';
  url.searchParams.set(
    'error',
    user ? 'Accès administrateur refusé.' : 'Connexion administrateur requise.'
  );
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
