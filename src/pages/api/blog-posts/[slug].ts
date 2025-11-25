import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

// GitHub API configuration
const GITHUB_REPO = 'weirdwool/jeanmarcfavre';
const GITHUB_BRANCH = 'main';
const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;

// Helper function to delete file from GitHub
async function deleteFromGitHub(slug: string) {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN not configured');
  }

  const filePath = `src/content/blog/${slug}.md`;
  
  // Get current file SHA
  const getFileResponse = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
    {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    }
  );

  if (!getFileResponse.ok) {
    throw new Error('File not found on GitHub');
  }

  const fileData = await getFileResponse.json();
  const fileSha = fileData.sha;

  // Delete the file
  const deleteResponse = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Delete blog post: ${slug}`,
        sha: fileSha,
        branch: GITHUB_BRANCH,
      }),
    }
  );

  if (!deleteResponse.ok) {
    const error = await deleteResponse.json();
    throw new Error(`GitHub API error: ${error.message || 'Unknown error'}`);
  }

  return await deleteResponse.json();
}

export const prerender = false;

// DELETE: Delete blog post
export const DELETE: APIRoute = async ({ params }) => {
  try {
    const slug = params.slug;

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Try to delete file locally first (works in dev mode)
    const filePath = path.join(process.cwd(), 'src', 'content', 'blog', `${slug}.md`);
    
    try {
      await fs.unlink(filePath);
      
      // If GitHub token is available, also delete from GitHub
      if (GITHUB_TOKEN) {
        try {
          await deleteFromGitHub(slug);
        } catch (githubError) {
          console.warn('Local file deleted but GitHub delete failed:', githubError);
          // Still return success since local file was deleted
        }
      }
      
      return new Response(JSON.stringify({ success: true, slug }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (deleteError: any) {
      // If local delete fails, try GitHub API directly
      if (GITHUB_TOKEN) {
        try {
          await deleteFromGitHub(slug);
          return new Response(JSON.stringify({ success: true, slug, message: 'Deleted from GitHub' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (githubError) {
          console.error('GitHub delete failed:', githubError);
          return new Response(JSON.stringify({ error: 'Failed to delete blog post' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
      
      return new Response(JSON.stringify({ error: 'Failed to delete blog post' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete blog post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

