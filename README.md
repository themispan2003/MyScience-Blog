## MyScience-Blog
Full Stack Web Development: Web/Front-End Development(HTML,CSS,JavaScript), BackEnd(NodeJs, GoogleAuth, MongoDB, Formspree)

## MyScience Blog

Ένα σύγχρονο blog platform για επιστημονικά άρθρα, φτιαγμένο με Next.js, MongoDB και NextAuth.

## Features

*  Δημιουργία άρθρων
*  Επεξεργασία & διαγραφή posts
*  Upload εικόνων
*  Authentication με Google
*  Markdown υποστήριξη (μέσω `marked`)
*  SEO optimization
*  Server-side rendering (SSR)
*  REST API με Next.js API routes

## Tech Stack

* **Frontend:** Next.js (Pages Router)
* **Backend:** Next.js API Routes
* **Database:** MongoDB (Mongoose)
* **Auth:** NextAuth (Google Provider)
* **Styling:** Tailwind CSS
* **File Uploads:** Formidable
* **Markdown:** marked

## Project Structure

```
/components      → UI Components (Layout, SEO κλπ)
/pages           → Routes (pages + API)
/pages/api       → Backend endpoints
/models          → Mongoose models
/lib             → DB connection
/public/uploads  → Uploaded images
/styles          → Global styles
```

## Installation

## 1️ Clone το repo

```bash
git clone https://github.com/your-username/myscience-blog.git
cd myscience-blog
```

## 2️ Install dependencies

```bash
npm install
```

## 3️ Environment Variables

Δημιούργησα `.env.local`:

```env
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

## 4️ Run development server

```bash
npm run dev
```

ή αν υπάρχει θέμα:

```bash
npx next dev
```

## MongoDB Setup

1. Δημιούργησε cluster στο MongoDB Atlas
2. Database Access → δημιούργησε user
3. Network Access → βάλε:

```
0.0.0.0/0
```

4. Πάρε connection string και βάλε το στο `.env.local`

## Authentication Setup (Google)

1. Πήγαινε στο Google Cloud Console
2. Δημιούργησε OAuth Client
3. Βάλε redirect URI:

```
http://localhost:3000/api/auth/callback/google
```

## API Endpoints

| Method | Endpoint              | Description  |
| ------ | --------------------- | ------------ |
| GET    | /api/posts            | Όλα τα posts |
| GET    | /api/posts/:id        | Single post  |
| POST   | /api/posts            | Δημιουργία   |
| POST   | /api/posts/:id/update | Update       |
| GET    | /api/posts/my-posts   | User posts   |

## Image Uploads

* Αποθηκεύονται στο `/public/uploads`
* Γίνεται μέσω Formidable
* Υποστηρίζονται αρχεία εικόνας

## Deployment (Vercel)

1. Push στο GitHub
2. Σύνδεση με Vercel
3. Προσθήκη environment variables
4. Deploy

## Scripts

```bash
npm run dev     # development
npm run build   # build
npm run start   # production
```

## Common Issues

### MongoDB auth error

Έλεγξε username/password

### next not found

Έτρεξα:

```bash
npm install
```

##  Image error

 Προσέθεσα  domains στο `next.config.js`

##  Future Improvements

*  Comments system
*  Likes
*  Tags & categories
*  Search
*  Analytics dashboard

## Author

Developed by Themis Panagis

## License

MIT License
