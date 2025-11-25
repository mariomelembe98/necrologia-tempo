import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface AdminAdvertiser {
    id: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    document_status?: string | null;
    document_verified_at?: string | null;
    announcements_count: number;
}

interface PaginatedAdvertisers {
    data: AdminAdvertiser[];
    current_page: number;
    last_page: number;
    total: number;
}

interface AdvertisersIndexProps {
    advertisers: PaginatedAdvertisers;
    filters?: {
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Anunciantes',
        href: '/admin/anunciantes',
    },
];

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

export default function AdvertisersIndex({ advertisers, filters }: AdvertisersIndexProps) {
    const [statusFilter, setStatusFilter] = useState<string>(filters?.status ?? 'all');

    const changeStatusFilter = (value: string) => {
        setStatusFilter(value);

        router.get(
            '/admin/anunciantes',
            {
                status: value === 'all' ? undefined : value,
            },
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            },
        );
    };

    const goToPage = (page: number) => {
        router.get(
            '/admin/anunciantes',
            {
                page,
                status: statusFilter === 'all' ? undefined : statusFilter,
            },
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestão de anunciantes" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                            Anunciantes
                        </h1>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Lista de anunciantes e anúncios associados.
                        </p>
                    </div>
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                changeStatusFilter(event.target.value)
                            }
                            className="h-8 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:focus:border-slate-300 dark:focus:ring-slate-300"
                        >
                            <option value="all">Todos os documentos</option>
                            <option value="verified">Verificados</option>
                            <option value="pending">Pendentes</option>
                            <option value="rejected">Rejeitados</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-sidebar-border/70 dark:bg-sidebar">
                    {advertisers.data.length === 0 ? (
                        <div className="flex h-40 items-center justify-center px-4 text-sm text-slate-500 dark:text-slate-400">
                            Nenhum anunciante encontrado.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-50 dark:bg-sidebar/80">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            Nome
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            Contacto
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            Email
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            Anúncios
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            Documento
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            Verificado em
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {advertisers.data.map((adv) => (
                                        <tr
                                            key={adv.id}
                                            className="border-t border-slate-100 hover:bg-slate-50/60 dark:border-sidebar-border/60 dark:hover:bg-sidebar/80 transition-colors"
                                        >
                                            <td className="px-4 py-2 text-slate-900 dark:text-slate-50">
                                                {adv.name}
                                            </td>
                                            <td className="px-4 py-2 text-xs text-slate-700 dark:text-slate-200">
                                                {adv.phone || '-'}
                                            </td>
                                            <td className="px-4 py-2 text-xs text-slate-700 dark:text-slate-200">
                                                {adv.email || '-'}
                                            </td>
                                            <td className="px-4 py-2 text-xs text-slate-700 dark:text-slate-200">
                                                {adv.announcements_count}
                                            </td>
                                            <td className="px-4 py-2 text-xs">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                                        adv.document_status === 'verified'
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                            : adv.document_status === 'pending'
                                                              ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                                              : 'bg-slate-50 text-slate-600 border border-slate-100'
                                                    }`}
                                                >
                                                    {adv.document_status
                                                        ? adv.document_status === 'verified'
                                                            ? 'Verificado'
                                                            : adv.document_status === 'pending'
                                                              ? 'Pendente'
                                                              : adv.document_status
                                                        : 'Sem informação'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-xs text-slate-700 dark:text-slate-200">
                                                {formatDateTime(adv.document_verified_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-xs text-slate-500 dark:border-sidebar-border dark:text-slate-400">
                        <div>
                            Página {advertisers.current_page} de {advertisers.last_page} ({' '}
                            {advertisers.total} anunciantes)
                        </div>
                        <div className="inline-flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    goToPage(advertisers.current_page - 1)
                                }
                                disabled={advertisers.current_page <= 1}
                                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-200 dark:hover:bg-sidebar/80"
                            >
                                Anterior
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    goToPage(advertisers.current_page + 1)
                                }
                                disabled={advertisers.current_page >= advertisers.last_page}
                                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-200 dark:hover:bg-sidebar/80"
                            >
                                Próxima
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

