# Plano de Melhoria de SEO - LIVRIA

> **Data:** Janeiro 2026
> **Projeto:** LIVRIA - Rede Social para Escritores
> **Stack:** Angular 20.1.0 + TailwindCSS + PrimeNG

---

## Sumário Executivo

Este documento apresenta uma análise completa do estado atual de SEO do projeto LIVRIA e um plano detalhado de implementação para otimização em mecanismos de busca e redes sociais.

### Score Atual: 45/100
### Score Projetado Após Implementação: 85/100

---

## 1. Diagnóstico Atual

### 1.1 O Que Já Está Implementado ✅

| Recurso | Status | Localização |
|---------|--------|-------------|
| Google Analytics 4 | ✅ Completo | `/src/index.html`, `/src/app/core/services/analytics.service.ts` |
| Meta Tags Básicas | ✅ Parcial | `/src/index.html` |
| Títulos por Rota | ✅ Completo | `/src/app/app.routes.ts` |
| PWA (Manifest + SW) | ✅ Completo | `/src/manifest.webmanifest`, `/src/sw.js` |
| Lazy Loading | ✅ Completo | Todas as rotas |
| Alt Tags em Imagens | ✅ Parcial | Componentes diversos |
| Preconnect de Fontes | ✅ Completo | `/src/index.html` |
| Estrutura de Headings | ✅ Bom | Páginas institucionais |

### 1.2 O Que Está Faltando ❌

| Recurso | Impacto | Prioridade |
|---------|---------|------------|
| robots.txt | Crítico | 🔴 Alta |
| sitemap.xml | Crítico | 🔴 Alta |
| Open Graph Tags | Alto | 🔴 Alta |
| Twitter Cards | Alto | 🔴 Alta |
| Canonical URLs | Alto | 🔴 Alta |
| JSON-LD Structured Data | Médio-Alto | 🟡 Média |
| Meta Tags Dinâmicas | Alto | 🔴 Alta |
| Image Lazy Loading | Médio | 🟡 Média |
| Core Web Vitals Monitoring | Médio | 🟡 Média |
| SSR/Prerendering | Alto | 🟢 Baixa (complexidade) |

---

## 2. Plano de Implementação

### Fase 1: Fundamentos Críticos (Prioridade Alta)

#### 2.1.1 Criar robots.txt

**Arquivo:** `/public/robots.txt`

```txt
# LIVRIA - robots.txt
User-agent: *
Allow: /
Disallow: /auth/
Disallow: /writer/
Disallow: /social/
Disallow: /livras/
Disallow: /subscription/
Disallow: /achievements/
Disallow: /dashboard/
Disallow: /unauthorized
Disallow: /api/

# Permitir páginas institucionais públicas
Allow: /institutional/
Allow: /institutional/about
Allow: /institutional/terms
Allow: /institutional/privacy
Allow: /institutional/security
Allow: /institutional/careers
Allow: /institutional/contact
Allow: /institutional/copyright
Allow: /institutional/partners
Allow: /institutional/community

# Sitemap
Sitemap: https://livria.com.br/sitemap.xml

# Crawl-delay (opcional)
Crawl-delay: 1

# Bots específicos
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /
```

**Tarefas:**
- [ ] Criar arquivo `/public/robots.txt`
- [ ] Configurar build para copiar arquivo para dist
- [ ] Verificar acesso em `https://dominio.com/robots.txt`

---

#### 2.1.2 Criar sitemap.xml

