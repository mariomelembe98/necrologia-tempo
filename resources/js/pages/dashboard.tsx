import { useMemo, useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Bell, Clock, FileText, Heart } from 'lucide-react';

interface DashboardStats {
    total: number;
    pending: number;
    published: number;
    homenagens: number;
    comunicados: number;
    outros: number;
    paymentPending: number;
    paymentPaid: number;
    paymentFailed: number;
    expiringSoon: number;
    expired: number;
    pendingPromotion: number;
}

interface RecentAnnouncement {
    id: string;
    slug: string;
    name: string;
    type: 'homenagem' | 'comunicado' | 'outros';
    status: string;
    createdAt?: string | null;
    expiresAt?: string | null;
    advertiserName?: string | null;
    planName?: string | null;
}

interface DashboardTrendPoint {
    date: string;
    count: number;
}

interface DashboardPageProps {
    stats: DashboardStats;
    recentAnnouncements: RecentAnnouncement[];
    trend: DashboardTrendPoint[];
    filters?: {
        from?: string | null;
        to?: string | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

function formatDate(value?: string | null) {
    if (!value) return '-';

    return new Date(value).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

export default function Dashboard({
    stats,
    recentAnnouncements,
    trend,
    filters,
}: DashboardPageProps) {
    const [startDate, setStartDate] = useState(filters?.from ?? '');
    const [endDate, setEndDate] = useState(filters?.to ?? '');

    const totalTrend = trend.reduce((sum, point) => sum + point.count, 0);
    const averageTrend = trend.length > 0 ? totalTrend / trend.length : 0;
    const lastDayVolume =
        trend.length > 0 ? trend[trend.length - 1].count : 0;
    const conversionRate =
        stats.pending + stats.published > 0
            ? stats.published / (stats.pending + stats.published)
            : 0;

    const latestAnnouncements = useMemo(() => {
        const sorted = [...recentAnnouncements].sort((a, b) => {
            const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;

            return bTime - aTime;
        });

        return sorted.slice(0, 6);
    }, [recentAnnouncements]);

    const expiringSoon = useMemo(() => {
        const candidates = recentAnnouncements.filter(
            (item) => item.status === 'published' && item.expiresAt,
        );

        candidates.sort((a, b) => {
            const aTime = a.expiresAt ? new Date(a.expiresAt).getTime() : 0;
            const bTime = b.expiresAt ? new Date(b.expiresAt).getTime() : 0;

            return aTime - bTime;
        });

        return candidates.slice(0, 6);
    }, [recentAnnouncements]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header + period filter */}
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-3 dark:border-sidebar-border lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Visao geral dos anuncios, tipos e periodos.
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {stats.pendingPromotion > 0 ? (
                                <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
                                    Revisar {stats.pendingPromotion} anúncio
                                    {stats.pendingPromotion > 1 ? 's' : ''} da promoção
                                </span>
                            ) : (
                                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                                    Nenhum anúncio promocional pendente
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Periodo
                        </span>
                        <input
                            type="date"
                            aria-label="Data inicial"
                            value={startDate}
                            onChange={(event) => {
                                const value = event.target.value;
                                setStartDate(value);
                                router.get(
                                    '/dashboard',
                                    {
                                        from: value || undefined,
                                        to: endDate || undefined,
                                    },
                                    {
                                        preserveState: true,
                                        preserveScroll: true,
                                        replace: true,
                                    },
                                );
                            }}
                            className="h-8 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:focus:border-slate-300 dark:focus:ring-slate-300"
                        />
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                            ate
                        </span>
                        <input
                            type="date"
                            aria-label="Data final"
                            value={endDate}
                            onChange={(event) => {
                                const value = event.target.value;
                                setEndDate(value);
                                router.get(
                                    '/dashboard',
                                    {
                                        from: startDate || undefined,
                                        to: value || undefined,
                                    },
                                    {
                                        preserveState: true,
                                        preserveScroll: true,
                                        replace: true,
                                    },
                                );
                            }}
                            className="h-8 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:focus:border-slate-300 dark:focus:ring-slate-300"
                        />
                    </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-sidebar-border/70 dark:bg-sidebar">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Anuncios totais
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800">
                                <FileText className="h-5 w-5 text-slate-700 dark:text-slate-100" />
                            </div>
                        </div>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            {stats.published} publicados, {stats.pending} pendentes
                        </p>
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm dark:border-amber-500/40 dark:bg-amber-950/40">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-300">
                                    Pendentes de revisao
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-amber-900 dark:text-amber-100">
                                    {stats.pending}
                                </p>
                            </div>
                            <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900">
                                <Clock className="h-5 w-5 text-amber-700 dark:text-amber-100" />
                            </div>
                        </div>
                        <p className="mt-2 text-xs text-amber-800/80 dark:text-amber-200/80">
                            Anuncios aguardando aprovacao ou publicacao.
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-sidebar-border/70 dark:bg-sidebar">
                        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Pagamentos
                        </p>
                        <div className="mt-3 space-y-1 text-sm text-slate-800 dark:text-slate-100">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    Pendentes
                                </span>
                                <span className="text-base font-semibold text-slate-900 dark:text-slate-50">
                                    {stats.paymentPending}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    Pagos
                                </span>
                                <span className="text-base font-semibold text-emerald-700">
                                    {stats.paymentPaid}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    Falhos
                                </span>
                                <span className="text-base font-semibold text-red-600">
                                    {stats.paymentFailed}
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Inclui notificacoes de checkout e M-Pesa.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-sidebar-border/70 dark:bg-sidebar">
                        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Expirações
                        </p>
                        <div className="mt-3 space-y-1 text-sm text-slate-800 dark:text-slate-100">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    Próximos 7 dias
                                </span>
                                <span className="text-base font-semibold text-amber-700">
                                    {stats.expiringSoon}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    Expirados
                                </span>
                                <span className="text-base font-semibold text-red-600">
                                    {stats.expired}
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Considera apenas anúncios publicados com data definida.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-sidebar-border/70 dark:bg-sidebar">
                        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Por tipo
                        </p>
                        <div className="mt-2 flex flex-col gap-1 text-sm text-slate-800 dark:text-slate-100">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1">
                                    <Heart className="h-4 w-4 text-rose-500" />
                                    Homenagens
                                </span>
                                <span>{stats.homenagens}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1">
                                    <Bell className="h-4 w-4 text-blue-500" />
                                    Comunicados
                                </span>
                                <span>{stats.comunicados}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Outros</span>
                                <span>{stats.outros}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-sidebar-border/70 dark:bg-sidebar">
                        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            ULTIMOS 14 DIAS
                        </p>
                        {trend.length > 0 && (
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {totalTrend} anuncios no periodo, media de{' '}
                                {averageTrend.toFixed(1)} por dia
                            </p>
                        )}
                        <div className="mt-3 flex h-20 items-end gap-1">
                            {trend.length === 0 ? (
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Sem dados recentes.
                                </p>
                            ) : (
                                (() => {
                                    const max = Math.max(...trend.map((p) => p.count));
                                    return trend.map((point) => (
                                        <div
                                            key={point.date}
                                            className="flex-1"
                                            title={`${formatDate(point.date)} - ${point.count} anuncio(s)`}
                                        >
                                            <div
                                                className="mx-0.5 rounded-t-full bg-slate-900/70 dark:bg-slate-100/80"
                                                style={{
                                                    height: `${(point.count / max) * 100 || 10}%`,
                                                }}
                                            />
                                        </div>
                                    ));
                                })()
                            )}
                        </div>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            Volume de anuncios criados por dia.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-sidebar-border/70 dark:bg-sidebar">
                        <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Volume diário
                        </p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-50">
                            {lastDayVolume}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Último dia registrado
                        </p>
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                            Média dos últimos {trend.length} dias: {averageTrend.toFixed(1)}
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-sidebar-border/70 dark:bg-sidebar">
                        <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Taxa de conversão
                        </p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-50">
                            {(conversionRate * 100).toFixed(1)}%
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {stats.pending + stats.published} pendentes + publicados
                        </p>
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                            Publicados ÷ (pendentes + publicados)
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-sidebar-border/70 dark:bg-sidebar">
                        <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Anúncios expirados
                        </p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-50">
                            {stats.expired}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Publicados com `expires_at` no passado
                        </p>
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                            Expirações próximas: {stats.expiringSoon}
                        </p>
                    </div>
                </div>

                {/* Shortcuts + recent listings */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Shortcuts */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-sidebar-border/70 dark:bg-sidebar">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                            Atalhos rapidos
                        </h2>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Acesse rapidamente as paginas de gestao.
                        </p>
                        <div className="mt-3 flex flex-col gap-2 text-sm">
                            <Link
                                href="/admin/anuncios"
                                className="inline-flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-100 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:hover:bg-sidebar/80"
                            >
                                <span>Gerir anuncios</span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Ver todos
                                </span>
                            </Link>
                            <Link
                                href="/admin/planos"
                                className="inline-flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-100 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:hover:bg-sidebar/80"
                            >
                                <span>Planos de anuncio</span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Configurar
                                </span>
                            </Link>
                            <Link
                                href="/admin/anunciantes"
                                className="inline-flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-100 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:hover:bg-sidebar/80"
                            >
                                <span>Anunciantes</span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Ver lista
                                </span>
                            </Link>
                            <Link
                                href="/publicar"
                                className="inline-flex items-center justify-between rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-medium text-sky-800 hover:bg-sky-100 dark:border-sky-500/50 dark:bg-sky-950/40 dark:text-sky-50 dark:hover:bg-sky-900/60"
                            >
                                <span>Novo anuncio publico</span>
                                <span className="text-[11px] text-sky-700 dark:text-sky-200">
                                    Abrir pagina
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Latest announcements */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-sidebar-border/70 dark:bg-sidebar">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                            Ultimos anuncios
                        </h2>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Ultimas publicacoes registradas no sistema.
                        </p>
                        {latestAnnouncements.length === 0 ? (
                            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                                Nenhum anuncio encontrado para o periodo atual.
                            </p>
                        ) : (
                            <ul className="mt-3 space-y-2">
                                {latestAnnouncements.map((item) => (
                                    <li
                                        key={item.id}
                                        className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-xs hover:bg-slate-100 dark:border-sidebar-border/70 dark:bg-sidebar/80 dark:hover:bg-sidebar"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <Link
                                                href={`/admin/anuncios/${item.slug}`}
                                                className="truncate text-xs font-medium text-slate-900 hover:text-sky-600 hover:underline dark:text-slate-50 dark:hover:text-sky-300"
                                            >
                                                {item.name}
                                            </Link>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                    item.status === 'pending'
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                                        : item.status === 'published'
                                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                          : 'bg-slate-50 text-slate-600 border border-slate-100'
                                                }`}
                                            >
                                                {item.status === 'pending'
                                                    ? 'Pendente'
                                                    : item.status === 'published'
                                                      ? 'Publicado'
                                                      : item.status === 'rejected'
                                                        ? 'Rejeitado'
                                                        : item.status}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                                            <span>
                                                Criado em{' '}
                                                <span className="font-medium">
                                                    {formatDate(item.createdAt ?? null)}
                                                </span>
                                            </span>
                                            <span className="truncate">
                                                {item.advertiserName ?? '-'}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Expiring soon */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-sidebar-border/70 dark:bg-sidebar">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                            Por expirar em breve
                        </h2>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Anuncios publicados com data de expiracao mais proxima.
                        </p>
                        {expiringSoon.length === 0 ? (
                            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                                Nenhum anuncio proximo de expirar.
                            </p>
                        ) : (
                            <ul className="mt-3 space-y-2">
                                {expiringSoon.map((item) => (
                                    <li
                                        key={item.id}
                                        className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-xs hover:bg-slate-100 dark:border-sidebar-border/70 dark:bg-sidebar/80 dark:hover:bg-sidebar"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <Link
                                                href={`/admin/anuncios/${item.slug}`}
                                                className="truncate text-xs font-medium text-slate-900 hover:text-sky-600 hover:underline dark:text-slate-50 dark:hover:text-sky-300"
                                            >
                                                {item.name}
                                            </Link>
                                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                                Expira em{' '}
                                                <span className="font-medium">
                                                    {formatDate(item.expiresAt ?? null)}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                                            <span>{item.planName ?? '-'}</span>
                                            <span className="truncate">
                                                {item.advertiserName ?? '-'}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
