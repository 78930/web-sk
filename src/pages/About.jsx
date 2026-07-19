import { Link } from "react-router-dom";
import Seo from "../components/ui/Seo";
import Icon from "../components/ui/Icons";

const VALUES = [
  { icon: Icon.Shield, title: "Trust first", text: "Phone-verified accounts on both sides keep the network real and accountable." },
  { icon: Icon.Bolt, title: "Speed", text: "Hiring and getting hired should take days, not weeks. We remove the friction." },
  { icon: Icon.Users, title: "Built for everyone", text: "Designed to be simple enough for any worker, in any language, on any phone." },
];

export default function About() {
  return (
    <>
      <Seo
        title="About"
        path="/about"
        description="Sketu is a hiring platform built for factories and the industrial workforce in India. Learn our story and mission."
        keywords="about Sketu, industrial hiring platform India, factory recruitment app, Sketu mission"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Sketu",
          "url": "https://www.sketu.in/about",
          "description": "Sketu is a hiring platform built for factories and the industrial workforce in India."
        }}
      />

      <section className="relative overflow-hidden border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="container-page py-20 text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            We're connecting factories with the workforce that powers them
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Sketu exists to make industrial hiring fair, fast and transparent — giving workers
            direct access to opportunities and giving factories a faster path to the right people.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Our mission</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              Across India's industrial belts, factories struggle to find reliable workers and
              workers struggle to find steady jobs — often relying on word of mouth and middlemen.
              Sketu replaces that with a simple, direct marketplace.
            </p>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              Workers create a profile once and apply to as many jobs as they like. Factories post
              roles and reach verified, open-to-work talent in their area instantly. No fees to
              sign up, no barriers to entry.
            </p>
            <div className="mt-8 flex gap-3">
              <Link to="/register" className="btn-primary">Join Sketu</Link>
              <Link to="/features" className="btn-secondary">How it works</Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { k: "Workers", v: "Profile + apply", icon: Icon.Users },
              { k: "Factories", v: "Post + hire", icon: Icon.Briefcase },
              { k: "Verification", v: "Phone OTP", icon: Icon.Phone },
              { k: "Cost to join", v: "Free", icon: Icon.Wallet },
            ].map((c) => (
              <div key={c.k} className="card p-6">
                <c.icon className="h-7 w-7 text-brand-600 dark:text-brand-400" />
                <div className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{c.v}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{c.k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white pt-0 dark:bg-slate-950">
        <div className="container-page">
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            What we value
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="card p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
