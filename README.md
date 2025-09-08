# ESG Assessment Platform

A full-stack application for managing and tracking Environmental, Social, and Governance (ESG) assessments.

## Live Demo

[Live Application](https://oren-seven.vercel.app)

## Features

- 🔐 User Authentication
- 📝 Interactive ESG Questionnaire
- 📊 Dynamic Dashboard
- 📈 Performance Analytics
- 📅 Year-wise Assessment Tracking
- 📑 PDF Export Functionality
- 📱 Responsive Design

## Tech Stack

### Frontend

- Next.js 13+
- TypeScript
- Tailwind CSS
- Shadcn UI Components

### Backend

- Node.js/Express
- TypeScript
- Prisma ORM
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository

```bash
git clone https://github.com/aditigupta-200/Oren.git
cd Oren
```

2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

4. Set up environment variables

```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001

# Backend (.env)
DATABASE_URL="your-postgres-connection-string"
JWT_SECRET="your-jwt-secret"
```

5. Run Database Migrations

```bash
cd backend
npx prisma db push
```

6. Start the Development Servers

```bash
# Backend
npm run dev  # Runs on port 3001

# Frontend
cd ../frontend
npm run dev  # Runs on port 3000
```

## Login Credentials

- Email: aditi@gmail.com
- Password: task@123

## Project Structure

```
├── frontend/
│   ├── app/          # Next.js 13 app directory
│   ├── components/   # Reusable UI components
│   ├── contexts/     # React contexts
│   ├── hooks/        # Custom hooks
│   └── utils/        # Utility functions
│
└── backend/
    ├── prisma/      # Database schema and migrations
    └── src/
        ├── routes/  # API routes
        ├── middleware/  # Express middleware
        └── lib/     # Utility functions
```

## Author

- Aditi Gupta

![alt text](<Screenshot 2025-09-09 002744.png>)

![alt text](<Screenshot 2025-09-09 002832.png>)

![alt text](<Screenshot 2025-09-09 002857.png>)

![alt text](<Screenshot 2025-09-09 002924.png>)

![alt text](<Screenshot 2025-09-09 003031.png>)

![alt text](<Screenshot 2025-09-09 003122.png>)

![alt text](<Screenshot 2025-09-09 003208.png>)

![alt text](<Screenshot 2025-09-09 003304.png>)

![alt text](<Screenshot 2025-09-09 003328.png>)

![alt text](<Screenshot 2025-09-09 003350.png>)

![alt text](<Screenshot 2025-09-09 003416.png>)

![alt text](<Screenshot 2025-09-09 003441.png>)

![alt text](<Screenshot 2025-09-09 003537.png>)

![alt text](<Screenshot 2025-09-09 003633.png>)









