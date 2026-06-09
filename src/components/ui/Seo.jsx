import { Helmet } from "react-helmet-async";

const SITE = "Sketu";
const SITE_URL = "https://www.sketu.in";
const OG_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_DESC =
    "Sketu connects factories with skilled workers. Post jobs, search verified talent, apply in seconds, and hire faster.";

export default function Seo({ title, description = DEFAULT_DESC, path = "" }) {
    const fullTitle = title ? `${title} · ${SITE}` : `${SITE} — Hire factory workers. Find factory jobs.`;
    const url = `${SITE_URL}${path}`;
    return (
          <Helmet>
                <title>{fullTitle}</title>title>
                <meta name="description" content={description} />
                <meta name="robots" content="index, follow" />
            {url ? <link rel="canonical" href={url} /> : null}
                <meta property="og:title" content={fullTitle} />
                <meta property="og:description" content={description} />
                <meta property="og:type" content="website" />
            {url ? <meta property="og:url" content={url} /> : null}
                <meta property="og:image" content={OG_IMAGE} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={fullTitle} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={OG_IMAGE} />
          </Helmet>Helmet>
        );
}</Helmet>
