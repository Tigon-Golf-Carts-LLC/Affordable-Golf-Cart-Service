import fs from 'fs';
import path from 'path';
import { services, serviceCategories } from '../shared/services';
import { usStates } from '../shared/states';
import { getAllPosts, getTotalPages } from '../shared/blog';

const DOMAIN = 'https://villagesgolfcartservices.com';
const PUBLIC_DIR = 'client/public';
const TODAY = new Date().toISOString().slice(0, 10);
const NOW = new Date().toISOString();

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

interface UrlEntry {
  loc: string;
  changefreq: string;
  priority: string;
  lastmod?: string;
}

function urlBlock(e: UrlEntry): string {
  return `  <url>
    <loc>${xmlEscape(e.loc)}</loc>
    <lastmod>${e.lastmod || TODAY}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`;
}

const corePages: UrlEntry[] = [
  { loc: `${DOMAIN}/`, changefreq: 'weekly', priority: '1.0' },
  { loc: `${DOMAIN}/services`, changefreq: 'weekly', priority: '0.9' },
  { loc: `${DOMAIN}/states`, changefreq: 'monthly', priority: '0.8' },
  { loc: `${DOMAIN}/contact`, changefreq: 'monthly', priority: '0.8' },
  { loc: `${DOMAIN}/about`, changefreq: 'yearly', priority: '0.5' },
];

const categoryPages: UrlEntry[] = serviceCategories.map((c) => ({
  loc: `${DOMAIN}/services?category=${encodeURIComponent(c)}`,
  changefreq: 'monthly',
  priority: '0.7',
}));

const servicePages: UrlEntry[] = services.map((s) => ({
  loc: `${DOMAIN}/services/${s.id}`,
  changefreq: 'monthly',
  priority: '0.7',
}));

const statePages: UrlEntry[] = usStates.map((st) => ({
  loc: `${DOMAIN}/states/${st.slug}`,
  changefreq: 'monthly',
  priority: '0.8',
}));

const blogPosts = getAllPosts();
const blogTotalPages = getTotalPages();

const blogPages: UrlEntry[] = [
  { loc: `${DOMAIN}/blog`, changefreq: 'weekly', priority: '0.8' },
  ...Array.from({ length: blogTotalPages - 1 }, (_, i) => ({
    loc: `${DOMAIN}/blog/page/${i + 2}`,
    changefreq: 'weekly' as const,
    priority: '0.5',
  })),
  ...blogPosts.map((p) => ({
    loc: `${DOMAIN}/blog/${p.slug}`,
    changefreq: 'monthly',
    priority: p.isPillar ? '0.8' : '0.7',
    lastmod: p.dateModified,
  })),
];

const allEntries = [...corePages, ...categoryPages, ...servicePages, ...statePages, ...blogPages];

function write(file: string, content: string) {
  fs.writeFileSync(path.join(PUBLIC_DIR, file), content.trimStart() + '\n', 'utf-8');
  console.log(`  ✓ ${file}`);
}

console.log('🗺️  Generating SEO data files from live site data...');
console.log(`   ${services.length} services, ${usStates.length} states, ${serviceCategories.length} categories`);

// ---- Master sitemap.xml (all real URLs) ----
write(
  'sitemap.xml',
  `
<?xml version="1.0" encoding="UTF-8"?>
<!-- Villages Golf Cart Services - Complete Sitemap (auto-generated) -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allEntries.map(urlBlock).join('\n')}
</urlset>`
);

// ---- Page sitemap (core static pages) ----
write(
  'page-sitemap.xml',
  `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${corePages.map(urlBlock).join('\n')}
</urlset>`
);

// ---- Category sitemap (service categories) ----
write(
  'category-sitemap.xml',
  `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categoryPages.map(urlBlock).join('\n')}
</urlset>`
);

