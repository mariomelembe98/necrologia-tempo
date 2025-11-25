import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Heart, PenSquare, Search, Menu, X } from 'lucide-react';

export default function PublicHeader() {
    const { url } = usePage();

    const isActive = (path: string) => url === path;
    const [mobileOpen, setMobileOpen] = useState(false);

    const desktopLinkBase =
        'flex items-center gap-2 text-sm transition-all duration-200 ease-out hover:-translate-y-0.5';

    const desktopLinkClass = (path: string) => {
        const active = isActive(path);

        return [
            desktopLinkBase,
            active
                ? 'text-gray-900 font-semibold border-b-2 border-gray-900 pb-1'
                : 'text-gray-600 hover:text-gray-900',
        ].join(' ');
    };

    const mobileChipBase =
        'whitespace-nowrap px-3 py-1 rounded-full text-sm transition-all duration-200 ease-out hover:-translate-y-0.5';

    const mobileChipClass = (path: string) => {
        const active = isActive(path);

        return [
            mobileChipBase,
            active
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600',
        ].join(' ');
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-3">
                        <img
                            src="/images/logo/logo-vermelho.png"
                            alt="Tempo Necrologia"
                            className="h-10 w-auto sm:h-11"
                        />
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className={desktopLinkClass('/')}>
                            Home
                        </Link>

                        <Link
                            href="/homenagens"
                            className={desktopLinkClass('/homenagens')}
                        >
                            <Heart className="w-4 h-4" />
                            Homenagens
                        </Link>

                        <Link
                            href="/comunicados"
                            className={desktopLinkClass('/comunicados')}
                        >
                            <Bell className="w-4 h-4" />
                            Comunicados
                        </Link>

                        <Link
                            href="/pesquisar"
                            className={desktopLinkClass('/pesquisar')}
                        >
                            <Search className="w-4 h-4" />
                            Pesquisar
                        </Link>

                        <Link
                            href="/publicar"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 ${
                                'bg-gray-900 text-white hover:bg-gray-800'
                            } ${
                                isActive('/publicar')
                                    ? 'ring-2 ring-rose-500 ring-offset-2 ring-offset-slate-900/0 md:ring-offset-white/0'
                                    : ''
                            }`}
                        >
                            <PenSquare className="w-4 h-4" />
                            Publicar Anúncio
                        </Link>
                    </nav>

                    <div className="md:hidden flex items-center gap-2">
                        <Link
                            href="/publicar"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors duration-200 bg-gray-900 text-white hover:bg-gray-800"
                        >
                            <PenSquare className="w-4 h-4" />
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileOpen((open) => !open)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
                        >
                            {mobileOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                <nav
                    className={`md:hidden border-t border-gray-200 overflow-hidden transition-all duration-300 ease-out ${
                        mobileOpen ? 'max-h-40 pb-4 pt-3 opacity-100' : 'max-h-0 pb-0 pt-0 opacity-0'
                    }`}
                >
                    <div className="flex flex-col gap-2">
                        <Link href="/" className={mobileChipClass('/')}>
                            Home
                        </Link>
                        <Link
                            href="/homenagens"
                            className={mobileChipClass('/homenagens')}
                        >
                            Homenagens
                        </Link>
                        <Link
                            href="/comunicados"
                            className={mobileChipClass('/comunicados')}
                        >
                            Comunicados
                        </Link>
                        <Link
                            href="/pesquisar"
                            className={mobileChipClass('/pesquisar')}
                        >
                            Pesquisar
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}
