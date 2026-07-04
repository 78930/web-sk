import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/ui/Seo";
import Icon from "../components/ui/Icons";
import Pill from "../components/ui/Pill";
import JobCard from "../components/jobs/JobCard";
import { SkeletonCard, EmptyState } from "../components/ui/States";
import { useAuth } from "../context/AuthContext";
import { listJobs } from "../services/jobs";

const FEATURES = [
  {
    icon: Icon.Bolt,
    title: "Hire in days, not weeks",
    text: "Post a job and start receiving applications from nearby workers within hours.",
  },
  {
    icon: Icon.Shield,
    title: "Verified profiles",
    text: "Every worker registers with a phone-verified account, so you reach real people.",
  },
  {
    icon: Icon.Search,
    title: "Search by skill & area",
    text: "Filter talent and jobs by area, shift, role and skill to find the right match fast.",
  },
  {
    icon: Icon.Users,
    title: "Built for both sides",
    text: "Factories post and hire; workers build a profile, apply, and track every application.",
  },
];

const WORKER_STEPS = [
  "Create a worker profile with your skills and preferred area",
  "Browse open factory jobs near you",
  "Apply in one tap and track your application status",
];
const FACTORY_STEPS = [
  "Register your factory and post a job in minutes",
  "Search verified worker talent or review applicants",
  "Shortlist and hire — all from one dashboard",
];

function Stat({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">{value}</div>
      <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const isFactory = user?.type === "factory";
  const isWorker = user?.type === "worker";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    listJobs()
      .then(({ items }) => active && setJobs(items))
      .catch(() => active && setFailed(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const liveCount = jobs.length;

  return (
    <>
      <Seo path="/" />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950" />
        <div
          className="absolute inset-0 -z-10 opacity-[0.4] dark:opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(47,132,247,0.18), transparent 40%), radial-gradient(circle at 80% 0%, rgba(26,102,237,0.16), transparent 35%)",
          }}
        />
        <div className="container-page py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
            <Pill tone="brand" className="mb-5">
              <Icon.Bolt className="mr-1 h-3.5 w-3.5" /> Hiring made simple for factories
            </Pill>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Hire factory workers.
              <br />
              <span className="text-gradient-accent">Find factory jobs.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Sketu connects factories with skilled and semi-skilled workers. Post jobs, search
              verified talent, apply in seconds, and hire faster — built for the industrial
              workforce.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to={isWorker ? "/dashboard" : "/jobs"} className="btn-accent w-full sm:w-auto">
                {isWorker ? "My dashboard" : "Browse jobs"} <Icon.ArrowRight className="h-4 w-4" />
              </Link>
              <Link to={isFactory ? "/dashboard" : "/register"} className="btn-secondary w-full sm:w-auto">
                {isFactory ? "Go to dashboard" : "Post a job"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live stats — real number pulled from the API */}
      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="container-page grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
          <Stat value={loading ? "…" : `${liveCount}`} label="Open jobs right now" />
          <Stat value="2" label="Sides of the market" />
          <Stat value="100%" label="Phone-verified users" />
          <Stat value="₹0" label="To create an account" />
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Everything you need to hire and get hired
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              A focused platform that does one thing well: connect factories with the workers they
              need.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="card card-hover p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — both sides */}
      <section className="section bg-white dark:bg-slate-950">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              How Sketu works
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              Two simple journeys — one for workers, one for factories.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {[
              { title: "For workers", steps: WORKER_STEPS, icon: Icon.Users, cta: "/register" },
              { title: "For factories", steps: FACTORY_STEPS, icon: Icon.Briefcase, cta: "/register" },
            ].map((col) => (
              <div key={col.title} className="card p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
                    <col.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{col.title}</h3>
                </div>
                <ol className="mt-6 space-y-4">
                  {col.steps.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                        {i + 1}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-300">{step}</span>
                    </li>
                  ))}
                </ol>
                <Link to={col.cta} className="btn-secondary mt-7">
                  Get started <Icon.ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest jobs — dynamic from MongoDB */}
      <section className="section">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Latest openings
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Fresh factory jobs, pulled live from the Sketu network.
              </p>
            </div>
            <Link to="/jobs" className="hidden shrink-0 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400 sm:inline-flex sm:items-center sm:gap-1">
              View all <Icon.ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : failed || jobs.length === 0 ? (
              <div className="sm:col-span-2 lg:col-span-3">
                <EmptyState
                  icon={Icon.Briefcase}
                  title={failed ? "Couldn't load jobs" : "No open jobs yet"}
                  message={
                    failed
                      ? "Make sure the backend API is running, then refresh."
                      : "Check back soon — new factory jobs are posted regularly."
                  }
                  action={
                    <Link to="/register" className="btn-primary">
                      Post the first job
                    </Link>
                  }
                />
              </div>
            ) : (
              jobs.slice(0, 6).map((job) => <JobCard key={job.id} job={job} />)
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section pt-0">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-brand-600 px-8 py-14 text-center shadow-xl sm:px-16">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 15% 20%, #fff, transparent 25%), radial-gradient(circle at 85% 80%, #fff, transparent 25%)",
              }}
            />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to get started?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-brand-50">
                Create a free account and post your first job or build your worker profile today.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="btn w-full bg-white font-bold text-accent-700 hover:bg-accent-50 sm:w-auto"
                >
                  {isAuthenticated ? "Go to dashboard" : "Create free account"}
                </Link>
                <Link to="/jobs" className="btn w-full border border-white/40 font-semibold text-white hover:bg-white/10 sm:w-auto">
                  Explore jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
