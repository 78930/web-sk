import { Link } from "react-router-dom";
import Seo from "../components/ui/Seo";
import Icon from "../components/ui/Icons";

const WORKER = [
  { icon: Icon.Users, title: "One profile, many jobs", text: "Add your skills, experience, preferred area and shift once — then apply to any job instantly." },
  { icon: Icon.Search, title: "Smart job search", text: "Filter open jobs by area, role, skill and shift to find work that fits your life." },
  { icon: Icon.Inbox, title: "Track applications", text: "See the status of every job you've applied to — applied, shortlisted or hired." },
];

const FACTORY = [
  { icon: Icon.Plus, title: "Post jobs fast", text: "Create a listing with pay range, shift, area and required skills in a couple of minutes." },
  { icon: Icon.Search, title: "Search talent", text: "Browse verified, open-to-work workers and filter by exactly the skills you need." },
  { icon: Icon.CheckCircle, title: "Shortlist & hire", text: "Review applicants, shortlist the best, and record hires — all from one dashboard." },
];

function Group({ label, tone, items }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className={`pill ${tone}`}>{label}</span>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {items.map((f) => (
          <div key={f.title} className="card card-hover p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">{f.title}</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{f.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <>
      <Seo title="How it works" path="/features" description="See how Sketu helps factories hire and workers find jobs — search, apply, shortlist and hire." />

      <section className="border-b border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-950">
        <div className="container-page text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            One platform, two simple journeys
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Whether you're hiring or job-hunting, Sketu gives you the tools to do it quickly.
          </p>
        </div>
      </section>

      <section className="section space-y-16">
        <div className="container-page space-y-16">
          <Group label="For workers" tone="bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200" items={WORKER} />
          <Group label="For factories" tone="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200" items={FACTORY} />
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <div className="rounded-3xl bg-slate-900 px-8 py-12 text-center dark:bg-slate-800 sm:px-16">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Start in less than a minute</h2>
            <p className="mt-3 text-slate-300">No passwords — just verify your phone and you're in.</p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/register" className="btn bg-brand-600 text-white hover:bg-brand-700">Create free account</Link>
              <Link to="/jobs" className="btn border border-white/30 text-white hover:bg-white/10">Browse jobs</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
