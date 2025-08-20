# AI Interview Genius - Next.js

A Next.js-powered AI interview practice platform that helps users prepare for technical interviews with personalized questions and real-time feedback powered by OpenAI.

## 🚀 Features

- 🤖 **AI-Powered Questions**: Dynamic interview questions generated using OpenAI based on job category and skills
- 📝 **Real-time Feedback**: Instant feedback on responses with suggestions for improvement
- 🎯 **Role-Specific Practice**: Tailored questions for different job categories and technical skills
- 🔧 **Multi-Technology Support**: Practice with specific programming languages and frameworks
- 💬 **Interactive Sessions**: Conversational interview simulation with follow-up questions

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Express.js with OpenAI API integration
- **UI Components**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom design system

## 📋 Prerequisites

- Node.js 18+ 
- OpenAI API key (get one from [OpenAI Platform](https://platform.openai.com/api-keys))

## 🏃‍♂️ Getting Started

### Installation

```bash
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies
npm install

# Step 4: Set up your OpenAI API key in server/index.js or .env file
# Make sure to add your OPENAI_API_KEY to the Express server environment
```

### Running the Application

**Important**: You need to run both the Express backend and Next.js frontend:

```bash
# Terminal 1: Start the Express backend server (port 3000)
npm run server

# Terminal 2: Start the Next.js development server (port 3001 or next available)
npm run dev
```

Then open your browser to the Next.js development server URL (usually http://localhost:3001)

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # Next.js API routes (proxy to Express)
│   ├── interview/         # Interview page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   └── interview/        # Interview-specific components
├── lib/                  # Utility functions
├── server/               # Express.js backend with OpenAI integration
└── tailwind.config.ts    # Tailwind configuration
```

## 🔌 API Endpoints

The application uses these API endpoints (Next.js proxies to Express):

- `POST /api/interview/start` - Initialize interview session with job category/skill
- `POST /api/interview/response` - Submit response and get next question
- `POST /api/interview/feedback` - Get comprehensive interview feedback

## 🚀 Technologies Used

This project is built with:

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **Express.js** - Backend API server
- **OpenAI API** - AI-powered question generation and feedback
- **shadcn/ui** - Modern UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful icon library

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/eaef1493-386d-4b66-9702-691ed9875adc) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
