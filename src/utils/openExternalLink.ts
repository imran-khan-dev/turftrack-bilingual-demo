"use client";

import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";

export async function openExternalLink(url: string) {
    if (Capacitor.isNativePlatform()) {
        // Open outside the Capacitor WebView
        await Browser.open({ url });
    } else {
        // Normal browser → new tab
        window.open(url, "_blank", "noopener,noreferrer");
    }
}