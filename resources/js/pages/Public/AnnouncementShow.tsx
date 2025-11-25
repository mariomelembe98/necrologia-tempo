import { Head } from '@inertiajs/react';

import AnnouncementDetail from '@/components/public/announcement-detail';
import PublicLayout from '@/layouts/public-layout';
import { type Announcement } from '@/context/AnnouncementContext';

interface AnnouncementShowPageProps {
    slug: string;
    announcements: Announcement[];
}

export default function AnnouncementShowPage({
    slug,
    announcements,
}: AnnouncementShowPageProps) {
    const announcement =
        announcements.find((item) => item.slug === slug) ?? announcements[0];

    const title = announcement
        ? `Tempo Necrologia - ${announcement.name}`
        : 'Anuncio';

    const description =
        announcement && (announcement.dateOfBirth || announcement.dateOfDeath)
            ? `${announcement.name} - ${announcement.dateOfBirth ?? ''} ${
                  announcement.dateOfBirth && announcement.dateOfDeath ? '-' : ''
              } ${announcement.dateOfDeath ?? ''}`.trim()
            : announcement?.description ??
              announcement?.name ??
              'Anuncio no Tempo Necrologia.';

    const image = announcement?.photoUrl ?? '/images/share-default.jpg';
    const url =
        typeof window !== 'undefined' ? window.location.href : undefined;

    return (
        <PublicLayout announcements={announcements}>
            <Head title={title}>
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:type" content="website" />
                {url && <meta property="og:url" content={url} />}
                <meta property="og:image" content={image} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <AnnouncementDetail />
        </PublicLayout>
    );
}

