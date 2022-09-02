import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

const defaultFormulaSelect = Prisma.validator<Prisma.FormulaSelect>()({
  id: true,
  title: true,
  description: true,
  definition: true,
  createdAt: true,
  updatedAt: true,
  categoryId: true,
  authorId: true,
  authorName: true,
  authorImage: true,
});

export const formulaRouter = createRouter()
  .query("all", {
    async resolve({ ctx }) {
      return ctx.prisma.formula.findMany({
        orderBy: { updatedAt: "desc" },
        select: defaultFormulaSelect,
      });
    },
  })
  .query("byId", {
    input: z.object({
      id: z.string().uuid(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      const formula = await ctx.prisma.formula.findUnique({
        where: { id },
        select: defaultFormulaSelect,
      });
      if (!formula) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No formula with id '${id}'`,
        });
      }
      return formula;
    },
  })
  .query("byCategoryId", {
    input: z.object({
      categoryId: z.string().uuid(),
    }),
    async resolve({ ctx, input }) {
      const { categoryId } = input;
      const formulas = await ctx.prisma.formula.findMany({
        where: { categoryId },
      });
      if (!formulas) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No formulas for category id '${categoryId}'`,
        });
      }
      return formulas;
    },
  })
  .mutation("add", {
    input: z.object({
      id: z.string().uuid().optional(),
      title: z.string().min(1).max(64),
      description: z.string().max(128).optional(),
      definition: z.string().optional(),
      categoryId: z.string().optional(),
      authorId: z.string().cuid().optional(),
      authorName: z.string().optional(),
      authorImage: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const formula = await ctx.prisma.formula.create({
        data: input,
        select: defaultFormulaSelect,
      });
      return formula;
    },
  })
  .mutation("edit", {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
        title: z.string().min(1).max(64),
        description: z.string().max(128).optional(),
        definition: z.string().optional(),
        categoryId: z.string().optional(),
      }),
    }),
    async resolve({ ctx, input }) {
      const { id, data } = input;
      const formula = await ctx.prisma.formula.update({
        where: { id },
        data,
        select: defaultFormulaSelect,
      });
      return formula;
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string().uuid(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      await ctx.prisma.formula.delete({ where: { id } });
      return { id };
    },
  });
