import Layout from "../components/Layout";
import SEO from "@/components/SEO";

export default function Contact() {
  return (
    <Layout>
      <SEO title="Eπικοινωνία" description="Φόρμα Συμπλήρωσης" />
      <section className="max-w-xl mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-4">Επικοινωνία</h1>
        <p className="mb-6 text-zinc-400">
          Συμπλήρωσε την παρακάτω φόρμα και θα επικοινωνήσω μαζί σου.
        </p>
        <form
          action="https://formspree.io/f/xovlqgoy"
          method="POST"
          className="flex flex-col space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Όνομα"
            required
            className="p-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="p-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none"
          />
          <textarea
            name="message"
            placeholder="Μήνυμα"
            rows={5}
            required
            className="p-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none"
          />
          {/* Προαιρετικό: redirect σε ευχαριστήρια σελίδα */}
          {/* <input type="hidden" name="_redirect" value="/ευχαριστω" /> */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
          >
            Αποστολή
          </button>
        </form>
      </section>
    </Layout>
  );
}