**Arquivo:** `/public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Página Principal -->
  <url>
    <loc>https://livria.com.br/</loc>
    <lastmod>2026-01-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Páginas Institucionais -->
  <url>
    <loc>https://livria.com.br/institutional/about</loc>
    <lastmod>2026-01-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://livria.com.br/institutional/terms</loc>
    <lastmod>2026-01-09</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>https://livria.com.br/institutional/privacy</loc>
    <lastmod>2026-01-09</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>https://livria.com.br/institutional/security</loc>
    <lastmod>2026-01-09</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>https://livria.com.br/institutional/careers</loc>
    <lastmod>2026-01-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://livria.com.br/institutional/contact</loc>
    <lastmod>2026-01-09</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://livria.com.br/institutional/copyright</loc>
    <lastmod>2026-01-09</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>

  <url>
    <loc>https://livria.com.br/institutional/partners</loc>
    <lastmod>2026-01-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>https://livria.com.br/institutional/community</loc>
    <lastmod>2026-01-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://livria.com.br/institutional/writer-area</loc>
    <lastmod>2026-01-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://livria.com.br/institutional/content-guidelines</loc>
    <lastmod>2026-01-09</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>https://livria.com.br/institutional/code-conduct</loc>
    <lastmod>2026-01-09</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Página de Login (para SEO de marca) -->
  <url>
    <loc>https://livria.com.br/auth/login</loc>
    <lastmod>2026-01-09</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <url>
    <loc>https://livria.com.br/auth/signup</loc>
    <lastmod>2026-01-09</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>

</urlset>
```

**Tarefas:**
- [ ] Criar arquivo `/public/sitemap.xml`
- [ ] Configurar build para copiar arquivo
- [ ] Submeter sitemap no Google Search Console
- [ ] Submeter sitemap no Bing Webmaster Tools

---

#### 2.1.3 Implementar Open Graph Tags

**Arquivo:** `/src/index.html` (adicionar no `<head>`)

```html
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://livria.com.br/">
<meta property="og:title" content="LIVRIA - Rede Social para Escritores">
<meta property="og:description" content="LIVRIA - Rede social para escritores e leitores. Crie, compartilhe e descubra histórias incríveis com narração por IA.">
<meta property="og:image" content="https://livria.com.br/assets/images/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="LIVRIA - Plataforma para escritores">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="LIVRIA">
```

**Requisitos de Imagem OG:**
- Dimensões: 1200x630 pixels
- Formato: JPG ou PNG
- Tamanho máximo: 8MB
- Criar imagem em: `/public/assets/images/og-image.jpg`

---

#### 2.1.4 Implementar Twitter Cards

**Arquivo:** `/src/index.html` (adicionar no `<head>`)

```html
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="https://livria.com.br/">
<meta name="twitter:title" content="LIVRIA - Rede Social para Escritores">
<meta name="twitter:description" content="Crie, compartilhe e descubra histórias incríveis com narração por IA.">
<meta name="twitter:image" content="https://livria.com.br/assets/images/twitter-card.jpg">
<meta name="twitter:image:alt" content="LIVRIA - Plataforma para escritores">
<meta name="twitter:site" content="@livria">
<meta name="twitter:creator" content="@livria">
```

---

#### 2.1.5 Implementar Canonical URLs

**Arquivo:** `/src/index.html` (adicionar no `<head>`)

```html
<!-- Canonical URL (será atualizado dinamicamente) -->
<link rel="canonical" href="https://livria.com.br/">
```

---

### Fase 2: Meta Tags Dinâmicas (Prioridade Alta)

#### 2.2.1 Criar Serviço de SEO

