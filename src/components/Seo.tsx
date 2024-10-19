import Head from "next/head";
import { useRouter } from "next/router";

export const defaultSeo = {
  company: "Guateplace",
  title: "Guateplace - Tu Tienda en Línea",
  description:
    "Descubre la mejor experiencia de compra en línea en Guatemala con productos de calidad y ofertas exclusivas.",
  keywords:
    "comprar online, tienda en línea, ecommerce Guatemala, productos, ofertas, Guateplace, Guatemala",
};

interface Props {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
}

const Seo = ({ title, description, keywords, image }: Props) => {
  const router = useRouter();

  const metUrl = `https://guateplace.com${router.asPath}`;

  const ogImage = image || "/guateplace.png";

  return (
    <Head>
      <meta name="application-name" content={defaultSeo.company} />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="description" content={defaultSeo.description} />
      <meta name="copyright" content={defaultSeo.company} />
      <meta name="language" content="es" />
      <meta name="robots" content="index,follow" />
      <meta name="author" content={defaultSeo.company} />
      <meta name="msapplication-TileColor" content="#f5f5f5" />
      <meta name="theme-color" content="#ffffff" />
      <meta
        name="keywords"
        content={keywords ? keywords : defaultSeo.keywords}
      />
      <meta
        name="description"
        content={description ? description : defaultSeo.description}
      />
      {/* Etiquetas Open Graph para Facebook y Twitter Cards */}
      <meta property="og:title" content={title ? title : defaultSeo.title} />
      <meta
        property="og:description"
        content={description ? description : defaultSeo.description}
      />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={metUrl} />{" "}
      {/* Reemplaza con la URL real */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title ? title : defaultSeo.title} />
      <meta
        name="twitter:description"
        content={description ? description : defaultSeo.description}
      />
      <meta name="twitter:image" content={ogImage} />
      <title>
        {title ? title : `${defaultSeo.company} | ${defaultSeo.title}`}
      </title>
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href="/apple-touch-icon.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="167x167"
        href="/apple-touch-icon.png"
      />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, user-scalable=no"
      />
    </Head>
  );
};

export default Seo;
