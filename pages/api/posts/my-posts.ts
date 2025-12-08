import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  await dbConnect();

  try {
    const posts = await Post.find({ author: session.user.name }).sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (e) {
    return res.status(500).json({ message: "Database error" });
  }
}
