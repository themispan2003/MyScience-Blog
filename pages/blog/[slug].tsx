import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import Layout from "../../components/Layout";
import Image from "next/image";            
import SEO from "@/components/SEO";

export async function getStaticPaths() {

  const postsDirectory = path.join(process.cwd(), "data/posts");
  const filenames = fs.readdirSync(postsDirectory);

  const paths = filenames.map((filename) => ({
    params: { slug: filename.replace(".md", "") },
  }));

  return {
    paths,
    fallback: false, 
  };
}

export async function getStaticProps({ params }) {

  const filePath = path.join(process.cwd(), "data/posts", params.slug + ".md");
  const fileContents = fs.readFileSync(filePath, "utf8");

  const { data, content } = matter(fileContents);
  return {
    props: {
      frontmatter: {
        ...data,
        thumbnail: data.thumbnail || "/uploads/default.jpg",   
      },
      content: marked(content),
    },
  };
}

export default function PostPage({ frontmatter, content }) {
  return (
    <Layout>
       <SEO title={frontmatter.title} description={frontmatter.excerpt} />
      <article className="max-w-3xl mx-auto mt-10">
        {/* εικόνα άρθρου */}
        <Image
          src={frontmatter.thumbnail}
          alt={frontmatter.title}
          width={800}
          height={400}
          className="rounded-xl mb-6 object-cover"
        />

        <h1 className="text-4xl font-bold mb-2">{frontmatter.title}</h1>
        <p className="text-zinc-400 mb-6">
          {frontmatter.date} · {frontmatter.author} · {frontmatter.excerpt} 
        </p>

        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </Layout>
  );
}
