import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Layout from "@/components/Layout";
import Link from "next/link";
import Image from "next/image";
import Post from "@/models/Post";
import dbConnect from "@/lib/db";
import SEO from "@/components/SEO";
import Thumbnail from "@/components/thumb";

export async function getStaticProps() {

  await dbConnect();

  //Markdown posts 
  const postsDir = path.join(process.cwd(), "data/posts");

  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }
  
  const filenames = fs.readdirSync(postsDir);

  const markdownPosts = filenames.map((filename) => {
    const filePath = path.join(postsDir, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);
    return {
      id: filename.replace(".md", ""), 
      slug: filename.replace(".md", ""),
      title: data.title,
      date: data.date,
      author: data.author,
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
      slug: null, 
      title: doc.title,
      date: doc.createdAt.toISOString(),
      author: doc.author || "Χρήστης",
      excerpt: doc.content ? doc.content.slice(0, 150) + "..." : "",
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
    props: { posts: allPosts.slice(0, 3) }, 
  };
}

export default function Home({ posts }) {
  return (
    <Layout>
      <SEO title="MyScience" description="Blog" />
      <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Το Blog σου",
          "url": "https://your-domain.com",
          "description": "Πρόσφατα άρθρα, νέα και περιεχόμενο.",
          "publisher": {
            "@type": "Organization",
            "name": "Το Blog σου",
            "logo": {
              "@type": "ImageObject",
              "url": "https://your-domain.com/logo.png"
            }
          }
        })
      }}
    />
      <section className="max-w-3xl mx-auto mt-10">
        <h1 className="text-4xl font-bold mb-6">Καλώς ήρθες στο blog!</h1>
        <p className="text-zinc-400 mb-10">
          Δημοσιεύω τα επιστημονικά μου άρθρα, μελέτες και παρατηρήσεις.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Πρόσφατα Άρθρα</h2>
        <ul className="space-y-6">
          {posts.map((post) => {
            //Mongo->/blog/user-post/[id]
            //Markdown->/all-posts/[slug]
            const postLink = post.type === "mongo" 
              ? `/blog/user-post/${post.id}` 
              : `/blog/${post.slug}`;
            return (
              <li key={post.id} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Link href={postLink}>
                <Thumbnail src={post.thumbnail} />
                  </Link>
                </div>
                <div>
                  <Link href={postLink}>
                    <h3 className="text-lg text-blue-400 hover:underline font-semibold">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-zinc-400 text-sm">
                    {new Date(post.date).toLocaleDateString("el-GR")} · {post.author}
                  </p>
                  <p className="text-zinc-300 text-sm mt-1">{post.excerpt}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-8">
          <Link href="/all-posts">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Δες όλα τα άρθρα
            </button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}