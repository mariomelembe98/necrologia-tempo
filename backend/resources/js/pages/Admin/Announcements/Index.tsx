import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import 'datatables.net-buttons-dt';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';

interface AnnouncementFromServer {
    id: number;
    slug: string;
    name: string;
    type: 'homenagem' | 'comunicado' | 'outros';
    status: string;
    created_at?: string | null;
    expires_at?: string | null;
    advertiser?: {
        name?: string | null;
    } | null;
    plan?: {
        name?: string | null;
    } | null;
}

interface AnnouncementsIndexProps {
    announcements: AnnouncementFromServer[];
    filters?: {
        from?: string | null;
        to?: string | null;
    };
}

DataTable.use(DT);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Anuncios',
        href: '/admin/anuncios',
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

export default function AdminAnnouncementsIndex({
    announcements,
    filters,
}: AnnouncementsIndexProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<
        'all' | 'pending' | 'published' | 'rejected'
    >('all');
    const [typeFilter, setTypeFilter] = useState<
        'all' | 'homenagem' | 'comunicado' | 'outros'
    >('all');
    const [startDate, setStartDate] = useState(filters?.from ?? '');
    const [endDate, setEndDate] = useState(filters?.to ?? '');

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            if (!target) return;

            const button = target.closest(
                '[data-status-button=\"true\"]',
            ) as HTMLElement | null;

            if (!button) return;

            const slug = button.getAttribute('data-slug');
            const status = button.getAttribute('data-status');

            if (!slug || !status) return;

            router.patch(`/admin/anuncios/${slug}/status`, { status });
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);

    const items = useMemo(() => {
        const mapped = announcements.map((item) => ({
            id: String(item.id),
            slug: item.slug,
            name: item.name,
            type: item.type,
            status: item.status,
            createdAt: item.created_at,
            expiresAt: item.expires_at,
            advertiserName: item.advertiser?.name ?? null,
            planName: item.plan?.name ?? null,
        }));

        return mapped.filter((item) => {
            if (statusFilter !== 'all' && item.status !== statusFilter) {
                return false;
            }

            if (typeFilter !== 'all' && item.type !== typeFilter) {
                return false;
            }

            if (startDate || endDate) {
                if (!item.createdAt) {
                    return false;
                }

                const created = new Date(item.createdAt);

                if (startDate) {
                    const from = new Date(`${startDate}T00:00:00`);
                    if (created < from) {
                        return false;
                    }
                }

                if (endDate) {
                    const to = new Date(`${endDate}T23:59:59.999`);
                    if (created > to) {
                        return false;
                    }
                }
            }

            if (!search.trim()) {
                return true;
            }

            const term = search.toLowerCase();

            return (
                item.name.toLowerCase().includes(term) ||
                (item.advertiserName ?? '').toLowerCase().includes(term) ||
                (item.planName ?? '').toLowerCase().includes(term)
            );
        });
    }, [announcements, search, statusFilter, typeFilter, startDate, endDate]);

    const columns: any[] = [
        {
            title: 'Nome',
            data: 'name',
            render: (data: string, type: string, row: any) => {
                if (type !== 'display') return data;

                const slug = row.slug as string;
                const safeName = data ?? '';

                return `<a href="/admin/anuncios/${slug}" class="hover:text-sky-600 hover:underline dark:hover:text-sky-400">${safeName}</a>`;
            },
        },
        {
            title: 'Tipo',
            data: 'type',
            render: (data: string, type: string) => {
                const label =
                    data === 'homenagem'
                        ? 'Homenagem'
                        : data === 'comunicado'
                          ? 'Comunicado'
                          : 'Outros';

                if (type !== 'display') {
                    return label;
                }

                return `<span class="text-xs text-slate-700 dark:text-slate-200">${label}</span>`;
            },
        },
        {
            title: 'Status',
            data: 'status',
            render: (data: string, type: string) => {
                const order =
                    data === 'pending'
                        ? 0
                        : data === 'published'
                          ? 1
                          : data === 'rejected'
                            ? 2
                            : 3;

                const label =
                    data === 'pending'
                        ? 'Pendente'
                        : data === 'published'
                          ? 'Publicado'
                          : data === 'rejected'
                            ? 'Rejeitado'
                            : data;

                const baseClasses =
                    'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border';

                const classes =
                    data === 'pending'
                        ? `${baseClasses} bg-amber-50 text-amber-700 border-amber-100`
                        : data === 'published'
                          ? `${baseClasses} bg-emerald-50 text-emerald-700 border-emerald-100`
                          : `${baseClasses} bg-slate-50 text-slate-600 border-slate-100`;

                if (type !== 'display') {
                    return order;
                }

                return `<span data-order="${order}" class="${classes}">${label}</span>`;
            },
        },
        {
            title: 'Anunciante',
            data: 'advertiserName',
            defaultContent: '-',
        },
        {
            title: 'Plano',
            data: 'planName',
            defaultContent: '-',
        },
        {
            title: 'Criado em',
            data: 'createdAt',
            render: (data: string | null, type: string) => {
                if (!data) {
                    return type === 'display' ? '-' : '';
                }

                if (type === 'display') {
                    return formatDate(data);
                }

                return data;
            },
        },
        {
            title: 'Expira em',
            data: 'expiresAt',
            render: (data: string | null, type: string) => {
                if (!data) {
                    return type === 'display' ? '-' : '';
                }

                if (type === 'display') {
                    return formatDate(data);
                }

                return data;
            },
        },
        {
            title: 'Acoes',
            data: null,
            orderable: false,
            searchable: false,
            render: (_data: unknown, _type: string, row: any) => {
                const slug = row.slug as string;
                const status = row.status as string;

                const buttons: string[] = [];

                if (status !== 'published') {
                    buttons.push(
                        `<button type="button" data-status-button="true" data-slug="${slug}" data-status="published" class="rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100">Publicar</button>`,
                    );
                }

                if (status !== 'pending') {
                    buttons.push(
                        `<button type="button" data-status-button="true" data-slug="${slug}" data-status="pending" class="rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 hover:bg-amber-100">Pendente</button>`,
                    );
                }

                if (status !== 'rejected') {
                    buttons.push(
                        `<button type="button" data-status-button="true" data-slug="${slug}" data-status="rejected" class="rounded-full border border-red-100 bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700 hover:bg-red-100">Rejeitar</button>`,
                    );
                }

                return `<div class="inline-flex gap-2">${buttons.join('')}</div>`;
            },
        },
    ];

    const options: any = {
        paging: true,
        pageLength: 10,
        lengthChange: true,
        searching: false,
        ordering: true,
        info: true,
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'copyHtml5',
                text: 'Copiar',
                className:
                    'dt-button rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:hover:bg-sidebar/80',
            },
            {
                extend: 'csvHtml5',
                text: 'CSV',
                className:
                    'dt-button rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:hover:bg-sidebar/80',
            },
            {
                extend: 'excelHtml5',
                text: 'Excel',
                className:
                    'dt-button rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:hover:bg-sidebar/80',
            },
            {
                extend: 'pdfHtml5',
                text: 'PDF',
                className:
                    'dt-button rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:hover:bg-sidebar/80',
            },
            {
                extend: 'print',
                text: 'Imprimir',
                className:
                    'dt-button rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:hover:bg-sidebar/80',
            },
        ],
        language: {
            emptyTable: 'Nenhum anuncio encontrado.',
            info: 'Mostrando _START_ ate _END_ de _TOTAL_ anuncios',
            infoEmpty: 'Nenhum anuncio para mostrar',
            lengthMenu: 'Mostrar _MENU_ registros',
            paginate: {
                first: 'Primeira',
                last: 'Ultima',
                next: 'Proxima',
                previous: 'Anterior',
            },
        },
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Anuncios" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                            Anuncios
                        </h1>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Lista de anuncios publicados e pendentes.
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-sidebar-border/70 dark:bg-sidebar">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 dark:border-sidebar-border">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                            Ultimos anuncios
                        </h2>
                        <div className="flex flex-wrap items-center gap-2">
                            <input
                                type="text"
                                placeholder="Pesquisar por nome, anunciante ou plano..."
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                }}
                                className="h-8 w-48 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-slate-300 dark:focus:ring-slate-300"
                            />
                            <select
                                value={typeFilter}
                                onChange={(event) =>
                                    setTypeFilter(
                                        event.target.value as
                                            | 'all'
                                            | 'homenagem'
                                            | 'comunicado'
                                            | 'outros',
                                    )
                                }
                                className="h-8 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:focus:border-slate-300 dark:focus:ring-slate-300"
                            >
                                <option value="all">Todos os tipos</option>
                                <option value="homenagem">Homenagens</option>
                                <option value="comunicado">Comunicados</option>
                                <option value="outros">Outros</option>
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(
                                        event.target.value as
                                            | 'all'
                                            | 'pending'
                                            | 'published'
                                            | 'rejected',
                                    )
                                }
                                className="h-8 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:focus:border-slate-300 dark:focus:ring-slate-300"
                            >
                                <option value="all">Todos os status</option>
                                <option value="pending">Pendentes</option>
                                <option value="published">Publicados</option>
                                <option value="rejected">Rejeitados</option>
                            </select>
                            <input
                                type="date"
                                aria-label="Data inicial"
                                value={startDate}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setStartDate(value);
                                    router.get(
                                        '/admin/anuncios',
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
                            <input
                                type="date"
                                aria-label="Data final"
                                value={endDate}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setEndDate(value);
                                    router.get(
                                        '/admin/anuncios',
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

                    {items.length === 0 ? (
                        <div className="flex h-40 items-center justify-center px-4 text-sm text-slate-500 dark:text-slate-400">
                            Nenhum anuncio encontrado com os filtros atuais.
                        </div>
                    ) : (
                        <div className="overflow-x-auto px-2 py-2">
                            <DataTable
                                data={items as any}
                                columns={columns as any}
                                options={options as any}
                                className="stripe hover w-full text-sm"
                            />
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
