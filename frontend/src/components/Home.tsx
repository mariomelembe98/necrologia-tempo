import { Link } from 'react-router-dom';
import { Heart, Bell, Search, PlusCircle, ArrowDown } from 'lucide-react';
import { useAnnouncements } from '../context/AnnouncementContext';
import { AnnouncementCard } from './AnnouncementCard';

export function Home() {
  const { announcements } = useAnnouncements();
  const recentAnnouncements = announcements.slice(0, 6);

  const scrollToContent = () => {
    document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section - Full Screen */}
      <div className="relative h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <Heart className="w-16 h-16 text-white mx-auto mb-6 opacity-90" />
          <h1 className="text-white mb-6">
            In Memoriam
          </h1>
          <p className="text-slate-300 mb-12 max-w-2xl mx-auto">
            Um espaço dedicado à memória daqueles que partiram. 
            Publique homenagens, comunicados e mantenha viva a lembrança de seus entes queridos.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/publicar"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Publicar Anúncio
            </Link>
            <Link
              to="/pesquisar"
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all border border-slate-700 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Pesquisar
            </Link>
          </div>

          {/* Quote */}
          <blockquote className="text-slate-400 italic border-l-2 border-slate-700 pl-4 inline-block">
            "Aqueles que amamos nunca morrem, apenas partem antes de nós."
          </blockquote>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white opacity-60 hover:opacity-100 transition-opacity animate-bounce"
          aria-label="Rolar para conteúdo"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div id="content" className="bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <Link
              to="/homenagens"
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all group"
            >
              <Heart className="w-8 h-8 text-rose-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-slate-900 mb-2">Homenagens</h3>
              <p className="text-slate-600">
                Preste sua homenagem e compartilhe memórias
              </p>
            </Link>

            <Link
              to="/comunicados"
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all group"
            >
              <Bell className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-slate-900 mb-2">Comunicados</h3>
              <p className="text-slate-600">
                Informações sobre velórios e cerimônias
              </p>
            </Link>

            <Link
              to="/pesquisar"
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all group"
            >
              <Search className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-slate-900 mb-2">Pesquisar</h3>
              <p className="text-slate-600">
                Encontre anúncios e homenagens
              </p>
            </Link>

            <Link
              to="/publicar"
              className="bg-slate-900 p-6 rounded-xl hover:bg-slate-800 transition-all group text-white"
            >
              <PlusCircle className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="mb-2">Publicar</h3>
              <p className="text-slate-300">
                Publique um novo anúncio
              </p>
            </Link>
          </div>

          {/* Recent Announcements */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-slate-900">Anúncios Recentes</h2>
              <Link to="/pesquisar" className="text-slate-600 hover:text-slate-900 transition-colors">
                Ver todos
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {recentAnnouncements.map(announcement => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}