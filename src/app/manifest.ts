import type { MetadataRoute } from 'next'
import { getTranslations } from '@/i18n/server'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    const t = await getTranslations('metadata.manifest')
    return {
        name: t('name'),
        short_name: t('shortName'),
        description: t('description'),
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
