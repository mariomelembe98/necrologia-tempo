import { Head } from '@inertiajs/react';

import SearchPage from '@/components/public/search-page';
import PublicLayout from '@/layouts/public-layout';
import { type Announcement } from '@/context/AnnouncementContext';

interface ComunicadosPageProps {
    announcements: Announcement[];
}

export default function ComunicadosPage({
    announcements,
}: ComunicadosPageProps) {
    return (
        <PublicLayout announcements={announcements}>
            <Head title="Comunicados" />
            <SearchPage type="comunicado" />
        </PublicLayout>
    );
}
