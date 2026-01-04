import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { Readable } from 'stream';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const galleryFolder = url.searchParams.get('folder') || '251225-Noel-St-Jean';
    const imagesDir = path.join(process.cwd(), 'public', 'blog', 'blog-galeries', galleryFolder, 'images');
    
    // Check if directory exists
    try {
      await fs.access(imagesDir);
    } catch {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Gallery folder not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Read all image files
    const entries = await fs.readdir(imagesDir);
    const imageFiles = entries.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });

    if (imageFiles.length === 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'No images found in gallery'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // For serverless environments, we'll use a simple approach:
    // Create a zip using JSZip (we'll need to install it or use a simpler method)
    // Since we're on Vercel/serverless, we'll use a client-side approach instead
    // This endpoint will return the list of image URLs for the client to zip
    
    return new Response(JSON.stringify({ 
      success: true,
      images: imageFiles.map(file => ({
        filename: file,
        path: `/blog/blog-galeries/${galleryFolder}/images/${file}`
      }))
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error preparing gallery zip:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to prepare zip file'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

