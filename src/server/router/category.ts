import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createRouter } from "./context";

const defaultCategorySelect = Prisma.validator<Prisma.CategorySelect>()({
  id: true,
  icon: true,
  name: true,
  createdAt: true,
  formulas: true,
});

export const categoryRouter = createRouter()
  .query("all", {
    resolve({ ctx }) {
      return ctx.prisma.category.findMany({ select: defaultCategorySelect });
    },
  })
  .query("byId", {
    input: z.object({
      id: z.string().uuid(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      const category = await ctx.prisma.category.findUnique({ where: { id } });
      return category;
    },
  });