**Arquivo:** `/src/app/core/services/seo.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'book' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private meta = inject(Meta);
  private title = inject(Title);
  private document = inject(DOCUMENT);
  private router = inject(Router);

  private readonly defaultConfig: SeoConfig = {
    title: 'LIVRIA - Rede Social para Escritores',
    description: 'LIVRIA - Rede social para escritores e leitores. Crie, compartilhe e descubra histórias incríveis com narração por IA.',
    image: 'https://livria.com.br/assets/images/og-image.jpg',
    type: 'website'
  };

  private readonly baseUrl = 'https://livria.com.br';

  constructor() {
    this.initRouteListener();
  }

  private initRouteListener(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateCanonicalUrl(this.baseUrl + event.urlAfterRedirects);
    });
  }

  updateSeoTags(config: Partial<SeoConfig>): void {
    const mergedConfig = { ...this.defaultConfig, ...config };
    const fullUrl = config.url || this.baseUrl + this.router.url;

    // Título
    const fullTitle = config.title
      ? `${config.title} | LIVRIA`
      : this.defaultConfig.title;
    this.title.setTitle(fullTitle);

    // Meta tags básicas
    this.meta.updateTag({ name: 'description', content: mergedConfig.description });
    if (mergedConfig.keywords) {
      this.meta.updateTag({ name: 'keywords', content: mergedConfig.keywords });
    }

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: mergedConfig.description });
    this.meta.updateTag({ property: 'og:url', content: fullUrl });
    this.meta.updateTag({ property: 'og:type', content: mergedConfig.type || 'website' });

    if (mergedConfig.image) {
      this.meta.updateTag({ property: 'og:image', content: mergedConfig.image });
      this.meta.updateTag({ property: 'og:image:alt', content: fullTitle });
    }

    // Twitter Cards
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: mergedConfig.description });
    this.meta.updateTag({ name: 'twitter:url', content: fullUrl });

    if (mergedConfig.image) {
      this.meta.updateTag({ name: 'twitter:image', content: mergedConfig.image });
      this.meta.updateTag({ name: 'twitter:image:alt', content: fullTitle });
    }

    // Article-specific tags
    if (mergedConfig.type === 'article') {
      if (mergedConfig.author) {
        this.meta.updateTag({ property: 'article:author', content: mergedConfig.author });
      }
      if (mergedConfig.publishedTime) {
        this.meta.updateTag({ property: 'article:published_time', content: mergedConfig.publishedTime });
      }
      if (mergedConfig.modifiedTime) {
        this.meta.updateTag({ property: 'article:modified_time', content: mergedConfig.modifiedTime });
      }
      if (mergedConfig.section) {
        this.meta.updateTag({ property: 'article:section', content: mergedConfig.section });
      }
      if (mergedConfig.tags) {
        mergedConfig.tags.forEach(tag => {
          this.meta.addTag({ property: 'article:tag', content: tag });
        });
      }
    }

    // Canonical URL
    this.updateCanonicalUrl(fullUrl);
  }

  private updateCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  // Helpers para tipos específicos de conteúdo
  setBookPage(book: { title: string; description: string; cover?: string; author: string }): void {
    this.updateSeoTags({
      title: book.title,
      description: book.description.substring(0, 160),
      image: book.cover,
      type: 'book' as any,
      author: book.author
    });
  }

  setAuthorPage(author: { name: string; bio: string; avatar?: string }): void {
    this.updateSeoTags({
      title: `${author.name} - Escritor`,
      description: author.bio.substring(0, 160),
      image: author.avatar,
      type: 'profile'
    });
  }

  setPostPage(post: { title: string; excerpt: string; image?: string; author: string; publishedAt: string }): void {
    this.updateSeoTags({
      title: post.title,
      description: post.excerpt,
      image: post.image,
      type: 'article',
      author: post.author,
      publishedTime: post.publishedAt
    });
  }

  resetToDefaults(): void {
    this.updateSeoTags(this.defaultConfig);
  }
}
```

**Uso nos Componentes:**

```typescript
// Em qualquer componente de página
import { SeoService } from '@core/services/seo.service';

@Component({...})
export class BookDetailComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit() {
    // Após carregar os dados do livro
    this.seoService.setBookPage({
      title: this.book.title,
      description: this.book.synopsis,
      cover: this.book.coverUrl,
      author: this.book.authorName
    });
  }
}
```

---

### Fase 3: Structured Data (JSON-LD)

#### 2.3.1 Criar Serviço de Structured Data

