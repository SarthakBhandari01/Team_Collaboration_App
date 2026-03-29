# Team Collaboration Platform

A real-time team collaboration application similar to Slack, built with React, Node.js, Express, MongoDB, and Socket.io.

## Features

### Workspaces & Channels

- Create and manage multiple workspaces
- Create public/private channels within workspaces
- Invite members via email or join code
- Admin controls for workspace management

### Real-time Messaging

- Instant messaging with Socket.io
- Rich text editor with formatting options
- Message editing and deletion
- @mentions with notifications
- Message timestamps and read receipts

### Direct Messages

- Private 1-on-1 conversations
- Real-time message delivery
- Conversation history

### User Management

- User authentication (Sign up/Sign in)
- JWT-based session management
- User profiles with avatars
- Role-based access control (Admin/Member)

### Notifications

- Real-time notifications for mentions
- Workspace invite notifications
- Unread message indicators

### Search

- Search messages within workspaces
- Search channels and members

## Tech Stack

### Frontend

- **React 18** - UI framework
- **Vite** - Build tool
- **TanStack Query** - Server state management
- **Socket.io Client** - Real-time communication
- **Tailwind CSS** - Styling
- **Radix UI / shadcn** - UI components
- **React Router** - Navigation

### Backend

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Zod** - Validation

## Project Structure

```
Team_Collaboration_platform/
├── Messaging_app_backend/
│   ├── src/
│   │   ├── config/         # Database, mail, server configs
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth middleware
│   │   ├── repositories/   # Database queries
│   │   ├── routes/         # API routes
│   │   ├── schema/         # Mongoose models
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helpers and errors
│   │   ├── validators/     # Request validation
│   │   └── index.js        # Entry point
│   └── package.json
│
├── Messaging_app_frontend/
│   ├── src/
│   │   ├── api/            # API request functions
│   │   ├── components/     # React components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd Messaging_app_backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# Edit .env with your values

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd Messaging_app_frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_BACKEND_URL=http://localhost:3000/api/v1" > .env

# Start development server
npm run dev
```

## Environment Variables

### Backend (.env)

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=1d
DEV_DB_URL=mongodb://localhost:27017/team_collab
PROD_DB_URL=mongodb+srv://...
MAIL_ID=your-email@gmail.com
MAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_BACKEND_URL=http://localhost:3000/api/v1
```

## API Endpoints

### Authentication

- `POST /api/v1/users/signup` - Register user
- `POST /api/v1/users/signin` - Login user

### Workspaces

- `GET /api/v1/workspaces` - Get user workspaces
- `POST /api/v1/workspaces` - Create workspace
- `GET /api/v1/workspaces/:id` - Get workspace details
- `PUT /api/v1/workspaces/:id` - Update workspace
- `DELETE /api/v1/workspaces/:id` - Delete workspace
- `POST /api/v1/workspaces/:id/join` - Join workspace
- `POST /api/v1/workspaces/:id/invite-email` - Send invite

### Channels

- `GET /api/v1/channels/:id` - Get channel
- `PUT /api/v1/channels/:id` - Update channel
- `DELETE /api/v1/channels/:id` - Delete channel

### Messages

- `GET /api/v1/messages/:channelId` - Get messages
- `DELETE /api/v1/messages/:id` - Delete message

## Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Connect to Vercel
3. Set `VITE_BACKEND_URL` environment variable
4. Deploy

### Backend (Render)

1. Push to GitHub
2. Create Web Service on Render
3. Set environment variables
4. Deploy

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

**Sarthak Bhandari**

- GitHub: [@SarthakBhandari01](https://github.com/SarthakBhandari01)
