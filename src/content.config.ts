import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const cases = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/cases" }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    subtitle: z.string().optional(),
    teaser: z.string(),
    categories: z.array(z.string()),
    cover: z.string(),
    desafio: z.string(),
    solucao: z.string(),
    metrics: z.array(
      z.object({ value: z.string(), label: z.string() })
    ).length(3),

    // 01 — Contexto
    contextText: z.string().optional(),

    // 02 — Problema
    problemText: z.string().optional(),

    // 03 — Discovery
    discoveryIntro: z.string().optional(),
    discoveryMethods: z.array(z.string()).optional(),
    discoveryItems: z.array(
      z.object({ title: z.string(), description: z.string() })
    ).optional(),

    // 04 — Solução
    solutionTitle: z.string().optional(),
    solutionIntro: z.string().optional(),
    solutionItems: z.array(
      z.object({ title: z.string(), description: z.string() })
    ).optional(),
    solutionDecisions: z.array(z.string()).optional(),

    // 04b — Iteração (primeiros-passos)
    iterationItems: z.array(z.string()).optional(),

    // 05 — Evolução em ondas (ecossistema)
    evolutionWaves: z.array(
      z.object({ year: z.string(), description: z.string() })
    ).optional(),

    // 05 — Minha atuação
    myRoleText: z.string().optional(),
    myRoleItems: z.array(z.string()).optional(),

    // 06 — Impacto
    impactCategories: z.array(
      z.object({ label: z.string(), items: z.array(z.string()) })
    ).optional(),
    impactText: z.string().optional(),

    // Imagens do case (screenshots, diagramas, fotos)
    images: z.array(
      z.object({
        src: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
        span: z.enum(["full", "half"]).default("half"),
      })
    ).optional(),

    // Links externos
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
