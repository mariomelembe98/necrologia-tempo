import { Link } from '@inertiajs/react';
import { ArrowDown, Bell, Heart, HeartPulse, PlusCircle, Search } from 'lucide-react';

import { useAnnouncements } from '@/context/AnnouncementContext';
import { AnnouncementCard } from './announcement-card';

export default function Home() {
    const { announcements } = useAnnouncements();
    const recentAnnouncements = announcements.slice(0, 6);

    const scrollToContent = () => {
        document
            .getElementById('content')
            ?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-sky-900 via-amber-200/60 to-slate-900">
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                            backgroundSize: '40px 40px',
                        }}
                    />
                </div>

                <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-slate-50">
                    <HeartPulse className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-90" />
                    <h1
                        className="text-slate-50 mb-6 text-4xl sm:text-5xl font-bold tracking-tight"
                        style={{ fontFamily: '"VeronaBold", system-ui, serif' }}
                    >
                        Tempo Necrologia
                    </h1>
                    <p className="text-gray-700 mb-12 max-w-2xl mx-auto text-base sm:text-lg">
                        Um espaço dedicado à memória daqueles que partiram. <br />
                        <br />
                        Publique homenagens, comunicados e mantenha viva a
                        lembrança de entes queridos.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link
                            href="/publicar"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Publicar anúncio
                        </Link>
                        <Link
                            href="/pesquisar"
                            className="w-full sm:w-auto px-8 py-4 bg-slate-800/90 text-slate-50 rounded-lg hover:bg-slate-700 transition-all border border-slate-700 flex items-center justify-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            Pesquisar
                        </Link>
                    </div>

                    <blockquote className="text-slate-200 italic border-l-2 border-slate-500 pl-4 inline-block">
                        &quot;Aqueles que amamos nunca morrem, apenas partem
                        antes de nós.&quot; 
                    </blockquote>

                    <button
                        type="button"
                        onClick={scrollToContent}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white opacity-60 hover:opacity-100 transition-opacity animate-bounce"
                        aria-label="Rolar para conteúdo"
                    >
                        <ArrowDown className="w-6 h-6" />
                    </button>
                </div>
            </section>

            <section
                id="content"
                className="bg-gradient-to-br from-slate-50 to-slate-100"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid md:grid-cols-4 gap-6 mb-16">
                        <Link
                            href="/homenagens"
                            className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all group"
                        >
                            <Heart className="w-8 h-8 text-rose-600 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="text-slate-900 mb-2 text-base font-semibold">
                                Homenagens
                            </h3>
                            <p className="text-slate-600 text-sm">
                                Preste sua homenagem e compartilhe memórias.
                            </p>
                        </Link>

                        <Link
                            href="/comunicados"
                            className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all group"
                        >
                            <Bell className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="text-slate-900 mb-2 text-base font-semibold">
                                Comunicados
                            </h3>
                            <p className="text-slate-600 text-sm">
                                Informações sobre velórios e cerimônias.
                            </p>
                        </Link>

                        <Link
                            href="/pesquisar"
                            className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all group"
                        >
                            <Search className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="text-slate-900 mb-2 text-base font-semibold">
                                Pesquisar
                            </h3>
                            <p className="text-slate-600 text-sm">
                                Encontre anúncios e homenagens.
                            </p>
                        </Link>

                        <Link
                            href="/publicar"
                            className="bg-slate-900 p-6 rounded-xl hover:bg-slate-800 transition-all shadow-lg flex flex-col justify-between text-white"
                        >
                            <div>
                                <PlusCircle className="w-8 h-8 mb-3 text-white" />
                                <h3 className="mb-2 text-base font-semibold">
                                    Publicar anúncio
                                </h3>
                                <p className="text-slate-200 text-sm">
                                    Crie um anúncio de homenagem ou comunicado
                                    em poucos passos.
                                </p>
                            </div>
                        </Link>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                                Anúncios recentes
                            </h2>
                            <p className="text-sm text-slate-600 mt-1">
                                Veja homenagens e comunicados publicados
                                recentemente.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                                <Heart className="w-3.5 h-3.5" />
                                Homenagens
                            </div>
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                <Bell className="w-3.5 h-3.5" />
                                Comunicados
                            </div>
                        </div>
                    </div>

                    {recentAnnouncements.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-center text-slate-600">
                            Ainda não há anúncios publicados. Seja o primeiro a
                            criar uma homenagem.
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {recentAnnouncements.map((announcement) => (
                                <AnnouncementCard
                                    key={announcement.id}
                                    announcement={announcement}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
