import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const formulaRouter = createRouter()
  .query("all", {
    async resolve({ ctx }) {
      return ctx.prisma.formula.findMany({
        orderBy: { updatedAt: "desc" },
      });
    },
  })
  .query("byId", {
    input: z.object({
      id: z.string().uuid(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      const formula = await ctx.prisma.formula.findUnique({ where: { id } });
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
  });
