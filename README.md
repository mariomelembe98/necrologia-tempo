# Tempo Necrologia

Aplicacao web para publicacao, pesquisa e gestao de anuncios necrologicos
(homenagens, comunicados e outros anuncios), construída em **Laravel + Inertia + React**.

---

## Tecnologias

- **Backend**
  - PHP 8.x (Laravel)
  - Eloquent ORM
  - Migrations, Seeders, Factories
  - Validacao e Controllers REST
- **Frontend**
  - Inertia.js (React + TypeScript)
  - Vite
  - Tailwind CSS / utilitarios de design (classes utilitarias)
  - Lucide Icons
- **Outros**
  - DataTables (zona de administracao)
  - Upload de ficheiros (foto do homenageado, documento do anunciante)
  - Envio de emails via Laravel Mail (notificacao de novo anuncio)

---

## Estrutura principal

Laravel vive na raiz do projecto.

- `app/Models/`
  - `Announcement.php` – anuncio publico
  - `AnnouncementPlan.php` – planos de anuncios (3, 7, 15 dias, etc.)
  - `Advertiser.php` – anunciantes (dados de contacto, documentos)
- `app/Http/Controllers/`
  - `PublicAnnouncementController.php` – site publico (home, publicar, pesquisar, ver anuncio)
  - `AnnouncementController.php` – criacao e actualizacao de anuncios (admin + endpoint publico de store)
  - `DashboardController.php` – dashboard geral (estatisticas)
  - `AdminPlanController.php` – gestao de planos
  - `AdminAdvertiserController.php` – gestao de anunciantes
- `app/Mail/`
  - `AnnouncementSubmitted.php` – mailable de notificacao quando um anuncio e submetido
- `resources/views/`
  - `app.blade.php` – layout base Inertia
  - `emails/announcements/submitted.blade.php` – template HTML do email de novo anuncio
- `resources/js/`
  - `layouts/public-layout.tsx` – layout publico (header, footer, contexto de anuncios)
  - `components/public/`
    - `home.tsx` – hero + destaques + ultimos anuncios
    - `publish-page.tsx` – pagina de publicacao (wizard + planos)
    - `search-page.tsx` – pesquisa + filtros publicos
    - `announcement-card.tsx` – cartoes de anuncio (listas)
    - `announcement-detail.tsx` – detalhe de anuncio (show)
    - `header.tsx` – cabecalho publico
  - `pages/Public/`
    - `Home.tsx`, `Publish.tsx`, `Pesquisar.tsx`, `AnnouncementShow.tsx`
  - `pages/Admin/...` – listagens, detalhe, gestao de planos/anunciantes, etc.
- `routes/web.php` – rotas web (publico + admin)

---

## Funcionalidades

### Site publico

**Home**

- Hero com slideshow de imagens (pasta `public/images/hero`) e overlay nas cores do por do sol.
- Titulo com a fonte Verona Bold apenas no hero.
- Cartoes rapidos para Homenagens, Comunicados, Pesquisa e Publicar.
- Listagem de anuncios recentes com cartoes ricos (foto/iniciais, datas, local, excerto da mensagem).

**Publicar anuncio**

- Lista de **planos** disponiveis (3, 7, 15 dias, outros) carregados da tabela `announcement_plans`.
- Cartoes de plano com cores e icones (comunicado, homenagem, outros), usando o mesmo visual do frontend original.
- Cada cartao exibe a promoção “Grátis até 10/12/2025”, com o valor original riscado e um badge verde.
- Um aviso destacado no topo do formulario reforça que a submissão é gratuita durante a promoção e pode ser fechado pelo utilizador.
- Formulario completo:
  - Dados do anuncio (tipo, nome, datas, local, mensagem, autor).
  - Dados do anunciante (nome, telefone, email opcional, documento).
  - Upload opcional de **foto do homenageado/falecido**.
  - Upload obrigatorio de **documento de identificacao** (BI, passaporte, carta, PDF).
  - Checkbox de declaracao de responsabilidade.
  - Cartao com formas de pagamento (EMOLA, M‑Pesa, transferencia).
