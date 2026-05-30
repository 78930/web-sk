import { Helmet } from "react-helmet-async";

const SITE = "Sketu";
const DEFAULT_DESC =
  "Sketu connects factories with skilled workers. Post jobs, search verified talent, apply in seconds, and hire faster.";

export default function Seo({ title, description = DEFAULT_DESC, path = "" }) {
  const fullTitle = title ? `${title} · ${SITE}` : `${SITE} — Hire factory workers. Find factory jobs.`;
  const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {url ? <meta property="og:url" content={url} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
