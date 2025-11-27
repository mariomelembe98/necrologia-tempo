import { useState } from 'react';
import { Head } from '@inertiajs/react';

import PublicLayout from '@/layouts/public-layout';

interface CheckoutProps {
    announcement: {
        name: string;
        type: string;
        location: string;
        slug: string;
    };
    plan: {
        name: string | null;
        duration: number | null;
        price: number | null;
    };
    paymentUrl: string;
}

export default function Checkout({ announcement, plan, paymentUrl }: CheckoutProps) {
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState<string | null>(null);
    const [paid, setPaid] = useState(false);
    const [showModal, setShowModal] = useState(false);

    async function handlePay(event: React.FormEvent) {
        event.preventDefault();
        if (!phone) {
            setStatus('Informe um telefone para receber o STK push.');
            return;
        }

        setStatus('Enviando pedido...');
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';

        const resp = await fetch(paymentUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token,
            },
            body: JSON.stringify({ phone }),
        });
        const data = await resp.json();
        if (resp.ok && data.success) {
            setStatus('Pagamento iniciado com sucesso! Aguarde a confirmação.');
            setPaid(true);
            setShowModal(true);
        } else {
            setStatus(`Erro: ${data.message ?? 'falha ao iniciar M-Pesa'}`);
        }
    }

    return (
        <PublicLayout>
            <Head title="Pagamento M-Pesa" />
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
                <div className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-900/40 backdrop-blur-lg text-slate-50">
                    <div className="space-y-4 text-center">
                        <p className="text-xs uppercase tracking-[0.45em] text-slate-400">Pagamento</p>
                        <h1 className="text-3xl font-bold">Pagamento M-Pesa</h1>
                        <p className="text-sm text-slate-300">
                            Após completar o pagamento via M-Pesa, o anúncio será publicado automaticamente.
                        </p>
                    </div>


                    <div className="grid gap-4 rounded-2xl border border-white/10 bg-slate-900/40 p-5 text-sm">
                        <div className="flex items-center justify-between text-slate-300">
                            <span>Tipo</span>
                            <strong className="text-white">{announcement.type}</strong>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                            <span>Nome</span>
                            <strong className="text-white">{announcement.name}</strong>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                            <span>Local</span>
                            <strong className="text-white">{announcement.location}</strong>
                        </div>
                    </div>

                    <div className="grid gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-900/40 p-5 text-sm text-emerald-100">
                        <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-[0.35em] text-emerald-200">Plano</span>
                            <span className="font-semibold text-sm">{plan.name ?? 'Plano indefinido'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-[0.35em] text-emerald-200">Validade</span>
                            <span>{plan.duration ? `${plan.duration} dias` : 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-[0.35em] text-emerald-200">Valor</span>
                            <span className="text-lg font-bold text-white">{plan.price ? `${plan.price} MT` : 'A definir'}</span>
                        </div>
                        <p className="text-xs text-emerald-100/80">
                            Receba o STK push e confirme para liberar a publicação automática.
                        </p>
                    </div>

                    <form onSubmit={handlePay} className="space-y-4 rounded-2xl border border-white/10 bg-slate-700/80 p-5 text-sm text-slate-300">
                        <div>
                            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">Telefone</label>
                            <input
                                value={phone}
                                onChange={(evt) => setPhone(evt.target.value)}
                                placeholder="2588XXXXXXXX"
                                className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/40 px-3 py-2 text-sm focus:border-emerald-400 focus:ring-emerald-400"
                            />
                        </div>
                        <div className="text-[11px] text-slate-400">
                            Ao clicar em «Pagar com M-Pesa» receberá um prompt no número acima. O pagamento será processado via sandbox.
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                type="submit"
                                disabled={paid}
                                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-4 py-3 text-center text-xs uppercase tracking-[0.4em] text-white transition hover:from-emerald-600 hover:to-emerald-500 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-300"
                            >
                                {paid ? 'Pagamento recebido' : 'Pagar com M-Pesa'}
                            </button>
                            {paid && (
                                <span className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
                                    Pagamento recebido
                                </span>
                            )}
                            {status && !paid && (
                                <div className="text-center text-xs text-amber-200">{status}</div>
                            )}
                            {status && paid && (
                                <div className="text-center text-xs text-emerald-200">{status}</div>
                            )}
                        </div>
                    </form>
                </div>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                        <div className="w-full max-w-md rounded-3xl border border-emerald-400 bg-white p-6 text-center shadow-2xl">
                            <h2 className="text-lg font-semibold text-slate-900">Pagamento enviado!</h2>
                            <p className="mt-2 text-sm text-slate-600">
                                O seu pagamento foi processado com sucesso. Clique no botão abaixo para ver o anúncio. <br/>
                                Em caso de dúvidas, entre em contacto com o suporte.
                            </p>
                            <div className="mt-6 flex flex-col gap-3">
                                <a
                                    href={`/anuncio/${announcement.slug}`}
                                    className="rounded-xl bg-emerald-600 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-emerald-700"
                                >
                                    Ver o anúncio
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600"
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
