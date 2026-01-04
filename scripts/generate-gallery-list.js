// Script to generate gallery image list at build time
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const galleryFolder = '251225-Noel-St-Jean';
const imagesDir = path.join(__dirname, '..', 'public', 'galeries', 'autre', galleryFolder);
const outputFile = path.join(__dirname, '..', 'public', 'galerie-familiale-images.json');

async function generateGalleryList() {
  try {
    const entries = await fs.readdir(imagesDir);
    const imageFiles = entries.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });
    
    imageFiles.sort();
    
    const images = imageFiles.map(file => ({
      filename: file,
      path: `/galeries/autre/${galleryFolder}/${file}`
    }));
    
    await fs.writeFile(
      outputFile,
      JSON.stringify({ success: true, images }, null, 2),
      'utf-8'
    );
    
    console.log(`✅ Generated gallery list with ${images.length} images`);
  } catch (error) {
    console.error('Error generating gallery list:', error);
    // Write empty list on error
    await fs.writeFile(
      outputFile,
      JSON.stringify({ success: false, images: [] }, null, 2),
      'utf-8'
    );
  }
}

generateGalleryList();

