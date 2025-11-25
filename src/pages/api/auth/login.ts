import type { APIRoute } from 'astro';
import crypto from 'crypto';

export const prerender = false;

const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { password } = await request.json();

    if (!ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Admin password not configured. Please set ADMIN_PASSWORD in environment variables.' 
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (password !== ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ success: false, message: 'Mot de passe incorrect' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate a simple token (in production, use a more secure method)
    const token = crypto.randomBytes(32).toString('hex');
    
    // Set cookie
    cookies.set('admin_auth', token, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return new Response(
      JSON.stringify({ success: true, token }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Erreur de connexion' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

