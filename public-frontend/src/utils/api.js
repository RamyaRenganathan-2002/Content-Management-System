const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function getPageBySlug(slug) {
    const res = await fetch(`${API_URL}/content/pages/${slug}`, {
        cache: 'no-store' // always fetch fresh content from CMS, no stale caching
    });

    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Failed to fetch page');
    }

    const data = await res.json();
    return data.page;
}

export async function getAllPages() {
    const res = await fetch(`${API_URL}/content/pages`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch pages');
    const data = await res.json();
    return data.pages;
}