import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Layout from "@/components/Layout";
import Image from "next/image";
import Link from "next/link";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import SEO from "@/components/SEO";
import Thumbnail from "@/components/thumb";

export async function getServerSideProps() {

  await dbConnect();
  
  //Markdown posts
  const postsDir = path.join(process.cwd(), "data/posts");
  const filenames = fs.existsSync(postsDir) ? fs.readdirSync(postsDir) : [];
  const markdownPosts = filenames.map((file) => {
    const src = fs.readFileSync(path.join(postsDir, file), "utf8");
    const { data } = matter(src);
    return {
      slug: file.replace(".md", ""),
      title: data.title,
      date: data.date,
      author: data.author || "Άγνωστος",
      excerpt: data.excerpt || "",
      thumbnail: data.thumbnail || "/images/default.jpg",
      type: "markdown",
    };
  });

  //MongoDB posts
  let mongoPosts = [];
  try {
    const results = await Post.find().sort({ createdAt: -1 }).lean();

    mongoPosts = results.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      date: doc.createdAt.toISOString(),
      author: doc.author || "Χρήστης",
      excerpt: doc.content.slice(0, 150) + "...",
      thumbnail: doc.thumbnail || "/uploads/default.jpg", 
      type: "mongo",
    }));
  } catch (error) {
    console.error("MongoDB fetch error:", error);
  }

  const allPosts = [...markdownPosts, ...mongoPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return {
    props: {
      posts: allPosts,
    },
  };
}

export default function AllPostsPage({ posts }) {
  return (
    <Layout>
      <SEO title="Όλα τα άρθρα" description="Δες όλα τα άρθρα του blog." />
      <section className="max-w-4xl mx-auto px-4 mt-10 space-y-8">
        <h1 className="text-4xl font-bold text-white">Όλα τα Άρθρα</h1>
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.slug || post.id} className="flex flex-col md:flex-row gap-4">
              <Link
                href={
                  post.type === "markdown"
                    ? `/blog/${post.slug}`
                    : `/blog/user-post/${post.id}`
                }
                className="flex-shrink-0"
              >
              <Thumbnail src={post.thumbnail} />
              </Link>
              <div>
                <Link
                  href={
                    post.type === "markdown"
                      ? `/blog/${post.slug}`
                      : `/blog/user-post/${post.id}`
                  }
                >
                  <h2 className="text-2xl font-semibold text-blue-500 hover:underline">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-sm text-zinc-400">
                  {new Date(post.date).toLocaleDateString("el-GR")} • {post.author}
                </p>
                <p className="mt-2 text-zinc-300">{post.excerpt}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
