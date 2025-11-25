import { Heart, Bell, Calendar, MapPin, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Announcement } from '../context/AnnouncementContext';

interface AnnouncementCardProps {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const calculateAge = () => {
    if (!announcement.dateOfBirth) return null;
    const birth = new Date(announcement.dateOfBirth);
    const death = new Date(announcement.dateOfDeath);
    const age = death.getFullYear() - birth.getFullYear();
    return age;
  };

  const age = calculateAge();

  return (
    <Link to={`/anuncio/${announcement.id}`} className="block h-full">
      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden hover:shadow-2xl hover:border-slate-300 transition-all hover:-translate-y-1 cursor-pointer group h-full flex flex-col">
        {/* Header */}
        <div className={`p-5 ${announcement.type === 'homenagem' ? 'bg-gradient-to-br from-rose-50 to-rose-100 border-b-2 border-rose-200' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-b-2 border-blue-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-1.5 rounded-lg ${announcement.type === 'homenagem' ? 'bg-rose-200' : 'bg-blue-200'}`}>
              {announcement.type === 'homenagem' ? (
                <Heart className="w-4 h-4 text-rose-700" />
              ) : (
                <Bell className="w-4 h-4 text-blue-700" />
              )}
            </div>
            <span className={`${announcement.type === 'homenagem' ? 'text-rose-700' : 'text-blue-700'}`}>
              {announcement.type === 'homenagem' ? 'Homenagem' : 'Comunicado'}
            </span>
          </div>
          <h3 className="text-slate-900 mb-1 group-hover:text-slate-700 transition-colors">
            {announcement.name}
          </h3>
          {age && (
            <p className="text-slate-600">
              {age} anos
            </p>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 flex-1 flex flex-col">
          <div className="space-y-3 flex-1">
            <div className="flex items-start gap-3 text-slate-600">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Calendar className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1 pt-1">
                <div className="text-slate-500 text-sm mb-0.5">Data</div>
                <div className="text-slate-900">
                  {announcement.dateOfBirth && (
                    <span>{formatDate(announcement.dateOfBirth)} - </span>
                  )}
                  <span>{formatDate(announcement.dateOfDeath)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-slate-600">
              <div className="p-2 bg-slate-100 rounded-lg">
                <MapPin className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1 pt-1">
                <div className="text-slate-500 text-sm mb-0.5">Local</div>
                <div className="text-slate-900">{announcement.location}</div>
              </div>
            </div>

            <p className="text-slate-700 line-clamp-3 leading-relaxed pt-2">
              {announcement.description}
            </p>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-3 text-slate-500">
              <User className="w-4 h-4" />
              <span className="text-sm">{announcement.author}</span>
            </div>

            {/* Read More Button */}
            <div className={`flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all ${
              announcement.type === 'homenagem' 
                ? 'text-rose-700 bg-rose-50 group-hover:bg-rose-100' 
                : 'text-blue-700 bg-blue-50 group-hover:bg-blue-100'
            }`}>
              <span>Ver detalhes completos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
