import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new IncomingForm({
    multiples: false,
    keepExtensions: true,
    uploadDir: uploadDir,
    filename: (_name, _ext, part, _form) => {
      const ext = path.extname(part.originalFilename || "") || ".jpg";
      return `${uuidv4()}${ext}`;
    },
  });

  await new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Upload error:", err);
        res.status(500).json({ message: "Error uploading file" });
        return resolve(null);
      }

      try {
        await dbConnect();

        const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
        const content = Array.isArray(fields.content) ? fields.content[0] : fields.content;
        
        const updateData: any = {
          title,
          content,
          updatedAt: new Date(),
        };

        const file = Array.isArray(files.image) ? files.image[0] : files.image;
        if (file) {
          updateData.thumbnail = `/uploads/${file.newFilename}`;
        }

        const updatedPost = await Post.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedPost) {
          res.status(404).json({ message: "Post not found" });
          return resolve(null);
        }

        res.status(200).json({ message: "Post updated successfully", post: updatedPost });
        resolve(null);

      } catch (dbError) {
        console.error("Database error:", dbError);
        res.status(500).json({ message: "Database error" });
        resolve(null);
      }
    });
  });
}