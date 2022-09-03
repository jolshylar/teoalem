import Page from "../components/layouts/Page";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import FormulaSection from "../components/FormulaSection";

const Formulas = () => {
  const { data: session } = useSession();
  const formulasQuery = trpc.useQuery(["formula.all"]);

  return (
    <Page title="Formulas">
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Welcome, {session?.user?.name || "Guest"}!
        </h1>
        <p>
          smooth user experience brought to you by{" "}
          <a
            className="text-teal-400"
            href="https://twitter.com/jolshylar"
            target="blank"
            rel="noreferrer"
          >
            @jolshylar
          </a>
        </p>
      </div>
      <div className="my-8 block md:grid md:grid-cols-3 md:justify-items-center">
        <FormulaSection formulasQuery={formulasQuery} session={session} />
      </div>
    </Page>
  );
};

export default Formulas;
