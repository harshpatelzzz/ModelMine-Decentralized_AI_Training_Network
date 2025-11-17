# ModelMine - Decentralized AI Training Network

A complete, production-ready full-stack decentralized AI training system built with Next.js, Express, PostgreSQL, Redis, and Docker. This platform enables users to submit AI training jobs that are processed by distributed node agents, with real-time progress tracking and blockchain-style ledger recording.

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Frontend"
        NextJS[Next.js App<br/>Port 3000]
    end
    
    subgraph "Backend Services"
        API[Express API<br/>Port 4000]
        Worker[BullMQ Worker]
    end
    
    subgraph "Data Layer"
        Postgres[(PostgreSQL<br/>Port 5432)]
        Redis[(Redis<br/>Port 6379)]
    end
    
    subgraph "Node Agents"
        Node1[Node Agent 1]
        Node2[Node Agent 2]
        NodeN[Node Agent N]
    end
    
    NextJS -->|HTTP/REST| API
    NextJS -->|WebSocket| API
    API -->|Prisma ORM| Postgres
    API -->|Job Queue| Redis
    Worker -->|Process Jobs| Redis
    Worker -->|Update Progress| Redis
    Worker -->|Prisma ORM| Postgres
    Redis -->|Pub/Sub| API
    API -->|Socket.IO| NextJS
    Node1 -->|Register/Heartbeat| API
    Node2 -->|Register/Heartbeat| API
    NodeN -->|Register/Heartbeat| API
    API -->|Store Metrics| Postgres
```

## 🚀 Features

- **User Authentication** - NextAuth with credentials provider (email + password)
- **Job Submission** - Submit AI training jobs with custom configuration
- **Real-time Progress** - Socket.IO updates for live job progress tracking
- **Job Queue** - BullMQ for reliable job processing
- **Node Agents** - Distributed compute nodes that register and send metrics
- **Blockchain Ledger** - SHA-256 hashed ledger blocks for job completion records
- **Dashboard** - Monitor all jobs with real-time status updates
- **Docker Compose** - Complete containerized setup with 6 services

## 📦 Tech Stack

### Frontend
- **Next.js 16** (App Router + TypeScript)
- **NextAuth** - Authentication
- **Socket.IO Client** - Real-time updates
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **shadcn/ui** - UI components

### Backend
- **Express** - REST API server
- **TypeScript** - Type safety
- **Prisma** - ORM for PostgreSQL
- **BullMQ** - Job queue management
- **Socket.IO** - WebSocket server
- **Redis** - Job queue & pub/sub
- **PostgreSQL** - Primary database

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/harshpatelzzz/decentralized-ai-training-network.git
cd ModelMine-Decentralized_AI_Training_Network
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/modelmine
REDIS_HOST=redis
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev_secret
JWT_SECRET=dev_secret
NEXT_PUBLIC_API_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000
```

### 3. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### 4. Start with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

This will start:
- **PostgreSQL** on port 5432
- **Redis** on port 6379
- **API** on port 4000
- **Worker** (background process)
- **Node Agent** (simulated compute node)
- **Next.js** on port 3000

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000
- **API Health**: http://localhost:4000/health

## 📁 Project Structure

