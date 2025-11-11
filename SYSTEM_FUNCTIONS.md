# 🎯 ModelMine - Complete System Functions & Features

## 📋 Table of Contents
1. [Token System](#token-system)
2. [User Functions](#user-functions)
3. [Job Functions](#job-functions)
4. [Node Functions](#node-functions)
5. [Network Functions](#network-functions)
6. [Ledger Functions](#ledger-functions)

---

## 💰 Token System

### How Tokens Work

**Token Distribution:**
- **Users stake tokens** when submitting jobs (default: 100 tokens per job)
- **Nodes earn tokens** when they complete jobs (reward: 80% of stake)
- **Network fee**: 20% of stake goes to network (can be distributed later)
- **Token balance** tracked per user and per node

### Token Flow:
```
User submits job (stakes 100 tokens)
    ↓
Job assigned to Node
    ↓
Node completes job
    ↓
Node earns 80 tokens (80% reward)
Network receives 20 tokens (20% fee)
User gets refund if job fails
```

### Token Functions:
- ✅ **Stake tokens** when submitting jobs
- ✅ **Earn tokens** when nodes complete jobs
- ✅ **Track token balance** per user/node
- ✅ **Calculate token distribution** across network
- ✅ **View token earnings** in dashboard

---

## 👤 User Functions

### Authentication
- ✅ **Sign Up** - Create new account with email/password
- ✅ **Sign In** - Login with credentials
- ✅ **Sign Out** - Logout from session
- ✅ **Session Management** - JWT-based authentication

### Job Management
- ✅ **Submit Job** - Create new AI training job
  - Title, description, config JSON
  - Optional token stake
- ✅ **View Jobs** - List all your submitted jobs
- ✅ **Filter Jobs** - Filter by status (Pending, Running, Completed, Failed)
- ✅ **Sort Jobs** - Sort by date, stake, status
- ✅ **View Job Details** - See full job information
- ✅ **Real-time Progress** - Watch job progress live

### Dashboard
- ✅ **Job Statistics** - Total, pending, in-progress, completed jobs
- ✅ **Token Balance** - View your current token balance
- ✅ **Job History** - See all past jobs
- ✅ **Real-time Updates** - Auto-refresh every 5 seconds

---

## 🔧 Job Functions

### Job Lifecycle
1. **PENDING** - Job created, waiting in queue
2. **RUNNING** - Job being processed by worker
3. **COMPLETED** - Job finished successfully
4. **FAILED** - Job encountered an error
5. **CANCELED** - Job canceled by user

### Job Processing
- ✅ **Queue Management** - BullMQ handles job queue
- ✅ **Progress Tracking** - 0-100% progress updates
- ✅ **Real-time Updates** - Socket.IO broadcasts progress
- ✅ **Result Storage** - Accuracy, loss, epochs stored
- ✅ **Ledger Recording** - Completed jobs added to blockchain ledger

### Job Configuration
- ✅ **Custom Config** - JSON configuration for training
- ✅ **Config Validation** - Validates JSON format
- ✅ **Config Storage** - Stored in database

---

## 🖥️ Node Functions

### Node Registration
- ✅ **Register Node** - Node agent registers with API
- ✅ **Node Status** - ONLINE, OFFLINE, BUSY, MAINTENANCE
- ✅ **Node Metrics** - CPU load, memory usage
- ✅ **Heartbeat** - Sends status every 5 seconds

### Node Operations
- ✅ **Job Assignment** - Jobs assigned to available nodes
- ✅ **Job Processing** - Nodes process assigned jobs
- ✅ **Token Rewards** - Nodes earn tokens for completed jobs
- ✅ **Contribution Tracking** - Track node contributions to jobs

### Node Statistics
- ✅ **Uptime** - Calculate node uptime percentage
- ✅ **Jobs Handled** - Count of jobs processed
- ✅ **Tokens Earned** - Total tokens earned by node
- ✅ **Performance Metrics** - CPU, memory, last seen

---

## 🌐 Network Functions

### Network Statistics
- ✅ **Active Nodes** - Count of online nodes
- ✅ **Total Tokens Staked** - Sum of all staked tokens
- ✅ **Completed Jobs** - Total completed jobs
- ✅ **Average Accuracy** - Average accuracy from completed jobs

### Network Monitoring
- ✅ **Node List** - View all registered nodes
- ✅ **Node Status** - Real-time node status
- ✅ **Job Timeline** - Job statistics over time (6 months)
- ✅ **Token Distribution** - Tokens earned per node
- ✅ **Network Health** - Overall network statistics

### Network Charts
- ✅ **Job Status Timeline** - Line chart showing job statuses over time
- ✅ **Token Distribution** - Bar chart showing tokens per node
- ✅ **Auto-refresh** - Updates every 5 seconds

---

## 📜 Ledger Functions

### Blockchain-Style Ledger
- ✅ **Ledger Blocks** - Immutable records of completed jobs
- ✅ **SHA-256 Hashing** - Secure hash of block data
- ✅ **Chain Linking** - Each block links to previous block
- ✅ **Data Integrity** - Hash includes: prevHash + data + timestamp

### Ledger Operations
- ✅ **Create Block** - New block created on job completion
- ✅ **View Ledger** - GET /ledger endpoint
- ✅ **Block Verification** - Hash verification ensures integrity
- ✅ **Immutable Records** - Blocks cannot be modified

---

## 🔄 Real-time Functions

### Socket.IO Events
- ✅ **Job Progress** - `job:{jobId}:progress` events
- ✅ **Node Registration** - `node:registered` events
- ✅ **Node Heartbeat** - `node:heartbeat` events
- ✅ **Auto-reconnect** - Automatic reconnection on disconnect

### Real-time Updates
- ✅ **Dashboard Updates** - Live job progress
- ✅ **Network Updates** - Real-time network statistics
- ✅ **Node Status** - Live node status changes
- ✅ **Job Status** - Instant job status updates

---

## 📊 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user

### Jobs
- `POST /jobs` - Submit new job
- `GET /jobs?userId=xxx` - Get user's jobs
- `GET /jobs/:id` - Get job details

### Nodes
- `POST /nodes/register` - Register new node
- `POST /nodes/heartbeat` - Update node status
- `GET /nodes` - Get all nodes

### Network
- `GET /network` - Get network statistics

### Ledger
- `GET /ledger` - Get all ledger blocks

### Health
- `GET /health` - API health check

---

## 🎮 Available Actions

### For Users:
1. ✅ Sign up / Sign in
2. ✅ Submit training jobs
3. ✅ View job dashboard
4. ✅ Monitor real-time progress
5. ✅ View network statistics
6. ✅ Check token balance
7. ✅ View job history

### For Nodes:
1. ✅ Register with network
2. ✅ Send heartbeat metrics
3. ✅ Process assigned jobs
4. ✅ Earn token rewards
5. ✅ Track contributions

### For Admins:
1. ✅ View all users
2. ✅ View all jobs
3. ✅ View all nodes
4. ✅ View network statistics
5. ✅ View ledger blocks

---

## 🔮 Future Enhancements

### Planned Features:
- [ ] Token staking when submitting jobs
- [ ] Token rewards for node contributions
- [ ] Token transfer between users
- [ ] Token withdrawal system
- [ ] Job cancellation with refund
- [ ] Job priority system
- [ ] Node reputation system
- [ ] Advanced job scheduling
- [ ] Job result download
- [ ] Email notifications

---

## 📝 Notes

- **Token System**: Currently placeholder, will be fully implemented
- **Real-time Updates**: Uses Socket.IO for WebSocket connections
- **Job Queue**: BullMQ handles reliable job processing
- **Database**: PostgreSQL stores all persistent data
- **Cache**: Redis used for job queue and pub/sub

---

**Last Updated**: 2024-11-12

