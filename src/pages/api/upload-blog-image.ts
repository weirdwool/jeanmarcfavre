import type { APIRoute } from 'astro';

export const prerender = false;

// GitHub API configuration
const GITHUB_REPO = 'weirdwool/jeanmarcfavre';
const GITHUB_BRANCH = 'main';
const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;

// Helper function to commit file to GitHub
async function commitFileToGitHub(filePath: string, content: string, message: string) {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN not configured');
  }

  const base64Content = Buffer.from(content, 'utf-8').toString('base64');
  
  // Check if file exists to get SHA for updates
  let fileSha: string | null = null;
  try {
    const getFileResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );
    if (getFileResponse.ok) {
      const fileData = await getFileResponse.json();
      fileSha = fileData.sha;
    }
  } catch (error) {
    // File doesn't exist, that's okay for new files
  }

  const commitResponse = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: base64Content,
        branch: GITHUB_BRANCH,
        ...(fileSha && { sha: fileSha }),
      }),
    }
  );

  if (!commitResponse.ok) {
    const error = await commitResponse.json();
    throw new Error(`GitHub API error: ${error.message || 'Unknown error'}`);
  }

  return await commitResponse.json();
}

// Helper to read file as base64
async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString('base64');
}

// Generate filename from date and original filename
function generateFilename(date: string, originalFilename: string): string {
  // Always use the date from the form
  const dateObj = new Date(date);
  const year = String(dateObj.getFullYear()).slice(-2);
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  // Get extension from original filename (preserve case)
  const extension = originalFilename.split('.').pop() || 'jpg';
  
  // Get base name without extension and remove any existing date prefix
  let baseName = originalFilename.replace(/\.[^/.]+$/, '');
  
  // Remove any existing date prefix (6 digits + hyphen) from the beginning
  baseName = baseName.replace(/^\d{6}-/i, '');
  
  // Clean the base name (remove special chars, keep alphanumeric, hyphens, and preserve case)
  // Only normalize accents but keep original case
  const cleanBaseName = baseName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents but keep case
    .replace(/[^a-zA-Z0-9-]+/g, '-') // Keep letters (both cases), numbers, and hyphens
    .replace(/(^-|-$)/g, '')
    .substring(0, 30);
  
  return `${year}${month}${day}-${cleanBaseName}.${extension}`;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!GITHUB_TOKEN) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'GITHUB_TOKEN not configured. Please set it in your environment variables.' 
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const date = formData.get('date') as string; // Publication date for filename
    
    if (!file) {
      return new Response(
        JSON.stringify({ success: false, message: 'Aucun fichier fourni' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!date) {
      return new Response(
        JSON.stringify({ success: false, message: 'La date est requise pour générer le nom du fichier' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate filename
    const filename = generateFilename(date, file.name);
    const repoPath = `public/blog/blog-images/${filename}`;
    
    // Read file content as base64
    const base64Content = await fileToBase64(file);

    // Commit to GitHub
    await commitFileToGitHub(
      repoPath,
      base64Content,
      `Upload blog image: ${filename}`
    );

    // Return the public URL path
    const publicPath = `/blog/blog-images/${filename}`;

    return new Response(
      JSON.stringify({ 
        success: true, 
        filename,
        path: publicPath,
        message: `Image téléversée avec succès: ${filename}` 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error uploading blog image:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'Erreur lors du téléversement de l\'image' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

