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

### 2. Frontend Setup

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

🔄 API Routes
🧠 AI Routes
bash
Copy
Edit
GET /api/ai/mentor
GET /api/ai/pathfinder
👥 User Routes
bash
Copy
Edit
POST /api/auth/login
POST /api/auth/register
GET  /api/users/favorites
GET  /api/users/bookmarks
GET  /api/users/likes
📚 Course Routes
bash
Copy
Edit
GET /api/courses
PATCH /api/courses/:id/bookmark
📝 Post Routes
bash
Copy
Edit
GET    /api/posts
POST   /api/posts
PATCH  /api/posts/:id/like
DELETE /api/posts/:id

🧠 Learning Goals
Learn modern MERN stack development

Integrate real-world APIs (Proxycurl, OpenAI)

Practice state and theme management with React Context

Build animations with Framer Motion

Enhance UI/UX with Tailwind + Dark Mode

🤝 Contributing
Pull requests are welcome!
To contribute:

Fork the repo

Create a new branch: git checkout -b feature-name

Commit your changes

Push and open a pull request

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

🙌 Acknowledgements
OpenAI

Proxycurl

Tailwind CSS

Framer Motion

Remix Icons

Lucide Icons

