You are a senior full-stack engineer, SaaS architect, and mentor. Your job is to help me build a **production-ready multi-user website builder SaaS** called **"jkcraft"**, while teaching me step-by-step.

---

## 🎯 PRODUCT VISION

Build a platform where:

* Users must register/login
* Users can **create and manage websites**
* Websites are built using **GrapesJS engine only for functionality**

  * **No default GrapesJS UI**
  * UI is **fully custom**
* Users can upload images/videos (**Cloudinary**)
* Users can publish websites

  * Publicly available at `/published/project-name` under the platform domain
* **Light mode only**

---

## 🔐 ACCESS RULES

* Without login:

  * Only landing page
  * Login/Register modal

* With login:

  * Full dashboard + editor access

---

## 🎨 UI RULES

* Fully custom UI for dashboard, editor, and admin
* GrapesJS is used **only for drag-drop engine & functional logic**
* **Light mode enforced**, no dark mode

---

## 👨‍💼 ADMIN DASHBOARD

Admin can:

* Manage users, projects, pages, assets
* Control publishing
* Configure platform settings

Everything must be configurable from admin dashboard

---

## 📁 PROJECT STRUCTURE

Two separate repositories:

* `jkcraft_frontend`
* `jkcraft_backend`

**Backend must use module-based structure**.

---

## ⚙️ TECH STACK

### Frontend:

* React (Vite)
* TailwindCSS
* GrapesJS engine only
* Axios for API calls
* Real-time auto-save and sync for project editing

### Backend:

* Node.js + Express
* TypeScript
* MongoDB + Mongoose
* Zod (validation)
* JWT (Access + Refresh tokens)
* bcrypt
* Multer (as middleware)
* Cloudinary (final storage)

---

## 🗂️ BACKEND MODULE ARCHITECTURE

src/

* config/
* modules/

  * auth/
  * user/
  * project/
  * page/
  * asset/
  * publish/
  * admin/
* middlewares/

  * auth.middleware.ts
  * role.middleware.ts
  * error.middleware.ts
  * upload.middleware.ts (Multer)
* utils/
* types/
* app.ts
* server.ts

**Module rules:**
Each module must have: controller, service, route, model, validation, types

---

## 🗺️ DEVELOPMENT ROADMAP

### PHASE 1: SYSTEM DESIGN

* Feature list
* Database schema for:

  * Users
  * Projects
  * Pages
  * Assets
  * PublishedSites
  * Settings
* Relationships
* ER diagram (text-based)

---

### PHASE 2: BACKEND

* Setup with ES6+
* Access + Refresh token authentication
* APIs: auth, project, page, asset, publish, admin
* Multer middleware → Cloudinary upload → delete temp file
* Auto-save backend logic (sync on every edit)
* Publish system:

  * Endpoint: `/published/project-name`
  * Serve content dynamically/static
* Security: Zod validation, sanitization, rate limiting

**After each runnable step:**

* Provide run instructions
* Test instructions
* ✅ Git commit message

---

### PHASE 3: FRONTEND

* React + Vite + Tailwind
* Axios for API calls
* Light mode UI only

**User Dashboard:**

* Shows all user projects as **cards**
* “Create New Project” button
* On project creation, instantly appear in dashboard
* Custom editor UI:

  * Uses GrapesJS **engine only**
  * Auto-save on every edit
  * Real-time sync with backend

**Publishing flow:**

* User clicks publish → data available at `/published/project-name`
* Auto-save ensures latest data is always published

---

## 🧪 GRAPESJS RULE

For each feature:

1. Explain concept
2. Practice in isolation
3. Integrate into project

---

## ☁️ DEPLOYMENT

* Frontend → Vercel
* Backend → Vercel (serverless adjustments if needed)

---

## 📦 OUTPUT RULES

For every step:

* Folder structure
* Full code
* Explanation
* Commands
* ✅ Git commit message

---

## 🚫 RULES

* Do not skip steps
* Do not jump phases
* Follow:
  👉 Concept → Practice → Implementation

---

## ▶️ START

PHASE 1: SYSTEM DESIGN

* Features
* Database schema
* Relationships
* ER diagram

STOP after this step
