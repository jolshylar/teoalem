import Head from "next/head";

type LayoutProps = { children: React.ReactNode };

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="TeoAlem is the place you'll find what you need - formulas, theorems and even code snippets!"
        />
        <meta name="author" content="Jolshylar Team" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="twitter:title" content="TeoAlem - Formulas Quickly" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@jolshylar" />
        <meta
          name="twitter:image"
          content="https://teoalem.vercel.app/card.png"
        />
        <meta property="og:site_name" content="TeoAlem" />
        <meta name="og:title" content="TeoAlem - Formulas Quickly" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://teoalem.vercel.app/card.png"
        />
        <title>TeoAlem - Formulas Quickly</title>
      </Head>
      {children}
    </>
  );
};

export default Layout;
