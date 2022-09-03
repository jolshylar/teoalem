import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createRouter } from "./context";

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  image: true,
  formulas: true,
});

export const userRouter = createRouter()
  .query("all", {
    resolve({ ctx }) {
      return ctx.prisma.user.findMany({ select: defaultUserSelect });
    },
  })
  .query("byId", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      return await ctx.prisma.user.findUnique({
        where: { id },
        select: defaultUserSelect,
      });
    },
  });
