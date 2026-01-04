import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const galleryFolder = url.searchParams.get('folder') || '251225-Noel-St-Jean';
    const imagesDir = path.join(process.cwd(), 'public', 'galeries', 'autre', galleryFolder);
    
    // Try to read the directory
    let files: string[] = [];
    try {
      const entries = await fs.readdir(imagesDir);
      // Filter for image files only
      files = entries.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      });
      // Sort by filename
      files.sort();
    } catch (error) {
      // Directory might not exist or be accessible
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