// ---- Service sitemap (every service detail page) ----
write(
  'service-sitemap.xml',
  `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${servicePages.map(urlBlock).join('\n')}
</urlset>`
);

// ---- Blog sitemap (blog index, pagination, and posts) ----
write(
  'blog-sitemap.xml',
  `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogPages.map(urlBlock).join('\n')}
</urlset>`
);

// ---- Geo sitemap (state service-area pages with coordinates) ----
write(
  'geo-sitemap.xml',
  `
<?xml version="1.0" encoding="UTF-8"?>
<!-- Geographic sitemap: nationwide golf cart service areas (all 50 US states) -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${usStates
  .map(
    (st) => `  <url>
    <loc>${DOMAIN}/states/${st.slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <!-- ${xmlEscape(st.name)} (${st.abbreviation}) lat=${st.lat} lng=${st.lng} -->
  </url>`
  )
  .join('\n')}
</urlset>`
);

// ---- Image sitemap (stable, publicly accessible images) ----
write(
  'image-sitemap.xml',
  `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${DOMAIN}/</loc>
    <image:image>
      <image:loc>${DOMAIN}/og-image.png</image:loc>
      <image:title>Villages Golf Cart Services - Nationwide Golf Cart Service</image:title>
      <image:caption>Professional golf cart service, repair, and maintenance nationwide.</image:caption>
    </image:image>
    <image:image>
      <image:loc>${DOMAIN}/logo.png</image:loc>
      <image:title>Villages Golf Cart Services Logo</image:title>
      <image:caption>Villages Golf Cart Services logo.</image:caption>
    </image:image>
  </url>
</urlset>`
);

// ---- Sitemap index ----
const childSitemaps = [
  'sitemap.xml',
  'page-sitemap.xml',
  'category-sitemap.xml',
  'service-sitemap.xml',
  'blog-sitemap.xml',
  'geo-sitemap.xml',
  'image-sitemap.xml',
];
write(
  'sitemap-index.xml',
  `
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${childSitemaps
  .map(
    (s) => `  <sitemap>
    <loc>${DOMAIN}/${s}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`
);

// ---- Plain URL list ----
write('urllist.txt', allEntries.map((e) => e.loc).join('\n'));

// ---- RSS feed (top services) ----
const feedServices = services.slice(0, 30);
write(
  'rss.xml',
  `
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Villages Golf Cart Services</title>
    <link>${DOMAIN}</link>
    <description>Nationwide golf cart service, repair, and maintenance. Call 1-888-502-7074.</description>
    <language>en-us</language>
    <lastBuildDate>${NOW}</lastBuildDate>
${feedServices
  .map(
    (s) => `    <item>
      <title>${xmlEscape(s.name)} (${xmlEscape(s.priceRange)})</title>
      <link>${DOMAIN}/services/${s.id}</link>
      <guid>${DOMAIN}/services/${s.id}</guid>
      <category>${xmlEscape(s.category)}</category>
      <description>${xmlEscape(s.description)}</description>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>`
);

// ---- Atom feed (top services) ----
write(
  'atom.xml',
  `
<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Villages Golf Cart Services</title>
  <link href="${DOMAIN}"/>
  <link rel="self" href="${DOMAIN}/atom.xml"/>
  <id>${DOMAIN}/</id>
  <updated>${NOW}</updated>
  <subtitle>Nationwide golf cart service, repair, and maintenance.</subtitle>
${feedServices
  .map(
    (s) => `  <entry>
    <title>${xmlEscape(s.name)}</title>
    <link href="${DOMAIN}/services/${s.id}"/>
    <id>${DOMAIN}/services/${s.id}</id>
    <updated>${NOW}</updated>
    <summary>${xmlEscape(s.description)} Price range: ${xmlEscape(s.priceRange)}.</summary>
    <category term="${xmlEscape(s.category)}"/>
  </entry>`
  )
  .join('\n')}
</feed>`
);

console.log('✅ SEO data files generated.\n');
