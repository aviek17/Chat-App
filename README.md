# 💬 TalkSphere — Real-Time Chat Application

A full-stack real-time chat application built with **React + Redux** on the frontend and **Node.js + Express + Socket.IO** on the backend, backed by **MongoDB Atlas** and secured with **JWT authentication** and **AES-256 message encryption**.

---

## 🗂️ Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Features](#features)
- [API Reference](#api-reference)
- [Socket Events](#socket-events)
- [Data Models](#data-models)
- [Authentication Flow](#authentication-flow)
- [Message Encryption](#message-encryption)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)

---

## Overview

TalkSphere is a real-time private messaging application that supports:

- User registration and login with JWT-based sessions
- Real-time 1-to-1 messaging over WebSockets
- Contact management with friend request flows
- User presence tracking (online/offline/away)
- Profile pictures with local file storage
- AES-256-CBC encrypted message storage in the database
- Theme support (light/dark) persisted client-side

---

## Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| UI Framework | React 19 + Vite |
| State Management | Redux Toolkit + redux-persist |
| Routing | React Router DOM v7 |
| UI Components | MUI (Material UI) v7 + Tailwind CSS v4 |
| HTTP Client | Axios (with request/response interceptors) |
| Real-time | Socket.IO Client v4 |
| Validation | Zod |
| Icons | Lucide React, React Icons, MUI Icons |
| Emoji | emoji-picker-react |

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express v5 |
| Database | MongoDB Atlas (via Mongoose v8) |
| Real-time | Socket.IO v4 |
| Authentication | JWT (jsonwebtoken) + bcrypt |
| File Upload | Multer |
| Validation | Zod |
| Firebase | Firebase Admin SDK (auth layer — partially wired) |
| Encryption | Node.js `crypto` — AES-256-CBC |
| Deployment | Vercel (configured via `vercel.json`) |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│                                                             │
│   React + Vite                                              │
│   ┌──────────────┐   ┌──────────────┐   ┌───────────────┐  │
│   │  Pages/Views │   │ Redux Store  │   │SocketManager  │  │
│   │  (React      │◄──│  (RTK +      │   │ (Socket.IO    │  │
│   │   Router)    │   │   persist)   │   │  Client)      │  │
│   └──────┬───────┘   └──────────────┘   └──────┬────────┘  │
│          │  Axios (+ JWT interceptor)           │ WS/Poll   │
└──────────┼───────────────────────────────────────┼──────────┘
           │ HTTPS REST                            │ WebSocket
           ▼                                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  SERVER  (Node.js / Express v5)              │
│                                                             │
│  Context Path: /talksphere-chat-app                         │
│                                                             │
│  ┌────────────────────┐    ┌──────────────────────────────┐ │
│  │   HTTP Routes      │    │   Socket.IO Server           │ │
│  │  /user  /chat      │    │   SocketConnectionManager    │ │
│  │                    │    │  ┌──────────┐ ┌───────────┐  │ │
│  │  Middlewares:      │    │  │   Chat   │ │   User    │  │ │
│  │  • httpAuth (JWT)  │    │  │  Socket  │ │  Socket   │  │ │
│  │  • validator (Zod) │    │  │Controller│ │Controller │  │ │
│  │  • multer (upload) │    │  └──────────┘ └───────────┘  │ │
│  │  • errorHandler    │    │  socketAuth middleware (JWT)  │ │
│  └─────────┬──────────┘    └──────────────────────────────┘ │
│            │                                                 │
│  ┌─────────▼──────────────────────────────────────────────┐ │
│  │               Service Layer                            │ │
│  │   UserService  │  ChatService  │  CommonService        │ │
│  └─────────┬──────────────────────────────────────────────┘ │
│            │                                                 │
│  ┌─────────▼──────────────────────────────────────────────┐ │
│  │               Repository Layer                         │ │
│  │        UserRepo          │         ChatRepo            │ │
│  └─────────┬──────────────────────────────────────────────┘ │
│            │                                                 │
└────────────┼─────────────────────────────────────────────────┘
             │ Mongoose ODM
             ▼
┌─────────────────────────┐       ┌──────────────────────────┐
│   MongoDB Atlas          │       │  Firebase Admin SDK       │
│                         │       │  (partially integrated —  │
│  Collections:           │       │   auth middleware exists  │
│  • users                │       │   but commented out)      │
│  • usercontacts         │       └──────────────────────────┘
│  • messages             │
│  • profilephotos        │       ┌──────────────────────────┐
└─────────────────────────┘       │  Local File System        │
                                  │  /public/photo            │
                                  │  (profile pictures)       │
                                  └──────────────────────────┘
```

---

## Project Structure

```
├── client/                          # React frontend (Vite)
│   └── src/
│       ├── App.jsx                  # Root routes definition
│       ├── main.jsx                 # App entry point
│       ├── pages/                   # Top-level page components
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── MainContainer.jsx    # Chat main view
│       │   ├── ChatListContainer.jsx
│       │   ├── Sidebar.jsx
│       │   ├── Header.jsx
│       │   └── FriendApproval.jsx   # Contact request management
│       ├── components/              # Reusable UI components
│       │   ├── ChatContainer.jsx
│       │   ├── ChatHeader.jsx
│       │   ├── MessageBubble.jsx
│       │   ├── MessageInput.jsx
│       │   ├── MessageList.jsx
│       │   ├── EmojiPicker.jsx
│       │   ├── LoginForm.jsx
│       │   ├── RegisterForm.jsx
│       │   ├── Profile.jsx
│       │   ├── ContactRequest.jsx
│       │   ├── NewContact.jsx
│       │   ├── MenuDrawer.jsx
│       │   ├── CustomModal.jsx
│       │   ├── ErrorModal.jsx
│       │   └── SuccessModal.jsx
│       ├── layouts/                 # Layout wrappers
│       │   ├── MainLayout.jsx       # Protected app shell
│       │   ├── AuthLayout.jsx       # Login/register shell
│       │   └── AppLoader.jsx        # Init loading state
│       ├── routes/
│       │   └── PrivateRoute.jsx     # Auth guard
│       ├── store/                   # Redux state management
│       │   ├── index.js             # Store + redux-persist config
│       │   ├── slice/
│       │   │   ├── authSlice.js     # JWT token + isAuthenticated
│       │   │   ├── userInfoSlice.js # Logged-in user profile
│       │   │   ├── chatListSlice.js # Chat list (sidebar)
│       │   │   ├── allUserMessageSlice.js  # Per-user message cache
│       │   │   ├── selectedUserSlice.js    # Active chat target
│       │   │   ├── friendSlice.js   # Friends list
│       │   │   ├── contactSlice.js  # Contacts list
│       │   │   ├── themeSlice.js    # Dark/light theme
│       │   │   ├── menuDrawerSlice.js
│       │   │   └── appSlice.js
│       │   ├── middleware/
│       │   │   └── themeMiddleware.js
│       │   ├── context/
│       │   │   └── ThemeProvider.jsx
│       │   └── hooks/index.js       # Typed useAppSelector/Dispatch
│       ├── sockets/                 # Socket.IO client layer
│       │   ├── SocketManager.js     # Singleton socket connection class
│       │   ├── hooks/useSocket.js
│       │   └── events/
│       │       ├── auth.js          # authenticate event
│       │       ├── chat.js          # send_message event
│       │       ├── message.js       # incoming message handlers
│       │       └── user.js          # presence events
│       ├── services/                # HTTP service modules
│       │   ├── axios.service.js     # Axios instance + interceptors
│       │   ├── user.service.js      # User API calls
│       │   ├── chat.service.js      # Chat API calls
│       │   └── common.service.js
│       ├── hooks/
│       │   ├── useAppInit.jsx       # App initialization logic
│       │   ├── useCommonApi.jsx
│       │   └── useEmojiPicker.jsx
│       └── utils/
│           ├── constants/api.constants.js
│           └── schemas/passwordSchema.js
│
└── server/                          # Node.js + Express backend
    ├── index.js                     # App entry — Express + Socket.IO setup
    ├── routes/
    │   ├── user.js                  # /user/* HTTP routes
    │   └── chat.js                  # /chat/* HTTP routes
    ├── controllers/
    │   ├── UserController.js        # HTTP request handlers
    │   └── ChatController.js
    ├── service/
    │   ├── UserService.js           # User business logic
    │   ├── ChatService.js           # Chat business logic
    │   ├── CommonService.js         # Shared utilities
    │   ├── SocketService.js         # Socket.IO bootstrap
    │   └── Firebase.js              # Firebase Admin initialization
    ├── repo/
    │   ├── UserRepo.js              # MongoDB queries — users/contacts
    │   └── ChatRepo.js              # MongoDB queries — messages
    ├── models/
    │   ├── User.js                  # User schema (bcrypt pre-save)
    │   ├── ProfilePicture.js        # Profile photo metadata
    │   └── chats/PrivateChat/
    │       ├── privateMessage.js    # Encrypted message schema
    │       └── userContact.js       # Contact/friend request schema
    ├── sockets/
    │   ├── SocketConnectionManager.js   # Central socket orchestrator
    │   ├── controllers/
    │   │   ├── ChatSocketController.js  # chat socket event handlers
    │   │   └── UserSocketController.js  # presence/profile socket events
    │   └── service/
    │       ├── ChatSocketService.js     # Message delivery logic
    │       └── UserSocketService.js     # Presence management
    ├── middlewares/
    │   ├── httpAuth.js              # JWT auth for HTTP routes
    │   ├── socketAuth.js            # JWT auth for socket connections
    │   ├── validator.js             # Zod request validation
    │   ├── profilePhotoUpload.js    # Multer file upload config
    │   ├── firebaseAuth.js          # Firebase auth (available, unused)
    │   └── errorHandler.js          # Global error handler
    ├── errors/
    │   ├── AppError.js
    │   ├── AuthError.js
    │   └── ValidationError.js
    ├── utils/
    │   ├── jwtUtils.js              # sign / verify / auto-refresh JWT
    │   └── logger.js                # Coloured console logger
    ├── validation/
    │   ├── user.js                  # Zod schema — signup/login
    │   └── message.js               # Zod schema — messages
    ├── private/
    │   └── firebaseConfig.json      # Firebase service account (gitignored in prod)
    └── vercel.json                  # Vercel deployment config
```

---

## Features

### Authentication
- Email + password registration and login
- Passwords hashed with **bcrypt** (salt rounds: 10)
- **JWT tokens** with 7-day expiry, auto-refreshed silently after 24 hours via `X-New-Token` response header
- Token stored in Redux (persisted to localStorage via redux-persist)
- Axios request interceptor injects Bearer token on every API call
- 401 responses automatically log the user out and redirect to `/login`

### Messaging
- Real-time 1-to-1 private messaging via **Socket.IO** (WebSocket + polling fallback)
- Messages stored in MongoDB with **AES-256-CBC encryption** (server-side)
- Message status lifecycle: `sent → delivered → read`
- `readAt` and `deliveredAt` timestamps tracked per message
- Soft delete support (`isDeleted`, `deletedAt`)
- Attachment field reserved in schema (not yet implemented in UI)

### Contacts & Friends
- Search users by phone number
- Send contact requests (creates dual-sided DB entries atomically via MongoDB session/transaction)
- Accept or reject contact requests via Socket.IO real-time events
- Contact flags: `isPending`, `isFriend`, `isFavorite`, `isBlocked`, `isArchived`, `isMuted`

### Presence
- In-memory `activeUsers` Map on the server tracks `socketId → userId`
- User status: `online`, `away`, `offline` synced to MongoDB
- `lastSeen` timestamp updated on disconnect
- `check_user_online` and `get_online_contacts` queries supported

### Profile
- Upload profile photo (stored locally under `/public/photo/`, served as static with 30-day cache)
- Update display name, bio, phone number
- ProfilePicture schema supports future migration to S3 or Cloudinary (`storageType` field)

### UI
- Light / dark theme toggle, persisted across sessions
- Emoji picker in message input
- MUI + Tailwind hybrid styling
- Sidebar with chat list, menu drawer, and navigation icons
- Private route guard — unauthenticated users redirected to `/login`

---

## API Reference

All routes are prefixed with the context path: `/talksphere-chat-app`

### User Routes — `/user`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/sign-up` | ❌ | Register a new user |
| `POST` | `/login` | ❌ | Login and receive JWT |
| `POST` | `/update-profile-picture` | ✅ | Upload a new profile photo (multipart) |
| `POST` | `/update-profile` | ✅ | Update display name, bio, phone number |
| `POST` | `/get-user-info-on-phone-number` | ✅ | Look up a user by phone number |
| `POST` | `/add-new-contact` | ✅ | Send a contact/friend request |
| `GET` | `/contacts` | ✅ | Get accepted contacts list |
| `POST` | `/request-approval` | ✅ | Accept or reject a contact request |
| `GET` | `/user-pending-requests` | ✅ | Requests you sent that are pending |
| `GET` | `/contact-pending-requests` | ✅ | Requests received awaiting your approval |
| `GET` | `/vercel/status` | ❌ | Health check |

### Chat Routes — `/chat`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/user-display-message` | ✅ | Get messages for a specific conversation |
| `GET` | `/user-last-messages` | ✅ | Get last message per contact (chat list) |

### Static Assets

| Path | Description |
|------|-------------|
| `/profile-photo/:filename` | Serve profile photos (30-day cache, immutable) |

---

## Socket Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `authenticate` | `{ userId }` | Register user in active users map |
| `send_message` | `{ receiverId, content }` | Send a private message |
| `get_user_profile` | `{ userId }` | Request a user's profile |
| `update_status` | `{ status }` | Update presence status |
| `contact_request_accepted` | `{ contactId }` | Notify contact of acceptance |
| `contact_request_rejected` | `{ contactId }` | Notify contact of rejection |
| `check_user_online` | `{ userId }` | Query online status of a user |
| `get_online_contacts` | — | Get list of online contacts |
| `ping` | — | Keepalive ping |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `receive_message` | `{ message }` | Deliver incoming message |
| `user_online_status` | `{ userId, isOnline }` | Online status response |
| `pong` | `{ timestamp }` | Keepalive pong |
| `error` | `{ message }` | Error notification |

---

## Data Models

### User
```
uid, email, username, displayName, phoneNumber, bio,
profilePicture (ref), isOnline, lastSeen, status (online/away/offline),
isVerified, createdAt, lastLogin, password (bcrypt)
```

### Message (PrivateMessage)
```
sender (ref User), receiver (ref User),
encryptedContent, iv,
status (sent/delivered/read), readAt, deliveredAt,
editedAt, isDeleted, deletedAt, attachment (ref)
Virtual: content (decrypted), chatRoom (sorted sender_receiver ID)
```

### UserContact
```
userId (ref User), contactUserId (ref User),
requestSentBy (username), contactNickname,
addedBy: { source: phone|email|username, value },
isPending, isFavorite, isBlocked, isArchived, isMuted, isFriend, addedAt
```

### ProfilePicture
```
userId (ref User), uid, path, filename, mimetype, size,
isActive, storageType (local|s3|cloudinary), url
```

---

## Authentication Flow

```
1. User submits login form
        │
        ▼
2. POST /user/login → UserController.login
        │
        ▼
3. UserService validates credentials (bcrypt.compare)
        │
        ▼
4. jwtUtils.generateToken({ uid, email, username, displayName }, 7d)
        │
        ▼
5. Token returned in response body
        │
        ▼
6. Client: store.dispatch(setToken(token)) → redux-persist → localStorage
        │
        ▼
7. Axios interceptor: every request adds Authorization: Bearer <token>
        │
        ▼
8. After 24h: server detects stale token, issues new token in X-New-Token header
        │
        ▼
9. Axios response interceptor: store.dispatch(updateToken(newToken))
        │
        ▼
10. On 401: store.dispatch(logout()) → persistor.purge() → redirect /login

Socket auth:
  Socket handshake passes token in auth.token field
  socketAuthMiddleware verifies JWT before allowing connection
```

---

## Message Encryption

All message content is encrypted at rest in MongoDB using **AES-256-CBC**.

```
Sending a message:
  plaintext → crypto.randomBytes(16) [IV]
            → crypto.createCipheriv('aes-256-cbc', KEY, IV)
            → encryptedContent (hex) + iv (hex) → stored in MongoDB

Reading a message:
  encryptedContent + iv → crypto.createDecipheriv(...)
                        → plaintext (exposed as virtual field `content`)
```

The encryption key (`MESSAGE_ENCRYPTION_KEY`) is a 32-byte hex string configured via environment variable. IVs are generated randomly per message.

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret |
| `MESSAGE_ENCRYPTION_KEY` | 32-byte hex key for AES-256-CBC |
| `MESSAGE_ENCRYPTION_ALGO` | Encryption algorithm (`aes-256-cbc`) |
| `CONTEXT_PATH` | URL prefix for all routes (e.g. `/talksphere-chat-app`) |
| `CLIENT_URL` | Allowed CORS origin (production) |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Firebase service account JSON |
| `NODE_ENV` | `development` or `production` |

### Client (`client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_CHAT_APP_API_URL` | Backend REST API base URL |
| `VITE_CHAT_APP_HOST` | Backend host (for Socket.IO connection) |
| `VITE_CHAT_APP_SOCKET_PATH` | Socket.IO path (must match `CONTEXT_PATH`) |
| `VITE_NODE_ENV` | Environment flag |

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas cluster (or local MongoDB)
- (Optional) Firebase project with Admin SDK credentials

### Server

```bash
cd server
npm install
cp .env.example .env          # fill in your values
npm run dev                   # nodemon — auto-reload
# or
npm start                     # production
```

### Client

```bash
cd client
npm install
cp .env.example .env          # set VITE_CHAT_APP_API_URL etc.
npm run dev                   # Vite dev server (default: http://localhost:5173)
npm run build                 # Production build → dist/
```

### Deployment

The backend includes a `vercel.json` and is preconfigured for **Vercel** deployment. The production URL used in the codebase is:

```
https://chat-app-one-gold-74.vercel.app
```

Update `VITE_CHAT_APP_API_URL` and `VITE_CHAT_APP_HOST` in the client `.env` for your deployment target.

---

## Notes & Known Limitations

- **Firebase auth middleware** (`firebaseAuth.js`) exists and Firebase Admin SDK is initialized, but the middleware is commented out in `routes/user.js`. Currently, only custom JWT auth is active.
- **Message attachments** — the `attachment` field is modelled in the Message schema but the upload/delivery pipeline is not yet implemented.
- **Group chat** — the architecture only implements private (1-to-1) messaging. The folder `models/chats/PrivateChat/` suggests group chat is planned but not present.
- **Active users** are stored in-memory (`Map`) on the server. This will not work correctly across multiple server instances — a Redis adapter would be needed for horizontal scaling.
- **Profile photos** are stored on the local filesystem. The `ProfilePicture` model has a `storageType` field (`local | s3 | cloudinary`) to support future cloud migration.

---

*Built by aviek.paul*