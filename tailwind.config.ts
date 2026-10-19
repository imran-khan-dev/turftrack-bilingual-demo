import type { Config } from "tailwindcss";

const config: Config = {
    theme: {
        extend: {
            fontFamily: {
                barlow: ["var(--font-barlow)"],
                helvetica: ["Helvetica", "Arial", "sans-serif"],
                proxima: ["var(--font-proxima)"],
            },
        },
    },
};

export default config;