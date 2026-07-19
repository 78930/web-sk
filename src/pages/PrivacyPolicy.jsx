import Seo from "../components/ui/Seo";

const EFFECTIVE_DATE = "19 July 2026";

const sections = [
  {
    title: "1. Who We Are",
    body: `Sketu ("we", "our", or "us") is an industrial job-matching platform operated in India. We connect job seekers (workers) with employers (factories and industrial businesses) through our Android app and website. For any privacy-related questions, contact us at info.sketu@gmail.com.`,
  },
  {
    title: "2. Information We Collect",
    body: `We collect the following personal information when you create an account or use Sketu:

Account details: name, mobile number, email address, and password (stored as a secure hash — we never store your plain-text password).

Worker profile: headline, years of experience, preferred work areas, preferred roles and shifts, salary expectations, skills, certifications, and availability status.

Employer/factory profile: company name, HR name, industrial areas of operation, company size, and a company description.

Identity documents (optional, for verification): Aadhaar card, PAN card, driving licence, bank passbook, or resume/CV. These are stored as encrypted images and are used only for identity verification by our team.

Profile photo: an optional photo you upload to your profile.

Usage data: pages visited, jobs viewed, applications submitted, and general interaction data used to improve the platform.

Device information: device type, operating system version, and push notification token (for job alerts).`,
  },
  {
    title: "3. How We Collect Your Information",
    body: `We collect information directly from you when you:
• Register an account using your name and mobile number with a password, or via OTP verification.
• Fill in your worker or factory profile.
• Apply for a job or post a job listing.
• Upload documents for identity verification.
• Contact us through the app or by email.`,
  },
  {
    title: "4. How We Use Your Information",
    body: `We use your information to:
• Create and manage your account.
• Match workers with relevant job listings and show employers suitable candidates.
• Display your worker or employer profile to the other party when you apply for a job or are shortlisted.
• Send push notifications and alerts about application updates, hire offers, and new job listings.
• Verify identity documents submitted for worker verification.
• Improve the app based on usage patterns.
• Respond to support queries.
• Comply with applicable Indian laws and regulations.`,
  },
  {
    title: "5. How We Share Your Information",
    body: `We do not sell your personal data. We share information only in these circumstances:

With employers: When you apply for a job, your worker profile (name, skills, experience, contact number, and verification status) is shared with the employer who posted that job.

With workers: When an employer shortlists you or sends a hire offer, their company name and contact details are shared with you.

With service providers: We use third-party services for hosting (Render), cloud infrastructure, and analytics. These providers process data on our behalf and are bound by confidentiality obligations.

For legal reasons: We may disclose information if required by Indian law, a court order, or to protect the rights and safety of our users.`,
  },
  {
    title: "6. Identity Documents",
    body: `Identity documents (Aadhaar, PAN, driving licence, bank passbook) are sensitive personal information. We store them in encrypted form and restrict access to authorised Sketu team members only. Documents are used solely for the purpose of verifying a worker's identity on the platform. We do not share identity documents with employers or any third party. You may request deletion of your documents at any time by emailing info.sketu@gmail.com.`,
  },
  {
    title: "7. Data Storage and Security",
    body: `Your data is stored on secure servers hosted on Render (cloud infrastructure based in the United States). We use industry-standard security measures including password hashing (bcrypt), HTTPS encryption for all data in transit, and access controls. While we take reasonable precautions, no system is completely secure. Please use a strong password and do not share your account credentials.`,
  },
  {
    title: "8. Data Retention",
    body: `We retain your account and profile data for as long as your account is active. If you request account deletion, we will delete your personal data within 30 days, except where we are required to retain it by law. Anonymised or aggregated usage data may be retained indefinitely for analytics purposes.`,
  },
  {
    title: "9. Your Rights",
    body: `You have the right to:
• Access the personal data we hold about you.
• Correct inaccurate or incomplete data in your profile.
• Request deletion of your account and personal data.
• Withdraw consent for push notifications at any time through your device settings.
• Object to processing of your data in certain circumstances.

To exercise any of these rights, email us at info.sketu@gmail.com. We will respond within 30 days.`,
  },
  {
    title: "10. Children's Privacy",
    body: `Sketu is intended for users aged 18 and above. We do not knowingly collect personal information from anyone under 18. If we become aware that a user is under 18, we will delete their account and data promptly. If you believe a minor has registered, please notify us at info.sketu@gmail.com.`,
  },
  {
    title: "11. Push Notifications",
    body: `We may send push notifications to your device to alert you about new job matches, application status changes, and hire offers. You can disable notifications at any time through your Android device settings (Settings → Apps → Sketu → Notifications).`,
  },
  {
    title: "12. Changes to This Policy",
    body: `We may update this privacy policy from time to time. When we do, we will update the Effective Date at the top of this page. If the changes are significant, we will notify you through the app or by email. Continued use of Sketu after changes are posted means you accept the updated policy.`,
  },
  {
    title: "13. Contact Us",
    body: `If you have any questions, concerns, or requests about this privacy policy or how we handle your data, please contact us:

Email: info.sketu@gmail.com
Platform: Sketu (Android App — Google Play)
Operated in: India`,
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <Seo title="Privacy Policy" path="/privacy-policy" />
      <section className="section">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Effective date: {EFFECTIVE_DATE}
              </p>
            </div>

            <div className="space-y-8">
              {sections.map((s) => (
                <div key={s.title}>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{s.title}</h2>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
