import Link from "next/link";
import { trpc } from "../utils/trpc";

const Categories = () => {
  const categoriesQuery = trpc.useQuery(["category.all"]);

  return (
    <div className="hidden md:block w-[50%]">
      <h1 className="text-2xl font-semibold text-center">Browse Categories</h1>
      <ul>
        {categoriesQuery.data?.map((t) => (
          <li
            key={t.id}
            className="my-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:duration-300"
          >
            <Link href={`/formulas/?q=${t.name}`}>
              <a className="flex items-center justify-between">
                <div className="flex items-center">
                  {t.icon && (
                    <img
                      src={t.icon}
                      alt="category icon"
                      width={24}
                      height={24}
                    />
                  )}
                  <span className="text-xl p-2">{t.name}</span>
                </div>
                <span className="text-xl px-2 rounded bg-gray-100 dark:bg-gray-800">
                  {t.formulas.length}
                </span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
