import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'blog', 'blog-images');
    
    // Try to read the directory
    let files: string[] = [];
    try {
      const entries = await fs.readdir(imagesDir);
      // Filter for image files only
      files = entries.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      });
      // Sort by filename (newest first if using date-based naming)
      files.sort().reverse();
    } catch (error) {
      // Directory might not exist or be accessible
      console.warn('Could not read images directory:', error);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      images: files.map(file => ({
        filename: file,
        path: `/blog/blog-images/${file}`
      }))
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error listing blog images:', error);
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