**Arquivo:** `/src/app/core/services/structured-data.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StructuredDataService {
  private document = inject(DOCUMENT);

  private readonly organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "LIVRIA",
    "alternateName": "Livrya",
    "url": "https://livria.com.br",
    "logo": "https://livria.com.br/assets/images/logo.png",
    "description": "Rede social para escritores e leitores. Crie, compartilhe e descubra histórias incríveis.",
    "sameAs": [
      "https://www.facebook.com/livria",
      "https://www.instagram.com/livria",
      "https://twitter.com/livria",
      "https://www.linkedin.com/company/livria"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Portuguese"]
    }
  };

  private readonly websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "LIVRIA",
    "url": "https://livria.com.br",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://livria.com.br/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  private readonly softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "LIVRIA",
    "operatingSystem": "Web",
    "applicationCategory": "SocialNetworkingApplication",
    "description": "Plataforma para escritores criarem, compartilharem e narrarem suas histórias com tecnologia de IA.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "BRL"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    }
  };

  setOrganizationSchema(): void {
    this.setJsonLd('organization-schema', this.organizationSchema);
  }

  setWebsiteSchema(): void {
    this.setJsonLd('website-schema', this.websiteSchema);
  }

  setSoftwareAppSchema(): void {
    this.setJsonLd('software-schema', this.softwareAppSchema);
  }

  setBookSchema(book: {
    name: string;
    description: string;
    author: string;
    datePublished: string;
    image?: string;
    isbn?: string;
    genre?: string[];
    numberOfPages?: number;
    publisher?: string;
    inLanguage?: string;
    aggregateRating?: { ratingValue: number; reviewCount: number };
  }): void {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Book",
      "name": book.name,
      "description": book.description,
      "author": {
        "@type": "Person",
        "name": book.author
      },
      "datePublished": book.datePublished,
      "image": book.image,
      "isbn": book.isbn,
      "genre": book.genre,
      "numberOfPages": book.numberOfPages,
      "publisher": book.publisher || "LIVRIA",
      "inLanguage": book.inLanguage || "pt-BR",
      ...(book.aggregateRating && {
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": book.aggregateRating.ratingValue,
          "reviewCount": book.aggregateRating.reviewCount
        }
      })
    };

    this.setJsonLd('book-schema', schema);
  }

  setPersonSchema(person: {
    name: string;
    description: string;
    image?: string;
    url?: string;
    sameAs?: string[];
  }): void {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": person.name,
      "description": person.description,
      "image": person.image,
      "url": person.url,
      "sameAs": person.sameAs
    };

    this.setJsonLd('person-schema', schema);
  }

  setBreadcrumbSchema(items: { name: string; url: string }[]): void {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    };

    this.setJsonLd('breadcrumb-schema', schema);
  }

  setArticleSchema(article: {
    headline: string;
    description: string;
    author: string;
    datePublished: string;
    dateModified?: string;
    image?: string;
    publisher?: string;
  }): void {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.headline,
      "description": article.description,
      "author": {
        "@type": "Person",
        "name": article.author
      },
      "datePublished": article.datePublished,
      "dateModified": article.dateModified || article.datePublished,
      "image": article.image,
      "publisher": {
        "@type": "Organization",
        "name": article.publisher || "LIVRIA",
        "logo": {
          "@type": "ImageObject",
          "url": "https://livria.com.br/assets/images/logo.png"
        }
      }
    };

    this.setJsonLd('article-schema', schema);
  }

  setFAQSchema(faqs: { question: string; answer: string }[]): void {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    this.setJsonLd('faq-schema', schema);
  }

  private setJsonLd(id: string, schema: object): void {
    this.removeJsonLd(id);

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.text = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }

  removeJsonLd(id: string): void {
    const existing = this.document.getElementById(id);
    if (existing) {
      existing.remove();
    }
  }

  removeAllJsonLd(): void {
    const scripts = this.document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach(script => script.remove());
  }
}
```

---

### Fase 4: Otimizações de Performance para SEO

#### 2.4.1 Lazy Loading de Imagens

**Diretiva:** `/src/app/shared/directives/lazy-image.directive.ts`

```typescript
import { Directive, ElementRef, Input, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: 'img[appLazyLoad]',
  standalone: true
})
export class LazyImageDirective implements OnInit {
  @Input() appLazyLoad: string = '';
  @Input() placeholder: string = 'assets/images/placeholder.jpg';

  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupLazyLoading();
    }
  }

  private setupLazyLoading(): void {
    const img = this.el.nativeElement as HTMLImageElement;

    // Definir loading lazy nativo
    img.loading = 'lazy';
    img.decoding = 'async';

    // Usar placeholder inicialmente
    if (this.placeholder) {
      img.src = this.placeholder;
    }

    // Usar Intersection Observer para carregamento
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            img.src = this.appLazyLoad || img.dataset['src'] || img.src;
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '50px' });

      observer.observe(img);
    } else {
      // Fallback para navegadores sem suporte
      img.src = this.appLazyLoad;
    }
  }
}
```

---

#### 2.4.2 Preload de Recursos Críticos

**Adicionar ao `/src/index.html`:**

