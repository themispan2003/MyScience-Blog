import Head from "next/head";

export default function SEO({ title, description }) {
  return (
    <Head>
      <title>{title ? `${title} | MyBlog` : "MyBlog"}</title>
      <meta name="description" content={description || "My Science Blog"} />
      <meta property="og:title" content={title || "MyBlog"} />
      <meta property="og:description" content={description || "My Science Blog"} />
      <meta property="og:type" content="website" />
    </Head>
  );
}
