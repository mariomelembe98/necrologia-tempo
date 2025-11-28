import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const DAY_MS = 1000 * 60 * 60 * 24;

interface AdminAnnouncement {
    id: string;
    slug: string;
    type: 'homenagem' | 'comunicado' | 'outros';
    name: string;
    status: string;
    photoUrl?: string | null;
    documentUrl?: string | null;
    dateOfBirth?: string | null;
    dateOfDeath?: string | null;
    location?: string | null;
    description?: string | null;
    author?: string | null;
    advertiser?: {
        name?: string | null;
        phone?: string | null;
        email?: string | null;
    };
    plan?: {
        name: string;
        duration_days: number;
        price_mt: number;
    } | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    publishedAt?: string | null;
    expiresAt?: string | null;
    paymentStatus?: string | null;
    paymentMethod?: string | null;
    paymentReference?: string | null;
    paidAt?: string | null;
}

interface ShowProps {
    announcement: AdminAnnouncement;
}

function formatDateTime(value?: string | null) {
    if (!value) return '-';

    return new Date(value).toLocaleString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function AdminAnnouncementShow({ announcement }: ShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Detalhe do anúncio',
            href: '#',
        },
    ];

    const paymentStatus = announcement.paymentStatus ?? 'pending';
    const paymentLabel =
        paymentStatus === 'paid'
            ? 'Pago'
            : paymentStatus === 'failed'
              ? 'Falhou'
              : 'Pendente';
    const paymentBadgeClass =
        paymentStatus === 'paid'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
            : paymentStatus === 'failed'
              ? 'bg-red-50 text-red-700 border-red-100'
              : 'bg-amber-50 text-amber-700 border-amber-100';

    const expiresAtDate = announcement.expiresAt
        ? new Date(announcement.expiresAt)
        : null;
    const daysUntilExpiration =
        expiresAtDate !== null
            ? Math.ceil((expiresAtDate.getTime() - Date.now()) / DAY_MS)
            : null;
    const expirationLabel =
        daysUntilExpiration === null
            ? 'Sem data definida'
            : daysUntilExpiration <= 0
              ? 'Expirado'
              : daysUntilExpiration === 1
                ? 'Expira em 1 dia'
                : `Expira em ${daysUntilExpiration} dias`;
    const expirationToneClass =
        daysUntilExpiration !== null && daysUntilExpiration <= 0
            ? 'text-red-600'
            : daysUntilExpiration !== null && daysUntilExpiration <= 7
              ? 'text-amber-600'
              : 'text-slate-600';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Anúncio: ${announcement.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-sidebar-border/70 dark:bg-sidebar">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    {announcement.type === 'homenagem'
                                        ? 'Homenagem'
                                        : announcement.type === 'comunicado'
                                          ? 'Comunicado'
                                          : 'Outros'}
                                </p>
                                <h1 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-50">
                                    {announcement.name}
                                </h1>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Slug:{' '}
                                    <span className="font-mono text-[11px]">
                                        {announcement.slug}
                                    </span>
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                        announcement.status === 'pending'
                                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                            : announcement.status === 'published'
                                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                              : announcement.status === 'rejected'
                                                ? 'bg-red-50 text-red-700 border border-red-100'
                                                : 'bg-slate-50 text-slate-600 border border-slate-100'
                                    }`}
                                >
                                    {announcement.status === 'pending'
                                        ? 'Pendente'
                                        : announcement.status === 'published'
                                          ? 'Publicado'
                                          : announcement.status === 'rejected'
                                            ? 'Rejeitado'
                                            : announcement.status}
                                </span>
                                <Link
                                    href={`/anuncio/${announcement.slug}`}
                                    className="text-xs text-sky-600 hover:text-sky-700 hover:underline dark:text-sky-400 dark:hover:text-sky-300"
                                >
                                    Ver página pública
                                </Link>
                            </div>
                        </div>

                        {announcement.photoUrl && (
                            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-sidebar-border dark:bg-sidebar/80">
                                <img
                                    src={announcement.photoUrl}
                                    alt={announcement.name}
                                    className="h-64 w-full object-cover"
                                />
                            </div>
                        )}

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3 text-xs dark:border-sidebar-border/60 dark:bg-sidebar/80">
                                <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Informações principais
                                </h2>
                                <div className="space-y-1 text-slate-700 dark:text-slate-200">
                                    <p>
                                        <span className="text-slate-500 dark:text-slate-400">
                                            Local:{' '}
                                        </span>
                                        {announcement.location || '-'}
                                    </p>
                                    <p>
                                        <span className="text-slate-500 dark:text-slate-400">
                                            Data de nascimento:{' '}
                                        </span>
                                        {announcement.dateOfBirth || '-'}
                                    </p>
                                    <p>
                                        <span className="text-slate-500 dark:text-slate-400">
                                            Data de falecimento:{' '}
                                        </span>
                                        {announcement.dateOfDeath || '-'}
                                    </p>
                                    <p>
                                        <span className="text-slate-500 dark:text-slate-400">
                                            Autor:{' '}
                                        </span>
                                        {announcement.author || '-'}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3 text-xs dark:border-sidebar-border/60 dark:bg-sidebar/80">
                                <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Plano e anunciante
                                </h2>
                                <div className="space-y-1 text-slate-700 dark:text-slate-200">
                                    <p>
                                        <span className="text-slate-500 dark:text-slate-400">
                                            Plano:{' '}
                                        </span>
                                        {announcement.plan
                                            ? `${announcement.plan.name} (${announcement.plan.duration_days} dias)`
                                            : '-'}
                                    </p>
                                    {announcement.plan && (
                                        <p>
                                            <span className="text-slate-500 dark:text-slate-400">
                                                Preço:{' '}
                                            </span>
                                            {announcement.plan.price_mt.toLocaleString(
                                                'pt-PT',
                                                {
                                                    style: 'currency',
                                                    currency: 'MZN',
                                                },
                                            )}
                                        </p>
                                    )}
                                    <p>
                                        <span className="text-slate-500 dark:text-slate-400">
                                            Anunciante:{' '}
                                        </span>
                                        {announcement.advertiser?.name || '-'}
                                    </p>
                                    <p>
                                        <span className="text-slate-500 dark:text-slate-400">
                                            Telefone:{' '}
                                        </span>
                                        {announcement.advertiser?.phone || '-'}
                                    </p>
                                    <p>
                                        <span className="text-slate-500 dark:text-slate-400">
                                            Email:{' '}
                                        </span>
                                        {announcement.advertiser?.email || '-'}
                                    </p>
                                    {announcement.documentUrl && (
                                        <p className="mt-1">
                                            <a
                                                href={announcement.documentUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sky-600 hover:text-sky-700 hover:underline dark:text-sky-400 dark:hover:text-sky-300"
                                            >
                                                Ver documento do anunciante
                                            </a>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3 text-xs dark:border-sidebar-border/60 dark:bg-sidebar/80">
                            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Mensagem / descrição
                            </h2>
                            <p className="whitespace-pre-line text-slate-700 dark:text-slate-200">
                                {announcement.description || 'Sem descrição.'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs shadow-sm dark:border-sidebar-border/70 dark:bg-sidebar">
                            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Timeline / logs
                            </h2>
                            <div className="space-y-1 text-slate-700 dark:text-slate-200">
                                <p>
                                    <span className="text-slate-500 dark:text-slate-400">
                                        Criado em:{' '}
                                    </span>
                                    {formatDateTime(announcement.createdAt)}
                                </p>
                                <p>
                                    <span className="text-slate-500 dark:text-slate-400">
                                        Actualizado em:{' '}
                                    </span>
                                    {formatDateTime(announcement.updatedAt)}
                                </p>
                                <p>
                                    <span className="text-slate-500 dark:text-slate-400">
                                        Publicado em:{' '}
                                    </span>
                                    {formatDateTime(announcement.publishedAt)}
                                </p>
                                <p>
                                    <span className="text-slate-500 dark:text-slate-400">
                                        Expira em:{' '}
                                    </span>
                                    {formatDateTime(announcement.expiresAt)}
                                </p>
                            </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs shadow-sm dark:border-sidebar-border/70 dark:bg-sidebar">
                            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Pagamentos e expirações
                            </h2>
                            <div className="space-y-2 text-slate-700 dark:text-slate-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        Status do pagamento
                                    </span>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border ${paymentBadgeClass}`}
                                    >
                                        {paymentLabel}
                                    </span>
                                </div>
                                {announcement.paymentMethod && (
                                    <p>
                                        <span className="text-slate-500 dark:text-slate-400">
                                            Método:{' '}
                                        </span>
                                        {announcement.paymentMethod}
                                    </p>
                                )}
                                {announcement.paymentReference && (
                                    <p>
                                        <span className="text-slate-500 dark:text-slate-400">
                                            Referência:{' '}
                                        </span>
                                        {announcement.paymentReference}
                                    </p>
                                )}
                                <p>
                                    <span className="text-slate-500 dark:text-slate-400">
                                        Último registro:{' '}
                                    </span>
                                    {announcement.paidAt
                                        ? formatDateTime(announcement.paidAt)
                                        : 'Ainda não foi pago'}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        Expiração
                                    </span>
                                    <span
                                        className={`text-sm font-semibold ${expirationToneClass}`}
                                    >
                                        {expirationLabel}
                                    </span>
                                </div>
                                {announcement.expiresAt && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {formatDateTime(announcement.expiresAt)}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
