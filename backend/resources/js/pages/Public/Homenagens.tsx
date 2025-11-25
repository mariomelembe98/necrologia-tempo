import { Head } from '@inertiajs/react';

import SearchPage from '@/components/public/search-page';
import PublicLayout from '@/layouts/public-layout';
import { type Announcement } from '@/context/AnnouncementContext';

interface HomenagensPageProps {
    announcements: Announcement[];
}

export default function HomenagensPage({
    announcements,
}: HomenagensPageProps) {
    return (
        <PublicLayout announcements={announcements}>
            <Head title="Homenagens" />
            <SearchPage type="homenagem" />
        </PublicLayout>
    );
}

