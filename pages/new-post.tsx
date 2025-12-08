import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";

export default function NewPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (status === "loading") return <p className="text-center mt-10">Φόρτωση...</p>;
  if (!session) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto mt-16 text-center">
          <p className="text-xl mb-4">Πρέπει να συνδεθείς για να δημιουργήσεις άρθρο.</p>
          <button
            onClick={() => signIn("google")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Σύνδεση με Google
          </button>
        </div>
      </Layout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    const res = await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setMessage("Το άρθρο ανέβηκε!");
      setTitle("");
      setContent("");
      setImage(null);
      setTimeout(() => router.push("/all-posts"), 1500);
    } else {
      setMessage("Κάτι πήγε λάθος.");
    }

    setLoading(false);
  };

  return (
    <Layout>
      <SEO title="Νέο άρθρο" description="Δημιουργία νέου άρθρου." />
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Νέο Άρθρο</h1>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <input
            type="text"
            placeholder="Τίτλος άρθρου"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-zinc-300 rounded px-4 py-2 bg-zinc-800 text-white"
          />
        <textarea
          placeholder="Περιεχόμενο άρθρου"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={10}
          className="w-full border border-zinc-300 rounded px-4 py-2 bg-zinc-800 text-white"
        />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Αποστολή..." : "Ανάρτηση Άρθρου"}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-sm text-green-400">{message}</p>}
      </div>
    </Layout>
  );
}
