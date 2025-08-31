📌 G-CHAT: A Real-Time Chat Application
🚀 Project Overview

G-CHAT is a modern, real-time chat application built using the MERN stack.
It allows users to send and receive messages instantly, supporting both one-on-one and group conversations.

This project was developed as part of an evaluation for ZenThink Technologies.

✨ Features

⚡ Real-Time Messaging – Instantaneous message delivery using Socket.io.

🔒 User Authentication – Secure user registration and login functionality.

💾 Persistent Conversations – Chats and messages stored in MongoDB.

👤 One-on-One Chat – Search for and initiate private chats with registered users.

👥 Group Chat – Create group conversations with multiple participants.

📱 Responsive UI – Clean, intuitive interface built with React & Tailwind CSS.

🛠 Tech Stack
🔹 Backend

Node.js – JavaScript runtime environment

Express.js – REST API framework

MongoDB – NoSQL database

Socket.io – Real-time communication

bcryptjs – Password hashing

cloudinary – Profile image upload

jsonwebtoken – Authentication

🔹 Frontend

React – UI library

React Router DOM – Client-side routing

Context API – Global state management

Axios – API requests

Socket.io-client – Real-time backend communication

⚙️ Getting Started
✅ Prerequisites

Node.js (v14 or higher)

MongoDB (local or cloud-hosted instance)

🔽 Installation
1. Clone the repository
git clone [Your Repository Link Here]
cd [Your Repository Name]

2. Backend Setup
cd backend
npm install


Create a .env file inside backend/ with:

MONGO_URI = "mongodb+srv://your-username:your-password@your-cluster.mongodb.net/gchat?retryWrites=true&w=majority"
JWT_SECRET = "your-jwt-secret"

3. Frontend Setup
cd ../frontend
npm install


Create a .env file inside frontend/ with:

REACT_APP_API_BASE_URL = "http://localhost:5100"

▶️ Running the Application
Start Backend Server
cd backend
npm start


👉 Runs on: http://localhost:5100

Start Frontend Client
cd frontend
npm run dev


👉 Runs on: http://localhost:5173

