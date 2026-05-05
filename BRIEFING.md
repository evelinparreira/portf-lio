# Briefing Técnico — Portfólio Evelin Parreira

> Este documento é o "ponto de verdade" do projeto. Toda decisão técnica e de design está aqui. Em caso de dúvida, consulte este documento antes de inferir.

---

## 1. Contexto e objetivo

Construir um portfólio pessoal estático, performático e fácil de manter, que sirva à transição de carreira da Evelin Parreira para posições de **Product Owner / APM / Product Manager**.

A Evelin já tem uma versão em HTML único do portfólio (anexada como referência de conteúdo). Este projeto **não é uma migração 1:1** — é uma reconstrução com decisões deliberadas de arquitetura, design e narrativa.

### Critérios de sucesso
- Site estático, performático (Lighthouse 95+ em todas as métricas)
- Estrutura modular: cada case é um arquivo Markdown editável sem mexer em código
- Visual maduro e distintivo, com tipografia bem-resolvida e identidade própria
- Funciona perfeitamente sem JavaScript (progressive enhancement)
- Mobile-first responsivo
- Acessível: respeita `prefers-reduced-motion`, contraste AA mínimo, navegação por teclado funcional

---

## 2. Stack

| Camada | Escolha | Versão |
|---|---|---|
| Framework | **Astro** | 6.x |
| Linguagem | **TypeScript** | strict mode |
| Estilo | **Tailwind CSS v4** (via `@tailwindcss/vite`) | 4.x |
| Conteúdo | **Astro Content Collections** (Markdown + Zod) | nativo |
| Runtime | **Node.js** | 22.12+ |
| Hospedagem | **Cloudflare Pages** | subdomínio gratuito por enquanto |
| Versionamento | **Git** + GitHub | — |

### Notas técnicas importantes
- **NÃO usar** o pacote `@astrojs/tailwind` — está deprecated para Tailwind v4. Usar **`@tailwindcss/vite`** como Vite plugin.
- Importar `z` de **`astro/zod`** (não de `astro:content`, que está deprecated).
- Definir collections em **`src/content.config.ts`** (não `src/content/config.ts` — mudou na Astro 5+).
- Sem JS por padrão (Astro é zero-JS). Usar `<script>` inline apenas onde necessário (ex.: timeline interativa, fade-in com IntersectionObserver).

---

## 3. Arquitetura de pastas

