# 🎨 LIVRIA - Design Brief para Estilização Frontend

> **Projeto:** Sistema de Narração de Livros (LIVRIA)  
> **Stack:** Angular 20 + Tailwind CSS 4 + PrimeNG 20  
> **Data:** Janeiro 2026  
> **Objetivo:** Definição de paleta de cores, tipografia e estilização completa do frontend

---

## 📋 Sumário

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Áreas do Sistema](#2-áreas-do-sistema)
3. [Componentes a Estilizar](#3-componentes-a-estilizar)
4. [Tokens de Design Necessários](#4-tokens-de-design-necessários)
5. [Referências de Layout](#5-referências-de-layout)
6. [Entregas Esperadas](#6-entregas-esperadas)
7. [Formato de Retorno](#7-formato-de-retorno)

---

## 1. Visão Geral do Projeto

### 1.1 Sobre o LIVRIA

O LIVRIA é uma plataforma que combina:
- **Sistema de Narração TTS** - Transformação de livros em audiobooks usando IA
- **Rede Social Literária** - Comunidade de escritores e leitores
- **Gamificação** - Sistema de pontos (Livras), conquistas e campanhas

### 1.2 Público-Alvo

- Escritores independentes
- Leitores ávidos
- Consumidores de audiobooks
- Comunidade literária brasileira

### 1.3 Personalidade da Marca

| Atributo | Descrição |
|----------|-----------|
| **Tom** | Acolhedor, intelectual, moderno |
| **Estilo** | Clean, editorial, com toques de gamificação |
| **Sensação** | Biblioteca moderna, criatividade, comunidade |

### 1.4 Cores Atuais (Para Referência)

```css
:root {
  --color-agua: #1E3A5F;     /* Azul profundo */
  --color-madeira: #2D5A27;  /* Verde floresta */
  --color-fogo: #B45309;     /* Laranja terroso */
  --color-terra: #78716C;    /* Cinza pedra */
  --color-metal: #334155;    /* Cinza azulado */
  --color-accent: #7C3AED;   /* Roxo vibrante */
}
```

> ⚠️ **Nota:** Estas cores são apenas referência. O designer deve propor uma nova paleta completa.

---

## 2. Áreas do Sistema

### 2.1 Área do Escritor (Writer Zone)

A área destinada à criação e gestão de conteúdo literário.

#### Páginas

| Página | Descrição | Componentes Principais |
|--------|-----------|------------------------|
| **Dashboard** | Visão geral do escritor | Cards de estatísticas, gráficos, livros recentes |
| **Lista de Livros** | Galeria de livros do autor | Cards de livros, filtros, botão criar |
| **Formulário de Livro** | Criação/edição de livro | Inputs, upload de capa, seleção de gênero |
| **Detalhes do Livro** | Visualização de um livro | Header com capa, tabs de capítulos, personagens |
| **Lista de Capítulos** | Capítulos de um livro | Lista ordenável, status, ações |
| **Editor de Capítulo** | Escrita do capítulo | Editor rich text (Quill), marcação de personagens |
| **Controle de Narração** | Geração de áudio TTS | Player, seleção de vozes, preview |
| **Player de Áudio** | Reprodução do audiobook | Waveform, controles, velocidade |
| **Lista de Personagens** | Personagens do livro | Cards, atribuição de vozes |
| **Formulário de Personagem** | Criar/editar personagem | Inputs, seletor de voz, preview |
| **Lista de Vozes** | Vozes customizadas | Cards de voz, samples de áudio |
| **Formulário de Voz** | Criar voz customizada | Sliders de pitch/speed, SSML |
| **Exportar Opções** | Download de áudio | Seleção de formato, qualidade |

#### Funcionalidades Especiais
- Drag & drop para reordenar capítulos
- Preview de voz em tempo real
- Waveform de áudio
- Status de processamento TTS

---

### 2.2 Área Social (Social Zone)

A rede social literária do LIVRIA.

#### Páginas

| Página | Descrição | Componentes Principais |
|--------|-----------|------------------------|
| **Feed** | Timeline personalizada | Story bar, posts, infinite scroll |
| **Explore** | Descoberta de conteúdo | Trending, categorias, recomendações |
| **Perfil** | Página de usuário | Header, tabs (posts, livros, conquistas) |
| **Detalhes do Post** | Post completo | Post expandido, comentários, replies |
| **Busca** | Busca global | Search bar, tabs (pessoas, livros, posts) |
| **Mensagens** | DMs e conversas | Lista de conversas, chat individual |
| **Notificações** | Central de notificações | Lista agrupada, tipos de notificação |
| **Grupos** | Grupos literários | Lista, detalhes do grupo, membros |
| **Campanhas** | Campanhas de leitura | Progresso, participantes, metas |
| **Trending** | Em alta | Lista rankeada, períodos |

#### Funcionalidades Especiais
- Stories (24h) estilo Instagram
- Real-time updates (WebSocket)
- Badges de notificação
- Indicadores de online/typing

---

### 2.3 Área de Gamificação

#### Páginas

| Página | Descrição | Componentes Principais |
|--------|-----------|------------------------|
| **Livras** | Moeda virtual | Saldo, histórico, loja de pacotes |
| **Conquistas** | Medalhas e badges | Grid de conquistas, categorias, progresso |
| **Planos** | Assinaturas | Cards de planos, comparativo, CTA |
| **Checkout** | Pagamento | Integração Stripe, resumo |

---

### 2.4 Área de Autenticação

#### Páginas

| Página | Descrição | Componentes Principais |
|--------|-----------|------------------------|
| **Login** | Entrada | Form, social login, link cadastro |
| **Cadastro** | Registro | Form multi-step, validações |
| **Esqueci Senha** | Recuperação | Email input, instruções |
| **Perfil/Configurações** | Editar conta | Formulário, upload avatar, preferências |

---

## 3. Componentes a Estilizar

### 3.1 Componentes Globais

#### Layout

| Componente | Descrição | Elementos |
|------------|-----------|-----------|
| **Main Layout** | Layout principal área escritor | Top menu, sidebar (opcional), footer |
| **Social Layout** | Layout rede social | Header, sidebar, bottom nav (mobile) |
| **Auth Layout** | Layout autenticação | Centralizado, branding, form container |

#### Navegação

| Componente | Descrição | Estados |
|------------|-----------|---------|
| **Top Menu Bar** | Barra superior | Logo, menu items, avatar, notificações |
| **Sidebar Nav** | Navegação lateral | Items, active, collapsed |
| **Bottom Navigation** | Nav mobile | 5 items, badges, active |
| **Breadcrumb** | Migalhas de pão | Links, current |
| **Tab Navigation** | Abas de conteúdo | Active, hover, disabled |

---

### 3.2 Componentes de Conteúdo

#### Cards

| Componente | Descrição | Variações |
|------------|-----------|-----------|
| **Book Card** | Card de livro | Default, compact, featured |
| **Chapter Card** | Card de capítulo | List item, grid, with status |
| **Character Card** | Card de personagem | Avatar, voz atribuída |
| **Post Card** | Post no feed | Texto, imagem, link, quote |
| **User Card** | Card de usuário | Mini (lista), full (perfil) |
| **Achievement Card** | Card de conquista | Bloqueado, desbloqueado, progresso |
| **Stat Card** | Card de estatística | Ícone, número, label |
| **Plan Card** | Card de plano | Destaque, popular tag |
| **Group Card** | Card de grupo | Membros count, privado/público |
| **Campaign Card** | Card de campanha | Progresso, deadline |
| **Message Card** | Conversa na lista | Avatar, preview, badge |
| **Notification Card** | Item de notificação | Tipos: like, comment, follow, achievement |

#### Listas

| Componente | Descrição | Features |
|------------|-----------|----------|
| **Comment List** | Lista de comentários | Nested replies, ações |
| **User List** | Lista de usuários | Follow button, bio snippet |
| **Transaction List** | Histórico de Livras | Tipo, valor, timestamp |
| **Search Results** | Resultados de busca | Tabs, highlight match |

---

### 3.3 Componentes Interativos

#### Formulários

| Componente | Descrição | Estados |
|------------|-----------|---------|
| **Input Text** | Campo de texto | Default, focus, error, disabled |
| **Textarea** | Campo multilinhas | Auto-resize, character count |
| **Select/Dropdown** | Seleção | Single, multi, searchable |
| **Checkbox/Radio** | Seleção booleana | Checked, unchecked, indeterminate |
| **Slider** | Controle deslizante | Range, value display |
| **File Upload** | Upload de arquivos | Drag zone, progress, preview |
| **Image Upload** | Upload de imagem | Crop, preview |
| **Rich Text Editor** | Editor Quill | Toolbar, content area |
| **Voice Selector** | Seletor de voz | Preview button, sample |

#### Botões

| Componente | Descrição | Variações |
|------------|-----------|-----------|
| **Primary Button** | Ação principal | Default, hover, loading, disabled |
| **Secondary Button** | Ação secundária | Outlined, text |
| **Icon Button** | Botão com ícone | Round, square |
| **Follow Button** | Seguir/Deixar de seguir | Following, not following, loading |
| **Like Button** | Curtir | Liked, not liked, animation |
| **Share Button** | Compartilhar | Dropdown menu |
| **CTA Button** | Call to action | Large, gradient (opcional) |
| **Floating Action Button** | FAB mobile | Novo post, scroll top |

---

### 3.4 Componentes de Feedback

| Componente | Descrição | Variações |
|------------|-----------|-----------|
| **Toast/Notification** | Mensagens flutuantes | Success, error, warning, info |
| **Modal/Dialog** | Diálogos | Confirm, form, content |
| **Loading Skeleton** | Placeholder de loading | Card, list, text |
| **Empty State** | Estado vazio | Ilustração, mensagem, CTA |
| **Error State** | Estado de erro | Retry button |
| **Progress Bar** | Barra de progresso | Determinate, indeterminate |
| **Badge** | Badges/Tags | Count, status, category |
| **Tooltip** | Dicas contextuais | Dark, light |
| **Avatar** | Foto de perfil | Sizes, fallback initials, online indicator |

---

### 3.5 Componentes Especiais

#### Área Social

| Componente | Descrição | Detalhes |
|------------|-----------|----------|
| **Story Bar** | Barra de stories | Scroll horizontal, círculos |
| **Story Viewer** | Visualizador fullscreen | Progress bar, tap zones |
| **Story Creator** | Criador de story | Capture/upload, texto overlay |
| **Post Composer** | Criar post | Textarea, mídia, emojis |
| **Share Modal** | Modal de compartilhamento | Quote ou repost simples |
| **Trending Section** | Seção trending | Lista rankeada |
| **Chat Bubble** | Mensagem no chat | Sent, received, timestamp |
| **Typing Indicator** | Digitando... | Animação de pontos |
| **Online Indicator** | Usuário online | Dot verde |

#### Área Escritor

| Componente | Descrição | Detalhes |
|------------|-----------|----------|
| **Audio Player** | Player de áudio | Waveform, controles, velocidade |
| **Audio Preview Player** | Preview curto | Mini player, play/stop |
| **Voice Preview** | Preview de voz | Sample text, play |
| **Narration Progress** | Progresso de geração | Percentual, etapa atual |
| **Chapter Status** | Status do capítulo | Draft, published, narrated |
| **Export Card** | Opções de exportação | Formato, qualidade |

#### Gamificação

| Componente | Descrição | Detalhes |
|------------|-----------|----------|
| **Livra Balance** | Saldo no header | Ícone, valor, animação |
| **Livra Animation** | Ganho/perda de Livras | +10 floating up |
| **Achievement Unlock** | Toast de conquista | Medalha, confetti (opcional) |
| **Level Progress** | Barra de nível | XP atual, próximo nível |
| **Leaderboard Item** | Item do ranking | Posição, avatar, score |

---

## 4. Tokens de Design Necessários

### 4.1 Paleta de Cores

Definir cores para:

```
PRIMÁRIAS
├── primary-50 até primary-900 (escala de 10 tons)
├── primary-DEFAULT (cor principal)
└── primary-on (cor do texto sobre primary)

SECUNDÁRIAS
├── secondary-50 até secondary-900
├── secondary-DEFAULT
└── secondary-on

ACCENT/DESTAQUE
├── accent-50 até accent-900
├── accent-DEFAULT
└── accent-on

SEMÂNTICAS
├── success (verde) - 50 até 900
├── warning (amarelo) - 50 até 900
├── error (vermelho) - 50 até 900
├── info (azul) - 50 até 900

NEUTRAS (para backgrounds, textos, borders)
├── neutral-50 até neutral-950
├── surface-ground (background principal)
├── surface-card (cards/elevação)
├── surface-overlay (modais)
├── surface-border
├── text-primary
├── text-secondary
├── text-muted

GAMIFICAÇÃO (opcional, cores específicas)
├── livra (cor da moeda Livras - dourado?)
├── achievement (medalhas - bronze, prata, ouro)
├── level (progresso/XP)
```

### 4.2 Tipografia

```
FONT FAMILIES
├── font-primary (títulos) - ex: Inter, Poppins, Montserrat
├── font-body (corpo) - ex: Inter, Open Sans
├── font-mono (código/números) - ex: JetBrains Mono

FONT SIZES
├── text-xs: 12px
├── text-sm: 14px
├── text-base: 16px
├── text-lg: 18px
├── text-xl: 20px
├── text-2xl: 24px
├── text-3xl: 30px
├── text-4xl: 36px

FONT WEIGHTS
├── font-normal: 400
├── font-medium: 500
├── font-semibold: 600
├── font-bold: 700

LINE HEIGHTS
├── leading-tight: 1.25
├── leading-normal: 1.5
├── leading-relaxed: 1.75
```

### 4.3 Espaçamento

```
SPACING SCALE (já padrão Tailwind)
├── 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64

ESPECÍFICOS
├── component-padding-sm: 8px
├── component-padding-md: 16px
├── component-padding-lg: 24px
├── card-padding: 16px ou 24px
├── section-gap: 24px ou 32px
```

### 4.4 Bordas e Sombras

```
BORDER RADIUS
├── rounded-sm: 4px
├── rounded-md: 8px
├── rounded-lg: 12px
├── rounded-xl: 16px
├── rounded-2xl: 24px
├── rounded-full: 9999px

BORDER WIDTH
├── border-default: 1px
├── border-thick: 2px

SHADOWS
├── shadow-sm (botões)
├── shadow-md (cards)
├── shadow-lg (modais)
├── shadow-xl (dropdowns elevados)
```

### 4.5 Transições e Animações

```
DURATIONS
├── duration-fast: 150ms
├── duration-normal: 300ms
├── duration-slow: 500ms

EASINGS
├── ease-default: ease-in-out

ANIMAÇÕES ESPECÍFICAS
├── fade-in
├── slide-up
├── scale-in
├── like-pulse (animação do coração)
├── livra-float (moedas subindo)
├── skeleton-shimmer (loading)
```

---

## 5. Referências de Layout

### 5.1 Desktop (≥1024px)

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER (64px altura)                                            │
│  [Logo]     [Search Bar]              [Notif] [Msgs] [Avatar]   │
├──────────────┬───────────────────────────────────────────────────┤
│              │                                                   │
│   SIDEBAR    │              MAIN CONTENT                         │
│   (240px)    │              (flex, centralizado)                 │
│              │                                                   │
│   - Feed     │   ┌─────────────────────────────────────────┐     │
│   - Explore  │   │                                         │     │
│   - Grupos   │   │          Content Area                   │     │
│   - Livras   │   │          (max-width: 680px para feed)  │     │
│   - Perfil   │   │                                         │     │
│              │   └─────────────────────────────────────────┘     │
│   [Novo Post]│                                                   │
│              │                                                   │
│   ──────     │                                                   │
│   Área       │                                                   │
│   Escritor   │                                                   │
│              │                                                   │
└──────────────┴───────────────────────────────────────────────────┘
```

### 5.2 Mobile (<768px)

```
┌─────────────────────────┐
│  HEADER (56px)          │
│  [Logo]      [Icons]    │
├─────────────────────────┤
│                         │
│                         │
│      MAIN CONTENT       │
│      (full width)       │
│                         │
│                         │
│                         │
│                         │
├─────────────────────────┤
│  BOTTOM NAV (64px)      │
│  [Home][Search][+][Notif][Profile]
└─────────────────────────┘
```

### 5.3 Área do Escritor - Dashboard

```
┌──────────────────────────────────────────────────────────────────┐
│  [Título: Dashboard]    [Bem-vindo message]                      │
├──────────────────────────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                    │
│  │ STAT 1 │ │ STAT 2 │ │ STAT 3 │ │ STAT 4 │   ← Stat Cards     │
│  │ Livros │ │Capítulos│ │Concluídos│ │Progresso│                 │
│  └────────┘ └────────┘ └────────┘ └────────┘                    │
├─────────────────────────┬────────────────────────────────────────┤
│    ┌─────────────────┐  │    ┌──────────────────────────────┐   │
│    │                 │  │    │  LIVROS RECENTES             │   │
│    │   CHART         │  │    │  [Book 1]                    │   │
│    │   (Doughnut)    │  │    │  [Book 2]                    │   │
│    │                 │  │    │  [Book 3]                    │   │
│    └─────────────────┘  │    │  [Ver Todos →]               │   │
│                         │    └──────────────────────────────┘   │
└─────────────────────────┴────────────────────────────────────────┘
```

---

## 6. Entregas Esperadas

### 6.1 Documento de Design System

1. **Paleta de Cores Completa**
   - Cores primárias, secundárias, accent
   - Cores semânticas (success, error, warning, info)
   - Cores neutras (backgrounds, textos, borders)
   - Variações light/dark mode

2. **Tipografia**
   - Font families escolhidas (Google Fonts ou similares)
   - Escala tipográfica
   - Hierarquia de headings

3. **Componentes Estilizados**
   - Referências visuais para cada componente listado
   - Estados (hover, active, disabled, focus)
   - Variações de tamanho quando aplicável

4. **Iconografia**
   - Estilo de ícones (PrimeIcons já incluso, mas pode sugerir complementar)

### 6.2 Formatos Aceitos

| Formato | Uso |
|---------|-----|
| **Figma** | Preferencial - Design System completo |
| **Adobe XD** | Alternativa ao Figma |
| **Sketch** | Se Figma não disponível |
| **PDF/Imagens** | Referências rápidas |

---

## 7. Formato de Retorno

### 7.1 Arquivo CSS de Tokens

O designer deve retornar um arquivo de configuração que será aplicado via IA:

```css
/* design-tokens.css - Exemplo de formato esperado */

:root {
  /* Cores Primárias */
  --color-primary-50: #value;
  --color-primary-100: #value;
  --color-primary-200: #value;
  --color-primary-300: #value;
  --color-primary-400: #value;
  --color-primary-500: #value; /* DEFAULT */
  --color-primary-600: #value;
  --color-primary-700: #value;
  --color-primary-800: #value;
  --color-primary-900: #value;
  
  /* Cores Secundárias */
  --color-secondary-50: #value;
  /* ... */
  
  /* Cores Semânticas */
  --color-success: #value;
  --color-warning: #value;
  --color-error: #value;
  --color-info: #value;
  
  /* Neutras */
  --color-neutral-50: #value;
  /* ... até 950 */
  
  /* Superfícies */
  --surface-ground: var(--color-neutral-50);
  --surface-card: #ffffff;
  --surface-overlay: rgba(0,0,0,0.5);
  --surface-border: var(--color-neutral-200);
  
  /* Textos */
  --text-primary: var(--color-neutral-900);
  --text-secondary: var(--color-neutral-600);
  --text-muted: var(--color-neutral-400);
  
  /* Tipografia */
  --font-primary: 'Font Name', sans-serif;
  --font-body: 'Font Name', sans-serif;
  
  /* Gamificação */
  --color-livra: #FFD700; /* exemplo: dourado */
  --color-achievement-bronze: #CD7F32;
  --color-achievement-silver: #C0C0C0;
  --color-achievement-gold: #FFD700;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* Dark Mode */
.dark {
  --surface-ground: var(--color-neutral-900);
  --surface-card: var(--color-neutral-800);
  --text-primary: var(--color-neutral-50);
  --text-secondary: var(--color-neutral-300);
  /* ... */
}
```

### 7.2 Configuração PrimeNG Theme

```typescript
// primeng-theme-config.ts - Para configurar o tema PrimeNG

import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const LivriaPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{valor}',
      100: '{valor}',
      // ...
    },
    // ...
  }
});

export default LivriaPreset;
```

### 7.3 Tailwind Config

```javascript
// tailwind.config.js additions
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          // ...
        },
        // ...
      },
      fontFamily: {
        sans: ['var(--font-primary)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

---

## 8. Checklist para o Designer

### Cores
- [ ] Paleta primária (10 tons)
- [ ] Paleta secundária (10 tons)
- [ ] Cor accent/destaque
- [ ] Cores semânticas (success, error, warning, info)
- [ ] Cores neutras (backgrounds, borders, textos)
- [ ] Cores especiais (Livras, conquistas)
- [ ] Versão dark mode

### Tipografia
- [ ] Fonte para headings
- [ ] Fonte para body text
- [ ] Hierarquia de tamanhos
- [ ] Pesos utilizados

### Componentes Principais
- [ ] Botões (primary, secondary, text, icon)
- [ ] Cards (book, post, user, achievement)
- [ ] Formulários (inputs, selects, textareas)
- [ ] Navegação (header, sidebar, bottom nav)
- [ ] Modais e overlays
- [ ] Toast/Notifications
- [ ] Estados vazios e loading

### Layouts
- [ ] Header desktop e mobile
- [ ] Sidebar
- [ ] Bottom navigation mobile
- [ ] Grid de cards
- [ ] Layout de perfil
- [ ] Layout de feed

### Extras
- [ ] Animações sugeridas
- [ ] Ilustrações/empty states (opcional)
- [ ] Ícones customizados (se necessário)


> **Nota Final:** Este documento será utilizado como base para aplicar a estilização via IA (Claude/Copilot). Quanto mais detalhado e estruturado o retorno do designer (especialmente os tokens CSS), mais rápida e precisa será a implementação.
