import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const uploadDir = path.join(process.cwd(), "public/uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  await new Promise((resolve, reject) => {
    
    const form = new IncomingForm({ 
        multiples: false, 
        keepExtensions: true,
        uploadDir: uploadDir
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ message: "Upload error" });
        return resolve(null); 
      }

      const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      const content = Array.isArray(fields.content) ? fields.content[0] : fields.content;
      let thumbnail = "/uploads/default.jpg";

      const file = Array.isArray(files.image) ? files.image[0] : files.image;
      
      if (file && file.filepath) {
        const ext = path.extname(file.originalFilename || "") || ".jpg";
        const filename = `${uuidv4()}${ext}`;
        const destPath = path.join(uploadDir, filename);
        
        try {
            fs.renameSync(file.filepath, destPath);
            thumbnail = `/uploads/${filename}`;
        } catch (moveError) {
            console.error("Σφάλμα μετακίνησης αρχείου:", moveError);
        }
      }

      try {
        await dbConnect();
        
        const authorName = session.user.name || session.user.email || "Unknown";

        const newPost = new Post({
          title,
          content,
          author: authorName,
          thumbnail,
        });

        await newPost.save();
        
        res.status(200).json({ message: "Το άρθρο αποθηκεύτηκε!" });
        resolve(null); 

      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Database error" });
        resolve(null); 
      }
    });
  });
}