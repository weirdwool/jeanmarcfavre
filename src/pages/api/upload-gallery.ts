import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

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
  // Convert File to ArrayBuffer, then to base64
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
    const galleryName = formData.get('galleryName') as string;
    
    if (!galleryName) {
      return new Response(
        JSON.stringify({ success: false, message: 'Gallery name is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'No files provided' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Process all files and commit to GitHub
    const uploadPromises = files.map(async (file) => {
      // Get the relative path from the file
      let relativePath = (file as any).webkitRelativePath || file.name;
      
      // If webkitRelativePath includes the gallery folder name, remove it
      // e.g., "gallery-name/index.html" -> "index.html"
      // or "gallery-name/images/photo.jpg" -> "images/photo.jpg"
      if (relativePath.includes('/')) {
        const pathParts = relativePath.split('/');
        // Remove the first part (gallery folder name) if it matches
        if (pathParts[0] === galleryName) {
          relativePath = pathParts.slice(1).join('/');
        } else {
          // Keep the path as is, just remove the first folder
          relativePath = pathParts.slice(1).join('/');
        }
      }
      
      // Construct the full path in the repository
      const repoPath = `public/blog/blog-galeries/${galleryName}/${relativePath}`;
      
      // Read file content
      let fileContent: string;
      if (file.type.startsWith('text/') || file.name.endsWith('.html') || file.name.endsWith('.css') || file.name.endsWith('.js')) {
        // Text files: read as UTF-8 text
        fileContent = await file.text();
      } else {
        // Binary files (images): read as base64 string
        fileContent = await fileToBase64(file);
        // Remove data URL prefix if present
        if (fileContent.includes(',')) {
          fileContent = fileContent.split(',')[1];
        }
      }

      // Write file locally first (for development) - KEEP THIS
      const localFilePath = path.join(process.cwd(), 'public', 'blog', 'blog-galeries', galleryName, relativePath);
      try {
        // Ensure directory exists
        await fs.mkdir(path.dirname(localFilePath), { recursive: true });
        // Write the file
        if (file.type.startsWith('text/') || file.name.endsWith('.html') || file.name.endsWith('.css') || file.name.endsWith('.js')) {
          // Text files: write as text
          await fs.writeFile(localFilePath, fileContent, 'utf-8');
        } else {
          // Binary files: write as buffer (decode from base64)
          const fileBuffer = Buffer.from(fileContent, 'base64');
          await fs.writeFile(localFilePath, fileBuffer);
        }
      } catch (localWriteError) {
        console.warn('Could not write file locally:', localWriteError);
        // Continue anyway - GitHub commit will still work
      }

      // Commit to GitHub - OLD WAY: commitFileToGitHub converts content to base64
      // For text files: pass text, it will be converted to base64
      // For binary files: pass base64 string, but commitFileToGitHub will try to convert it again
      // So we need to handle binary files differently
      if (file.type.startsWith('text/') || file.name.endsWith('.html') || file.name.endsWith('.css') || file.name.endsWith('.js')) {
        return commitFileToGitHub(repoPath, fileContent, `Upload gallery: ${galleryName} - ${relativePath}`);
      } else {
        // For binary files, commitFileToGitHub expects UTF-8 but we have base64
        // We need to bypass commitFileToGitHub's conversion and send base64 directly
        if (!GITHUB_TOKEN) {
          throw new Error('GITHUB_TOKEN not configured');
        }
        
        // Get file SHA if exists
        let fileSha: string | null = null;
        try {
          const getFileResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/contents/${repoPath}?ref=${GITHUB_BRANCH}`,
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
          // File doesn't exist, that's okay
        }

        // Commit binary file directly with base64 content
        const commitResponse = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO}/contents/${repoPath}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `token ${GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: `Upload gallery: ${galleryName} - ${relativePath}`,
              content: fileContent, // Already base64
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
    });

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    return new Response(
      JSON.stringify({ 
        success: true, 
        galleryName,
        message: `Successfully uploaded ${files.length} files` 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error uploading gallery:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'Failed to upload gallery' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

