# 🚀 MERN Stack Blog Application - Deployment & DevOps

A full-stack blogging application built with the MERN stack (MongoDB, Express, React, Node.js), featuring authentication, image uploads, commenting, and category management.

This repository demonstrates **Deployment and DevOps best practices**, including CI/CD pipelines, production optimization, and cloud hosting.

## 🌐 Live Demo

* **Frontend (Live Blog):** [https://deployment-and-devops-essentials-zkpc.onrender.com](https://deployment-and-devops-essentials-zkpc.onrender.com)
* **Backend (API):** [https://deployment-and-devops-essentials-hcoh.onrender.com](https://deployment-and-devops-essentials-hcoh.onrender.com)
* **Health Check:** [https://deployment-and-devops-essentials-hcoh.onrender.com/health](https://deployment-and-devops-essentials-hcoh.onrender.com/health)

---

## 📸 Screenshots

### 1. CI/CD Pipeline Success
![CI/CD Pipeline Action](PLACEHOLDER_LINK_HERE)

### 2. Live Application (Home Page)
![Home Page](PLACEHOLDER_LINK_HERE)

### 3. Post Creation & Image Upload
![Create Post](PLACEHOLDER_LINK_HERE)

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), React Router v6, CSS Modules.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB Atlas (Production Cluster).
* **DevOps:** * **Hosting:** Render (Static Site + Web Service).
    * **CI/CD:** GitHub Actions (Automated testing & build checks).
    * **Monitoring:** Uptime health checks.

---

## ⚙️ Features Implemented

1.  **Production-Ready API:**
    * Security headers (`helmet`).
    * Request logging (`morgan`).
    * CORS configuration for specific frontend domains.
2.  **Authentication:**
    * JWT-based auth with secure password hashing (`bcryptjs`).
3.  **File Handling:**
    * Image uploads handled via `formidable`.
    * *(Note: On free Render tier, images are ephemeral and reset on deploy).*
4.  **DevOps & Automation:**
    * **Frontend CI:** Automatically builds React on push to verify syntax.
    * **Backend CI:** Verifies dependency installation on push.
    * **Health Check Endpoint:** `/health` route for uptime monitoring.

---

## 🚀 Setup & Installation

To run this project locally:

1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/PLP-MERN-Stack-Development/deployment-and-devops-essentials-Padawan33.git](https://github.com/PLP-MERN-Stack-Development/deployment-and-devops-essentials-Padawan33.git)
    cd deployment-and-devops-essentials-Padawan33
    ```

2.  **Install Dependencies:**
    ```bash
    # Install server deps
    cd server && npm install
    # Install client deps
    cd ../client && npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the `server` folder:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    NODE_ENV=development
    ```

4.  **Run Locally:**
    ```bash
    # Run Backend
    cd server && npm start
    # Run Frontend (in new terminal)
    cd client && npm run dev
    ```

---

## 📝 Deployment Process

1.  **Backend:** Deployed to **Render Web Service**.
    * Environment variables configured in Render Dashboard.
    * Build Command: `npm install`.
    * Start Command: `npm start`.
2.  **Frontend:** Deployed to **Render Static Site**.
    * Build Command: `npm install && npm run build`.
    * Publish Directory: `dist`.
    * Rewrites configured for SPA routing (`/*` -> `/index.html`).