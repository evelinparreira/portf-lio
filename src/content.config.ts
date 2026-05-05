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
    ).optional(