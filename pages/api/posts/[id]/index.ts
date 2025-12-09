import dbConnect from "@/lib/db";
import Post from "@/models/Post";

export default async function handler(req, res) {
  const { id } = req.query;

  await dbConnect();

  if (req.method === "GET") {
    try {
      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({ message: "Not found" });
      }

      return res.status(200).json(post);
    } catch (e) {
      console.error("FETCH POST ERROR:", e);
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
