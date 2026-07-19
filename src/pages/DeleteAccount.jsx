import Seo from "../components/ui/Seo";

export default function DeleteAccount() {
  return (
    <>
      <Seo
        title="Delete Account"
        path="/delete-account"
        description="Instructions to delete your Sketu account and all associated personal data."
      />
      <section className="section">
        <div className="container-page">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Delete Your Account</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                You can request permanent deletion of your Sketu account and all associated data at any time.
              </p>
            </div>

            <div className="card p-8 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">What gets deleted</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {[
                    "Your account (name, phone number, email, password)",
                    "Your worker or factory profile",
                    "All job applications you submitted",
                    "All hire offers sent or received",
                    "Uploaded identity documents (Aadhaar, PAN, etc.)",
                    "Profile photo",
                    "Push notification token",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 flex items-center justify-center text-xs">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">How to request deletion</h2>
                <div className="mt-3 space-y-4 text-sm text-slate-600 dark:text-slate-300">
                  <p>Send an email to <strong className="text-slate-900 dark:text-white">info.sketu@gmail.com</strong> with the subject line:</p>
                  <div className="rounded-xl bg-slate-100 px-4 py-3 font-mono text-sm dark:bg-slate-800">
                    Account Deletion Request — [your registered phone number]
                  </div>
                  <p>Include in the email body:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your full name as registered on Sketu</li>
                    <li>Your registered phone number</li>
                    <li>Reason for deletion (optional)</li>
                  </ul>
                  <p>We will permanently delete your account and all associated data within <strong className="text-slate-900 dark:text-white">30 days</strong> of receiving your request. You will receive a confirmation email once the deletion is complete.</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Data we may retain</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  We may retain anonymised, aggregated usage data (with no personally identifiable information) for analytics. We may also retain data where required by Indian law.
                </p>
              </div>

              <div className="rounded-xl bg-brand-50 p-4 dark:bg-brand-900/20">
                <p className="text-sm text-brand-700 dark:text-brand-300">
                  <strong>Contact:</strong>{" "}
                  <a href="mailto:info.sketu@gmail.com" className="underline hover:no-underline">
                    info.sketu@gmail.com
                  </a>
                  {" "}· We respond within 7 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
