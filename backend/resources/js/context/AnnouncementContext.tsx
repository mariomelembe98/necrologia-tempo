import { createContext, useContext, useState, type ReactNode } from 'react';

export type AnnouncementType = 'homenagem' | 'comunicado' | 'outros';

export interface Announcement {
    id: string;
    slug: string;
    photoUrl?: string | null;
    type: AnnouncementType;
    name: string;
    dateOfBirth?: string;
    dateOfDeath: string;
    location: string;
    description: string;
    author: string;
    advertiserName: string;
    advertiserPhone: string;
    advertiserEmail: string;
    advertiserDocument: string;
    plan: string;
    planPrice: number;
    planDuration: number;
    createdAt: string;
    expiresAt: string;
}

interface AnnouncementContextValue {
    announcements: Announcement[];
    addAnnouncement: (
        data: Omit<Announcement, 'id' | 'slug' | 'createdAt' | 'expiresAt'>,
    ) => Announcement;
}

const AnnouncementContext = createContext<AnnouncementContextValue | undefined>(
    undefined,
);

const mockAnnouncements: Announcement[] = [
    {
        id: '1',
        slug: 'maria-silva-santos',
        photoUrl: null,
        type: 'comunicado',
        name: 'Maria Silva Santos',
        dateOfBirth: '1945-03-15',
        dateOfDeath: '2024-11-15',
        location: 'São Paulo, SP',
        description:
            'É com profundo pesar que comunicamos o falecimento de Maria Silva Santos. O velório será realizado no Memorial do Carmo às 14h.',
        author: 'Família Santos',
        advertiserName: 'João Santos',
        advertiserPhone: '+258 84 123 4567',
        advertiserEmail: 'joao.santos@example.com',
        advertiserDocument: 'verified',
        plan: 'Anúncio de falecimento 3 dias',
        planPrice: 200,
        planDuration: 3,
        createdAt: '2024-11-15T10:00:00Z',
        expiresAt: '2024-11-18T10:00:00Z',
    },
    {
        id: '2',
        slug: 'joao-pedro-oliveira',
        photoUrl: null,
        type: 'homenagem',
        name: 'João Pedro Oliveira',
        dateOfBirth: '1958-07-22',
        dateOfDeath: '2024-11-14',
        location: 'Rio de Janeiro, RJ',
        description:
            'Pai dedicado, amigo leal e profissional exemplar. Sua bondade e sabedoria estarão sempre em nossos corações.',
        author: 'Família Oliveira',
        advertiserName: 'Ana Oliveira',
        advertiserPhone: '+258 85 987 6543',
        advertiserEmail: 'ana.oliveira@example.com',
        advertiserDocument: 'verified',
        plan: 'Homenagem póstuma de 15 dias',
        planPrice: 500,
        planDuration: 15,
        createdAt: '2024-11-14T15:30:00Z',
        expiresAt: '2024-11-29T15:30:00Z',
    },
];

export function AnnouncementProvider({
    children,
    initialAnnouncements,
}: {
    children: ReactNode;
    initialAnnouncements?: Announcement[];
}) {
    const [announcements, setAnnouncements] = useState<Announcement[]>(
        initialAnnouncements && initialAnnouncements.length > 0
            ? initialAnnouncements
            : mockAnnouncements,
    );

    const addAnnouncement = (
        data: Omit<Announcement, 'id' | 'slug' | 'createdAt' | 'expiresAt'>,
    ): Announcement => {
        const now = new Date();
        const expiresAt = new Date(now);
        expiresAt.setDate(now.getDate() + data.planDuration);

        const slugBase = data.name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const announcement: Announcement = {
            ...data,
            slug: slugBase ? `${slugBase}-${Date.now()}` : Date.now().toString(),
            id: Date.now().toString(),
            createdAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
        };

        setAnnouncements((prev) => [announcement, ...prev]);

        return announcement;
    };

    return (
        <AnnouncementContext.Provider value={{ announcements, addAnnouncement }}>
            {children}
        </AnnouncementContext.Provider>
    );
}

export function useAnnouncements(): AnnouncementContextValue {
    const context = useContext(AnnouncementContext);

    if (!context) {
        throw new Error(
            'useAnnouncements must be used within AnnouncementProvider',
        );
    }

    return context;
}
