import { createContext, useContext, useState, ReactNode } from 'react';

export interface Announcement {
  id: string;
  type: 'homenagem' | 'comunicado';
  name: string;
  dateOfBirth?: string;
  dateOfDeath: string;
  location: string;
  description: string;
  author: string;
  advertiserName: string;
  advertiserPhone: string;
  advertiserEmail: string;
  advertiserDocument: string; // URL or base64 of uploaded document
  plan: string;
  planPrice: number;
  planDuration: number;
  createdAt: string;
  expiresAt: string;
}

interface AnnouncementContextType {
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt' | 'expiresAt'>) => void;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    type: 'comunicado',
    name: 'Maria Silva Santos',
    dateOfBirth: '1945-03-15',
    dateOfDeath: '2024-11-15',
    location: 'São Paulo, SP',
    description: 'É com profundo pesar que comunicamos o falecimento de Maria Silva Santos. O velório será realizado no Memorial do Carmo às 14h.',
    author: 'Família Santos',
    advertiserName: 'João Santos',
    advertiserPhone: '+258 84 123 4567',
    advertiserEmail: 'joao.santos@email.com',
    advertiserDocument: 'verified',
    plan: 'Anúncio de falecimento 3 dias',
    planPrice: 200,
    planDuration: 3,
    createdAt: '2024-11-15T10:00:00Z',
    expiresAt: '2024-11-18T10:00:00Z'
  },
  {
    id: '2',
    type: 'homenagem',
    name: 'João Pedro Oliveira',
    dateOfBirth: '1958-07-22',
    dateOfDeath: '2024-11-14',
    location: 'Rio de Janeiro, RJ',
    description: 'Pai dedicado, amigo leal e profissional exemplar. Sua bondade e sabedoria estarão sempre em nossos corações. Descanse em paz.',
    author: 'Família Oliveira',
    advertiserName: 'Ana Oliveira',
    advertiserPhone: '+258 85 987 6543',
    advertiserEmail: 'ana.oliveira@email.com',
    advertiserDocument: 'verified',
    plan: 'Homenagem póstuma de 15 dias',
    planPrice: 500,
    planDuration: 15,
    createdAt: '2024-11-14T15:30:00Z',
    expiresAt: '2024-11-29T15:30:00Z'
  },
  {
    id: '3',
    type: 'homenagem',
    name: 'Ana Carolina Ferreira',
    dateOfBirth: '1972-12-03',
    dateOfDeath: '2024-11-13',
    location: 'Belo Horizonte, MG',
    description: 'Mãe amorosa e avó carinhosa. Sua alegria e força de vontade inspiraram a todos que tiveram o privilégio de conhecê-la.',
    author: 'Filhos e Netos',
    advertiserName: 'Carlos Ferreira',
    advertiserPhone: '+258 86 765 4321',
    advertiserEmail: 'carlos.ferreira@email.com',
    advertiserDocument: 'verified',
    plan: 'Homenagem póstuma de 15 dias',
    planPrice: 500,
    planDuration: 15,
    createdAt: '2024-11-13T09:15:00Z',
    expiresAt: '2024-11-28T09:15:00Z'
  },
  {
    id: '4',
    type: 'comunicado',
    name: 'Carlos Alberto Souza',
    dateOfBirth: '1950-05-10',
    dateOfDeath: '2024-11-12',
    location: 'Curitiba, PR',
    description: 'Comunicamos o falecimento de Carlos Alberto Souza. Missa de 7º dia será celebrada na Igreja São José às 19h do dia 19/11.',
    author: 'Família Souza',
    advertiserName: 'Maria Souza',
    advertiserPhone: '+258 87 912 3456',
    advertiserEmail: 'maria.souza@email.com',
    advertiserDocument: 'verified',
    plan: 'Anúncio de falecimento 7 dias',
    planPrice: 300,
    planDuration: 7,
    createdAt: '2024-11-12T11:20:00Z',
    expiresAt: '2024-11-19T11:20:00Z'
  }
];

export function AnnouncementProvider({ children }: { children: ReactNode }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);

  const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'createdAt' | 'expiresAt'>) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(new Date().getTime() + announcement.planDuration * 24 * 60 * 60 * 1000).toISOString()
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  return (
    <AnnouncementContext.Provider value={{ announcements, addAnnouncement }}>
      {children}
    </AnnouncementContext.Provider>
  );
}

export function useAnnouncements() {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error('useAnnouncements must be used within AnnouncementProvider');
  }
  return context;
}