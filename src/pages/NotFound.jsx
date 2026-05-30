import { Link } from "react-router-dom";
import Seo from "../components/ui/Seo";

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" />
      <section className="section">
        <div className="container-page flex flex-col items-center py-24 text-center">
          <p className="text-7xl font-extrabold text-brand-600 dark:text-brand-400">404</p>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Page not found</h1>
          <p className="mt-2 max-w-md text-slate-500 dark:text-slate-400">
            The page you're looking for doesn't exist or has moved.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/" className="btn-primary">Back home</Link>
            <Link to="/jobs" className="btn-secondary">Browse jobs</Link>
          </div>
        </div>
      </section>
    </>
  );
}