```
portfolio-evelin/
├── public/
│   ├── covers/                      ← peças autorais da Evelin (covers dos cases)
│   │   ├── pesquisa-clima.png
│   │   ├── produtos-bancarios.png
│   │   ├── primeiros-passos.png
│   │   ├── venda-consultiva.png    (placeholder até ela enviar)
│   │   ├── ecossistema.png         (placeholder até ela enviar)
│   │   └── lms.png
│   ├── photos/
│   │   └── evelin.jpg               ← foto do hero
│   ├── fonts/                       ← Inter + DM Serif Display self-hosted
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Hero.astro
│   │   ├── About.astro
│   │   ├── Timeline.astro           ← timeline interativa de experiência
│   │   ├── CaseCard.astro           ← card usado na home (3 colunas)
│   │   ├── CaseNav.astro            ← anterior/próximo no rodapé do case
│   │   ├── Contact.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro         ← <head>, meta, fontes, body wrapper
│   │   └── CaseLayout.astro         ← layout interno de um case
│   ├── content/
│   │   └── cases/
│   │       ├── pesquisa-clima.md
│   │       ├── produtos-bancarios.md
│   │       ├── primeiros-passos.md
│   │       ├── venda-consultiva.md
│   │       ├── ecossistema.md
│   │       └── lms.md
│   ├── pages/
│   │   ├── index.astro              ← home
│   │   └── cases/
│   │       └── [slug].astro         ← gera /cases/pesquisa-clima etc
│   ├── styles/
│   │   └── global.css               ← @import "tailwindcss" + @theme tokens + reset
│   └── content.config.ts            ← schema dos cases (Zod)
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

---

## 4. Schema de conteúdo (Astro Content Collections)

### `src/content.config.ts`

```ts
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const cases = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/cases" }),
  schema: z.object({
    order: z.number(),                    // ordem na home (1 = primeiro)
    title: z.string(),
    subtitle: z.string().optional(),
    teaser: z.string(),                   // 1 frase tagline
    categories: z.array(z.string()),      // ["Produto", "RH", ...]
    cover: z.string(),                    // caminho relativo /covers/x.png
    desafio: z.string(),                  // 1 frase
    solucao: z.string(),                  // 1 frase
    metrics: z.array(
      z.object({
        value: z.string(),                // "+237%", "80%", "R$0"
        label: z.string(),                // "Volume de respostas"
      })
    ).length(3),                          // sempre 3 métricas
    externalLinks: z.array(
      z.object({
        title: z.string(),
        url: z.string().url(),
        type: z.enum(["video", "article", "page"]).optional(),
      })
    ).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { cases };
```

### Exemplo de arquivo de case (`src/content/cases/pesquisa-clima.md`)

```markdown
---
order: 1
title: "Evolução da pesquisa de clima"
subtitle: "Para aumento de adesão, confiança e eficiência"
teaser: "De 19% para 80% de adesão, com -65% de custo por resposta"
categories: ["Produto", "RH", "Experiência do Colaborador"]
cover: "/covers/pesquisa-clima.png"
desafio: "Pesquisa com 19% de adesão, falhas operacionais e baixa percepção de valor."
solucao: "Evolução contínua do produto em três frentes: redução de fricção, experiência e engajamento."
metrics:
  - value: "80%"
    label: "Pico de adesão (era 19%)"
  - value: "+237%"
    label: "Volume de respostas"
  - value: "-65%"
    label: "Custo por resposta"
---

## 01 — Contexto

A empresa já possuía uma pesquisa de clima contínua...

## 02 — Problema

Como aumentar a eficiência da pesquisa de clima...

[... corpo do case em markdown ...]
```

### Ordem dos cases (campo `order`)

| order | slug | título |
|---|---|---|
| 1 | `pesquisa-clima` | Evolução da pesquisa de clima |
| 2 | `produtos-bancarios` | Solução escalável de aprendizagem para produtos bancários |
| 3 | `primeiros-passos` | Produto Educacional Jovem Aprendiz: Primeiros Passos |
| 4 | `venda-consultiva` | Transformação do modelo comercial para venda consultiva |
| 5 | `ecossistema` | Ecossistema de aprendizagem corporativa |
| 6 | `lms` | Plataforma de aprendizagem de baixo custo |

A home renderiza os cases ordenados por `order` ASC. Navegação anterior/próximo dentro do case usa o mesmo critério.

---

## 5. Design tokens

Definir em **`src/styles/global.css`** usando o `@theme` do Tailwind v4 (CSS-first config).

```css
@import "tailwindcss";

@theme {
  /* Cores */
  --color-navy: #1e3657;
  --color-navy-dark: #14263f;
  --color-lime: #d3ff00;
  --color-brown: #7a5c3e;
  --color-brown-light: #c4a882;
  --color-red-accent: #e03030;
  --color-bg: #f5f4f0;
  --color-bg-card: #ffffff;
  --color-text: #111111;
  --color-text-muted: #666666;
  --color-border: #e0ddd6;

  /* Fontes */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-display: "DM Serif Display", serif;

  /* Easing */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
```

### Paleta — uso pretendido

| Token | Uso |
|---|---|
| `navy` | Fundo de seções escuras, texto principal de títulos, CTA primária |
| `lime` | Destaque sobre navy (CTA text, accent), pequenos elementos |
| `brown` | Italic em headlines (estilo editorial), sutilezas |
| `red-accent` | Section labels (etiquetas pequenas, como "PROJETOS") |
| `bg` | Fundo geral (creme) |
| `bg-card` | Fundo de cards brancos |

### Tipografia

- **Inter** → corpo de texto, navegação, labels, métricas, **títulos dos cards de case (sans bold compacto)**
- **DM Serif Display** → headline do hero ("Evelin"), section titles ("Sobre mim", "Cases", "Minha Jornada"), italic em destaques

Self-hostar ambas em `public/fonts/` para evitar latência de Google Fonts e CLS.

### Breakpoints (Tailwind defaults, com ajuste leve)

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px (grid de 3 colunas dos cases ativa aqui)
- `xl`: 1280px
- `2xl`: 1536px

---

## 6. Componentes — especificação

### `Nav.astro`
- Fixo no topo, altura 72px
- Background semitransparente com backdrop-filter blur
- Logo "EP." à esquerda, links ao centro/direita, CTA "Contato" à direita
- Em mobile (`<sm`): logo + hamburger (menu drawer simples)
- Estado `scrolled`: background mais opaco quando `window.scrollY > 40`

### `Hero.astro`
- Grid 55fr / 45fr em `lg+`, 1 coluna em mobile
- Esquerda: badge "Product Owner | APM | Product Manager", headline "Olá, sou _Evelin_ Parreira." (DM Serif Display, "Evelin" em italic + cor brown), parágrafo, 2 CTAs
- Direita (lg+ apenas): foto da Evelin em card 3:4 com gradiente decorativo
- **Mobile: foto não aparece** (decisão da Evelin — foco em texto)

### `About.astro`
- Faixa horizontal de 3 colunas (texto / stats / vivências)
- Stats: 5+ anos, 40+ projetos, 3k+ pessoas
- Vivências: tags pílula com habilidades
- Section title "Sobre mim" em DM Serif Display
- Bio (texto canônico):
  > "Atuo há 5 anos liderando produtos internos voltados à experiência do colaborador e à cultura organizacional em uma fintech, com abordagem end-to-end de produto, do discovery à evolução contínua, com foco em geração de valor, tomada de decisão orientada por dados e construção de soluções escaláveis, mesmo em cenários de alta complexidade e restrição de recursos."

### `Timeline.astro`
- Timeline horizontal scrollável com cards de experiência
- Card ativo expande (cor navy + texto lime), demais ficam compactos com ano grande em opacidade baixa
- Setas de navegação + dots indicadores
- 4 entradas: 2022 DHO, 2021 T&D, 2019 Antifraude, 2018 Atendimento
- Section title "Minha Jornada"

### `CaseCard.astro` ⭐ (componente crítico)
**Props:** recebe um `CollectionEntry<"cases">`

**Layout (3 colunas em `lg+`):**
- Cover na proporção **3:2** (não 2:1 como no original) com badge de categoria sobreposto
- Título em **Inter Bold** compacto (não serif), tamanho ~1rem
- Label "DESAFIO" pequeno (caps, letter-spacing alto, cor navy) + 1 frase
- Label "SOLUÇÃO" pequeno + 1 frase
- 3 métricas em linha (valor + label, peso visual igual)
- CTA seta circular "→" no canto inferior direito

**Hover:**
- Cover: zoom suave (`scale(1.05)`) com `overflow:hidden`
- CTA: desliza ligeiramente para direita
- Card: `translateY(-5px)` + sombra suave

**Acessibilidade:**
- O card inteiro é clicável (link envolvendo tudo) — não apenas a setinha
- `aria-label` descrevendo o case completo
- Focus ring visível no estado de teclado

**Grid:** 3 colunas em `lg+`, 2 em `md`, 1 em `sm`. Gap de 1rem.

### `CaseLayout.astro`
- Topbar fixo com "← Voltar ao portfólio" + logo central + badge "CASE" à direita
- Hero do case em fundo navy (categoria, título, subtítulo, métricas hero)
- Conteúdo do markdown renderizado em largura confortável (~720px de leitura)
- Componente `CaseNav` no rodapé com anterior/próximo (loop circular)
- Botão "Voltar ao portfólio" final

### `CaseNav.astro`
- Recebe o slug atual + lista ordenada de cases
- Calcula anterior e próximo (com wrap: depois do último → primeiro)
- Renderiza dois links: "← Case anterior: [título]" e "Próximo case: [título] →"

### `Footer.astro`
**Desktop (3 colunas):**
- Esquerda: nome + cargo "Product Owner · APM · Product Manager"
- Centro: links rápidos (Sobre, Jornada, Cases, Contato)
- Direita: email + LinkedIn + linha pequena "© 2026"

**Mobile:** empilhado em coluna única, centralizado.

### `Contact.astro`
- Card grande em fundo navy com decoração circular (lime + brown semitransparentes)
- Título "Vamos _conversar?_" (italic em "conversar" + cor lime)
- Links: email + LinkedIn em estilo card
- Sem formulário (é só link)

---

## 7. Conteúdo dos cases — fonte

A Evelin tem 6 arquivos HTML originais com o conteúdo de cada case (anexados como referência). O conteúdo deles deve ser **copiado para os arquivos `.md`** de cada case, mantendo:

- Estrutura "01 — Contexto / 02 — Problema / 03 — Discovery / ..."
- Cards de insights com emoji + título + descrição
- Banda de impacto com 3 métricas
- Listas de iteração e referências/links externos

**Importante:** o conteúdo é fiel ao original. Reescritas serão feitas pela Evelin depois, num momento separado. **Não inventar conteúdo nem interpretar livremente.**

---

## 8. Plano de fases

### Fase 1 — Setup (sessão única)
1. `npm create astro@latest` (template "Empty", TypeScript strict)
2. Instalar Tailwind v4: `npm install tailwindcss @tailwindcss/vite`
3. Configurar `astro.config.mjs` com plugin Tailwind via Vite
4. Criar `src/styles/global.css` com `@import "tailwindcss"` + `@theme` tokens
5. Self-hostar fontes Inter (400, 500, 600, 700, 800) + DM Serif Display (400, italic) em `public/fonts/`
6. Adicionar fontes no global.css com `@font-face` e `font-display: swap`
7. Configurar deploy no Cloudflare Pages (conectar repo GitHub)
8. Commit inicial + deploy de teste (homepage placeholder)

**Saída esperada:** site rodando localmente com `npm run dev`, hello world em produção no Cloudflare.

### Fase 2 — Componentes base (sessão única)
1. Criar `BaseLayout.astro` com `<head>`, meta tags, link de fontes, slot do body
2. Criar `Nav.astro` com fixed top, blur, links âncora
3. Criar `Hero.astro` com headline + foto desktop
4. Criar `About.astro` com bio nova + stats + vivências
5. Criar `Timeline.astro` interativa
6. Criar `Contact.astro`
7. Criar `Footer.astro` com 3 colunas
8. Montar `src/pages/index.astro` orquestrando todos os componentes
9. Validar responsivo em 390px / 768px / 1024px / 1440px
10. Commit + deploy

**Saída esperada:** home completa exceto seção "Cases" (placeholder).

### Fase 3 — Sistema de cases (sessão única)
1. Criar `src/content.config.ts` com schema Zod
2. Criar 6 arquivos `.md` em `src/content/cases/` com frontmatter + conteúdo (copiar dos HTMLs originais)
3. Criar `CaseCard.astro` seguindo a especificação do bloco 6
4. Adicionar grid de cases na home (`getCollection("cases")` + sort por `order`)
5. Criar `src/pages/cases/[slug].astro` com `getStaticPaths()` para gerar todas as rotas
6. Criar `CaseLayout.astro` para o layout interno
7. Criar `CaseNav.astro` com lógica de anterior/próximo (loop)
8. Adicionar covers em `public/covers/` (Evelin enviará as peças; usar placeholders coloridos onde ainda não tiver)
9. Commit + deploy

**Saída esperada:** todos os 6 cases navegáveis, home com grid funcionando.

### Fase 4 — Refinamentos (sessão única)
1. Animações de entrada (`fade-up`) com `IntersectionObserver`, mas com **fallback sem JS** (sem JS, tudo aparece direto)
2. Implementar `@media (prefers-reduced-motion: reduce)` desabilitando animações
3. Hover state polido nos cards (zoom no cover, CTA desliza)
4. Polimento de mobile (especialmente timeline e grid de cases)
5. Otimização de imagens (Astro `<Image>` para covers, formatos modernos automáticos)
6. Verificar Lighthouse (mirar 95+ em todas as métricas)
7. Adicionar meta tags OpenGraph/Twitter para preview de link
8. Adicionar `sitemap.xml` (integração `@astrojs/sitemap`) + `robots.txt`
9. Commit + deploy final

**Saída esperada:** v1 publicada e pronta para a Evelin compartilhar.

---

## 9. Critérios de aceite

Cada fase só é considerada completa quando:

- [ ] `npm run build` roda sem erros nem warnings críticos
- [ ] `npm run preview` mostra o site funcionando como em produção
- [ ] Lighthouse (modo desktop): Performance 95+, Accessibility 95+, Best Practices 95+, SEO 95+
- [ ] Site funciona com JavaScript desabilitado (conteúdo legível, navegação funcional)
- [ ] Mobile (390px): nada fica cortado, nada estoura horizontal scroll
- [ ] Navegação por teclado completa (Tab, Enter, Escape em modais se houver)
- [ ] Sem erros no console do navegador
- [ ] Build do Cloudflare Pages passa
- [ ] URLs amigáveis (sem `.html`, sem query strings desnecessárias)

---

## 10. Anti-patterns explícitos (NÃO fazer)

- ❌ Não usar `@astrojs/tailwind` (deprecated). Usar `@tailwindcss/vite`.
- ❌ Não usar `tailwind.config.js` para Tailwind v4. Configurar via `@theme` no CSS.
- ❌ Não importar `z` de `astro:content`. Usar `astro/zod`.
- ❌ Não usar React/Vue/Svelte para componentes — Astro nativo é suficiente.
- ❌ Não criar uma SPA. Cada case é uma página real (`/cases/slug`), não rota client-side.
- ❌ Não usar `localStorage`/`sessionStorage`. Não há necessidade nesse projeto.
- ❌ Não usar Google Fonts via CDN. Self-hostar em `public/fonts/`.
- ❌ Não usar emoji em gradiente como cover de case. Usar peças autorais da Evelin (ou placeholders sólidos com tipografia, em último caso).
- ❌ Não duplicar conteúdo entre o card da home e o case interno. O `desafio`/`solucao` curtos do frontmatter alimentam o card; o markdown longo alimenta o case interno.
- ❌ Não inventar conteúdo de case. Conteúdo vem dos HTMLs originais ou da Evelin.

---

## 11. Decisões já tomadas (não revisitar sem motivo forte)

| Decisão | Valor |
|---|---|
| Posicionamento | Product Owner · APM · Product Manager |
| Bio principal | (ver bloco 6, About.astro) |
| Setor mencionado | Fintech (com produtos internos de EX) |
| Paleta | Navy + lime + brown sobre creme |
| Tipografia | Inter (sans) + DM Serif Display (display) |
| Grid de cases | 3 colunas (lg+), 2 (md), 1 (sm) |
| Conteúdo do card | Cover + título + desafio (1 frase) + solução (1 frase) + 3 métricas + CTA |
| Título do card | Sans bold compacto (Inter), não serif |
| Métricas no card | 3 com peso igual |
| Aspect ratio do cover | 3:2 (não 2:1) |
| Hover do card | Zoom no cover + CTA desliza |
| Foto no mobile | Não aparece (foco em texto) |
| Navegação entre cases | Anterior + próximo no rodapé do case (loop) |
| Footer | 3 colunas em desktop, empilhado mobile |
| Ordem dos cases | 1.Clima, 2.Bancários, 3.Primeiros Passos, 4.Vendas, 5.Ecossistema, 6.LMS |
| Animações | Fade-up com IntersectionObserver + fallback sem JS + respeitar prefers-reduced-motion |

---

## 12. Pendências conhecidas (resolver durante ou após implementação)

- [ ] **Cover do case 5 (Ecossistema):** Evelin vai procurar peça da Universidade Corporativa e enviar
- [ ] **Cover do case 4 (Venda Consultiva):** Evelin vai procurar peça e enviar
- [ ] **Foto da Evelin em alta resolução** para `public/photos/evelin.jpg`
- [ ] **Reescrita dos blocos "Minha atuação"** em cada case (Evelin fará no momento próprio)
- [ ] **Aprofundamento dos cases 2 (LMS), 3 (Venda Consultiva) e 5 (Ecossistema)** com Discovery e Iteração mais ricos (Evelin fará no momento próprio)
- [ ] **Domínio próprio** (Evelin vai decidir depois — por enquanto, subdomínio `.pages.dev` do Cloudflare)
- [ ] **Página 404** custom (low priority)

---

## 13. Como o Claude Code deve trabalhar nesse projeto

1. **Leia este briefing inteiro antes de começar qualquer fase.**
2. **Comece sempre pela fase atual** indicada pela usuária. Não pule fases.
3. **Faça commits pequenos e frequentes** — um por componente ou feature.
4. **Mostre o resultado visual após cada componente importante** (rode `npm run dev` ou screenshot).
5. **Se uma decisão não estiver no briefing, pergunte à usuária antes de inferir.** Não chute.
6. **Não otimize prematuramente.** Funcione primeiro, otimize na fase 4.
7. **Mantenha o código simples e legível.** Esse projeto é para ser editado pela usuária no futuro — escrever código que ela consegue entender é um requisito, não um bonus.
8. **Quando terminar uma fase, valide os critérios de aceite do bloco 9** antes de declarar pronto.

---

## 14. Anexos

A usuária vai anexar os seguintes arquivos no início da primeira sessão:

- `página_inicial.html` — referência da home atual
- `1.html` a `6.html` — os 6 cases originais com conteúdo a ser preservado
- Peças autorais para covers:
  - `Primeiros_Passos.png` → cover do case 3 (Primeiros Passos)
  - `Produtos_e_Serviços_Bancários.png` → cover do case 2 (Produtos Bancários)
  - `atualiza.png` → cover do case 6 (LMS)
  - `Gente___Conexao.png` → cover do case 1 (Pesquisa de Clima)

Mapeamento de slug → cover:

| Slug | Arquivo de cover |
|---|---|
| `pesquisa-clima` | `gente-conexao.png` (renomear) |
| `produtos-bancarios` | `produtos-bancarios.png` (renomear) |
| `primeiros-passos` | `primeiros-passos.png` (renomear) |
| `venda-consultiva` | **placeholder** (Evelin enviará depois) |
| `ecossistema` | **placeholder** (Evelin enviará depois) |
| `lms` | `atualiza.png` (renomear) |

> Nota sobre nomenclatura: padronizar nomes de arquivo em `public/covers/` para `kebab-case` sem acentos: `gente-conexao.png`, `produtos-bancarios.png`, etc.

---

**Fim do briefing.** Boas decisões e código limpo. 🚀
