# 💬 Fullstack Chat App

A modern real-time chat application built with React, Node.js, Socket.io, and MongoDB featuring message reactions and image sharing.

## ✨ Features

- 🔐 **Authentication** - JWT-based login/signup with secure password hashing
- 💬 **Real-time Messaging** - Instant messaging with Socket.io
- 😊 **Message Reactions** - React to messages with emojis (👍❤️😂😮😢😡)
- 🖼️ **Image Sharing** - Upload and share images via Cloudinary
- 👥 **User Management** - View online users and chat history
- 🎨 **Modern UI** - Clean interface built with Tailwind CSS and DaisyUI
- 📱 **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **DaisyUI** - UI components
- **Zustand** - State management
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **bcryptjs** - Password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd fullstack-chat-app
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Environment Setup**

Create `.env` file in the `backend` directory:
```env
MONGODB_URI=mongodb://localhost:27017/chatapp
PORT=5001
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. **Start the application**
```bash
# Start backend (from backend directory)
npm start

# Start frontend (from frontend directory)
npm run dev
```

5. **Access the app**
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## 📁 Project Structure

```
fullstack-chat-app/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── lib/            # Utilities (db, socket, cloudinary)
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── index.js        # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand stores
│   │   ├── lib/            # Utilities
│   │   └── App.jsx         # Main app component
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check` - Check auth status
- `PUT /api/auth/update-profile` - Update profile

### Messages
- `GET /api/messages/users` - Get all users
- `GET /api/messages/:id` - Get messages with user
- `POST /api/messages/send/:id` - Send message
- `POST /api/messages/react/:messageId` - Add/remove reaction

## 🎯 Key Features Implementation

### Message Reactions
- Click the "+" button under any message to open emoji picker
- Select from 6 popular emojis: 👍❤️😂😮😢😡
- Toggle reactions by clicking the same emoji again
- Real-time updates across all connected clients
- Visual feedback for user's own reactions

### Real-time Communication
- Socket.io handles instant message delivery
- Real-time reaction updates
- Online user status
- Automatic reconnection

### Image Sharing
- Drag & drop or click to upload images
- Cloudinary integration for optimized storage
- Image preview in chat
- Responsive image display

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcryptjs
- Protected routes and middleware
- Input validation and sanitization
- CORS configuration

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)
1. Set environment variables
2. Update CORS origin to your frontend URL
3. Deploy backend first

### Frontend Deployment (Vercel/Netlify)
1. Update API base URL in `frontend/src/lib/axios.js`
2. Build and deploy frontend

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Socket.io for real-time communication
- Cloudinary for image management
- Tailwind CSS for styling
- DaisyUI for UI components
