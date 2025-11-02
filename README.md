# Decentralized AI Training Network (DATN)

A next-generation decentralized web platform that simulates a blockchain-based system where users can submit and manage distributed AI training jobs across the network.

## 🚀 Features

- **Submit AI Training Jobs** - Create and manage decentralized AI training requests
- **Job Dashboard** - Monitor active and historical training jobs with real-time progress
- **Network Overview** - Track node contributions and network statistics
- **Light/Dark Theme** - Beautiful theme system with persistent storage
- **Responsive Design** - Modern, professional UI that works on all devices

## 🛠️ Tech Stack

- **Next.js 14** (App Router + TypeScript)
- **Tailwind CSS** - Styling and design system
- **shadcn/ui** - Accessible component library
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **Sonner** - Toast notifications
- **Axios** - API client

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🐳 Docker

```bash
# Build Docker image
docker build -t datn .

# Run with Docker Compose
docker-compose up -d

# Or run directly
docker run -p 3000:3000 datn
```

## 🎨 Design

- **Light Mode**: Indigo (#6366F1) + Slate palette
- **Dark Mode**: Violet (#7C3AED) + Deep Gray palette
- **Font**: Inter (modern sans-serif)
- **Style**: Rounded cards, glass blur effects, gradient accents

## 📁 Project Structure

```
├── app/
│   ├── api/          # Mock API routes
│   ├── dashboard/    # Job dashboard page
│   ├── network/      # Network overview page
│   ├── submit-job/   # Job submission page
│   └── page.tsx      # Landing page
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── navbar.tsx    # Navigation bar
│   └── theme-*.tsx   # Theme system
└── lib/
    └── mock-data.ts  # In-memory data store
```

## 🌐 API Routes

- `GET /api/jobs` - Fetch all training jobs
- `POST /api/jobs` - Create a new training job
- `GET /api/network` - Get network statistics and nodes

## 📝 License

MIT
