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
        slug: 'curratilaine-remane',
        photoUrl: 'https://i0.wp.com/revista.tempo.co.mz/wp-content/uploads/DESFOCADO-02.07.2025.png?resize=696%2C928&ssl=1',
        type: 'homenagem',
        name: 'Curratilaine Remane',
        dateOfDeath: '2026-02-13',
        location: 'Inhambane, Moçambique',
        description:
            'Curratilaine Remane: Uma Ode à Integridade e à Memória\n\nDas entranhas da cidade eterna - entre os becos sinuosos de Chalambe e as praias vibrantes do Matadouro e da Prancha — nasceu o fervor de ser manhambana de gema. Na memória, ecoam os assaltos joviais às amêndoas do velho nhachalane, as futeboladas desenfreadas no Rio Grande e os namoricos juvenis, embalados pela brisa marítima e cúmplice da lua.\n\nFoi nesse cenário de efervescência e simplicidade que moldaste teu carácter: íntegro e leal, como um rio que traça seu leito com a força da natureza.\n\nComo diziam os mais velhos, em tempos de sabedoria popular: “Quem não tomou chá de Ceilão não pode ser alguém de confiança.” Tu, és prova viva dessa máxima, diante de ti, nos curvamos.\n\nO Baluarte da Integridade no Mar de Seguros\n\nNo labirinto do sector de seguros, foste um farol de rectidão. Da Emose à Ímpar, da Seguradora Internacional de Moçambique à Fidelidade-Ímpar, e na presidência da Associação Moçambicana de Seguradoras, tua conduta sempre foi marcada pela serenidade e integridade.\n\nA corrente da malandragem, que tantas vezes verga outros, nunca te tocou. Foste exemplo, para a família, amigos, colegas e para a sociedade. Um pilar que não cede. Uma rocha inabalável.\n\nO Poeta da Serenidade, o Avô Guerreiro\n\nHoje, como os grandes guerreiros que depõem as armas após bravas batalhas, tuas mãos soltaram o escudo do profissional incansável. Agora, empunhas a armadura de pai e avô, transmitindo uma serenidade que lembra um lago límpido e calmo.\n\nAli, o som traquina dos netos arranca sorrisos nostálgicos, que te transportam à infância: as travessias da linha férrea rumo à escola Carvalho Araújo, os dias na Escola Técnica, e a migração forçada à capital em busca do saber.\n\nBem-haja, amigo Tainito, como carinhosamente teus amigos te chamam. Que a serenidade te envolva e que as risadas dos netos continuem a pintar a tela da tua vida com cores de alegria e paz.',
        author: 'Amigos e Família',
        advertiserName: 'Comissão de Homenagem',
        advertiserPhone: '+258 84 000 0000',
        advertiserEmail: 'homenagem.curratilaine@example.com',
        advertiserDocument: 'verified',
        plan: 'Homenagem póstuma de 15 dias',
        planPrice: 500,
        planDuration: 15,
        createdAt: '2026-02-13T09:00:00Z',
        expiresAt: '2026-02-28T09:00:00Z',
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
