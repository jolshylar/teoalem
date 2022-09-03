import type { Session } from "next-auth";
import type {
  Category as CategoryType,
  Formula as FormulaType,
} from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";
import Link from "next/link";
import {
  ACTION_BUTTON,
  CARD,
  INPUT_SELECT,
  INPUT_TEXT,
  LABEL,
  TOPIC,
} from "../styles";
import { IoAdd, IoPeople } from "react-icons/io5";
import Avatar from "./Avatar";

type FormulaSectionProps = {
  session: Session | null;
  formulasQuery: any;
};

export default function FormulaSection({
  session,
  formulasQuery,
}: FormulaSectionProps) {
  const [adding, setAdding] = useState(false);
  const categoriesQuery = trpc.useQuery(["category.all"]);

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Formulas</h1>
          <span className="text-gray-400">
            {formulasQuery.data?.length} available
          </span>
        </div>

        {session && (
          <>
            <button
              className={`${ACTION_BUTTON} flex items-center gap-2`}
              onClick={() => setAdding(!adding)}
            >
              <IoAdd className="w-6 h-6" /> Add Formula
            </button>
          </>
        )}
      </div>
      {session && (
        <AddFormula
          categoriesQuery={categoriesQuery}
          adding={adding}
          session={session}
        />
      )}

      {formulasQuery.data?.map((formulas: FormulaType) => (
        <Formula
          key={formulas.id}
          categoriesQuery={categoriesQuery}
          data={formulas}
        />
      ))}
    </div>
  );
}

type AddFormulaProps = {
  adding: boolean;
  session: Session;
  categoriesQuery: any;
};

type FormData = {
  title: string;
  description: string;
  definition: string;
  category: object;
};

export const AddFormula = ({
  adding,
  session,
  categoriesQuery,
}: AddFormulaProps) => {
  const { data } = categoriesQuery;
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [categoryId, setCategoryId] = useState<string>("");
  const utils = trpc.useContext();
  const addFormula = trpc.useMutation("formula.add", {
    async onSuccess() {
      // refetches all formulas after successful add
      await utils.invalidateQueries(["formula.all"]);
      reset();
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await addFormula.mutateAsync({
        ...data,
        authorName: session.user?.name || "unknown",
        authorImage: session.user?.image || "/default-avatar.png",
        authorId: session.user?.id || "",
        categoryId,
      });
    } catch {}
  });

  return (
    <div className={`flex items-center justify-center my-4 ${CARD}`}>
      <form hidden={!adding} className="w-[90%] mx-auto" onSubmit={onSubmit}>
        <h2 className="text-center text-3xl font-bold mb-2">Add Formula</h2>
        {/* Title */}
        <div>
          <label className={LABEL} htmlFor="title">
            Title:
          </label>
          <input
            id="title"
            {...register("title")}
            type="text"
            className={INPUT_TEXT}
            disabled={addFormula.isLoading}
          />
        </div>
        {/* Description */}
        <div className="my-4">
          <label className={LABEL} htmlFor="description">
            Description:
          </label>
          <input
            id="description"
            {...register("description")}
            type="text"
            className={INPUT_TEXT}
            disabled={addFormula.isLoading}
          />
        </div>
        {/* Definition */}
        <div className="my-4">
          <label className={LABEL} htmlFor="definition">
            Definition:
          </label>
          <input
            id="definition"
            {...register("definition")}
            type="text"
            className={INPUT_TEXT}
            disabled={addFormula.isLoading}
          />
        </div>
        {/* Category */}
        <div>
          <label className={LABEL} htmlFor="category">
            Category:
          </label>
          <select
            {...register("category")}
            id="category"
            className={INPUT_SELECT}
            onChange={(e) => setCategoryId(e.currentTarget.value)}
          >
            <option selected>Choose a category</option>
            {data &&
              data.map((c: CategoryType) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
        {/* Submit Form */}
        <button
          className={`${ACTION_BUTTON} my-4`}
          type="submit"
          disabled={addFormula.isLoading}
        >
          Submit
        </button>
        {/* Validation Error */}
        {addFormula.error && (
          <p className="text-red-500">{addFormula.error.message}</p>
        )}
      </form>
    </div>
  );
};

type FormulaProps = {
  data: FormulaType;
  categoriesQuery: any;
};

export const Formula = ({ data, categoriesQuery }: FormulaProps) => {
  const { data: categories } = categoriesQuery;
  const category = categories.find(
    (c: CategoryType) => c.id === data.categoryId
  );

  return (
    <article
      className="my-2 flex gap-2 flex-col text-[#202020] bg-neutral-100 dark:text-neutral-100 dark:bg-[#202020] p-4 rounded-xl"
      key={data.id}
    >
      <div className="flex items-center justify-between">
        <Link href={`/users/${data.authorId || "ghost"}`}>
          <a className="flex items-center gap-2 font-medium">
            <Avatar src={data.authorImage} size={32} />
            <span>{data.authorName || "ghost"}</span>
          </a>
        </Link>
        <p className="text-gray-500">{`${data.updatedAt.toLocaleDateString()}, ${data.updatedAt.toLocaleTimeString()}`}</p>
      </div>
      <Link href={`/formulas/${data.id}`}>
        <a className="max-w-max text-2xl font-semibold">{data.title}</a>
      </Link>
      <p className="text-gray-400">{data.description}</p>
      <div className="my-2 flex justify-between">
        <span className={`${TOPIC} flex items-center gap-2`}>
          <IoPeople className="w-5 h-5" /> 0 participants
        </span>
        {category && (
          <span
            className={`${TOPIC} flex items-center gap-2`}
            key={data.categoryId}
          >
            {category.image && <img src={category.image} className="w-4 h-4" />}
            {category.name}
          </span>
        )}
      </div>
    </article>
  );
};
