# 🚀 ModelMine - Complete System Walkthrough

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [User Journey](#user-journey)
3. [How It Works](#how-it-works)
4. [Step-by-Step Guide](#step-by-step-guide)

---

## 🏗️ System Overview

### Architecture Flow
```
User (Frontend) 
    ↓
Next.js App (Port 3000)
    ↓ HTTP/REST + WebSocket
Express API (Port 4000)
    ↓
├─→ PostgreSQL (Database)
├─→ Redis (Job Queue)
└─→ BullMQ Worker (Processes Jobs)
    ↓
Socket.IO (Real-time Updates)
    ↓
Frontend (Live Progress)
```

### Services Running
- **Frontend**: Next.js on http://localhost:3000
- **Backend API**: Express on http://localhost:4000
- **Database**: PostgreSQL (stores users, jobs, nodes, ledger)
- **Job Queue**: Redis (manages job processing)
- **Worker**: BullMQ (processes training jobs)
- **Node Agent**: Simulated compute node (sends metrics)

---

## 👤 User Journey

### Step 1: Sign Up ✅ (You've completed this!)
- Create account with email and password
- Account stored in PostgreSQL `User` table
- Password hashed with bcrypt

### Step 2: Sign In
- Log in with your credentials
- NextAuth creates a session
- You're redirected to Dashboard

### Step 3: Submit a Training Job
- Go to "Submit Job" page
- Enter job details:
  - **Title**: e.g., "GPT-NeoX Training"
  - **Description**: What you want to train
  - **Config JSON**: Training parameters
    ```json
    {
      "epochs": 10,
      "batchSize": 32,
      "learningRate": 0.001,
      "modelType": "transformer"
    }
    ```
- Click "Submit Job"
- Job is created in database with status `PENDING`
- Job is added to Redis queue

### Step 4: Job Processing (Automatic)
- **Worker picks up job** from Redis queue
- **Status changes** to `RUNNING`
- **Progress updates** every 10% (10 steps total)
- Each step takes 1 second
- **Socket.IO broadcasts** progress: `job:{jobId}:progress`
- **Frontend receives** real-time updates
- **Dashboard shows** live progress bar

### Step 5: Job Completion
- After 10 seconds (10 steps), job completes
- **Status changes** to `COMPLETED`
- **Result stored** in database:
  ```json
  {
    "accuracy": 94.7,
    "loss": 0.052,
    "epochs": 10,
    "completedAt": "2024-11-12T..."
  }
  ```
- **Ledger block created** with SHA-256 hash
- **Notification shown** on frontend

### Step 6: View Results
- Go to Dashboard
- See completed job with results
- View accuracy, loss, and other metrics

---

## 🔄 How It Works (Technical Flow)

### 1. Job Submission Flow
```
User submits job
    ↓
POST /jobs → Express API
    ↓
Validates input (Zod schema)
    ↓
Creates Job record in PostgreSQL (status: PENDING)
    ↓
Adds job to BullMQ queue (Redis)
    ↓
Returns job ID to frontend
    ↓
Frontend redirects to Dashboard
```

### 2. Job Processing Flow
```
BullMQ Worker picks up job
    ↓
Updates job status to RUNNING
    ↓
For each step (1-10):
    ├─ Wait 1 second
    ├─ Update progress (10%, 20%, ... 100%)
    ├─ Save to PostgreSQL
    └─ Publish to Redis pub/sub: job:{jobId}:progress
        ↓
    API subscribes to Redis
        ↓
    Forwards via Socket.IO to all connected clients
        ↓
    Frontend receives update
        ↓
    Dashboard updates progress bar in real-time
```

### 3. Job Completion Flow
```
After 10 steps complete:
    ↓
Generate result object
    ↓
Update job in PostgreSQL:
    - status: COMPLETED
    - progress: 100
    - result: { accuracy, loss, epochs }
    ↓
Create LedgerBlock:
    - Get previous block hash
    - Create SHA-256 hash of (prevHash + data + timestamp)
    - Store in database
    ↓
Publish completion event via Redis
    ↓
Socket.IO broadcasts to frontend
    ↓
User sees completion notification
```

### 4. Node Agent Flow
```
Node Agent starts
    ↓
Registers with API: POST /nodes/register
    ↓
Every 5 seconds:
    ├─ Collect system metrics (CPU, memory)
    ├─ POST /nodes/heartbeat
    ├─ API updates Node record
    └─ Metrics stored in database
```

---

## 📝 Step-by-Step Guide

### **Current Status: You're Signed In! ✅**

### **Next Steps:**

#### **Step 1: Submit Your First Training Job**

1. **Navigate to Submit Job**
   - Click "Submit Job" in the navbar
   - Or go to: http://localhost:3000/submit-job

2. **Fill in Job Details**
   ```
   Title: "My First AI Training Job"
   
   Description: "Training a neural network for image classification"
   
   Config JSON:
   {
     "epochs": 10,
     "batchSize": 32,
     "learningRate": 0.001,
     "optimizer": "adam",
     "lossFunction": "categorical_crossentropy"
   }
   ```

3. **Click "Submit Job"**
   - Job is created and queued
   - You'll be redirected to Dashboard

#### **Step 2: Watch Real-Time Progress**

1. **Go to Dashboard**
   - Click "Dashboard" in navbar
   - Or go to: http://localhost:3000/dashboard

2. **See Your Job**
   - Job appears with status "Running"
   - Progress bar updates in real-time (0% → 100%)
   - Watch the percentage increase every second

3. **Job Completion**
   - After ~10 seconds, job completes
   - Status changes to "Completed"
   - Results show: Accuracy, Loss, Epochs

#### **Step 3: View Network Status**

1. **Go to Network Page**
   - Click "Network" in navbar
   - Or go to: http://localhost:3000/network

2. **See Network Stats**
   - Active Nodes (from node-agent)
   - Total Tokens Staked
   - Completed Jobs
   - Average Accuracy

#### **Step 4: Explore Features**

- **Submit Multiple Jobs**: Create several jobs to see them queue
- **Filter Jobs**: Use filters (All, Pending, Running, Completed)
- **View Job Details**: Click on a job to see full details
- **Check Ledger**: View blockchain-style ledger blocks

---

## 🎯 Key Features Explained

### **Real-Time Updates**
- Uses Socket.IO for WebSocket connections
- Worker publishes progress to Redis
- API forwards to frontend via Socket.IO
- No page refresh needed!

### **Job Queue System**
- BullMQ manages job processing
- Jobs processed in order
- Can handle multiple jobs concurrently
- Failed jobs can be retried

### **Blockchain-Style Ledger**
- Each completed job creates a ledger block
- SHA-256 hash ensures immutability
- Hash includes: previous hash + job data + timestamp
- Creates a chain of blocks

### **Node Agents**
- Simulated compute nodes
- Register with the network
- Send heartbeat every 5 seconds
- Metrics include CPU, memory usage
- Can scale horizontally (multiple agents)

---

## 🔍 What Happens Behind the Scenes

### When You Submit a Job:

1. **Frontend** → POST request to `/jobs`
2. **API** → Validates data, creates Job record
3. **API** → Adds job to BullMQ queue
4. **Worker** → Picks up job from queue
5. **Worker** → Processes job (10 steps, 1 sec each)
6. **Worker** → Updates database with progress
7. **Worker** → Publishes progress to Redis
8. **API** → Subscribes to Redis, forwards via Socket.IO
9. **Frontend** → Receives update, shows progress
10. **Worker** → Completes job, creates ledger block
11. **Frontend** → Shows completion notification

### Database Tables:

- **User**: Your account information
- **Job**: All training jobs you've submitted
- **Node**: Compute nodes in the network
- **Contribution**: Node contributions to jobs
- **LedgerBlock**: Immutable record of completed jobs

---

## 🎮 Try These Actions

### 1. **Submit Multiple Jobs**
   - Create 3-4 jobs with different configs
   - Watch them process in parallel
   - See how the queue handles them

### 2. **Monitor Real-Time Progress**
   - Keep Dashboard open
   - Submit a job
   - Watch the progress bar update live
   - No refresh needed!

### 3. **Check the Ledger**
   - After jobs complete
   - View the ledger blocks
   - See the blockchain-style hashing

### 4. **View Network Stats**
   - Check the Network page
   - See active nodes
   - View overall statistics

---

## 🐛 Troubleshooting

### If Jobs Don't Process:
- Check worker logs: `docker-compose logs worker`
- Verify Redis is running: `docker-compose ps redis`
- Check API logs: `docker-compose logs api`

### If Progress Doesn't Update:
- Check browser console for Socket.IO errors
- Verify API Socket.IO is running
- Check Redis pub/sub connection

### If Signup/Login Fails:
- Verify database tables exist
- Check API logs for errors
- Ensure PostgreSQL is running

---

## 📊 Example Job Configurations

### Image Classification
```json
{
  "epochs": 20,
  "batchSize": 64,
  "learningRate": 0.0001,
  "modelType": "CNN",
  "dataset": "CIFAR-10"
}
```

### Language Model
```json
{
  "epochs": 10,
  "batchSize": 32,
  "learningRate": 0.001,
  "modelType": "transformer",
  "vocabSize": 50000
}
```

### Reinforcement Learning
```json
{
  "epochs": 100,
  "batchSize": 128,
  "learningRate": 0.0003,
  "modelType": "DQN",
  "environment": "CartPole"
}
```

---

## 🎉 You're All Set!

The system is fully operational. Start by submitting a training job and watching it process in real-time!

**Quick Links:**
- Dashboard: http://localhost:3000/dashboard
- Submit Job: http://localhost:3000/submit-job
- Network: http://localhost:3000/network
- API Health: http://localhost:4000/health

