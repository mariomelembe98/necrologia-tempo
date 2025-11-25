import {
    AnnouncementProvider,
    type Announcement,
} from '@/context/AnnouncementContext';
import PublicHeader from '@/components/public/header';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

export default function PublicLayout({
    children,
    announcements,
}: {
    children: ReactNode;
    announcements?: Announcement[];
}) {
    const { flash } = usePage<{ flash?: { success?: string } }>().props;

    return (
        <AnnouncementProvider initialAnnouncements={announcements}>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                <PublicHeader />
                <main className="pb-12">
                    {flash?.success && (
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 px-4 py-3 text-sm shadow-sm">
                                {flash.success}
                            </div>
                        </div>
                    )}
                    {children}
                </main>
                <footer className="mt-8 border-t border-slate-200/70 bg-white/80">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <p className="text-sm sm:text-base text-slate-500 text-center">
                            As informações publicadas são de responsabilidade das famílias,
                            amigos ou empresas funerárias que as enviam. A Tempo actua como
                            meio de divulgação.
                        </p>
                    </div>
                </footer>
            </div>
        </AnnouncementProvider>
    );
}
