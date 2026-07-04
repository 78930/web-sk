import { useState } from "react";
import Seo from "../components/ui/Seo";
import Icon from "../components/ui/Icons";
import { TextField, TextArea } from "../components/ui/Field";

const CONTACTS = [
  { icon: Icon.Mail, label: "Email", value: "hello@sketu.in" },
  { icon: Icon.MapPin, label: "Based in", value: "Jeedimetla, Hyderabad" },
  { icon: Icon.Clock, label: "Response time", value: "Within 24 hours" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    // No public contact endpoint exists in the backend; this captures intent
    // client-side. Wire to an API route or email service when available.
    setSent(true);
  };

  return (
    <>
      <Seo title="Contact" path="/contact" description="Get in touch with the Sketu team." />

      <section className="border-b border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-950">
        <div className="container-page text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Get in touch
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-300">
            Questions, feedback or partnership ideas? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            {CONTACTS.map((c) => (
              <div key={c.label} className="card flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                  <c.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">{c.label}</div>
                  <div className="font-semibold text-slate-900 dark:text-white">{c.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            <div className="card p-8">
              {sent ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
                    <Icon.CheckCircle className="h-7 w-7" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Thanks, {form.name || "there"}!</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Your message has been noted. We'll get back to you soon.
                  </p>
                  <button onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }} className="btn-secondary mt-6">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField label="Your name" value={form.name} onChange={set("name")} placeholder="Full name" required />
                    <TextField label="Email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" required />
                  </div>
                  <TextArea label="Message" value={form.message} onChange={set("message")} placeholder="How can we help?" rows={6} required />
                  <button type="submit" className="btn-primary w-full sm:w-auto">
                    Send message <Icon.ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