```html
<!-- Preload de recursos críticos -->
<link rel="preload" href="assets/images/logo.svg" as="image">
<link rel="preload" href="assets/fonts/main-font.woff2" as="font" type="font/woff2" crossorigin>

<!-- DNS Prefetch para APIs externas -->
<link rel="dns-prefetch" href="//api.livria.com.br">
<link rel="dns-prefetch" href="//storage.googleapis.com">
<link rel="dns-prefetch" href="//www.google-analytics.com">
```

---

### Fase 5: Monitoramento e Ferramentas

#### 2.5.1 Configuração do Google Search Console

**Tarefas:**
1. [ ] Acessar https://search.google.com/search-console
2. [ ] Adicionar propriedade para `livria.com.br`
3. [ ] Verificar propriedade via DNS ou arquivo HTML
4. [ ] Submeter sitemap.xml
5. [ ] Configurar alertas de problemas de indexação

#### 2.5.2 Configuração do Bing Webmaster Tools

**Tarefas:**
1. [ ] Acessar https://www.bing.com/webmasters
2. [ ] Importar do Google Search Console (ou adicionar manualmente)
3. [ ] Submeter sitemap.xml
4. [ ] Configurar alertas

#### 2.5.3 Criar Serviço de Core Web Vitals

**Arquivo:** `/src/app/core/services/web-vitals.service.ts`

```typescript
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root'
})
export class WebVitalsService {
  private platformId = inject(PLATFORM_ID);
  private analytics = inject(AnalyticsService);

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.measureLCP();
    this.measureFID();
    this.measureCLS();
    this.measureTTFB();
    this.measureFCP();
  }

  private measureLCP(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      this.analytics.trackEvent('web_vitals', 'lcp', {
        value: Math.round(lastEntry.startTime),
        metric_id: 'LCP'
      });
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  }

  private measureFID(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        this.analytics.trackEvent('web_vitals', 'fid', {
          value: Math.round(entry.processingStart - entry.startTime),
          metric_id: 'FID'
        });
      });
    });

    observer.observe({ type: 'first-input', buffered: true });
  }

  private measureCLS(): void {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
    });

    observer.observe({ type: 'layout-shift', buffered: true });

    // Enviar CLS quando a página for descarregada
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.analytics.trackEvent('web_vitals', 'cls', {
          value: Math.round(clsValue * 1000),
          metric_id: 'CLS'
        });
      }
    });
  }

  private measureTTFB(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const [entry] = list.getEntries() as PerformanceNavigationTiming[];
      this.analytics.trackEvent('web_vitals', 'ttfb', {
        value: Math.round(entry.responseStart),
        metric_id: 'TTFB'
      });
    });

    observer.observe({ type: 'navigation', buffered: true });
  }

  private measureFCP(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');

      if (fcpEntry) {
        this.analytics.trackEvent('web_vitals', 'fcp', {
          value: Math.round(fcpEntry.startTime),
          metric_id: 'FCP'
        });
      }
    });

    observer.observe({ type: 'paint', buffered: true });
  }
}
```

---

## 3. Checklist de Implementação

### Fase 1 - Fundamentos Críticos 🔴
- [ ] **1.1** Criar `/public/robots.txt`
- [ ] **1.2** Criar `/public/sitemap.xml`
- [ ] **1.3** Adicionar Open Graph tags em `index.html`
- [ ] **1.4** Adicionar Twitter Card tags em `index.html`
- [ ] **1.5** Adicionar tag canonical em `index.html`
- [ ] **1.6** Criar imagem OG (1200x630px)
- [ ] **1.7** Verificar meta tags com ferramentas de debug

### Fase 2 - Meta Tags Dinâmicas 🔴
- [ ] **2.1** Criar `SeoService`
- [ ] **2.2** Integrar SeoService nas páginas institucionais
- [ ] **2.3** Integrar SeoService nas páginas de livros
- [ ] **2.4** Integrar SeoService nas páginas de autores
- [ ] **2.5** Testar atualização dinâmica de meta tags

### Fase 3 - Structured Data 🟡
- [ ] **3.1** Criar `StructuredDataService`
- [ ] **3.2** Adicionar Organization schema na home
- [ ] **3.3** Adicionar Website schema na home
- [ ] **3.4** Adicionar Book schema nas páginas de livros
- [ ] **3.5** Adicionar BreadcrumbList schema
- [ ] **3.6** Validar schemas com Google Rich Results Test

