import { Link, useLocation } from 'react-router-dom';
import { Heart, Bell, PlusCircle, Search } from 'lucide-react';

export function Header() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isHome = location.pathname === '/';

  return (
    <header className={`border-b ${isHome ? 'bg-transparent border-slate-700/30' : 'bg-white border-slate-200 shadow-sm'} sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Heart className={`w-6 h-6 ${isHome ? 'text-white' : 'text-slate-700'}`} />
            <span className={isHome ? 'text-white' : 'text-slate-900'}>In Memoriam</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`flex items-center gap-2 transition-colors ${
                isActive('/') 
                  ? (isHome ? 'text-white' : 'text-slate-900')
                  : (isHome ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900')
              }`}
            >
              Home
            </Link>
            
            <Link
              to="/homenagens"
              className={`flex items-center gap-2 transition-colors ${
                isActive('/homenagens') 
                  ? (isHome ? 'text-white' : 'text-slate-900')
                  : (isHome ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900')
              }`}
            >
              <Heart className="w-4 h-4" />
              Homenagens
            </Link>
            
            <Link
              to="/comunicados"
              className={`flex items-center gap-2 transition-colors ${
                isActive('/comunicados') 
                  ? (isHome ? 'text-white' : 'text-slate-900')
                  : (isHome ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900')
              }`}
            >
              <Bell className="w-4 h-4" />
              Comunicados
            </Link>
            
            <Link
              to="/pesquisar"
              className={`flex items-center gap-2 transition-colors ${
                isActive('/pesquisar') 
                  ? (isHome ? 'text-white' : 'text-slate-900')
                  : (isHome ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900')
              }`}
            >
              <Search className="w-4 h-4" />
              Pesquisar
            </Link>
            
            <Link
              to="/publicar"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isHome 
                  ? 'bg-white text-slate-900 hover:bg-slate-100'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              } ${isActive('/publicar') ? 'ring-2 ring-slate-700' : ''}`}
            >
              <PlusCircle className="w-4 h-4" />
              Publicar Anúncio
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link
              to="/publicar"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isHome 
                  ? 'bg-white text-slate-900 hover:bg-slate-100'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Mobile navigation */}
        <nav className="md:hidden pb-4 flex gap-4 overflow-x-auto">
          <Link
            to="/"
            className={`whitespace-nowrap px-3 py-1 rounded-full transition-colors ${
              isActive('/') 
                ? (isHome ? 'bg-white text-slate-900' : 'bg-slate-900 text-white')
                : (isHome ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600')
            }`}
          >
            Home
          </Link>
          <Link
            to="/homenagens"
            className={`whitespace-nowrap px-3 py-1 rounded-full transition-colors ${
              isActive('/homenagens') 
                ? (isHome ? 'bg-white text-slate-900' : 'bg-slate-900 text-white')
                : (isHome ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600')
            }`}
          >
            Homenagens
          </Link>
          <Link
            to="/comunicados"
            className={`whitespace-nowrap px-3 py-1 rounded-full transition-colors ${
              isActive('/comunicados') 
                ? (isHome ? 'bg-white text-slate-900' : 'bg-slate-900 text-white')
                : (isHome ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600')
            }`}
          >
            Comunicados
          </Link>
          <Link
            to="/pesquisar"
            className={`whitespace-nowrap px-3 py-1 rounded-full transition-colors ${
              isActive('/pesquisar') 
                ? (isHome ? 'bg-white text-slate-900' : 'bg-slate-900 text-white')
                : (isHome ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600')
            }`}
          >
            Pesquisar
          </Link>
        </nav>
      </div>
    </header>
  );
}