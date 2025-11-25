import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { SearchPage } from './components/SearchPage';
import { PublishPage } from './components/PublishPage';
import { AnnouncementDetail } from './components/AnnouncementDetail';
import { AnnouncementProvider } from './context/AnnouncementContext';

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  return (
    <div className={isHome ? '' : 'min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'}>
      <Header />
      {children}
    </div>
  );
}

export default function App() {
  return (
    <AnnouncementProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/homenagens" element={<SearchPage type="homenagem" />} />
            <Route path="/comunicados" element={<SearchPage type="comunicado" />} />
            <Route path="/pesquisar" element={<SearchPage />} />
            <Route path="/publicar" element={<PublishPage />} />
            <Route path="/anuncio/:id" element={<AnnouncementDetail />} />
          </Routes>
        </Layout>
      </Router>
    </AnnouncementProvider>
  );
}