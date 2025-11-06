// src/pages/api/vimeo-showcase/[id].json.ts
import type { APIRoute } from 'astro';

// REMOVE THIS LINE: export const prerender = false;

// Define your known Vimeo Showcase IDs
const VIMEO_SHOWCASE_IDS = ['11819722', '11819719', '11819723', '5309609'];

// Get Vimeo Access Token from environment variables
// This will be available during the build process
const VIMEO_ACCESS_TOKEN = import.meta.env.VIMEO_ACCESS_TOKEN;

// Add getStaticPaths to pre-render each ID at build time
export async function getStaticPaths() {
  if (!VIMEO_ACCESS_TOKEN) {
    console.error('Vimeo Access Token not configured in .env for build process. Cannot pre-render Vimeo API routes.');
    // In a real build, you might throw an error or handle this more gracefully.
    // For local dev, ensure .env is correctly set up.
    // Returning an empty array will result in no API routes being generated.
    return [];
  }

  const paths = [];

  for (const showcaseId of VIMEO_SHOWCASE_IDS) {
    try {
      const response = await fetch(`https://api.vimeo.com/me/albums/${showcaseId}/videos`, {
        headers: {
          'Authorization': `Bearer ${VIMEO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Vimeo API Error during build for showcase ${showcaseId}: Status ${response.status}, Body: ${errorText}`);
        continue; // Skip this ID if it fails to fetch
      }

      const data = await response.json();

      const videos = data.data.map((video: any) => ({
        id: video.uri.split('/').pop(),
        name: video.name,
        description: video.description,
        thumbnail: video.pictures.sizes.find((size: any) => size.width === 640 || size.width === 960)?.link || video.pictures.sizes[0]?.link,
        embedHtml: video.embed.html,
        link: video.link,
      }));

      paths.push({
        params: { id: showcaseId },
        props: { videos: videos } // Pass the fetched data as props
      });

    } catch (error) {
      console.error(`Server error during build fetching Vimeo videos for ${showcaseId}:`, error);
    }
  }
  return paths;
}

// Modify the GET handler to receive data from props OR fetch on-demand in dev
export const GET: APIRoute = async ({ props, params }) => {
  let { videos } = props || {};

  // Fallback for dev mode: fetch on-demand if videos not pre-rendered
  if (!videos && params.id && VIMEO_ACCESS_TOKEN) {
    try {
      const response = await fetch(`https://api.vimeo.com/me/albums/${params.id}/videos`, {
        headers: {
          'Authorization': `Bearer ${VIMEO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        videos = data.data.map((video: any) => ({
          id: video.uri.split('/').pop(),
          name: video.name,
          description: video.description,
          thumbnail: video.pictures.sizes.find((size: any) => size.width === 640 || size.width === 960)?.link || video.pictures.sizes[0]?.link,
          embedHtml: video.embed?.html,
          link: video.link,
        }));
      }
    } catch (error) {
      console.error('Dev mode fetch error:', error);
    }
  }

  if (!videos) {
    return new Response(JSON.stringify({ error: 'Video data not found for this ID.' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new Response(JSON.stringify({ videos }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};