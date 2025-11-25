import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useAnnouncements } from '../context/AnnouncementContext';
import { AnnouncementCard } from './AnnouncementCard';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';

interface SearchPageProps {
  type?: 'homenagem' | 'comunicado';
}

export function SearchPage({ type }: SearchPageProps) {
  const { announcements } = useAnnouncements();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>(type || 'all');
  const [filterLocation, setFilterLocation] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Update filter when type prop changes
  useEffect(() => {
    setFilterType(type || 'all');
  }, [type]);

  const filteredAnnouncements = useMemo(() => {
    let filtered = announcements;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(a => a.type === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(term) ||
        a.description.toLowerCase().includes(term) ||
        a.location.toLowerCase().includes(term)
      );
    }

    // Filter by location
    if (filterLocation) {
      filtered = filtered.filter(a => 
        a.location.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'recent') {
      filtered = [...filtered].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === 'oldest') {
      filtered = [...filtered].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (sortBy === 'name') {
      filtered = [...filtered].sort((a, b) => 
        a.name.localeCompare(b.name)
      );
    }

    return filtered;
  }, [announcements, searchTerm, filterType, filterLocation, sortBy]);

  const pageTitle = type === 'homenagem' ? 'Homenagens' : type === 'comunicado' ? 'Comunicados' : 'Pesquisar Anúncios';
  const pageDescription = type === 'homenagem' 
    ? 'Veja todas as homenagens publicadas em memória de entes queridos'
    : type === 'comunicado' 
    ? 'Confira os comunicados de falecimento e informações sobre cerimônias'
    : 'Encontre anúncios de homenagens e comunicados';

  const clearFilters = () => {
    setSearchTerm('');
    setFilterLocation('');
    setSortBy('recent');
    if (!type) setFilterType('all');
  };

  const hasActiveFilters = searchTerm || filterLocation || (filterType !== 'all' && !type);

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-slate-900 mb-3">{pageTitle}</h1>
          <p className="text-slate-600 mb-4">
            {pageDescription}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-900">{filteredAnnouncements.length}</span>
              <span className="text-slate-600">
                {filteredAnnouncements.length === 1 ? 'anúncio' : 'anúncios'}
              </span>
            </div>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Limpar filtros
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Filter className="w-5 h-5 text-slate-700" />
            </div>
            <h2 className="text-slate-900">Filtros de Busca</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Buscar por nome</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Nome da pessoa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Type Filter */}
            {!type && (
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de anúncio</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="homenagem">Homenagens</SelectItem>
                    <SelectItem value="comunicado">Comunicados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Location Filter */}
            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                type="text"
                placeholder="Cidade, estado..."
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              />
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <Label htmlFor="sort">Ordenar por</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="oldest">Mais antigos</SelectItem>
                  <SelectItem value="name">Nome (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <div className="bg-white rounded-2xl border border-slate-200 p-12 max-w-md mx-auto">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-slate-900 mb-2">Nenhum anúncio encontrado</h3>
              <p className="text-slate-600 mb-6">
                Não encontramos resultados para sua busca. Tente ajustar os filtros.
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters}>
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnouncements.map(announcement => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
