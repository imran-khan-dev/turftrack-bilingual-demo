import Link from "next/link";
import {
  Database,
  Share2,
  Bell,
  Lock,
  UserX,
  Mail,
  ArrowLeft,
  LockKeyhole,
} from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.privacy");
  return {
    title: t("title"), description: t("description"),
    openGraph: { title: t("title"), description: t("description"), type: "website" },
    twitter: { card: "summary", title: t("title"), description: t("description") },
    robots: { index: true, follow: true },
  };
}

export default function PrivacyPolicyPage() {
  const lastUpdated = "August 22, 2026";

  return (
    <main className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* --- NAVIGATION / BACK LINK --- */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* --- PAGE HEADER --- */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-200/60 flex items-center justify-center shrink-0">
              <LockKeyhole className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-xs font-semibold tracking-wider text-green-600 uppercase">
              Data & Privacy
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>

          <p className="text-sm text-slate-500 leading-relaxed">
            At Turf Track, we value your trust and are committed to protecting
            your personal information. This Privacy Policy outlines how we
            collect, use, and safeguard your data.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
            <span>Last updated:</span>
            <span className="font-medium text-slate-600">{lastUpdated}</span>
          </div>
        </div>

        {/* --- PRIVACY SECTIONS --- */}
        <div className="space-y-6">
          {/* Section 1 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                <Database className="w-4 h-4 text-slate-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                1. Information We Collect
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              We collect necessary information to provide seamless booking
              services between players and turf businesses:
            </p>
            <ul className="text-sm text-slate-600 space-y-2 leading-relaxed list-disc list-inside">
              <li>
                <strong className="text-slate-800">Account Information:</strong>{" "}
                Your full name, email address, phone number, and user role.
              </li>
              <li>
                <strong className="text-slate-800">Booking Records:</strong>{" "}
                Reserved slots, venue choices, booking dates, payment statuses,
                and transaction history.
              </li>
              <li>
                <strong className="text-slate-800">Device & Usage Data:</strong>{" "}
                IP addresses, browser/device specifications, and app interaction
                logs to optimize platform performance.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                <Share2 className="w-4 h-4 text-slate-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                2. Information Sharing with Turf Venues
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              To fulfill slot reservations, Turf Track shares relevant booking
              details with the specific turf business where you reserve a slot:
            </p>
            <ul className="text-sm text-slate-600 space-y-2 leading-relaxed list-disc list-inside">
              <li>
                <strong className="text-slate-800">Player Verification:</strong>{" "}
                Your name and phone number are visible to venue management to
                verify entry at the ground.
              </li>
              <li>
                <strong className="text-slate-800">
                  Direct Financial Settlement:
                </strong>{" "}
                In cases of venue-approved refunds, your contact information
                allows turf managers to disburse funds directly via cash or
                mobile transfer.
              </li>
              <li>
                We{" "}
                <span className="font-semibold text-slate-900">never sell</span>{" "}
                your personal data to third-party advertisers.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 text-slate-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                3. SMS & In-App Notifications
              </h2>
            </div>
            <ul className="text-sm text-slate-600 space-y-2 leading-relaxed list-disc list-inside">
              <li>
                We use your registered phone number to send automated
                transactional updates, including booking confirmations, slot
                cancellation updates, and refund status notifications (e.g.,
                Pending, Approved, Refunded).
              </li>
              <li>
                You can manage your notification preferences within your app
                account settings.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-slate-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                4. Data Protection & Security
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              We employ industry-standard security controls to keep your data
              safe. All user credentials and database communication are
              encrypted in transit and at rest. Access to backend administration
              tools is restricted strictly to authorized platform personnel.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                <UserX className="w-4 h-4 text-slate-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                5. User Rights & Account Deletion
              </h2>
            </div>
            <ul className="text-sm text-slate-600 space-y-2 leading-relaxed list-disc list-inside">
              <li>
                <strong className="text-slate-800">Access & Update:</strong> You
                can review and update your profile information at any time
                within your account dashboard.
              </li>
              <li>
                <strong className="text-slate-800">Account Removal:</strong> You
                may request complete deletion of your account and personal
                history by reaching out to our privacy support team.
              </li>
            </ul>
          </section>

          {/* Section 6 - Contact */}
          <section className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-green-400" />
              </div>
              <h2 className="text-base font-semibold">6. Privacy Enquiries</h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              If you have questions or concerns regarding our privacy practices
              or data handling, reach out to us at:
            </p>
            <div className="text-sm text-green-400 font-medium">
              privacy@turftrack.pro
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
