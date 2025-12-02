import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'moderator' | 'support';
    status: 'active' | 'blocked';
    created_at: string;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

const roles = ['all', 'admin', 'moderator', 'support'] as const;
const statuses = ['all', 'active', 'blocked'] as const;

const formatDate = (value?: string | null) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

const defaultForm = {
    name: '',
    email: '',
    role: 'admin',
    status: 'active',
    password: '',
};

const getCsrfToken = () =>
    document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content') ?? '';

export default function AdminUsersIndex() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>({
        current_page: 1,
        last_page: 1,
        per_page: 25,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        role: 'all',
        status: 'all',
    });
    const [page, setPage] = useState(1);
    const [form, setForm] = useState(defaultForm);
    const [editing, setEditing] = useState<AdminUser | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchUsers = useCallback(
        async (targetPage = 1) => {
            setLoading(true);
            const params = new URLSearchParams();
            params.set('page', String(targetPage));
            if (filters.search.trim()) {
                params.set('search', filters.search.trim());
            }
            if (filters.role !== 'all') {
                params.set('role', filters.role);
            }
            if (filters.status !== 'all') {
                params.set('status', filters.status);
            }

            try {
                const response = await fetch(
                    `/admin/utilizadores?${params.toString()}`,
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                    },
                );

                if (!response.ok) {
                    throw new Error('Erro ao carregar a lista');
                }

                const json = await response.json();
                setUsers(json.data);
                setMeta(json.meta);
                setPage(targetPage);
            } catch (error) {
                console.error(error);
                setStatusMessage('Não foi possível carregar os utilizadores.');
            } finally {
                setLoading(false);
            }
        },
        [filters],
    );

    useEffect(() => {
        fetchUsers(1);
    }, [fetchUsers]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        setStatusMessage(null);

        const payload = {
            name: form.name,
            email: form.email,
            role: form.role,
            status: form.status,
            ...(form.password ? { password: form.password } : {}),
        };

        const url = editing
            ? `/admin/utilizadores/${editing.id}`
            : '/admin/utilizadores';

        const method = editing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.message || 'Ocorreu um erro');
            }

            setStatusMessage(
                editing
                    ? 'Utilizador atualizado com sucesso.'
                    : 'Utilizador criado com sucesso.',
            );
            setForm(defaultForm);
            setEditing(null);
            fetchUsers(page);
        } catch (error) {
            console.error(error);
            setStatusMessage(
                error instanceof Error
                    ? error.message
                    : 'Falha ao procesar a requisição.',
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (user: AdminUser) => {
        if (!window.confirm('Tem certeza que deseja excluir este utilizador?')) {
            return;
        }

        try {
            const response = await fetch(`/admin/utilizadores/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': getCsrfToken(),
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                const json = await response.json();
                throw new Error(json.message || 'Falha ao excluir.');
            }

            setStatusMessage('Utilizador eliminado.');
            fetchUsers(page);
        } catch (error) {
            console.error(error);
            setStatusMessage(
                error instanceof Error
                    ? error.message
                    : 'Erro ao excluir utilizador.',
            );
        }
    };

    const paginationWindow = useMemo(() => {
        const pages: number[] = [];
        const windowSize = 2;
        const start = Math.max(1, meta.current_page - windowSize);
        const end = Math.min(meta.last_page, meta.current_page + windowSize);

        if (start > 1) {
            pages.push(1);
        }

        if (start > 2) {
            pages.push(-1);
        }

        for (let number = start; number <= end; number += 1) {
            pages.push(number);
        }

        if (end < meta.last_page - 1) {
            pages.push(-2);
        }

        if (end < meta.last_page) {
            pages.push(meta.last_page);
        }

        return pages;
    }, [meta.current_page, meta.last_page]);

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Utilizadores', href: '/admin/utilizadores/gestao' }]}>
            <Head title="Gestão de utilizadores" />

            <div className="flex flex-col gap-6">
                <header className="flex flex-col gap-1">
                    <h1 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                        Utilizadores
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Gerencie contas administrativas, filtros e status.
                    </p>
                </header>

                {statusMessage && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 dark:border-sidebar-border dark:bg-sidebar/70">
                        {statusMessage}
                    </div>
                )}

                <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-sidebar-border/70 dark:bg-sidebar">
                        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 pb-3 dark:border-sidebar-border">
                            <div className="flex flex-col text-xs">
                                <span className="text-slate-500 dark:text-slate-400">Filtro</span>
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                                    {meta.total} utilizadores
                                </p>
                            </div>
                            <input
                                type="search"
                                placeholder="Buscar nome ou email"
                                value={filters.search}
                                onChange={(event) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        search: event.target.value,
                                    }))
                                }
                                className="min-w-[240px] rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:focus:border-slate-300 dark:focus:ring-slate-300"
                            />
                            <select
                                value={filters.role}
                                onChange={(event) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        role: event.target.value,
                                    }))
                                }
                                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:focus:border-slate-300 dark:focus:ring-slate-300"
                            >
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role === 'all' ? 'Todos os papéis' : role}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={filters.status}
                                onChange={(event) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        status: event.target.value,
                                    }))
                                }
                                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:focus:border-slate-300 dark:focus:ring-slate-300"
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status === 'all'
                                            ? 'Todos os status'
                                            : status === 'active'
                                                ? 'Ativos'
                                                : 'Bloqueados'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 dark:bg-sidebar/80">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Nome</th>
                                        <th className="px-4 py-2 text-left">Email</th>
                                        <th className="px-4 py-2 text-left">Papel</th>
                                        <th className="px-4 py-2 text-left">Status</th>
                                        <th className="px-4 py-2 text-left">Criado em</th>
                                        <th className="px-4 py-2 text-left">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-4 py-8 text-center text-xs text-slate-500"
                                            >
                                                A carregar utilizadores…
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="border-t border-slate-100 hover:bg-slate-50/80 dark:border-sidebar-border/60 dark:hover:bg-sidebar/80"
                                            >
                                                <td className="px-4 py-2 text-slate-900 dark:text-slate-50">
                                                    {user.name}
                                                </td>
                                                <td className="px-4 py-2 text-xs text-slate-600 dark:text-slate-300">
                                                    {user.email}
                                                </td>
                                                <td className="px-4 py-2 text-xs capitalize text-slate-600 dark:text-slate-300">
                                                    {user.role}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                                            user.status === 'active'
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                                                        }`}
                                                    >
                                                        {user.status === 'active'
                                                            ? 'Ativo'
                                                            : 'Bloqueado'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400">
                                                    {formatDate(user.created_at)}
                                                </td>
                                                <td className="px-4 py-2 text-xs">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditing(user);
                                                            setForm({
                                                                name: user.name,
                                                                email: user.email,
                                                                role: user.role,
                                                                status: user.status,
                                                                password: '',
                                                            });
                                                        }}
                                                        className="mr-2 text-sky-600 hover:underline"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(user)}
                                                        className="text-rose-600 hover:underline"
                                                    >
                                                        Remover
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>
                                Página {meta.current_page} de {meta.last_page} (
                                {meta.total} utilizadores)
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-200 dark:hover:bg-sidebar/80"
                                    onClick={() =>
                                        fetchUsers(Math.max(1, meta.current_page - 1))
                                    }
                                    disabled={meta.current_page === 1}
                                >
                                    Anterior
                                </button>
                                {paginationWindow.map((item) =>
                                    item < 0 ? (
                                        <span
                                            key={`gap-${item}`}
                                            className="px-2 text-xs text-slate-400"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={`page-${item}`}
                                            type="button"
                                            onClick={() => fetchUsers(item)}
                                            className={`h-8 w-8 rounded-full text-xs font-medium ${
                                                item === meta.current_page
                                                    ? 'bg-slate-900 text-white'
                                                    : 'bg-slate-50 text-slate-900 hover:bg-slate-100'
                                            }`}
                                        >
                                            {item}
                                        </button>
                                    ),
                                )}
                                <button
                                    type="button"
                                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-200 dark:hover:bg-sidebar/80"
                                    onClick={() =>
                                        fetchUsers(
                                            Math.min(meta.last_page, meta.current_page + 1),
                                        )
                                    }
                                    disabled={meta.current_page >= meta.last_page}
                                >
                                    Próxima
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-sidebar-border/70 dark:bg-sidebar">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                            {editing ? 'Editar utilizador' : 'Criar um novo utilizador'}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Papéis: admin, moderator, support. Salve para criar/atualizar.
                        </p>

                        <form
                            className="mt-4 space-y-3 text-xs"
                            onSubmit={handleSubmit}
                        >
                            <label className="flex flex-col gap-1">
                                Nome
                                <input
                                    type="text"
                                    value={form.name}
                                    required
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            name: event.target.value,
                                        }))
                                    }
                                    className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:focus:border-slate-300 dark:focus:ring-slate-300"
                                />
                            </label>
                            <label className="flex flex-col gap-1">
                                Email
                                <input
                                    type="email"
                                    value={form.email}
                                    required
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            email: event.target.value,
                                        }))
                                    }
                                    className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:focus:border-slate-300 dark:focus:ring-slate-300"
                                />
                            </label>
                            <div className="grid gap-2 sm:grid-cols-2">
                                <label className="flex flex-col gap-1">
                                    Papel
                                    <select
                                        value={form.role}
                                        onChange={(event) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                role: event.target.value,
                                            }))
                                        }
                                        className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:focus:border-slate-300 dark:focus:ring-slate-300"
                                    >
                                        {roles
                                            .filter((role) => role !== 'all')
                                            .map((role) => (
                                                <option key={role} value={role}>
                                                    {role}
                                                </option>
                                            ))}
                                    </select>
                                </label>
                                <label className="flex flex-col gap-1">
                                    Status
                                    <select
                                        value={form.status}
                                        onChange={(event) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                status: event.target.value,
                                            }))
                                        }
                                        className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:focus:border-slate-300 dark:focus:ring-slate-300"
                                    >
                                        <option value="active">Ativo</option>
                                        <option value="blocked">Bloqueado</option>
                                    </select>
                                </label>
                            </div>
                            <label className="flex flex-col gap-1">
                                Senha {editing ? '(deixe em branco para manter)' : ''}
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            password: event.target.value,
                                        }))
                                    }
                                    className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:focus:border-slate-300 dark:focus:ring-slate-300"
                                />
                            </label>

                            <div className="flex items-center gap-2">
                                <button
                                    type="submit"
                                    className="rounded-md bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-70"
                                    disabled={saving}
                                >
                                    {saving ? 'Gravando…' : 'Salvar'}
                                </button>
                                {editing && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditing(null);
                                            setForm(defaultForm);
                                        }}
                                        className="text-xs font-medium text-slate-500 hover:text-slate-700"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
