import { Link, usePage, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Bell,
    Calendar,
    Heart,
    MapPin,
    User,
    Share2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAnnouncements } from '@/context/AnnouncementContext';

interface PageProps {
    slug: string;
}

export default function AnnouncementDetail() {
    const { slug } = usePage<PageProps>().props;
    const { announcements } = useAnnouncements();

    const announcement = announcements.find((a) => a.slug === slug);

    if (!announcement) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-white rounded-2xl border-2 border-slate-200 p-10 shadow-lg">
                        <h1 className="text-xl font-semibold text-slate-900 mb-3">
                            Anúncio não encontrado
                        </h1>
                        <p className="text-sm text-slate-600 mb-6">
                            O anúncio que você procura não existe ou já foi
                            removido.
                        </p>
                        <Link href="/">
                            <Button>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Voltar para início
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const formatDate = (value: string, withText = false) =>
        new Date(value).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: withText ? 'long' : 'numeric',
            year: 'numeric',
        });

    const initials = (() => {
        const parts = announcement.name.trim().split(/\s+/);
        const first = parts[0]?.[0] ?? '';
        const second = parts[1]?.[0] ?? '';

        return (first + second).toUpperCase();
    })();

    const age = (() => {
        if (!announcement.dateOfBirth || !announcement.dateOfDeath) {
            return null;
        }

        const birth = new Date(announcement.dateOfBirth);
        const death = new Date(announcement.dateOfDeath);

        if (
            Number.isNaN(birth.getTime()) ||
            Number.isNaN(death.getTime()) ||
            death < birth
        ) {
            return null;
        }

        let years = death.getFullYear() - birth.getFullYear();
        const hasNotHadBirthdayThisYear =
            death.getMonth() < birth.getMonth() ||
            (death.getMonth() === birth.getMonth() &&
                death.getDate() < birth.getDate());

        if (hasNotHadBirthdayThisYear) {
            years -= 1;
        }

        return years;
    })();

    const handleBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            router.visit('/');
        }
    };

    const handleShare = () => {
        const url = window.location.href;

        if (navigator.share) {
            navigator
                .share({
                    title: `Tempo Necrologia - ${announcement.name}`,
                    text: announcement.description,
                    url,
                })
                .catch(() => {});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(url).catch(() => {});
            alert('Link copiado para a área de transferência.');
        }
    };

    const isTribute = announcement.type === 'homenagem';

    const buildShareText = () => {
        const url = window.location.href;
        const lines: string[] = [];

        lines.push(
            isTribute
                ? 'Homenagem em memoria de'
                : 'Comunicado de falecimento de',
        );
        lines.push(announcement.name);

        if (announcement.dateOfBirth && announcement.dateOfDeath) {
            lines.push(
                `${formatDate(announcement.dateOfBirth)} - ${formatDate(
                    announcement.dateOfDeath,
                )}`,
            );
        } else if (announcement.dateOfDeath) {
            lines.push(formatDate(announcement.dateOfDeath));
        }

        lines.push('');
        lines.push(`Ver anuncio completo: ${url}`);

        return lines.join('\n');
    };

    const handleShareWhatsApp = () => {
        const text = buildShareText();
        const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

        window.open(shareUrl, '_blank', 'noopener,noreferrer');
    };

    const handleShareFacebook = () => {
        const url = window.location.href;
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url,
        )}`;

        window.open(shareUrl, '_blank', 'noopener,noreferrer');
    };

    const recentAnnouncements = announcements
        .filter((item) => item.slug !== slug)
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        )
        .slice(0, 5);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
            <div className="relative h-80 sm:h-96 overflow-hidden">
                <div className="absolute inset-0">
                    {announcement.photoUrl ? (
                        <img
                            src={announcement.photoUrl}
                            alt={`Foto de ${announcement.name}`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div
                            className={`w-full h-full ${
                                isTribute
                                    ? 'bg-gradient-to-br from-rose-200 via-rose-100 to-pink-100'
                                    : 'bg-gradient-to-br from-blue-200 via-blue-100 to-cyan-100'
                            }`}
                        />
                    )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/20 to-slate-50/90" />

                <div className="absolute top-6 left-0 right-0 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            className="border border-white/70 bg-white/10 text-white shadow-lg backdrop-blur-sm hover:bg-white/20 hover:text-white"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={handleShare}
                                className="inline-flex border border-white/70 bg-white/10 text-white shadow-lg backdrop-blur-sm hover:bg-white/20 hover:text-white"
                            >
                                <Share2 className="w-4 h-4 mr-0 sm:mr-2" />
                                <span className="hidden sm:inline">
                                    Compartilhar
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-6 left-0 right-0 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto flex justify-between items-end">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 drop-shadow-md">
                                {announcement.name}
                            </h1>
                            {age && (
                                <p className="text-sm text-gray-900/90 mt-1 drop-shadow">
                                    {age} anos
                                </p>
                            )}
                        </div>

                        <div
                            className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border border-white/10 ${
                                isTribute
                                    ? 'bg-rose-600/90 text-white'
                                    : 'bg-blue-600/90 text-white'
                            }`}
                        >
                            {isTribute ? (
                                <Heart className="w-5 h-5" />
                            ) : (
                                <Bell className="w-5 h-5" />
                            )}
                            <span className="font-medium">
                                {isTribute ? 'Homenagem' : 'Comunicado'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-16">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,0.9fr)] items-start">
                <article className="bg-white rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden">
                    <div className="p-6 sm:p-10 lg:p-12">
                        <div className="mb-8 pb-6 border-b border-slate-100 lg:flex lg:items-start lg:gap-6">
                            <div className="hidden lg:block w-full max-w-xs lg:mr-6">
                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                                    {announcement.photoUrl ? (
                                        <img
                                            src={announcement.photoUrl}
                                            alt={`Foto de ${announcement.name}`}
                                            className="aspect-[4/5] w-full object-cover"
                                        />
                                    ) : (
                                        <div
                                            className={`aspect-[4/5] w-full flex items-center justify-center text-3xl font-semibold ${
                                                isTribute
                                                    ? 'bg-rose-100 text-rose-700'
                                                    : 'bg-blue-100 text-blue-700'
                                            }`}
                                        >
                                            {initials}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1">
                                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
                                    {announcement.name}
                                </h1>

                                {age && (
                                    <p className="text-sm text-slate-700">
                                        {age} anos
                                    </p>
                                )}

                                <div className="mt-4 grid sm:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-xl bg-slate-100">
                                            <Calendar className="w-5 h-5 text-slate-700" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 mb-1">
                                                Datas
                                            </div>
                                            <div className="text-sm text-slate-900 space-y-0.5">
                                                {announcement.dateOfBirth && (
                                                    <div>
                                                        Nascimento:{' '}
                                                        {formatDate(
                                                            announcement.dateOfBirth,
                                                        )}
                                                    </div>
                                                )}
                                                <div>
                                                    Falecimento:{' '}
                                                    {formatDate(
                                                        announcement.dateOfDeath,
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-xl bg-slate-100">
                                            <MapPin className="w-5 h-5 text-slate-700" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 mb-1">
                                                Local
                                            </div>
                                            <div className="text-sm text-slate-900">
                                                {announcement.location}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <section className="mb-8">
                            <h2 className="text-sm font-semibold text-slate-900 mb-2">
                                {isTribute
                                    ? 'Mensagem de homenagem'
                                    : 'Informações do comunicado'}
                            </h2>
                            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line bg-slate-50 border border-slate-200 rounded-xl p-4">
                                {announcement.description}
                            </p>
                        </section>

                        <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 pt-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-xl bg-slate-100">
                                    <User className="w-5 h-5 text-slate-700" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">
                                        Publicado por
                                    </div>
                                    <div className="text-sm text-slate-900">
                                        {announcement.author}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">
                                        Publicado em{' '}
                                        {formatDate(
                                            announcement.createdAt,
                                            true,
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </article>

                {recentAnnouncements.length > 0 && (
                    <aside className="hidden lg:block space-y-4">
                        <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                            <h2 className="text-sm font-semibold text-slate-900">
                                Ultimos anuncios
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Veja outras homenagens e comunicados publicados recentemente.
                            </p>
                            <div className="mt-4 space-y-3">
                                {recentAnnouncements.map((item) => {
                                    const initials = item.name
                                        .trim()
                                        .split(/\s+/)
                                        .slice(0, 2)
                                        .map((part) => part[0] ?? '')
                                        .join('')
                                        .toUpperCase();

                                    return (
                                        <Link
                                            key={item.id}
                                            href={`/anuncio/${item.slug}`}
                                            className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-700 hover:border-slate-300 hover:bg-white transition-colors"
                                        >
                                            <div className="flex-shrink-0">
                                                {item.photoUrl ? (
                                                    <img
                                                        src={item.photoUrl}
                                                        alt={`Foto de ${item.name}`}
                                                        className="h-10 w-10 rounded-full object-cover shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-[11px] font-semibold text-sky-700">
                                                        {initials}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="font-medium text-slate-900 truncate">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-[11px] text-slate-500">
                                                        {item.type === 'homenagem'
                                                            ? 'Homenagem'
                                                            : item.type === 'comunicado'
                                                                ? 'Comunicado'
                                                                : 'Outro'}
                                                    </span>
                                                </div>
                                                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>
                                                        {formatDate(
                                                            item.dateOfDeath,
                                                            true,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100">
                                <Link
                                    href="/pesquisar"
                                    className="text-xs font-medium text-sky-700 hover:text-sky-800"
                                >
                                    Ver todos os anuncios
                                </Link>
                            </div>
                        </div>
                    </aside>
                )}
                </div>
            </div>
        </div>
    );
}
