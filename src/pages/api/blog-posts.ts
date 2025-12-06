import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'fs/promises';
import path from 'path';

// GitHub API configuration
const GITHUB_REPO = 'weirdwool/jeanmarcfavre';
const GITHUB_BRANCH = 'main';
const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN; // Set this in your environment

// Helper function to commit file to GitHub
async function commitToGitHub(slug: string, content: string, action: 'create' | 'update') {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN not configured');
  }

  const filePath = `src/content/blog/${slug}.md`;
  const base64Content = Buffer.from(content, 'utf-8').toString('base64');
  
  // Get current file SHA if updating
  let fileSha: string | null = null;
  if (action === 'update') {
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
      // File might not exist, that's okay for create
    }
  }

  // Commit the file
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
        message: action === 'create' 
          ? `Add blog post: ${slug}` 
          : `Update blog post: ${slug}`,
        content: base64Content,
        branch: GITHUB_BRANCH,
        ...(fileSha && { sha: fileSha }), // Include SHA for updates
      }),
    }
  );

  if (!commitResponse.ok) {
    const error = await commitResponse.json();
    throw new Error(`GitHub API error: ${error.message || 'Unknown error'}`);
  }

  return await commitResponse.json();
}

// Mark API routes as dynamic (not pre-rendered)
export const prerender = false;

// GET: Fetch all blog posts
export const GET: APIRoute = async () => {
  try {
    const posts = await getCollection('blog');
    
    const postsData = posts.map(post => ({
      slug: post.slug,
      title: post.data.title,
      pubDate: post.data.pubDate.toISOString(),
      location: post.data.location || '',
      main_image: post.data.main_image || '',
      gallery_url: post.data.gallery_url || '',
      video_url: post.data.video_url || '',
      tags: post.data.tags || {},
      body: post.body || '',
    }));

    // Sort by date, newest first
    postsData.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    return new Response(JSON.stringify(postsData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch blog posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// POST: Create new blog post
export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { slug, title, pubDate, location, main_image, gallery_url, video_url, tags, body } = data;

    // Generate markdown content
    const frontmatter = `---
title: ${JSON.stringify(title)}
pubDate: ${new Date(pubDate).toISOString()}
${location && location.trim() ? `location: ${JSON.stringify(location)}` : ''}
${main_image && main_image.trim() ? `main_image: ${JSON.stringify(main_image)}` : ''}
${gallery_url && gallery_url.trim() ? `gallery_url: ${JSON.stringify(gallery_url)}` : ''}
${video_url && video_url.trim() ? `video_url: ${JSON.stringify(video_url)}` : ''}
tags:
${Object.entries(tags || {}).map(([key, value]) => `  ${key}: ${value}`).join('\n')}
---

${body || ''}
`;

    // Try to write file locally first (works in dev mode)
    const filePath = path.join(process.cwd(), 'src', 'content', 'blog', `${slug}.md`);
    
    try {
      await fs.writeFile(filePath, frontmatter, 'utf-8');
      
      // If GitHub token is available, also commit to GitHub for automatic deployment
      if (GITHUB_TOKEN) {
        try {
          await commitToGitHub(slug, frontmatter, 'create');
        } catch (githubError) {
          console.warn('Local file saved but GitHub commit failed:', githubError);
          // Still return success since local file was saved
        }
      }
      
      return new Response(JSON.stringify({ success: true, slug }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (writeError) {
      // If local write fails, try GitHub API directly
      if (GITHUB_TOKEN) {
        try {
          await commitToGitHub(slug, frontmatter, 'create');
          return new Response(JSON.stringify({ success: true, slug, message: 'Committed to GitHub' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (githubError) {
          console.error('GitHub commit failed:', githubError);
        }
      }
      
      // Fallback: return markdown for download
      return new Response(JSON.stringify({ 
        success: false, 
        markdown: frontmatter,
        message: 'File write not available. Please download and commit manually, or set GITHUB_TOKEN environment variable.',
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error creating blog post:', error);
    return new Response(JSON.stringify({ error: 'Failed to create blog post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// PUT: Update existing blog post
export const PUT: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { slug, title, pubDate, location, main_image, gallery_url, video_url, tags, body } = data;

    // Generate markdown content
    const frontmatter = `---
title: ${JSON.stringify(title)}
pubDate: ${new Date(pubDate).toISOString()}
${location && location.trim() ? `location: ${JSON.stringify(location)}` : ''}
${main_image && main_image.trim() ? `main_image: ${JSON.stringify(main_image)}` : ''}
${gallery_url && gallery_url.trim() ? `gallery_url: ${JSON.stringify(gallery_url)}` : ''}
${video_url && video_url.trim() ? `video_url: ${JSON.stringify(video_url)}` : ''}
tags:
${Object.entries(tags || {}).map(([key, value]) => `  ${key}: ${value}`).join('\n')}
---

${body || ''}
`;

    // Try to write file locally first (works in dev mode)
    const filePath = path.join(process.cwd(), 'src', 'content', 'blog', `${slug}.md`);
    
    try {
      await fs.writeFile(filePath, frontmatter, 'utf-8');
      
      // If GitHub token is available, also commit to GitHub for automatic deployment
      if (GITHUB_TOKEN) {
        try {
          await commitToGitHub(slug, frontmatter, 'update');
        } catch (githubError) {
          console.warn('Local file saved but GitHub commit failed:', githubError);
          // Still return success since local file was saved
        }
      }
      
      return new Response(JSON.stringify({ success: true, slug }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (writeError) {
      // If local write fails, try GitHub API directly
      if (GITHUB_TOKEN) {
        try {
          await commitToGitHub(slug, frontmatter, 'update');
          return new Response(JSON.stringify({ success: true, slug, message: 'Committed to GitHub' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (githubError) {
          console.error('GitHub commit failed:', githubError);
        }
      }
      
      // Fallback: return markdown for download
      return new Response(JSON.stringify({ 
        success: false, 
        markdown: frontmatter,
        message: 'File write not available. Please download and commit manually, or set GITHUB_TOKEN environment variable.',
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error updating blog post:', error);
    return new Response(JSON.stringify({ error: 'Failed to update blog post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

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

// DELETE: Delete blog post
export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    // Get slug from URL or request
    let slug: string;
    if (params && params.slug) {
      slug = params.slug;
    } else {
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      slug = pathParts[pathParts.length - 1];
    }

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

