import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/onboarding`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/dashboard`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/track`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tutor`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/project/submit`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];
}
