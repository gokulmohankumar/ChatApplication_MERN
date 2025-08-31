# Chat Application

A real-time chat application built with the MERN stack.

## Features
- User authentication (sign up, login)
- Real-time messaging
- Chat rooms and direct messages
- Responsive UI with React + Tailwind CSS

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Socket.io
- **Database**: MongoDB

## Getting Started

### Prerequisites
- Node.js (v20.19+ or 22.12+)
- MongoDB (local or Atlas)

### Installation

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend will start on a development server (port may vary).  
The backend will run on the configured port in your `.env` file.

### Environment Variables

Create a `.env` file in the `backend` directory and add:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Running the App
1. Start the backend server.
2. Start the frontend development server.
3. Open the URL shown in the terminal for the frontend.

## License
This project is licensed under the MIT License.
