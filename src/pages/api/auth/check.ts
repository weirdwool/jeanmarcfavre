import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get('admin_auth')?.value;
  const sessionToken = cookies.get('admin_auth')?.value;

  // Check if user is authenticated
  // In a real app, you'd verify the token properly
  const isAuthenticated = !!token || !!sessionToken;

  return new Response(
    JSON.stringify({ authenticated: isAuthenticated }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

