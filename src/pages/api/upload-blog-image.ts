import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

export const prerender = false;

// GitHub API configuration
const GITHUB_REPO = 'weirdwool/jeanmarcfavre';
const GITHUB_BRANCH = 'main';
const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;

// Helper function to commit file to GitHub
async function commitFileToGitHub(filePath: string, base64Content: string, message: string) {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN not configured');
  }

  // base64Content is already base64-encoded for binary files
  
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
    const date = formData.get('date') as string; // Date is sent but not used for filename
    
    if (!file) {
      return new Response(
        JSON.stringify({ success: false, message: 'Aucun fichier fourni' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Use original filename exactly as uploaded (no modifications)
    const filename = file.name;
    const repoPath = `public/blog/blog-images/${filename}`;
    
    // Check file size - images should be optimized, limit to 1.5MB
    const maxSizeBytes = 1.5 * 1024 * 1024; // 1.5MB
    if (file.size > maxSizeBytes) {
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(1);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Le fichier est trop volumineux (${fileSizeMB}MB). La taille maximale est de 1.5MB. Veuillez optimiser l'image avant de la téléverser.` 
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Read file content as base64
    const base64Content = await fileToBase64(file);

    // Write file locally first (for development)
    const localFilePath = path.join(process.cwd(), 'public', 'blog', 'blog-images', filename);
    try {
      // Ensure directory exists
      await fs.mkdir(path.dirname(localFilePath), { recursive: true });
      // Write the file
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(localFilePath, fileBuffer);
    } catch (localWriteError) {
      console.warn('Could not write file locally:', localWriteError);
      // Continue anyway - GitHub commit will still work
    }

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
    
    // Provide more specific error messages
    let errorMessage = 'Erreur lors du téléversement de l\'image';
    if (error.message) {
      if (error.message.includes('GITHUB_TOKEN')) {
        errorMessage = 'Token GitHub non configuré. Veuillez contacter l\'administrateur.';
      } else if (error.message.includes('GitHub API error')) {
        errorMessage = `Erreur GitHub: ${error.message.replace('GitHub API error: ', '')}`;
      } else if (error.message.includes('timeout') || error.message.includes('network')) {
        errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet et réessayez.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: errorMessage 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

