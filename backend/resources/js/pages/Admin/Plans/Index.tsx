import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface AdminPlan {
    id: string;
    name: string;
    slug: string;
    type: 'homenagem' | 'comunicado' | 'outros';
    duration_days: number;
    price_mt: number;
    is_active: boolean;
    announcements_count: number;
}

interface PlansIndexProps {
    plans: AdminPlan[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Planos',
        href: '/admin/planos',
    },
];

export default function PlansIndex({ plans }: PlansIndexProps) {
    const [editingPlan, setEditingPlan] = useState<AdminPlan | null>(null);

    const form = useForm<{
        name: string;
        slug: string;
        type: 'homenagem' | 'comunicado' | 'outros';
        duration_days: number | string;
        price_mt: number | string;
    }>({
        name: '',
        slug: '',
        type: 'homenagem',
        duration_days: 7,
        price_mt: 0,
    });

    const startCreate = () => {
        setEditingPlan(null);
        form.setData({
            name: '',
            slug: '',
            type: 'homenagem',
            duration_days: 7,
            price_mt: 0,
        });
    };

    const startEdit = (plan: AdminPlan) => {
        setEditingPlan(plan);
        form.setData({
            name: plan.name,
            slug: plan.slug,
            type: plan.type,
            duration_days: plan.duration_days,
            price_mt: plan.price_mt,
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (editingPlan) {
            form.put(`/admin/planos/${editingPlan.id}`, {
                preserveScroll: true,
            });
        } else {
            form.post('/admin/planos', {
                preserveScroll: true,
                onSuccess: () => {
                    form.reset();
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestão de planos" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                            Planos de anúncios
                        </h1>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Gestão dos planos disponíveis para publicação de anúncios.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={startCreate}
                        className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                    >
                        Novo plano
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 text-xs shadow-sm dark:border-sidebar-border/70 dark:bg-sidebar"
                >
                    <div className="flex flex-wrap items-end gap-3">
                        <div className="flex-1 min-w-[160px]">
                            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Nome
                            </label>
                            <input
                                type="text"
                                value={form.data.name}
                                onChange={(event) =>
                                    form.setData('name', event.target.value)
                                }
                                className="h-8 w-full rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:focus:border-slate-300 dark:focus:ring-slate-300"
                            />
                            {form.errors.name && (
                                <p className="mt-1 text-[11px] text-red-500">
                                    {form.errors.name}
                                </p>
                            )}
                        </div>
                        <div className="w-40">
                            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Tipo
                            </label>
                            <select
                                value={form.data.type}
                                onChange={(event) =>
                                    form.setData(
                                        'type',
                                        event.target
                                            .value as AdminPlan['type'],
                                    )
                                }
                                className="h-8 w-full rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:focus:border-slate-300 dark:focus:ring-slate-300"
                            >
                                <option value="homenagem">Homenagem</option>
                                <option value="comunicado">Comunicado</option>
                                <option value="outros">Outros</option>
                            </select>
                            {form.errors.type && (
                                <p className="mt-1 text-[11px] text-red-500">
                                    {form.errors.type}
                                </p>
                            )}
                        </div>
                        <div className="w-32">
                            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Duração (dias)
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={form.data.duration_days}
                                onChange={(event) =>
                                    form.setData(
                                        'duration_days',
                                        event.target.value,
                                    )
                                }
                                className="h-8 w-full rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:focus:border-slate-300 dark:focus:ring-slate-300"
                            />
                            {form.errors.duration_days && (
                                <p className="mt-1 text-[11px] text-red-500">
                                    {form.errors.duration_days}
                                </p>
                            )}
                        </div>
                        <div className="w-40">
                            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Preço (MZN)
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={form.data.price_mt}
                                onChange={(event) =>
                                    form.setData(
                                        'price_mt',
                                        event.target.value,
                                    )
                                }
                                className="h-8 w-full rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-50 dark:focus:border-slate-300 dark:focus:ring-slate-300"
                            />
                            {form.errors.price_mt && (
                                <p className="mt-1 text-[11px] text-red-500">
                                    {form.errors.price_mt}
                                </p>
                            )}
                        </div>
                        <div className="w-40 text-right">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex h-8 items-center justify-center rounded-md bg-emerald-600 px-3 text-xs font-medium text-white shadow-sm hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {editingPlan ? 'Guardar alterações' : 'Criar plano'}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-sidebar-border/70 dark:bg-sidebar">
                    {plans.length === 0 ? (
                        <div className="flex h-40 items-center justify-center px-4 text-sm text-slate-500 dark:text-slate-400">
                            Nenhum plano encontrado.
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
                                            Tipo
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            Duração
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            Preço
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            Anúncios ligados
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            Status
                                        </th>
                                        <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {plans.map((plan) => (
                                        <tr
                                            key={plan.id}
                                            className="border-t border-slate-100 hover:bg-slate-50/60 dark:border-sidebar-border/60 dark:hover:bg-sidebar/80 transition-colors"
                                        >
                                            <td className="px-4 py-2 text-slate-900 dark:text-slate-50">
                                                {plan.name}
                                            </td>
                                            <td className="px-4 py-2 text-xs text-slate-700 dark:text-slate-200">
                                                {plan.type === 'homenagem'
                                                    ? 'Homenagens'
                                                    : plan.type === 'comunicado'
                                                      ? 'Comunicados'
                                                      : 'Outros'}
                                            </td>
                                            <td className="px-4 py-2 text-xs text-slate-700 dark:text-slate-200">
                                                {plan.duration_days} dias
                                            </td>
                                            <td className="px-4 py-2 text-xs text-slate-700 dark:text-slate-200">
                                                {plan.price_mt.toLocaleString('pt-PT', {
                                                    style: 'currency',
                                                    currency: 'MZN',
                                                })}
                                            </td>
                                            <td className="px-4 py-2 text-xs text-slate-700 dark:text-slate-200">
                                                {plan.announcements_count}
                                            </td>
                                            <td className="px-4 py-2 text-xs">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                                        plan.is_active
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                            : 'bg-slate-50 text-slate-600 border border-slate-100'
                                                    }`}
                                                >
                                                    {plan.is_active ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-right text-xs">
                                                <div className="inline-flex gap-2">
                                                    <button
                                                        type="button"
                                                        className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100 dark:border-sidebar-border dark:bg-sidebar dark:text-slate-100 dark:hover:bg-sidebar/80"
                                                        onClick={() => startEdit(plan)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                                                            plan.is_active
                                                                ? 'border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100'
                                                                : 'border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                        }`}
                                                        onClick={() =>
                                                            router.patch(
                                                                `/admin/planos/${plan.id}/toggle`,
                                                            )
                                                        }
                                                    >
                                                        {plan.is_active ? 'Desativar' : 'Ativar'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

