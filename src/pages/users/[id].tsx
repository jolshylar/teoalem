import { useRouter } from "next/router";
import Avatar from "../../components/Avatar";
import Page from "../../components/layouts/Page";
import { trpc } from "../../utils/trpc";

const UserProfile = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const { data } = trpc.useQuery(["user.byId", { id }]);

  if (!data) return null;
  return (
    <Page
      title={data.name || "Profile"}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="flex flex-col items-center justify-center">
        <Avatar src={data.image} size={100} />
        <h1 className="text-4xl font-extrabold">{data.name}</h1>
        <h2 className="text-2xl">
          Total Formulas Posted: {data.formulas.length}
        </h2>
      </div>
    </Page>
  );
};

export default UserProfile;
