const fs = require('fs');
const path = require('path');
require('dotenv').config();

const host = process.env.NEXT_PUBLIC_HOST

const createSitemap = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so +1 and pad with 0 if needed
  const dd = String(today.getDate()).padStart(2, '0'); // Pad with 0 if needed
  const currentDate = `${yyyy}-${mm}-${dd}`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${[
        ["/", 1],
        ["/about", .7],
        ["/rasterizer", .9],
        ["/rotorizer", .9],
        ["/rasterizer/about", .8],
        ["/rotorizer/about", .8],
        ["/post/hinting", .8]
      ].map(([path, priority]) =>
      `<url>
        <loc>${host}${path}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${priority}</priority>
      </url>`).join("\n")}
  </urlset>
  `
  return xml
}

const sitemap = createSitemap()

fs.writeFileSync(path.join(__dirname, './public/sitemap.xml'), sitemap);

