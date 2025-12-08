import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Layout({ children }) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-zinc-900 text-white font-sans flex flex-col">
      <header className="p-4 border-b border-zinc-700 flex justify-between items-center">
        <h1 className="text-xl font-bold">MyScienceBlog</h1>
        <nav className="flex items-center space-x-4">
          <Link href="/">
            <span className="hover:underline">Αρχική</span>
          </Link>
          <Link href="/contact">
            <span className="hover:underline">Επικοινωνία</span>
          </Link>
          <Link href="/all-posts">
            <span className="hover:underline">Άρθρα</span>
          </Link>
          {session && (
            <Link href="/new-post">
              <span className="hover:underline">Νέο Άρθρο</span>
            </Link>
          )}
          {session && (
            <Link href="/my-posts">
              <span className="hover:underline">Τα άρθρα μου</span>
            </Link>
          )}
          {session ? (
            <>
              <button
                onClick={() => signOut()}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm"
              >
                Αποσύνδεση
              </button>
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt="avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-sm"
            >
              Σύνδεση
            </button>
          )}
        </nav>
      </header>

      <main className="p-6 flex-1">{children}</main>

      <footer className="text-center text-sm text-zinc-400 py-4 border-t border-zinc-700">
        © {new Date().getFullYear()} MyScienceBlog · Ανέβασε τις ιδέες σου!
      </footer>
    </div>
  );
}