- Validacao:
  - Datas consistentes (nao permite idade negativa).
  - Campos obrigatorios variam conforme o tipo (por exemplo, comunicado exige data de falecimento).
  - Mensagens de erro em portugues.
- UX:
  - Um unico formulario com boa responsividade (mobile e desktop).
  - Ao submeter:
    - valida no frontend e backend;
    - cria registos em `advertisers` e `announcements`;
    - gera `slug` unico para o anuncio;
    - define `expires_at` com base no plano (quando existir);
    - envia email de notificacao para a equipa;
    - volta para `/publicar`, mostra mensagem de sucesso no topo,
      limpa os campos e faz scroll suave para cima;
    - o botao "Publicar anuncio" fica desactivado enquanto o pedido esta a ser processado.

**Checkout e pagamento M-Pesa**

- Depois de criar o anuncio, o utilizador e redirecionado para `/checkout/{slug}` para confirmar o pagamento.
- A pagina mostra o plano, o valor (marcado como gratuito ate 10/12/2025 durante a promocao), um campo de telefone e um botao que dispara o STK push (com badge “Pagamento recebido” apos o pedido).
- O `CheckoutController` usa o `MpesaService` para iniciar a cobranca, grava o `payment_reference`, marca `payment_status = paid`, atualiza `paid_at` e publica o anuncio (`status = published` / `published_at` definidas) assim que a API responde com sucesso.
- Apenas anuncios com `status = published` e `expires_at` futuro aparecem no site publico (home, pesquisa, homenagens, comunicados e pagina individual).

**Pesquisa**

- Pagina com o mesmo background do por do sol da pagina de publicar.
- Filtros por:
  - nome,
  - tipo (Homenagem / Comunicado / Outros),
  - estado (apenas anuncios publicados sao exibidos),
  - datas (intervalo).
- Campos de filtro com bom contraste (cores ajustadas para leitura).

**Pagina de anuncio (show)**

- Hero com a foto do anuncio como background (quando existe), com overlay para garantir legibilidade.
- Card de detalhe com:
  - tipo, nome, idade (calculada pelas datas), datas formatadas, local, mensagem e autor.
  - bloco para mostrar a foto do anuncio em destaque, alem do hero.
- Sidebar direita (desktop) com lista de ultimos anuncios, incluindo miniaturas ou iniciais.
- Botao de partilha sempre visivel (inclusive em mobile), usando Web Share API quando disponivel.

### Administracao / Dashboard

**Dashboard**

- Visao geral com:
  - volume de anuncios criados por dia (ultimos 14 dias),
  - anuncios a expirar em breve,
  - ultimos anuncios criados.
- Filtros por periodo (data inicial/final).
- Cartoes de atalho para:
  - listagem de anuncios,
  - planos,
  - anunciantes.

**Gestao de anuncios** (`/admin/anuncios`)

- Tabela avançada (DataTables) com:
  - paginacao,
  - pesquisa,
  - ordenacao por coluna,
  - filtros por nome, anunciante, plano, tipo, status e datas,
  - botoes de exportacao (copiar, CSV, imprimir).
- Detalhe administrativo do anuncio com mais campos e logs.
- Accao para actualizar o status (`pending`, `published`, `rejected`, `archived`).

**Gestao de planos**

- Listagem de planos de anuncio (`announcement_plans`).
- Criar/editar plano (nome, tipo, duracao em dias, preco).
- Activar/desactivar planos.
- Estes planos sao usados directamente na pagina publica de publicar anuncio.

**Gestao de anunciantes**

- Listagem com paginacao.
- Filtros por nome, email, telefone, status de documento, etc.
- Permite ver e validar documentos enviados.

### Notificacoes por email

- Quando um anuncio e submetido via `/publicar`, o `AnnouncementController@store`:
  - cria o anuncio com status `pending`;
  - dispara o mailable `AnnouncementSubmitted`;
  - o email usa a view `resources/views/emails/announcements/submitted.blade.php`.
- O email contem:
  - dados principais do anuncio (tipo, nome, datas, local, mensagem, autor);
  - informacao do plano e status;
  - dados do anunciante (nome, email, telefone).
