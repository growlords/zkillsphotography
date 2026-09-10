// server/cloudStore.mjs
// Resilient, global cloud persistence engine for Z Skills Photography CMS
// Stores CMS content and portfolio projects in GitHub Issue #1 & Comments,
// ensuring 100% data persistence across Vercel serverless cold starts, instances, and regions.

const GITHUB_TOKEN = process.env.CMS_PERSISTENCE_TOKEN || process.env.GITHUB_TOKEN || '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';
const REPO = process.env.CMS_REPO || 'growlords/zkillsphotography';
const ISSUE_NUM = 1;
const COMMENT_PROJECTS_ID = 5619020438;
const COMMENT_MEDIA_ID = 5619029616;

const CACHE_TTL_MS = 2500; // 2.5 seconds cache TTL

let memoryCache = {
  content: null,
  projects: null,
  media: null,
  lastFetchedAt: 0,
};

const defaultHeaders = {
  Authorization: `token ${GITHUB_TOKEN}`,
  'User-Agent': 'zskills-cms',
  Accept: 'application/vnd.github.v3+json',
};

/**
 * Fetch with a timeout to avoid serverless hanging
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Get all site content (branding, hero, about, services, process, testimonials, contact, social, seo)
 */
export async function getCloudContent(forceFresh = false) {
  const now = Date.now();
  if (!forceFresh && memoryCache.content && (now - memoryCache.lastFetchedAt < CACHE_TTL_MS)) {
    return memoryCache.content;
  }

  try {
    const res = await fetchWithTimeout(`https://api.github.com/repos/${REPO}/issues/${ISSUE_NUM}`, {
      headers: defaultHeaders,
    });
    if (res.ok) {
      const data = await res.json();
      if (data.body) {
        const parsed = JSON.parse(data.body);
        memoryCache.content = parsed;
        memoryCache.lastFetchedAt = now;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[CloudStore] getCloudContent fallback to memory:', err.message);
  }

  return memoryCache.content;
}

/**
 * Save site content section or entire content object
 */
export async function saveCloudContent(updatedContent) {
  memoryCache.content = updatedContent;
  memoryCache.lastFetchedAt = Date.now();

  try {
    const res = await fetchWithTimeout(`https://api.github.com/repos/${REPO}/issues/${ISSUE_NUM}`, {
      method: 'PATCH',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: JSON.stringify(updatedContent, null, 2),
      }),
    });
    if (!res.ok) {
      console.warn('[CloudStore] Failed to persist content to GitHub:', res.status);
    }
    return res.ok;
  } catch (err) {
    console.warn('[CloudStore] Error persisting content to GitHub:', err.message);
    return false;
  }
}

/**
 * Get portfolio projects list
 */
export async function getCloudProjects(forceFresh = false) {
  const now = Date.now();
  if (!forceFresh && memoryCache.projects && (now - memoryCache.lastFetchedAt < CACHE_TTL_MS)) {
    return memoryCache.projects;
  }

  try {
    const res = await fetchWithTimeout(`https://api.github.com/repos/${REPO}/issues/comments/${COMMENT_PROJECTS_ID}`, {
      headers: defaultHeaders,
    });
    if (res.ok) {
      const data = await res.json();
      if (data.body) {
        const parsed = JSON.parse(data.body);
        if (Array.isArray(parsed)) {
          memoryCache.projects = parsed;
          memoryCache.lastFetchedAt = now;
          return parsed;
        }
      }
    }
  } catch (err) {
    console.warn('[CloudStore] getCloudProjects fallback to memory:', err.message);
  }

  return memoryCache.projects;
}

/**
 * Save portfolio projects array
 */
export async function saveCloudProjects(projectsArray) {
  memoryCache.projects = projectsArray;
  memoryCache.lastFetchedAt = Date.now();

  try {
    const res = await fetchWithTimeout(`https://api.github.com/repos/${REPO}/issues/comments/${COMMENT_PROJECTS_ID}`, {
      method: 'PATCH',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: JSON.stringify(projectsArray, null, 2),
      }),
    });
    if (!res.ok) {
      console.warn('[CloudStore] Failed to persist projects to GitHub:', res.status);
    }
    return res.ok;
  } catch (err) {
    console.warn('[CloudStore] Error persisting projects to GitHub:', err.message);
    return false;
  }
}

/**
 * Upload a media file permanently via GitHub Contents API
 */
export async function uploadMediaToCloud(filename, buffer) {
  try {
    const base64Content = buffer.toString('base64');
    const path = `public/uploads/${filename}`;
    const res = await fetchWithTimeout(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      method: 'PUT',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Upload media: ${filename} [skip ci]`,
        content: base64Content,
        branch: 'main',
      }),
    });

    if (res.ok || res.status === 201) {
      const data = await res.json();
      return {
        success: true,
        downloadUrl: `https://raw.githubusercontent.com/${REPO}/main/public/uploads/${filename}`,
        sha: data.content?.sha,
      };
    }
  } catch (err) {
    console.warn('[CloudStore] uploadMediaToCloud error:', err.message);
  }
  return { success: false };
}

/**
 * Seed cloud store if empty
 */
export async function seedCloudIfEmpty(initialContent, initialProjects) {
  try {
    const current = await getCloudContent(true);
    if (!current || !current.hero) {
      console.log('[CloudStore] Seeding initial content to cloud...');
      await saveCloudContent(initialContent);
    }
    const currentProj = await getCloudProjects(true);
    if (!currentProj || currentProj.length === 0) {
      console.log('[CloudStore] Seeding initial projects to cloud...');
      await saveCloudProjects(initialProjects);
    }
  } catch (err) {
    console.warn('[CloudStore] seedCloudIfEmpty error:', err.message);
  }
}
