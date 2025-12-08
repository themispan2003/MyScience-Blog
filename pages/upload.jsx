import { useState } from "react";
import { getSession } from "next-auth/react";
import SEO from "@/components/SEO";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: { session } };
}

export default function UploadPage() {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const fileField = e.target.elements.image;

    formData.append("image", fileField.files[0]);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    setMessage(result.message);
  };

  return (
    <Layout>
    <SEO title="Ανέβασμα εικόνας" description="Βοηθητική σελίδα" />
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload εικόνας</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" name="image" accept="image/*" required />
        <button
          type="submit"
          className="block mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Ανέβασε
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
    </Layout>
  );
}
