import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const form = formidable({
    multiples: false,
    uploadDir: path.join(process.cwd(), "/public/uploads"),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable ERROR:", err);
      return res.status(500).json({ message: "Σφάλμα φόρμας" });
    }

    try {
      const { id } = req.query;

      const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      const content = Array.isArray(fields.content)
        ? fields.content[0]
        : fields.content;

      const updateData: any = {
        title,
        content,
      };

      if (files.image) {
        const file = files.image[0];
        updateData.thumbnail = "/uploads/" + file.newFilename;
      }

      await Post.findByIdAndUpdate(id, updateData);

      return res.status(200).json({ message: "OK" });
    } catch (e) {
      console.error("UPDATE ERROR:", e);
      return res.status(500).json({ message: "Σφάλμα ενημέρωσης" });
    }
  });
}
