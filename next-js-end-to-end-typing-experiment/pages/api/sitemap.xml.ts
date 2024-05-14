import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Content-Type", "application/xml");
    res.end(`
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
            <loc>https://${req.headers.host}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.9</priority>
            </url>
        </urlset>
    `);
};
