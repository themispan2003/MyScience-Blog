import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import fs from "fs";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  const { id } = req.query;

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  await dbConnect();

  if (req.method === "DELETE") {
    try {
      const post = await Post.findById(id);

      if (!post) return res.status(404).json({ message: "Το άρθρο δεν βρέθηκε." });

      if (post.author !== session.user.name) {
        return res.status(403).json({ message: "Δεν επιτρέπεται." });
      }

      await Post.findByIdAndDelete(id);

      if (post.thumbnail && post.thumbnail.startsWith("/uploads/")) {
        const filePath = path.join(process.cwd(), "public", post.thumbnail);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      return res.status(200).json({ message: "ΟΚ" });

    } catch (e) {
      return res.status(500).json({ message: "Σφάλμα διαγραφής." });
    }
  }
}