```
ModelMine-Decentralized_AI_Training_Network/
├── api/                      # Backend API service
│   ├── src/
│   │   ├── index.ts         # Express server + Socket.IO
│   │   ├── worker.ts        # BullMQ worker
│   │   └── routes/          # API routes
│   │       ├── auth.ts      # Authentication
│   │       ├── jobs.ts      # Job management
│   │       ├── nodes.ts     # Node registration
│   │       └── ledger.ts    # Ledger blocks
│   ├── Dockerfile
│   └── package.json
├── node-agent/              # Node agent service
│   ├── src/
│   │   └── index.ts         # Agent registration & heartbeat
│   ├── Dockerfile
│   └── package.json
├── prisma/
│   └── schema.prisma        # Database schema
├── app/                     # Next.js app directory
│   ├── api/                 # Next.js API routes
│   ├── dashboard/           # Dashboard page
│   ├── submit-job/          # Job submission page
│   └── ...
├── components/              # React components
├── lib/                     # Utilities
├── docker-compose.yml       # Docker orchestration
├── Dockerfile              # Next.js Dockerfile
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - User login

### Jobs
- `POST /jobs` - Submit a new training job
- `GET /jobs?userId={id}` - List all jobs for a user
- `GET /jobs/:id` - Get job details

### Nodes
- `POST /nodes/register` - Register a new node agent
- `POST /nodes/heartbeat` - Update node metrics
- `GET /nodes` - List all nodes

### Ledger
- `GET /ledger` - Get all ledger blocks
- `GET /ledger/:id` - Get specific ledger block

## 🔄 Job Processing Flow

1. **User submits job** via frontend → `POST /jobs`
2. **API creates job** in database with status `PENDING`
3. **Job added to BullMQ queue** for processing
4. **Worker picks up job** from queue
5. **Worker simulates training** in 10 steps (1 second each)
6. **Progress updates** published to Redis pub/sub
7. **API subscribes** to Redis and forwards via Socket.IO
8. **Frontend receives** real-time updates via Socket.IO
9. **On completion**, worker creates ledger block with SHA-256 hash
10. **Job status** updated to `COMPLETED` in database

## 🖥️ Node Agent

The node agent service:
- Registers itself with the API on startup
- Sends heartbeat every 5 seconds with system metrics
- Collects CPU load average and memory usage
- Can be scaled horizontally (multiple agents)

### Running Multiple Agents

```bash
# In docker-compose.yml, add more node-agent services:
node-agent-2:
  build: ./node-agent
  environment:
    API_URL: http://api:4000
    NODE_NAME: node-agent-2
```

## 🗄️ Database Schema

### User
- Authentication and user management
- Roles: USER, NODE, ADMIN

### Job
- Training job details
- Status: PENDING, RUNNING, FAILED, COMPLETED, CANCELED
- Progress tracking (0-100%)
- Results stored as JSON

### Node
- Compute node registration
- Status: ONLINE, OFFLINE, BUSY, MAINTENANCE
- Metrics stored as JSON

### Contribution
- Tracks node contributions to jobs

### LedgerBlock
- Blockchain-style ledger
- SHA-256 hash of (previous hash + data + timestamp)
- Immutable record of completed jobs

## 🔐 Authentication

- Uses NextAuth with credentials provider
- Passwords hashed with bcrypt
- JWT tokens for session management
- Protected routes via middleware

## 📊 Real-time Updates

- Socket.IO for WebSocket connections
- Redis pub/sub for cross-service communication
- Frontend listens to `job:{jobId}:progress` events
- Automatic UI updates on job status changes

## 🐳 Docker Services

1. **postgres** - PostgreSQL 15 database
2. **redis** - Redis 7 for job queue
3. **api** - Express backend API
4. **worker** - BullMQ job processor
5. **node-agent** - Simulated compute node
6. **nextjs** - Next.js frontend

## 🧪 Development

### Local Development (without Docker)

```bash
# Terminal 1: Start PostgreSQL and Redis
docker-compose up postgres redis

# Terminal 2: Start API
cd api
npm install
npm run dev

# Terminal 3: Start Worker
cd api
npm run worker

# Terminal 4: Start Node Agent
cd node-agent
npm install
npm run dev

# Terminal 5: Start Next.js
npm install
npm run dev
```

### Database Migrations

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

## 📝 Environment Variables

### Root `.env`
```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/modelmine
REDIS_HOST=redis
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev_secret
JWT_SECRET=dev_secret
NEXT_PUBLIC_API_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000
```

## 🚀 Production Deployment

1. Update environment variables for production
2. Use strong secrets for `NEXTAUTH_SECRET` and `JWT_SECRET`
3. Configure proper database connection strings
4. Set up SSL/TLS for production
5. Use production-grade Redis and PostgreSQL
6. Scale workers and node agents as needed

## 📄 License

MIT

## 👤 Author

**Harsh Patel**

- GitHub: [@harshpatelzzz](https://github.com/harshpatelzzz)
- Email: harshpatel174101@gmail.com
- Project: [decentralized-ai-training-network](https://github.com/harshpatelzzz/decentralized-ai-training-network)


## 🤝 Special Mention
- UI/UX Inspired

## 📧 Support
For questions or support:
- Email: harshpatel174101@gmail.com
- GitHub Issues: [Create an issue](https://github.com/harshpatelzzz/decentralized-ai-training-network/issues)

