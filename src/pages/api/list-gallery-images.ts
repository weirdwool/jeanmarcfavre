import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const galleryFolder = url.searchParams.get('folder') || '251225-Noel-St-Jean';
    
    // First, try to read from the pre-generated JSON file (build-time solution)
    try {
      const jsonPath = path.join(process.cwd(), 'public', 'galerie-familiale-images.json');
      const jsonContent = await fs.readFile(jsonPath, 'utf-8');
      const data = JSON.parse(jsonContent);
      
      if (data.success && data.images && data.images.length > 0) {
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (jsonError) {
      // JSON file doesn't exist or can't be read, fall back to file system
      console.warn('Could not read pre-generated JSON, trying file system:', jsonError);
    }
    
    // Fallback: Try to read from file system (for dev or if JSON doesn't exist)
    const imagesDir = path.join(process.cwd(), 'public', 'galeries', 'autre', galleryFolder);
    
    try {
      const entries = await fs.readdir(imagesDir);
      const files = entries.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      });
      files.sort();
      
      return new Response(JSON.stringify({ 
        success: true, 
        images: files.map(file => ({
          filename: file,
          path: `/galeries/autre/${galleryFolder}/${file}`
        }))
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.warn('Could not read gallery images directory:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Dossier non trouvé: galeries/autre/${galleryFolder}`,
        images: []
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error listing gallery images:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to list images',
      images: []
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
