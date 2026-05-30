import { Link } from "react-router-dom";
import Icon from "../ui/Icons";

const COLS = [
  {
    title: "Platform",
    links: [
      { to: "/jobs", label: "Browse jobs" },
      { to: "/talent", label: "Find talent" },
      { to: "/features", label: "How it works" },
      { to: "/register", label: "Create account" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About Sketu" },
      { to: "/contact", label: "Contact" },
      { to: "/features", label: "For factories" },
      { to: "/features", label: "For workers" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Icon.Briefcase className="h-5 w-5" />
              </span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">Sketu</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              The hiring platform built for factories and the industrial workforce. Post a job,
              find verified workers, and hire — all in one place.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((link, i) => (
                  <li key={`${link.to}-${i}`}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-400 sm:flex-row dark:border-slate-800">
          <p>© {new Date().getFullYear()} Sketu. All rights reserved.</p>
          <p>Made for India's industrial workforce.</p>
        </div>
      </div>
    </footer>
  );
}
