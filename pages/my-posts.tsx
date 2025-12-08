import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Image from "next/image";
import SEO from "@/components/SEO";
import { useSession, signIn } from "next-auth/react";
import Thumbnail from "@/components/thumb";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/api/posts/my-posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  const deletePost = async (id) => {
    if (!confirm("Σίγουρα θέλεις να το διαγράψεις;")) return;

    const res = await fetch(`/api/posts/${id}/delete`, {
      method: "DELETE",
    });

    if (res.ok) {
      setPosts(posts.filter((p) => p._id !== id));
    } else {
      alert("Σφάλμα κατά τη διαγραφή");
    }
  };
const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Layout>
        <p className="text-center mt-20 text-zinc-400">Φόρτωση...</p>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto mt-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Πρέπει να συνδεθείς</h1>
          <p className="text-zinc-400 mb-6">
            Για να δεις τα άρθρα σου, συνδέσου στον λογαριασμό σου.
          </p>

          <button
            onClick={() => signIn()}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Σύνδεση
          </button>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <SEO title="Τα άρθρα μου" description="Διαχείριση προσωπικών άρθρων." />
      <section className="max-w-3xl mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-6">Τα άρθρα μου</h1>

        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post._id} className="flex gap-4 items-start">
            <a
              href={`/blog/user-post/${post._id}`}
              className="flex gap-4 items-start flex-1 cursor-pointer hover:opacity-80"
            >
            <Thumbnail src={post.thumbnail} />
                <div>
                  <h3 className="font-semibold text-xl">{post.title}</h3>
                  <p className="text-zinc-400 text-sm">
                    {new Date(post.createdAt).toLocaleDateString("el-GR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </a>
              <a
                href={`/edit-post/${post._id}`}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Επεξεργασία
              </a>
              <button
                onClick={() => deletePost(post._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Διαγραφή
              </button>

            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
