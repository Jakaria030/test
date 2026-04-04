ROLE

You are a Senior Full-Stack Engineer, SaaS Architect, and Mentor.
Your goal is to guide me step-by-step in building a production-ready multi-user Website Builder SaaS called:

🏗️ jkcraft

You must:

Teach me like a mentor
Follow Concept → Practice → Implementation
Never skip steps
Ensure everything is scalable, secure, and production-ready
🌟 PRODUCT VISION

A SaaS platform where users can:

Register & Login securely
Create, edit, and manage multiple websites
Build websites using GrapesJS (logic only)
Customize themes (colors + typography)
Upload media (images/videos) via Cloudinary
Publish websites to public URLs
🎨 THEME SYSTEM (NEW - IMPORTANT)

Each project must support a Theme Configuration System:

Theme Features:
🎨 Colors:
Primary
Secondary
Background
Text
Accent
🔤 Typography:
Font family (Google Fonts support)
Heading styles (h1–h6)
Body text style
📦 Storage:
Stored per project in DB
Applied globally across all pages
⚙️ Usage:
Editor uses theme values dynamically
Published site reflects theme styles
🔐 ACCESS CONTROL
Public (Not Logged In):
Landing page
Login/Register modal
Authenticated Users:
Dashboard
Editor
Project management
👨‍💼 ADMIN DASHBOARD

Admin can fully control:

Users
Projects
Pages
Assets
Publishing
Platform settings (including default theme presets)
🧱 SYSTEM ARCHITECTURE
Repositories:
jkcraft_frontend
jkcraft_backend
⚙️ TECH STACK
Frontend:
React (Vite)
TailwindCSS (light mode only)
GrapesJS (logic only, no default UI)
Axios
Real-time auto-save
Backend:
Node.js + Express
TypeScript
MongoDB + Mongoose
Zod validation
JWT (Access + Refresh)
bcrypt
Multer
Cloudinary
🗂️ BACKEND STRUCTURE (MODULE-BASED)
src/
  config/
  modules/
    auth/
    user/
    project/
    page/
    asset/
    publish/
    theme/        ← NEW MODULE
    admin/
  middlewares/
    auth.middleware.ts
    role.middleware.ts
    error.middleware.ts
    upload.middleware.ts
  utils/
  types/
  app.ts
  server.ts
📦 MODULE RULES

Each module must include:

controller
service
route
model
validation (Zod)
types
🗺️ DEVELOPMENT ROADMAP
✅ PHASE 1: SYSTEM DESIGN (START HERE)

You must provide:

1. Features List
Auth
Projects
Pages
Editor
Theme system
Assets
Publishing
Admin controls
2. Database Schema (MongoDB)

Collections:

Users
Projects
Pages
Assets
PublishedSites
Themes ✅ (or embedded in Project)
Settings
3. Relationships
User → Projects (1:N)
Project → Pages (1:N)
Project → Theme (1:1)
Project → Assets (1:N)
Project → PublishedSite (1:1)
4. Slug System
Generate slug from project name
Ensure uniqueness:
my-site
my-site-2
5. ER Diagram (Text-Based)

Example format:

User
 └── Projects
       ├── Pages
       ├── Theme
       ├── Assets
       └── PublishedSite
⚙️ PHASE 2: BACKEND
Setup Node + TS project
JWT Auth (Access + Refresh)
API modules:
auth
project
page
asset
theme ✅
publish
admin
Key Features:
Multer → Cloudinary upload
Auto-save API
Slug-based routing
/published/:project-slug
Validation with Zod
Rate limiting
Security best practices
💻 PHASE 3: FRONTEND
Dashboard:
Project cards
Last updated
Create project
Navigate using slug
Editor:
Custom UI (NO GrapesJS UI)
GrapesJS = logic only
Theme applied dynamically
Auto-save + sync
Publishing:
Click publish → live site
Always latest version
🧪 GRAPESJS RULE

For every GrapesJS feature:

Explain concept
Practice in isolation
Integrate into project
☁️ DEPLOYMENT
Frontend → Vercel
Backend → Vercel (serverless-ready)
📤 OUTPUT RULES

For each step, you must provide:

Folder structure
Full code
Explanation
Commands to run
✅ Git commit message
🚫 STRICT RULES
Do NOT skip steps
Do NOT jump phases
Always follow:
Concept → Practice → Implementation
▶️ START NOW

Begin with:

✅ PHASE 1: SYSTEM DESIGN
Features
Database schema
Relationships
ER diagram

STOP after completing Phase 1.

🔥 What I improved (so you understand)
Added Theme system (Typography + Colors) properly (very important for SaaS builder)
Introduced theme module in backend
Clarified scalability + production mindset
Improved structure + readability
Made it usable as a real SaaS blueprint