- A configuracao de SMTP e feita via `.env`.

---

## Instalacao e configuracao

### Pre‑requisitos

- PHP 8.2+
- Composer
- Node.js 18+ (ou superior)
- NPM (ou Yarn)
- Base de dados (MySQL, PostgreSQL, etc.)

### Passos

1. **Clonar o repositorio**

```bash
git clone <url-do-repo>
cd necrologiatempo
```

2. **Instalar dependencias PHP e JS**

```bash
composer install
npm install
```

3. **Configurar o `.env`**

```bash
cp .env.example .env
php artisan key:generate
```

Editar o `.env` com:

- `APP_URL`
- `DB_*` (host, database, user, password)
- `FILESYSTEM_DISK=public` (para uploads de fotos/documentos)
- `MPESA_HOST` (API privada, ex: `https://api.sandbox.vm.co.mz:18352`)
- `MPESA_ORIGIN` (origem usada no header `<Origin>`, ex: `developer.mpesa.vm.co.mz`)
- `MPESA_API_KEY` (token completo para `Authorization: Bearer ...`)
- `MPESA_SERVICE_PROVIDER_CODE` (ex: `171717`)
- `MPESA_ENV` (`sandbox` ou `production`)
- `MPESA_TIMEOUT` (tempo limite em segundos para chamadas M-Pesa)
- Secao de mail, por exemplo:

```env
MAIL_MAILER=smtp
MAIL_HOST=mail.tempo.co.mz
MAIL_PORT=587
MAIL_USERNAME=tempo@tempo.co.mz
MAIL_PASSWORD=***colocar_senha_aqui***
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=tempo@tempo.co.mz
MAIL_FROM_NAME="Tempo Necrologia"
```

4. **Migrar e semear a base de dados**

```bash
php artisan migrate
php artisan db:seed
```

Os seeders populam, entre outras coisas, a tabela `announcement_plans`
com os planos usados no frontend (3, 7, 15 dias, etc.).

5. **Executar em desenvolvimento**

Em dois terminais:

```bash
php artisan serve
npm run dev
```

6. **Build para producao**

```bash
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## Fluxo principal

1. O utilizador entra em `/` e pode:
   - ver anuncios recentes,
   - pesquisar,
   - ou clicar em **Publicar anuncio**.
2. Em `/publicar`:
   - escolhe um plano,
   - preenche os dados do anuncio e do anunciante,
   - envia foto (opcional) e documento (obrigatorio),
   - aceita a declaracao de responsabilidade.
3. O backend:
   - valida os dados;
   - cria ou reutiliza o `Advertiser` com base em email ou telefone;
   - grava o `Announcement` com slug unico e `status = pending`;
   - calcula `expires_at` a partir do plano;
   - guarda paths de foto e documento;
   - envia email de notificacao.
4. O pedido redireciona para `/checkout/{slug}` mostrando uma mensagem de sucesso e limpando o formulario, para que o anunciante confirme o pagamento M-Pesa.
5. Na administracao, um utilizador pode rever o anuncio e mudar o status para `published`.
6. Somente anuncios com `status = published` e `expires_at` no futuro aparecem no site publico
   (home, homenagens, comunicados, pesquisa e pagina individual).

---

## Desenvolvimento

- Componentes React estao em `resources/js`, organizados por contexto
  (publico e admin).
- O layout publico (`public-layout.tsx`) centraliza o header, footer e estilos
  da parte publica.
- Estilos sao feitos com classes utilitarias tipo Tailwind (sem dependencia
  obrigatoria do runtime do Tailwind).
- A app usa Inertia, portanto cada pagina React e carregada via rotas Laravel.

---

## Proximos passos (ideias)

- Melhorar o fluxo de moderacao:
  - comentarios internos,
  - razoes de rejeicao,
  - historico de alteracoes.
- Adicionar estado de pagamento no `Announcement` (pending/paid/failed)
  e integracao real com EMOLA / M‑Pesa / transferencia.
- Criar API publica de leitura para integracao com parceiros (por exemplo, funerarias).
- Internacionalizacao (pt / en) da interface publica e administrativa.
