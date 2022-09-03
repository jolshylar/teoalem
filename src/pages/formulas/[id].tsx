import type { Formula, Category } from "@prisma/client";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import NextError from "next/error";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Page from "../../components/layouts/Page";
import {
  ACTION_BUTTON,
  CARD,
  DELETE_BUTTON,
  INPUT_SELECT,
  INPUT_TEXT,
  LABEL,
} from "../../styles";
import { trpc } from "../../utils/trpc";

const FormulaViewPage = () => {
  // Router
  const router = useRouter();
  const id = router.query.id as string;
  // Session
  const { data: session } = useSession();
  // tRPC
  const roomQuery = trpc.useQuery(["formula.byId", { id }]);
  const { data: room } = roomQuery;
  const { data: topics } = trpc.useQuery(["category.all"]);

  // room fetch fail
  if (roomQuery.error) {
    return (
      <NextError
        title={roomQuery.error.message}
        statusCode={roomQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (!room || roomQuery.status !== "success") {
    return <>Loading...</>;
  }
  return (
    <Page title={room.title} className="max-w-[60ch] mx-auto">
      {/* Header */}
      <h1 className="text-4xl font-extrabold">{room.title}</h1>
      <p className="my-2">{room.description}</p>
      <p className="my-2 font-bold">{room.definition}</p>
      <div className="flex items-center justify-between my-2">
        <p className="text-gray-400">
          Created {room.createdAt.toLocaleDateString("en-us")}
        </p>
      </div>

      <EditRoom data={room} topics={topics} session={session} router={router} />
    </Page>
  );
};

type EditRoomProps = {
  data?: Formula | null;
  topics?: Category[] | null;
  session?: Session | null;
  router: any;
};

type FormData = {
  id: string;
  title: string;
  description: string;
  definition: string;
  categoryId: string;
};

const EditRoom = ({ data, topics, session, router }: EditRoomProps) => {
  const id = router.query.id as string;
  const category = topics?.find((t: Category) => t.id === data?.categoryId);
  const [editing, setEditing] = useState(false);
  // Form
  const { register, handleSubmit } = useForm<FormData>();
  // tRPC
  const utils = trpc.useContext();
  const editRoom = trpc.useMutation("formula.edit", {
    async onSuccess() {
      await utils.invalidateQueries(["formula.byId", { id }]);
    },
  });
  const deleteRoom = trpc.useMutation("formula.delete", {
    async onSuccess() {
      router.push("/formulas");
      await utils.invalidateQueries(["formula.all"]);
    },
  });
  // States
  const [title, setTitle] = useState(data?.title);
  const [description, setDescription] = useState(data?.description);
  const [definition, setDefinition] = useState(data?.definition);
  const [categoryId, setCategoryId] = useState(data?.categoryId);

  const onSubmit = handleSubmit(async () => {
    try {
      await editRoom.mutateAsync({
        id: data?.id || "",
        data: {
          title: title || "",
          description: description || "",
          definition: definition || "",
          categoryId: categoryId || "",
        },
      });
    } catch {}
  });

  return (
    <>
      <div className="flex gap-2 my-2">
        {session?.user?.id === data?.authorId && (
          <>
            <button
              className={ACTION_BUTTON}
              onClick={() => setEditing(!editing)}
            >
              Edit
            </button>
            <button
              className={DELETE_BUTTON}
              onClick={() => deleteRoom.mutate({ id })}
            >
              Delete
            </button>
          </>
        )}
      </div>
      <div className={`my-10 flex items-center justify-center ${CARD}`}>
        <form hidden={!editing} className="w-[90%]" onSubmit={onSubmit}>
          <h2 className="text-center text-3xl font-bold mb-2">Edit Formula</h2>
          <div>
            <label className={LABEL} htmlFor="title">
              Title:
            </label>
            <input
              id="title"
              {...register("title")}
              className={INPUT_TEXT}
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              disabled={editRoom.isLoading}
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
              className={INPUT_TEXT}
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              disabled={editRoom.isLoading}
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
              className={INPUT_TEXT}
              value={definition}
              onChange={(e) => setDefinition(e.currentTarget.value)}
              disabled={editRoom.isLoading}
            />
          </div>
          {/* Category */}
          <div className="my-4">
            <label className={LABEL} htmlFor="categoryId">
              Category:
            </label>
            <select
              {...register("categoryId")}
              id="categoryId"
              className={INPUT_SELECT}
              onChange={(e) => setCategoryId(e.currentTarget.value)}
            >
              {category ? (
                <option value={category.id}>{category.name}</option>
              ) : (
                <option selected>Choose a category</option>
              )}
              {topics &&
                topics.map((t: Category) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
            </select>
          </div>
          {/* Save */}
          <button
            className="py-2 px-4 rounded-md text-white bg-teal-400 hover:bg-teal-500 hover:duration-500"
            onClick={() => console.log(category)}
            disabled={editRoom.isLoading}
          >
            Save
          </button>
          {/* Error occurred */}
          {editRoom.error && (
            <p style={{ color: "red" }}>{editRoom.error.message}</p>
          )}
        </form>
      </div>
    </>
  );
};

export default FormulaViewPage;
