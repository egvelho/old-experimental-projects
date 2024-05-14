import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Content-Type", "text/plain");
    res.end(`
        User-agent: *
        Allow: /
        
        Sitemap: http://${req.headers.host}/api/sitemap.xml
    `);
};
