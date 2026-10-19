import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  CalendarX,
  CreditCard,
  UserCheck,
  AlertTriangle,
  Mail,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.terms");
  return {
    title: t("title"), description: t("description"),
    openGraph: { title: t("title"), description: t("description"), type: "website" },
    twitter: { card: "summary", title: t("title"), description: t("description") },
    robots: { index: true, follow: true },
  };
}

export default function TermsofServicePage() {
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
              <FileText className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-xs font-semibold tracking-wider text-green-600 uppercase">
              Legal Agreement
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Terms of Service
          </h1>

          <p className="text-sm text-slate-500 leading-relaxed">
            Please read these terms carefully before using Turf Track. By
            accessing or using our platform, you agree to be bound by these
            policies.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
            <span>Last updated:</span>
            <span className="font-medium text-slate-600">{lastUpdated}</span>
          </div>
        </div>

        {/* --- TERMS SECTIONS --- */}
        <div className="space-y-6">
          {/* Section 1 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-slate-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                1. Platform Role & Scope of Service
              </h2>
            </div>
            <ul className="text-sm text-slate-600 space-y-2 leading-relaxed list-disc list-inside">
              <li>
                <strong className="text-slate-800">
                  Intermediary Platform:
                </strong>{" "}
                Turf Track is a technology application that connects
                independent turf venue businesses with players for slot booking.
              </li>
              <li>
                <strong className="text-slate-800">Facility Operations:</strong>{" "}
                Turf Track does not own, operate, manage, or maintain any
                listed physical turf grounds. Venue maintenance, ground rules,
                and booking fulfillment remain the sole responsibility of the
                respective turf business.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-slate-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                2. Venue-Specific Terms & Booking Rules
              </h2>
            </div>
            <ul className="text-sm text-slate-600 space-y-2 leading-relaxed list-disc list-inside">
              <li>
                Each turf business sets and configures its own operational
                guidelines, slot availability, custom pricing, and ground rules.
              </li>
              <li>
                <strong className="text-slate-800">
                  Public Page Disclosure:
                </strong>{" "}
                Specific terms, cancellation criteria, and policies set by a
                turf business are clearly displayed on that venue&apos;s public
                booking page within the app. Placing a booking indicates
                agreement to that specific venue&apos;s policies.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                <CalendarX className="w-4 h-4 text-slate-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                3. Booking Cancellations
              </h2>
            </div>
            <ul className="text-sm text-slate-600 space-y-2 leading-relaxed list-disc list-inside">
              <li>
                <strong className="text-slate-800">Venue Discretion:</strong>{" "}
                The ability to cancel a confirmed booking is strictly governed
                by the individual turf venue&apos;s configured settings.
              </li>
              <li>
                <strong className="text-slate-800">Time Windows:</strong> If a
                venue enables slot cancellations, the eligible cancellation
                timeframe (e.g., hours prior to slot start) is configured by the
                venue and enforced within the application.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4 text-slate-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                4. Refunds & Financial Disclaimer
              </h2>
            </div>
            <ul className="text-sm text-slate-600 space-y-2 leading-relaxed list-disc list-inside">
              <li>
                <strong className="text-slate-800">Platform Exemption:</strong>{" "}
                Turf Track is{" "}
                <span className="font-semibold text-slate-900">
                  not responsible for processing, approving, or issuing refunds
                </span>
                . All refund decisions remain under the authority of the
                respective venue.
              </li>
              <li>
                <strong className="text-slate-800">
                  Percentages & Payment Mediums:
                </strong>{" "}
                If approved by the venue, refund percentages are determined by
                their custom rules. Refunds are distributed directly by the
                venue through cash, mobile financial services, or direct
                transfer.
              </li>
              <li>
                <strong className="text-slate-800">In-App Tracking:</strong>{" "}
                Turf Track provides tracking tools—including refund status
                lists (Pending, Refunded), notifications, and SMS updates—to
                facilitate clear communication between venues and players.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4 text-slate-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                5. Player Conduct & Venue Compliance
              </h2>
            </div>
            <ul className="text-sm text-slate-600 space-y-2 leading-relaxed list-disc list-inside">
              <li>
                Players must follow all rules established by venue management
                regarding proper sports footwear, arrival times, and ground
                conduct.
              </li>
              <li>
                Intentional damage to venue property or disruptive conduct may
                result in immediate expulsion by venue staff without a refund
                and potential account suspension on Turf Track.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-slate-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                6. Limitation of Liability
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Turf Track is not liable for any operational disputes, financial
              claims, personal injuries, lost belongings, or unfulfilled booking
              commitments arising from interactions between players and
              independent turf businesses.
            </p>
          </section>

          {/* Section 7 - Contact */}
          <section className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-green-400" />
              </div>
              <h2 className="text-base font-semibold">
                7. Support & Questions
              </h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              For platform-related inquiries or technical issues, contact our
              support team:
            </p>
            <div className="text-sm text-green-400 font-medium">
              support@turftrack.pro
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
