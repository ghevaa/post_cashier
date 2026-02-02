# PostKasir

PostKasir is a modern, full-stack Point of Sale (POS) and Inventory Management system designed for small to medium-sized businesses. It features a robust backend API and a responsive React-based frontend.

## 🚀 Features

- **Point of Sale (POS):** Efficient transaction processing with cart management.
- **Inventory Management:** Track stock levels, products, and categories.
- **Supplier Management:** Manage supplier details and relationships.
- **Dashboard & Analytics:** Real-time insights into sales and performance.
- **Authentication:** Secure user authentication and authorization.
- **Payments:** Integration with Midtrans for payment processing.
- **Receipt Printing:** Support for generating receipts.

## 🛠 Tech Stack

### Frontend (`apps/web`)
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4
- **State Management:** React Context API
- **HTTP Client:** Native Fetch / Custom Hooks

### Backend (`apps/api`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Authentication:** Better Auth
- **Validation:** Zod
- **File Uploads:** Multer (Local storage)

## 📂 Project Structure

This project is a monorepo managed with NPM Workspaces.

```
postkasir/
├── apps/
│   ├── api/      # Backend Express server
│   └── web/      # Frontend React application
├── package.json  # Root configuration
└── ...
```

## ⚡ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL Database
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd postkasir
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Environment Setup

#### Backend (`apps/api/.env`)
Create a `.env` file in the `apps/api` directory:
```env
PORT=3001
DATABASE_URL="postgresql://user:password@localhost:5432/postkasir_db"
FRONTEND_URL="http://localhost:5173"
# Add other keys (Midtrans, etc.) as needed
```

#### Frontend (`apps/web/.env`)
Create a `.env` file in the `apps/web` directory:
```env
VITE_API_URL="http://localhost:3001/api/v1"
```

### Running the Project

1. **Database Migration (Backend):**
   Run the migrations to set up your database schema.
   ```bash
   npm run db:push -w apps/api
   ```

2. **Start Development Servers:**
   You can run both apps concurrently if you add a root script, or run them in separate terminals.

   **Terminal 1 (Backend):**
   ```bash
   npm run dev -w apps/api
   ```

   **Terminal 2 (Frontend):**
   ```bash
   npm run dev -w apps/web
   ```

   - API will run on `http://localhost:3001`
   - Web App will run on `http://localhost:5173`

## 📦 Build

To build the project for production:

```bash
# Build Backend
npm run build -w apps/api

# Build Frontend
npm run build -w apps/web
```

## 🚀 Deployment

### Vercel Deployment

This monorepo can be deployed to Vercel as two separate projects (one for the frontend, one for the backend).

#### Important Note on Backend
The backend uses **local file storage** (`uploads/`) for images. On serverless platforms like Vercel, the filesystem is ephemeral (temporary), meaning **uploaded files will vanish** after deployments or function restarts.
*Recommendation:* For production, update the upload logic to use an external service like Cloudinary or AWS S3.

#### Steps

1. **Push to GitHub:** Ensure your code is committed and pushed.
2. **Create Database:** Provision a hosted PostgreSQL database (e.g., Neon, Supabase, or Railway).
3. **Deploy Frontend:**
   - Import the repo to Vercel.
   - Set **Root Directory** to `apps/web`.
   - Add Environment Variable: `VITE_API_URL` (Set this to your production backend URL once deployed).
4. **Deploy Backend:**
   - Import the repo *again* to Vercel (new project).
   - Set **Root Directory** to `apps/api`.
   - Add Environment Variables: `DATABASE_URL`, `FRONTEND_URL`, etc.
   - You may need to add a `vercel.json` in `apps/api` to correctly route the Express app.

---

Made with ❤️ by Ghevary
