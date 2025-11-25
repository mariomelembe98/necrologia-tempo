# Tempo Necrologia

Aplicação web para publicação, pesquisa e gestão de anúncios necrológicos (homenagens, comunicados e outros anúncios), construída em **Laravel + Inertia + React**.

## Tecnologias

- **Backend**
  - PHP (Laravel)
  - Eloquent ORM
  - Migrations, Seeders, Factories
  - Validação e Resource Controllers
- **Frontend**
  - Inertia.js (React + TypeScript)
  - Vite
  - Tailwind CSS / utilitários de design
  - Lucide Icons
- **Outros**
  - DataTables (zona de administração)
  - Upload de ficheiros (foto do homenageado, documento do anunciante)

## Estrutura principal

- `backend/` – aplicação Laravel (API + frontend Inertia)
  - `app/Models/`
    - `Announcement.php` – anúncio público
    - `AnnouncementPlan.php` – planos de anúncios (3, 7, 15 dias, etc.)
    - `Advertiser.php` – anunciantes (dados de contacto, documentos)
  - `app/Http/Controllers/`
    - `PublicAnnouncementController.php` – site público (home, publicar, pesquisar, ver anúncio)
    - `AnnouncementController.php` – CRUD de anúncios (admin)
    - `DashboardController.php` – dashboard geral (estatísticas)
    - `AdminPlanController.php` – gestão de planos
    - `AdminAdvertiserController.php` – gestão de anunciantes
  - `resources/js/`
    - `layouts/public-layout.tsx` – layout público (header, footer, contexto de anúncios)
    - `context/AnnouncementContext.tsx` – contexto partilhado de anúncios
    - `components/public/`
      - `home.tsx` – hero + destaques + últimos anúncios
      - `publish-page.tsx` – wizard de publicação de anúncio
      - `search-page.tsx` – pesquisa + filtros públicos
      - `announcement-card.tsx` – cartões de anúncio (listas)
      - `announcement-detail.tsx` – detalhe de anúncio (show)
    - `pages/Public/`
      - `Home.tsx`, `Publish.tsx`, `Pesquisar.tsx`, `AnnouncementShow.tsx`
    - `pages/Admin/…` – listagens, detalhe, gestão de planos/anunciantes, etc.
  - `routes/web.php` – rotas web (público + admin)

> Nota: existe um diretório `frontend/` legado com o React original; a aplicação atual vive em `backend/` via Inertia.

## Funcionalidades

### Site público

- **Home**
  - Hero com fundo inspirado nas cores do pôr‑do‑sol.
  - Cartões rápidos para Homenagens, Comunicados, Pesquisa e Publicar.
  - Listagem de anúncios recentes com cartões ricos (foto/iniciais, datas, local, excerto da mensagem).

- **Publicar anúncio**
  - Wizard em passos:
    1. Dados do anúncio  
    2. Dados do anunciante  
    3. Confirmação + formas de pagamento
  - Seleção de **planos** (3, 7, 15 dias, outros) com cards visualmente diferenciados.
  - Upload opcional de **foto do homenageado/falecido**.
  - Upload obrigatório de **documento do anunciante** (BI, passaporte, etc.).
  - Validação de datas (não permitir idade negativa, campos obrigatórios por tipo de anúncio).
  - Mensagens de erro em português.
  - Mensagem de sucesso e redirecionamento após publicar.

- **Pesquisa**
  - Filtros por nome, tipo (Homenagem/Comunicado/Outros), estado, datas, etc.
  - Inputs/selects estilizados para boa leitura (sem fundo branco “estourado” no tema).

- **Página de anúncio (show)**
  - Hero com foto de fundo do anúncio (ou gradiente) e overlay escuro para legibilidade.
  - Cartão com detalhes (datas, local, mensagem, autor).
  - Avatar/foto do homenageado e iniciais quando não existe imagem.
  - Sidebar com **últimos anúncios** (incluindo miniaturas ou iniciais).
  - Botões de partilha (Web Share API, link, WhatsApp/Facebook).

### Administração / Dashboard

- **Dashboard**
  - Visão geral de:
    - volume de anúncios por dia (últimos 14 dias),
    - anúncios por expirar,
    - anúncios recentes.
  - Filtros por período (data inicial/final).
  - Cartões de atalho para secções importantes (anúncios, planos, anunciantes, etc.).

- **Gestão de anúncios** (`/admin/anuncios`)
  - Tabela com DataTables (pesquisa, filtros, ordenação, exportação).
  - Filtros por:
    - nome, anunciante, plano,
    - tipo (Homenagem/Comunicado/Outros),
    - status (Pendente/Publicado/Rejeitado),
    - datas (criação, expiração).
  - Detalhe administrativo com mais campos e logs.

- **Gestão de planos**
  - Listagem de planos (`announcement_plans`).
  - Criar/editar plano, ativar/desativar.
  - Ligação com os planos exibidos na UI pública.

- **Gestão de anunciantes**
  - Listagem com paginação, filtros (por status de documento, etc.).
  - Acesso a documentos e dados de contacto.

## Instalação e configuração

### Pré‑requisitos

- PHP 8.2+ (ou compatível com a versão do Laravel usada)
- Composer
- Node.js 18+ / 20+
- NPM ou Yarn
- MySQL/PostgreSQL (ou outro driver suportado pelo Laravel)

### Passos básicos

1. **Clonar o repositório**

```bash
git clone <url-do-repo>
cd necrologiatempo/backend
```

2. **Instalar dependências PHP e JS**

```bash
composer install
npm install
```

3. **Configurar o `.env`**

```bash
cp .env.example .env
php artisan key:generate
```

Editar o `.env`:

- `APP_URL`
- `DB_*` (host, database, user, password)
- `FILESYSTEM_DISK` (para uploads de fotos/documentos)
- `MAIL_*` (se quiser enviar emails)

4. **Migrar e semear a base de dados**

```bash
php artisan migrate
php artisan db:seed
```

> Os seeders preenchem pelo menos a tabela de **planos de anúncio** (`announcement_plans`) e, opcionalmente, alguns anúncios de exemplo.

5. **Build / Dev**

- Ambiente de desenvolvimento:

```bash
npm run dev
php artisan serve
```

- Ambiente de produção:

```bash
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Fluxo principal

1. Utilizador entra em `/` e consulta anúncios recentes ou clica em **Publicar**.
2. Em `/publicar`, escolhe um plano e preenche o wizard:
   - Dados do anúncio;
   - Dados do anunciante + upload do documento;
   - Confirma responsabilidade e vê instruções de pagamento.
3. O backend valida os dados, grava em `announcements`, gera slug, datas de expiração e associa o plano.
4. O anúncio passa pelo fluxo de moderação (se configurado) e, quando publicado, aparece na página pública e na pesquisa.

## Desenvolvimento

- Os componentes React estão em `resources/js/` e seguem uma estrutura por contexto (Public/Admin).
- O layout público (`public-layout.tsx`) injeta o `AnnouncementContext`, evitando duplicar fetching de anúncios.
- Estilos são baseados em utilitários Tailwind (classes `bg-*`, `text-*`, `border-*`).

## Próximos passos

- Melhorar o fluxo de moderação (estados adicionais, comentários internos).
- Integrar pagamentos reais (EMOLA, M‑Pesa, transferência) com estados de pagamento no dashboard.
- Criar API pública só de leitura para parceiros (por exemplo, funerárias).

