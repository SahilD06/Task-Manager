# Task Mastery - MongoDB Edition

A beautifully minimal, full-stack Task Manager application upgraded with real-time persistence via MongoDB Atlas.

## ✨ Features
- **Frontend**: Minimalist, high-performance UI built with React.
- **Backend API**: Secure REST endpoints using Next.js App Router.
- **Persistence**: Powered by **MongoDB Atlas** for reliable, cloud-based data storage.
- **Git Integration**: Pre-configured with `.gitignore` and `.env` templates for secure deployments.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: Version 20.6.0 or higher.
- **MongoDB Atlas Account**: A connection string for your cluster.

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/SahilD06/Task-Manager.git
cd Task-Manager
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add your MongoDB connection string:
```env
MONGODB_URI=mongodb+srv://your_user:your_password@cluster0.6jq1skr.mongodb.net/?appName=Cluster0
```
> [!IMPORTANT]
> Never commit your `.env.local` file to version control. It is already included in `.gitignore`.

### 4. Running the App
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## 🛠️ Assumptions & Trade-offs

### Assumptions
- **Database Name**: It is assumed that the database name is `Assignment`, as defined in `src/lib/db.js`.
- **Environment**: The setup assumes a modern Node.js environment that supports `.env.local` natively (Next.js 10+).

### Trade-offs
- **MongoDB Driver vs. Mongoose**: I chose the native `mongodb` driver over Mongoose.
    - *Rationale*: For a simple task manager, Mongoose adds unnecessary overhead. The native driver is faster and perfectly sufficient for basic CRUD operations.
- **ID Mapping**: To maintain compatibility with existing frontend logic that expects an `id` field, the API manually maps MongoDB's `_id` to `id`.
    - *Rationale*: This avoids refactoring the entire frontend state management while still benefiting from MongoDB's unique object IDs.
- **Minimal Error Handling**: Basic try/catch blocks are used in API routes. In a larger production app, a more robust global error boundary or logging service (like Sentry) would be recommended.

---

## 📦 Tech Stack
- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Language**: JavaScript (ESM)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Styling**: Vanilla CSS
