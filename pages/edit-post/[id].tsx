import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";

export default function EditPost() {
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/posts/${id}`)
      .then((res) => res.json())
      .then((post) => {

        if (post) {
            setTitle(post.title || "");
            setContent(post.content || "");
        }
      });
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (newImage) formData.append("image", newImage);

    const res = await fetch(`/api/posts/${id}/update`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      router.push("/my-posts");
    } else {
      alert("Σφάλμα στην αποθήκευση");
    }

    setLoading(false);
  };

  return (
    <Layout>
      <SEO title="Επεξεργασία άρθρου" description="Τροποποίηση υπάρχοντος άρθρου." />
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-white">Επεξεργασία Άρθρου</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-zinc-300 mb-2 font-medium">Τίτλος</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-zinc-600 rounded px-4 py-2 bg-zinc-800 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-zinc-300 mb-2 font-medium">Κείμενο</label>
            <textarea
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-zinc-600 rounded px-4 py-2 bg-zinc-800 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Upload New Image */}
          <div className="p-4 border border-zinc-700 border-dashed rounded bg-zinc-800/50">
            <label className="block text-zinc-300 mb-2 font-medium">Αλλαγή εικόνας</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImage(e.target.files?.[0] || null)}
              className="w-full text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Αποθήκευση..." : "Αποθήκευση Αλλαγών"}
          </button>
        </form>
      </div>
    </Layout>
  );
}