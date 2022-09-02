import Head from "next/head";

type PageProps = {
  children: React.ReactNode;
  className?: string;
  title: string;
};

const Page = ({ children, className = "", title }: PageProps) => {
  const t = `${title} / TeoAlem`;
  return (
    <>
      {title && (
        <Head>
          <title>{t}</title>
          <meta name="twitter:title" content={t} />
          <meta name="og:title" content={t} />
        </Head>
      )}
      <main className={className}>{children}</main>
    </>
  );
};

export default Page;
