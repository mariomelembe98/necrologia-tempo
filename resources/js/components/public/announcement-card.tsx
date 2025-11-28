import { Link } from '@inertiajs/react';
import { ArrowRight, Bell, Calendar, Heart, MapPin, User } from 'lucide-react';

import { type Announcement } from '@/context/AnnouncementContext';

type AnnouncementCardVariant = 'default' | 'compact';

interface AnnouncementCardProps {
    announcement: Announcement;
    variant?: AnnouncementCardVariant;
}

export function AnnouncementCard({
    announcement,
    variant = 'default',
}: AnnouncementCardProps) {
    const formatDate = (value: string) =>
        new Date(value).toLocaleDateString('pt-PT');

    const initials = (() => {
        const parts = announcement.name.trim().split(/\s+/);
        const first = parts[0]?.[0] ?? '';
        const second = parts[1]?.[0] ?? '';

        return (first + second).toUpperCase();
    })();

    const age = (() => {
        if (!announcement.dateOfBirth) {
            return null;
        }

        const birth = new Date(announcement.dateOfBirth);
        const death = new Date(announcement.dateOfDeath);

        return death.getFullYear() - birth.getFullYear();
    })();

    const baseCardClasses =
        'block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 rounded-2xl';

    if (variant === 'compact') {
        return (
            <Link
                href={`/anuncio/${announcement.slug}`}
                className={`${baseCardClasses} group`}
            >
                <article className="flex gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition hover:border-slate-300 hover:shadow-lg">
                    <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow ${
                            announcement.type === 'homenagem'
                                ? 'bg-rose-500'
                                : 'bg-blue-500'
                        }`}
                    >
                        {announcement.photoUrl ? (
                            <img
                                src={announcement.photoUrl}
                                alt={announcement.name}
                                className="h-14 w-14 rounded-2xl object-cover shadow-inner"
                            />
                        ) : (
                            <span className="text-lg font-semibold">
                                {initials}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
                            <span>
                                {announcement.type === 'homenagem'
                                    ? 'Homenagem'
                                    : 'Comunicado'}
                            </span>
                            <span>{age ? `${age} anos` : '– anos'}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900">
                            {announcement.name}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2">
                            {announcement.description}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{announcement.location}</span>
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    return (
        <Link
            href={`/anuncio/${announcement.slug}`}
            className={baseCardClasses}
        >
            <article className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all h-full flex flex-col">
                <div
                    className={`p-4 border-b ${
                        announcement.type === 'homenagem'
                            ? 'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200'
                            : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
                    }`}
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <div
                                    className={`p-1.5 rounded-lg ${
                                        announcement.type === 'homenagem'
                                            ? 'bg-rose-200'
                                            : 'bg-blue-200'
                                    }`}
                                >
                                    {announcement.type === 'homenagem' ? (
                                        <Heart className="w-4 h-4 text-rose-700" />
                                    ) : (
                                        <Bell className="w-4 h-4 text-blue-700" />
                                    )}
                                </div>
                                <span
                                    className={
                                        announcement.type === 'homenagem'
                                            ? 'text-rose-700 text-xs font-medium'
                                            : 'text-blue-700 text-xs font-medium'
                                    }
                                >
                                    {announcement.type === 'homenagem'
                                        ? 'Homenagem'
                                        : 'Comunicado'}
                                </span>
                            </div>

                            <h3 className="text-base font-semibold text-slate-900 leading-snug truncate">
                                {announcement.name}
                            </h3>
                            {age && (
                                <p className="text-sm text-slate-600 mt-0.5">
                                    {age} anos
                                </p>
                            )}
                        </div>

                        <div className="flex-shrink-0 flex items-center justify-center">
                            {announcement.photoUrl ? (
                                <div className="h-20 w-20 rounded-full border-2 border-white shadow-md overflow-hidden bg-slate-200">
                                    <img
                                        src={announcement.photoUrl}
                                        alt={announcement.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div
                                    className={`h-20 w-20 rounded-full border-2 border-white shadow-md flex items-center justify-center text-sm font-semibold ${
                                        announcement.type === 'homenagem'
                                            ? 'bg-rose-500/90 text-white'
                                            : 'bg-blue-500/90 text-white'
                                    }`}
                                >
                                    {initials}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="p-1.5 bg-slate-100 rounded-lg">
                            <Calendar className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Data</div>
                            <div className="text-slate-900">
                                {announcement.dateOfBirth && (
                                    <>
                                        <span>
                                            {formatDate(
                                                announcement.dateOfBirth,
                                            )}
                                        </span>
                                        <span className="mx-1">–</span>
                                    </>
                                )}
                                <span>
                                    {formatDate(announcement.dateOfDeath)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="p-1.5 bg-slate-100 rounded-lg">
                            <MapPin className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Local</div>
                            <div className="text-slate-900">
                                {announcement.location}
                            </div>
                        </div>
                    </div>


                    <p className="text-sm text-slate-700 leading-relaxed line-clamp-3 pt-1">
                        {announcement.description}
                    </p>

                    <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5" />
                            <span>{announcement.author}</span>
                        </div>
                        <div className="text-emerald-500 font-semibold flex items-center gap-1">
                            Ver detalhes
                            <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
