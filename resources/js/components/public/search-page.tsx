import { useEffect, useMemo, useState } from 'react';

import { useAnnouncements } from '@/context/AnnouncementContext';
import { AnnouncementCard } from './announcement-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Filter, Search as SearchIcon, X } from 'lucide-react';

type FilterType = 'all' | 'homenagem' | 'comunicado';

interface SearchPageProps {
    type?: 'homenagem' | 'comunicado';
}

export default function SearchPage({ type }: SearchPageProps) {
    const { announcements } = useAnnouncements();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<FilterType>(
        type ?? 'all',
    );
    const [filterLocation, setFilterLocation] = useState('');
    const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'name'>(
        'recent',
    );

    useEffect(() => {
        setFilterType(type ?? 'all');
    }, [type]);

    const filteredAnnouncements = useMemo(() => {
        let filtered = announcements;

        if (filterType !== 'all') {
            filtered = filtered.filter((a) => a.type === filterType);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (a) =>
                    a.name.toLowerCase().includes(term) ||
                    a.description.toLowerCase().includes(term) ||
                    a.location.toLowerCase().includes(term),
            );
        }

        if (filterLocation) {
            filtered = filtered.filter((a) =>
                a.location
                    .toLowerCase()
                    .includes(filterLocation.toLowerCase()),
            );
        }

        if (sortBy === 'recent') {
            filtered = [...filtered].sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
            );
        } else if (sortBy === 'oldest') {
            filtered = [...filtered].sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime(),
            );
        } else if (sortBy === 'name') {
            filtered = [...filtered].sort((a, b) =>
                a.name.localeCompare(b.name),
            );
        }

        return filtered;
    }, [announcements, searchTerm, filterType, filterLocation, sortBy]);

    const pageTitle =
        type === 'homenagem'
            ? 'Homenagens'
            : type === 'comunicado'
              ? 'Comunicados'
              : 'Pesquisar anúncios';

    const pageDescription =
        type === 'homenagem'
            ? 'Veja todas as homenagens publicadas em memória de entes queridos.'
            : type === 'comunicado'
              ? 'Confira comunicados de falecimento e informações sobre cerimônias.'
              : 'Encontre anúncios de homenagens e comunicados.';

    const clearFilters = () => {
        setSearchTerm('');
        setFilterLocation('');
        setSortBy('recent');
        if (!type) {
            setFilterType('all');
        }
    };

    const hasActiveFilters =
        !!searchTerm ||
        !!filterLocation ||
        (!type && filterType !== 'all') ||
        sortBy !== 'recent';

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-900 via-amber-200/60 to-slate-900 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-8 sm:mb-12">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-slate-50 mb-3">
                        {pageTitle}
                    </h1>
                    <p className="text-sm text-slate-100 mb-4">
                        {pageDescription}
                    </p>

                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200">
                            <span className="text-slate-900 text-sm font-semibold">
                                {filteredAnnouncements.length}
                            </span>
                            <span className="text-slate-600 text-sm">
                                {filteredAnnouncements.length === 1
                                    ? 'anúncio'
                                    : 'anúncios'}
                            </span>
                        </div>

                        <div className="ml-auto flex items-center gap-1 rounded-full border border-slate-200 bg-white/70 p-1 text-slate-500 shadow-sm">
                            <button
                                className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                                    viewMode === 'grid'
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'text-slate-500 hover:text-slate-900'
                                }`}
                                onClick={() => setViewMode('grid')}
                                aria-label="Visualização em mosaico"
                            >
                                <span className="grid grid-cols-2 gap-1">
                                    <span className="h-3 w-3 rounded-sm bg-current" />
                                    <span className="h-3 w-3 rounded-sm bg-current" />
                                    <span className="h-3 w-3 rounded-sm bg-current" />
                                    <span className="h-3 w-3 rounded-sm bg-current" />
                                </span>
                            </button>
                            <button
                                className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                                    viewMode === 'list'
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'text-slate-500 hover:text-slate-900'
                                }`}
                                onClick={() => setViewMode('list')}
                                aria-label="Visualização em lista"
                            >
                                <span className="flex flex-col gap-1">
                                    <span className="h-1.5 w-3 rounded-sm bg-current" />
                                    <span className="h-1.5 w-3 rounded-sm bg-current" />
                                    <span className="h-1.5 w-3 rounded-sm bg-current" />
                                </span>
                            </button>
                        </div>

                        {hasActiveFilters && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Limpar filtros
                            </Button>
                        )}
                    </div>
                </header>

                <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 mb-8 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <Filter className="w-5 h-5 text-slate-700" />
                        </div>
                        <h2 className="text-sm font-semibold text-slate-900">
                            Filtros de busca
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="search">Buscar por nome</Label>
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    id="search"
                                    type="text"
                                    placeholder="Nome da pessoa..."
                                    className="pl-9 text-slate-900 placeholder:text-slate-500 focus:border-slate-400 focus:ring-slate-400"
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(event.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo</Label>
                            <Select
                                value={filterType}
                                onValueChange={(value) =>
                                    setFilterType(value as FilterType)
                                }
                            >
                                <SelectTrigger
                                    id="type"
                                    className="bg-slate-50 text-slate-900 border-slate-200 focus:ring-slate-400 focus:border-slate-400 dark:bg-slate-900 dark:text-slate-50 dark:border-slate-700"
                                >
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Todos
                                    </SelectItem>
                                    <SelectItem value="homenagem">
                                        Homenagens
                                    </SelectItem>
                                    <SelectItem value="comunicado">
                                        Comunicados
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Local</Label>
                            <Input
                                id="location"
                                placeholder="Cidade ou província"
                                className="text-slate-900 placeholder:text-slate-500 focus:border-slate-400 focus:ring-slate-400"
                                value={filterLocation}
                                onChange={(event) =>
                                    setFilterLocation(event.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sort">Ordenar por</Label>
                            <Select
                                value={sortBy}
                                onValueChange={(value) =>
                                    setSortBy(
                                        value as
                                            | 'recent'
                                            | 'oldest'
                                            | 'name',
                                    )
                                }
                            >
                                <SelectTrigger
                                    id="sort"
                                    className="bg-slate-50 text-slate-900 border-slate-200 focus:ring-slate-400 focus:border-slate-400 dark:bg-slate-900 dark:text-slate-50 dark:border-slate-700"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="recent">
                                        Mais recentes
                                    </SelectItem>
                                    <SelectItem value="oldest">
                                        Mais antigos
                                    </SelectItem>
                                    <SelectItem value="name">
                                        Nome (A–Z)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </section>

                {filteredAnnouncements.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-slate-600">
                        Nenhum anúncio encontrado com os filtros
                        selecionados.
                    </div>
                ) : (
                    <div
                        className={
                            viewMode === 'grid'
                                ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'
                                : 'space-y-4'
                        }
                    >
                        {filteredAnnouncements.map((announcement, index) => (
                            <div
                                key={announcement.id}
                                className={`animate-search-card ${
                                    viewMode === 'list'
                                        ? 'border border-slate-200 rounded-2xl bg-white/80 p-4 shadow-sm'
                                        : ''
                                }`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <AnnouncementCard
                                    announcement={announcement}
                                    variant={viewMode === 'list' ? 'compact' : 'default'}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
