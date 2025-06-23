# 🚀 MentorX – AI-Powered Mentorship & Career Guidance Platform

MentorX is an all-in-one AI-powered mentorship platform designed to help users navigate their career journey with expert mentors, intelligent tools, and community-driven features.

---

## 🔗 Live Demo

Deployed Link Soon

---

## ✨ Features

### 🎓 AI Career Tools
- **Mentor AI** – Chat with AI for personalized mentorship advice.
- **PathFinder AI** – Get AI-suggested career paths based on goals.
- **EduMatrix** – Discover curated courses (Udemy integration planned).

### 👥 Community
- Create posts, like, delete, and engage with other users.
- Explore posts via tags and follow favorite mentors.

### 📚 Personalized Dashboard
- View:
  - ❤️ Favorite Mentors
  - 🔖 Bookmarked Courses
  - ✍️ Liked Posts

### 🌗 Dark/Light Theme
- Toggle themes with `localStorage` persistence.
- UI adapts based on your preference.

### 🧠 Smart Integration
- Proxycurl for real mentor data.
- OpenAI for AI-powered tools.
- MongoDB for scalable backend storage.

---

## 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Framer Motion
- React Icons, Lucide, Remix Icons
- Axios, React Toastify

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

### APIs
- Proxycurl (mentors)
- OpenAI (Mentor AI, PathFinder)
- Udemy API (planned)
- Adzuna API (planned)
- Web3Forms (contact form)

---

## 📦 Installation

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/MentorX.git
```
```bash
cd MentorX
```

### 2. Backend Setup

```bash
cd BackEnd
```
```bash
npm install
```

➕ Add Environment Variables
Create a .env file in the BackEnd/ folder:

```bash
PORT=5050
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PROXYCURL_API_KEY=your_proxycurl_key
```

Then start the backend:
```bash
npm run dev
```

Runs at http://localhost:5050

### 3. Frontend Setup

```bash
cd ../FrontEnd
```
```bash
npm install
```
```bash
npm run dev
```

Runs at http://localhost:5173

### 4. Folder Structure
```bash
MentorX/
│
├── BackEnd/                           // 🌐 Backend server (Node.js + Express)
│   ├── config/                        // 🔧 Configuration files (DB, APIs, env vars)
│   ├── controllers/                  // 📦 Route logic handlers (auth, posts, users, etc.)
│   ├── middleware/                   // 🛡️ Middlewares (auth check, error handlers)
│   ├── models/                       // 🗃️ Mongoose schemas/models (User, Post, Course, etc.)
│   ├── routes/                       // 🚏 API route definitions
│   ├── scripts/                      // ⚙️ One-time or helper scripts (e.g., seeding DB)
│   ├── utils/                        // 🧰 Utility functions (token gen, validators, etc.)
│   └── index.js                      // 🚀 Entry point to start the backend server
│
├── FrontEnd/                         // 🎨 Frontend React app
│   ├── src/
│   │   ├── assets/                   // 🖼️ Static assets (images, icons, fonts)
│   │   ├── components/               // 🧩 Reusable UI components (Navbar, Cards, Sections)
│   │   ├── hookes/                   // 🪝 Custom React hooks (e.g., API fetch, theme logic)
│   │   ├── pages/                    // 📄 Full page views (Dashboard, MentorAI, Community)
│   │   ├── utils/                    // ⚙️ Helper functions and API logic (Axios instance, filters)
│   │   └── App.jsx                   // 🌐 Main app component with routing
│
└── README.md                         // 📘 Project documentation
```

### 5🔄 API Routes

🧠 AI Routes
```bash
GET /api/ai/mentor
```
```bash
GET /api/ai/pathfinder
```

👥 User Routes
```bash
POST /api/auth/login
```
```bash
POST /api/auth/register
```
```bash
GET  /api/users/favorites
```
```bash
GET  /api/users/bookmarks
```
```bash
GET  /api/users/likes
```

📚 Course Routes
```bash
GET /api/courses
```
```bash
PATCH /api/courses/:id/bookmark
```

📝 Post Routes
```bash
GET    /api/posts
```
```bash
POST   /api/posts
```
```bash
PATCH  /api/posts/:id/like
```
```bash
DELETE /api/posts/:id
```

### 6🧠 Learning Goals
🔹 Full-Stack Development (MERN)
Build a modern web application using MongoDB, Express.js, React.js, and Node.js from scratch.

🔹 Real-World API Integration
Work with live APIs like Proxycurl and OpenAI to power features such as mentor discovery and AI-driven guidance.

🔹 Global State & Theme Management
Use React Context API to manage user authentication, favorites, bookmarks, and dark/light theme toggling across the app.

🔹 Smooth UI Animations
Enhance user experience with responsive, scroll-aware, and interactive animations using Framer Motion.

🔹 Modern UI/UX with Tailwind CSS
Design visually polished, mobile-first interfaces with Tailwind CSS, complete with hover effects, transitions, and dark mode support.



### 7🤝 Contributing
Pull requests are welcome!
To contribute:
```bash
Fork the repo

Create a new branch: git checkout -b feature-name

Commit your changes

Push and open a pull request
```

### 8📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

### 9🙌 Acknowledgements
OpenAI

Proxycurl

Tailwind CSS

Framer Motion

Remix Icons

Lucide Icons

