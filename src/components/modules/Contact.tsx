"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MessageCircle,
  Clock,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import { useTranslations } from "next-intl";


export default function Contact() {
  const t = useTranslations("marketing.contact");
  return (
    <main className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* --- NAVIGATION / BACK LINK --- */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("back")}
          </Link>
        </div>

        {/* --- PAGE HEADER --- */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-200/60 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-xs font-semibold tracking-wider text-green-600 uppercase">
              {t("badge")}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {t("title")}
          </h1>

          <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
            {t("description")}
          </p>
        </div>

        {/* --- DIRECT CONTACT CARDS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Phone Call Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
              <Phone className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t("phone")}
              </h3>
              <p className="text-base font-bold text-slate-900">
                +880 1303-196324
              </p>
              <p className="text-xs text-slate-500">
                {t("hours")}
              </p>
            </div>
            <a
              href="tel:+8801700000000"
              className="inline-flex items-center justify-center h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors w-full"
            >
              {t("call")}
            </a>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-200/60 flex items-center justify-center text-green-600">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t("whatsapp")}
              </h3>
              <p className="text-base font-bold text-slate-900">
                +880 1303-196324
              </p>
              <p className="text-xs text-slate-500">
                {t("whatsappHint")}
              </p>
            </div>
            <a
              href="https://wa.me/8801303196324"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-10 px-4 bg-green-500 hover:bg-green-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors w-full"
            >
              {t("messageWhatsApp")}
            </a>
          </div>

          {/* Email Support Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t("email")}
              </h3>
              <p className="text-base font-bold text-slate-900">
                support@turftrack.pro
              </p>
              <p className="text-xs text-slate-500">
                {t("emailHint")}
              </p>
            </div>
            <a
              href="mailto:support@turftrack.com"
              className="inline-flex items-center justify-center h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors w-full"
            >
              {t("sendEmail")}
            </a>
          </div>

          {/* Working Hours Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
              <Clock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t("supportHours")}
              </h3>
              <p className="text-sm font-bold text-slate-900">
                {t("week")}
              </p>
              <p className="text-xs text-slate-500">{t("businessHours")}</p>
            </div>
            <div className="h-10 border border-slate-200 rounded-xl flex items-center justify-center bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {t("desk")}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
