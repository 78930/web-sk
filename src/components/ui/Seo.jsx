import { Helmet } from "react-helmet-async";

const SITE      = "Sketu";
const SITE_URL  = "https://www.sketu.in";
const OG_IMAGE  = SITE_URL + "/og-image.png";
const DEFAULT_DESC =
  "Sketu connects factories with skilled workers. Post jobs, search verified talent, apply in seconds, and hire faster — built for India's industrial workforce.";
const DEFAULT_KEYWORDS =
  "factory jobs India, industrial jobs, hire workers India, factory recruitment, skilled workers, job search India, Sketu";

export default function Seo({
  title,
  description = DEFAULT_DESC,
  keywords    = DEFAULT_KEYWORDS,
  path        = "",
  jsonLd      = null,
}) {
  const fullTitle = title
    ? title + " · " + SITE
    : SITE + " — Hire factory workers. Find factory jobs.";
  const url = SITE_URL + path;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description"   content={description} />
      <meta name="keywords"      content={keywords} />
      <meta name="robots"        content="index, follow" />
      <meta name="author"        content="Sketu" />
      <link rel="canonical"      href={url} />

      {/* Open Graph */}
      <meta property="og:site_name"   content={SITE} />
      <meta property="og:locale"      content="en_IN" />
      <meta property="og:type"        content="website" />
      <meta property="og:url"         content={url} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={OG_IMAGE} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt"    content="Sketu — Industrial hiring platform" />

      {/* Twitter */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={OG_IMAGE} />

      {/* JSON-LD structured data */}
      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
    </Helmet>
  );
}