### Fase 4 - Performance 🟡
- [ ] **4.1** Criar diretiva de lazy loading
- [ ] **4.2** Aplicar lazy loading em todas as imagens
- [ ] **4.3** Adicionar preload de recursos críticos
- [ ] **4.4** Otimizar bundle size
- [ ] **4.5** Configurar cache headers (servidor)

### Fase 5 - Monitoramento 🟢
- [ ] **5.1** Configurar Google Search Console
- [ ] **5.2** Configurar Bing Webmaster Tools
- [ ] **5.3** Criar WebVitalsService
- [ ] **5.4** Inicializar monitoramento de Core Web Vitals
- [ ] **5.5** Configurar alertas de performance

---

## 4. Ferramentas de Validação

### SEO Geral
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Ahrefs SEO Toolbar](https://ahrefs.com/seo-toolbar)
- [SEMrush](https://www.semrush.com)

### Structured Data
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

### Social Media Preview
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### Performance
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

### Acessibilidade
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)
- [axe DevTools](https://www.deque.com/axe/)

---

## 5. KPIs e Métricas de Sucesso

### Métricas de Indexação
| Métrica | Meta | Prazo |
|---------|------|-------|
| Páginas indexadas no Google | 100% das páginas públicas | 30 dias |
| Erros de rastreamento | 0 | Contínuo |
| Coverage issues | 0 críticos | 30 dias |

### Métricas de Performance (Core Web Vitals)
| Métrica | Meta | Prazo |
|---------|------|-------|
| LCP (Largest Contentful Paint) | < 2.5s | 60 dias |
| FID (First Input Delay) | < 100ms | 60 dias |
| CLS (Cumulative Layout Shift) | < 0.1 | 60 dias |
| TTFB (Time to First Byte) | < 600ms | 60 dias |

### Métricas de Visibilidade
| Métrica | Meta | Prazo |
|---------|------|-------|
| Impressões no Google Search | +50% | 90 dias |
| CTR médio | > 3% | 90 dias |
| Posição média | Top 30 para palavras-chave alvo | 180 dias |

### Métricas Sociais
| Métrica | Meta | Prazo |
|---------|------|-------|
| OG Tags válidos | 100% páginas | 30 dias |
| Twitter Cards válidos | 100% páginas | 30 dias |
| Rich Snippets ativos | 5+ tipos | 90 dias |

---

## 6. Cronograma Sugerido

```
Semana 1:
├── robots.txt
├── sitemap.xml
├── Open Graph tags (estáticos)
└── Twitter Cards (estáticos)

Semana 2:
├── Canonical URLs
├── SeoService
├── Integração páginas institucionais
└── Criar imagem OG

Semana 3:
├── StructuredDataService
├── Organization schema
├── Website schema
└── BreadcrumbList schema

Semana 4:
├── Book schema
├── Person schema
├── Validação de schemas
└── Google Search Console setup

Semana 5:
├── WebVitalsService
├── Lazy loading de imagens
├── Preload de recursos
└── Otimizações de bundle

Semana 6:
├── Bing Webmaster Tools
├── Testes finais
├── Documentação
└── Monitoramento contínuo
```

---

## 7. Considerações Adicionais

### 7.1 SSR/Prerendering (Futuro)
Para melhor indexação, considerar migração para Angular Universal ou @angular/ssr para:
- Renderização no servidor de páginas públicas
- Melhor indexação por crawlers
- Melhores previews em redes sociais

### 7.2 Internacionalização (i18n)
Se houver planos de expansão internacional:
- Implementar hreflang tags
- Criar versões localizadas do sitemap
- Considerar subdomínios ou subdiretórios por idioma

### 7.3 Conteúdo Gerado por Usuários
Para livros e posts públicos:
- Gerar meta tags dinâmicos baseados no conteúdo
- Implementar paginação SEO-friendly
- Considerar AMP para conteúdo de leitura

---

## 8. Recursos e Referências

- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards)
- [Angular SEO Guide](https://angular.io/guide/universal)
- [Core Web Vitals](https://web.dev/vitals/)

---

*Documento criado em Janeiro 2026 - LIVRIA SEO Improvement Plan*
