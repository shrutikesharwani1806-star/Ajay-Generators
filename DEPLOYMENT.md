# 🚀 Ajay Generators - Deployment Guide (Next.js Unified)

This guide provides instructions to deploy the unified Ajay Generators platform. The project is now a single-folder Next.js application, making it fully compatible with **Vercel**, **Netlify**, or any Node.js host.

## 1. Prerequisites
- A **MongoDB Atlas** account (Database).
- A **Cloudinary** account (Image hosting).
- A **Razorpay** account (Payments).

## 2. Environment Variables
Set these variables in your hosting provider's dashboard (e.g., Vercel Dashboard > Settings > Environment Variables):

| Variable | Description |
| :--- | :--- |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `RAZORPAY_KEY_ID` | Your Razorpay API Key ID |
| `RAZORPAY_KEY_SECRET` | Your Razorpay API Secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary name |
| `CLOUDINARY_API_KEY` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret |
| `NODE_ENV` | `production` |

## 3. Deployment Steps (Vercel)
1. **Push your code** to GitHub.
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com).
   - Select "New Project" and import this repository.
   - Vercel will automatically detect **Next.js**.
3. **Configure Settings**:
   - Framework Preset: `Next.js`
   - Root Directory: `./`
   - Build Command: `next build`
   - Install Command: `npm install --legacy-peer-deps`
4. **Deploy**: Click Deploy.

## 4. Local Development
1. Clone the repo.
2. Install dependencies: `npm install --legacy-peer-deps`
3. Run dev server: `npm run dev`
4. Access at: `http://localhost:3000`

## 5. Architecture Highlights
- **Unified Folder**: Frontend and Backend (API) are in one project.
- **App Router**: Optimized routing and server-side rendering.
- **Pure JavaScript**: No TypeScript overhead.
- **Responsive Design**: Uses strict `vw`/`vh` for premium industrial UI.

---
**Ajay Generators - Premium Power Solutions**
