import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, Bell, Calendar, MapPin, User, ArrowLeft, Share2, Phone, Mail, FileText, Shield, Check } from 'lucide-react';
import { useAnnouncements } from '../context/AnnouncementContext';
import { Button } from './ui/button';
import { toast } from 'sonner';

export function AnnouncementDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { announcements } = useAnnouncements();
  
  const announcement = announcements.find(a => a.id === id);

  if (!announcement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 shadow-lg">
            <h2 className="text-slate-900 mb-4">Anúncio não encontrado</h2>
            <p className="text-slate-600 mb-8">
              O anúncio que você está procurando não existe ou foi removido.
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para início
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateAge = () => {
    if (!announcement.dateOfBirth) return null;
    const birth = new Date(announcement.dateOfBirth);
    const death = new Date(announcement.dateOfDeath);
    const age = death.getFullYear() - birth.getFullYear();
    return age;
  };

  const age = calculateAge();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `In Memoriam - ${announcement.name}`,
        text: announcement.description,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado para a área de transferência');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Image/Banner */}
      <div className={`relative h-72 sm:h-80 ${announcement.type === 'homenagem' ? 'bg-gradient-to-br from-rose-200 via-rose-100 to-pink-100' : 'bg-gradient-to-br from-blue-200 via-blue-100 to-cyan-100'}`}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }} />
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-6 left-0 right-0 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>

            <Button
              variant="outline"
              onClick={handleShare}
              className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg"
            >
              <Share2 className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Compartilhar</span>
            </Button>
          </div>
        </div>

        {/* Type Badge */}
        <div className="absolute bottom-8 left-0 right-0 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg ${
              announcement.type === 'homenagem' 
                ? 'bg-rose-600 text-white' 
                : 'bg-blue-600 text-white'
            }`}>
              {announcement.type === 'homenagem' ? (
                <Heart className="w-5 h-5" />
              ) : (
                <Bell className="w-5 h-5" />
              )}
              <span className="font-medium">
                {announcement.type === 'homenagem' ? 'Homenagem' : 'Comunicado'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-16">
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden">
          {/* Main Info */}
          <div className="p-6 sm:p-10 lg:p-12">
            <h1 className="text-slate-900 mb-3">
              {announcement.name}
            </h1>
            
            {age && (
              <p className="text-slate-600 mb-8">
                {age} anos
              </p>
            )}

            {/* Date and Location Info */}
            <div className="grid sm:grid-cols-2 gap-6 mb-10 pb-10 border-b-2 border-slate-100">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  announcement.type === 'homenagem' ? 'bg-rose-100' : 'bg-blue-100'
                }`}>
                  <Calendar className={`w-6 h-6 ${
                    announcement.type === 'homenagem' ? 'text-rose-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="text-slate-500 mb-1.5">Datas</div>
                  <div className="text-slate-900">
                    {announcement.dateOfBirth && (
                      <>
                        <div className="mb-1">{formatDate(announcement.dateOfBirth)}</div>
                        <div className="text-slate-400">até</div>
                      </>
                    )}
                    <div className={announcement.dateOfBirth ? 'mt-1' : ''}>
                      {formatDate(announcement.dateOfDeath)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  announcement.type === 'homenagem' ? 'bg-rose-100' : 'bg-blue-100'
                }`}>
                  <MapPin className={`w-6 h-6 ${
                    announcement.type === 'homenagem' ? 'text-rose-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="text-slate-500 mb-1.5">Local</div>
                  <div className="text-slate-900">{announcement.location}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h2 className="text-slate-900 mb-6">
                {announcement.type === 'homenagem' ? 'Mensagem de Homenagem' : 'Informações do Comunicado'}
              </h2>
              <div className="text-slate-700 whitespace-pre-line leading-relaxed text-lg bg-slate-50 p-6 rounded-xl border border-slate-200">
                {announcement.description}
              </div>
            </div>

            {/* Author */}
            <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <User className="w-6 h-6 text-slate-600" />
              </div>
              <div className="flex-1">
                <div className="text-slate-500 mb-1">Publicado por</div>
                <div className="text-slate-900">{announcement.author}</div>
                <div className="text-slate-500 text-sm mt-2">
                  Em {formatDate(announcement.createdAt)}
                </div>
              </div>
            </div>

            {/* Advertiser Information */}
            <div className="mt-8 p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border-2 border-amber-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-amber-200">
                <div className="p-2 bg-amber-200 rounded-lg">
                  <Shield className="w-5 h-5 text-amber-800" />
                </div>
                <h3 className="text-slate-900">Dados do Anunciante</h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-slate-600 text-sm mb-1">Nome</div>
                    <div className="text-slate-900">{announcement.advertiserName}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Phone className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-slate-600 text-sm mb-1">Telefone</div>
                    <a href={`tel:${announcement.advertiserPhone}`} className="text-slate-900 hover:text-blue-600 transition-colors">
                      {announcement.advertiserPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Mail className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-slate-600 text-sm mb-1">E-mail</div>
                    <a href={`mailto:${announcement.advertiserEmail}`} className="text-slate-900 hover:text-blue-600 transition-colors break-all">
                      {announcement.advertiserEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <FileText className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-slate-600 text-sm mb-1">Documento</div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-slate-900">Verificado</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-amber-200">
                <div className="flex items-center justify-between">
                  <p className="text-slate-600 text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-700" />
                    Identidade verificada e protegida
                  </p>
                  <div className="text-sm text-slate-600">
                    Plano: <span className="text-slate-900">{announcement.plan}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 sm:px-10 lg:px-12 py-8 bg-slate-50 border-t-2 border-slate-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-slate-600 text-center sm:text-left">
                "A saudade é o amor que fica"
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link to="/publicar" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full">
                    Publicar Homenagem
                  </Button>
                </Link>
                <Link to="/pesquisar" className="w-full sm:w-auto">
                  <Button className={`w-full ${
                    announcement.type === 'homenagem' 
                      ? 'bg-rose-600 hover:bg-rose-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}>
                    Ver Mais Anúncios
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}