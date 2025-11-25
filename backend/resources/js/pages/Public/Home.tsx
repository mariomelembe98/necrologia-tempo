import { Head } from '@inertiajs/react';

import Home from '@/components/public/home';
import PublicLayout from '@/layouts/public-layout';
import { type Announcement } from '@/context/AnnouncementContext';

interface PublicHomePageProps {
    announcements: Announcement[];
}

export default function PublicHomePage({
    announcements,
}: PublicHomePageProps) {
    return (
        <PublicLayout announcements={announcements}>
            <Head title="Inicio" />
            <Home />
        </PublicLayout>
    );
}

