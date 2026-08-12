# UNIPAST - Uganda Universities Past Papers Portal

A modern, full-featured platform for accessing past exam papers from 20 leading Ugandan universities.

## 🚀 Features

### ✅ Implemented
- **Modern UI** - Built with Next.js, React, TypeScript, and Tailwind CSS
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Dark Mode** - Full dark mode support with system preference detection
- **Authentication** - NextAuth with email/password credentials
- **Student Registration** - Self-service account creation with validation
- **Home Page** - Hero section, statistics, college grid, latest papers showcase
- **Search** - Course search with autocomplete suggestions
- **Navigation** - Sticky navigation bar with user menu
- **Footer** - Comprehensive footer with links and information

### 🔄 In Progress
- Payment integration (UGX 200 per paper)
- PDF preview modal with PDF.js
- Download protection system
- Course browsing and filtering
- Student dashboard
- Admin dashboard

### 📋 Database Schema
- **Users** - Students, lecturers, admins with roles
- **Academic Structure** - Colleges, schools, programmes, courses
- **Papers** - Past papers with metadata (pages, file size, etc.)
- **Payments** - Payment tracking with verification status
- **Downloads** - Download history and access control
- **Bookmarks** - Saved favorite papers
- **Audit Logs** - Activity tracking

## 📦 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animations
- **React Hook Form** - Form management
- **PDF.js** - PDF viewing

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma ORM** - Database abstraction
- **NextAuth** - Authentication

### Database
- **SQLite** - Local development
- **PostgreSQL** - Production

### Deployment Ready
- **Environment configuration** - `.env.local` for development
- **AWS S3** - For file storage (production)
- **Vercel** - Recommended deployment platform

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL (for production) OR SQLite (for development)

### Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# 3. Generate Prisma Client
npm run prisma:generate

# 4. Push schema to database
npm run db:push

# 5. (Optional) Seed database with sample data
npm run db:seed

# 6. Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
unipast-nextjs/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── auth/                 # Authentication endpoints
│   │       ├── [...nextauth]/    # NextAuth handler
│   │       └── signup/           # Signup endpoint
│   ├── auth/                     # Authentication pages
│   │   ├── signin/page.tsx       # Sign in page
│   │   ├── signup/page.tsx       # Sign up page
│   │   └── forgot-password/      # Password reset
│   ├── papers/                   # Papers browsing
│   ├── colleges/                 # College pages
│   ├── dashboard/                # Student dashboard
│   ├── admin/                    # Admin dashboard
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── layout/                   # Layout components
│   │   ├── Navigation.tsx        # Top navigation
│   │   └── Footer.tsx            # Footer
│   ├── ui/                       # Reusable UI components
│   │   └── Button.tsx            # Button component
│   ├── home/                     # Home page components
│   │   ├── HeroSection.tsx       # Hero section
│   │   └── Stats.tsx             # Statistics cards
│   ├── search/                   # Search components
│   │   └── SearchBar.tsx         # Search with suggestions
│   ├── colleges/                 # College components
│   │   └── CollegeGrid.tsx       # College cards grid
│   └── papers/                   # Papers components
│       └── LatestPapers.tsx      # Latest papers list
├── lib/                          # Utility functions
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Prisma client
│   └── hooks/                    # Custom React hooks
│       └── useDebounce.ts        # Debounce hook
├── prisma/                       # Prisma ORM
│   └── schema.prisma             # Database schema
├── public/                       # Static assets
│   └── uploads/                  # Paper uploads
├── types/                        # TypeScript type definitions
├── .env.example                  # Environment template
├── .env.local                    # Local environment (git ignored)
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── next.config.js                # Next.js configuration
├── postcss.config.js             # PostCSS configuration
└── package.json                  # Dependencies and scripts
```

## 🔐 Authentication

### Features
- Email/password registration and login
- Secure password hashing with bcryptjs
- JWT sessions with NextAuth
- Role-based access control (Student, Lecturer, Admin)
- Password reset functionality

### Admin Account (for testing)
```
Email: admin@example.com
Password: admin123
```

## 💳 Payment System

### Implementation Status
- **Structure**: API-ready for payment gateway integration
- **Current Mode**: Reference-based verification (manual)
- **Cost**: UGX 200 per paper

### Future Integrations
- MTN Mobile Money API
- Airtel Money API
- Stripe (international payments)

### Payment Flow
1. Student clicks "Download"
2. Payment modal opens
3. Student makes payment via mobile money
4. Student enters payment reference
5. Admin verifies payment
6. Download unlocked after verification

## 📊 Admin Features

### Dashboard
- Statistics (students, papers, downloads, revenue)
- Upload history
- Download analytics
- User management

### Paper Management
- Upload new papers with automatic metadata extraction
- Edit paper information
- Delete papers
- View download statistics
- Bulk upload support

### User Management
- View all users
- Edit user details
- Manage user roles
- View user activity
- Suspend/activate accounts

## 👥 Student Features

### Dashboard
- Profile management
- Download history
- Bookmarked papers
- Payment history
- Settings

### Paper Access
- Browse by college/school/course
- Search functionality
- PDF preview
- Instant download after payment
- Bookmark favorite papers

## 🎨 Styling & Theming

### Color Scheme
- **Primary**: Makerere maroon (#8B0000)
- **Accent**: Gold (#FFD700)
- **Dark**: Slate 900-950
- **Light**: Slate 50-100

### Features
- Responsive grid layouts
- Smooth animations
- Dark mode support
- Accessibility compliant
- Mobile-first design

## 🔄 API Routes

### Authentication
- `POST /api/auth/signin` - Sign in with credentials
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Papers
- `GET /api/papers` - Get all papers (paginated)
- `GET /api/papers/[id]` - Get single paper
- `POST /api/papers` - Upload paper (admin only)
- `PUT /api/papers/[id]` - Update paper (admin only)
- `DELETE /api/papers/[id]` - Delete paper (admin only)

### Downloads
- `GET /api/downloads` - Get user downloads
- `POST /api/downloads/[paperId]` - Record download
- `GET /api/downloads/analytics` - Download statistics (admin)

### Payments
- `POST /api/payments` - Create payment record
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments` - Get payment history

### Search
- `GET /api/search?q=query` - Search courses/papers

## 🚀 Deployment

### Recommended: Vercel
```bash
# Connect your GitHub repository to Vercel
# Set environment variables in Vercel dashboard
# Deploy automatically on push to main
```

### Docker Deployment
```bash
# Build Docker image
docker build -t unipast .

# Run container
docker run -p 3000:3000 unipast
```

### Environment Variables (Production)
```
DATABASE_URL=postgresql://user:password@host:5432/unipast_prod
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://yourdomain.com
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name
```

## 📝 Database Seeding

Create a seed file at `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create colleges, schools, courses, etc.
  // ...

  console.log('Database seeded successfully');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run with: `npm run db:seed`

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🐛 Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check PostgreSQL/SQLite is running
- Run `npm run db:push` to sync schema

### Authentication Errors
- Clear browser cookies
- Verify NEXTAUTH_SECRET is set
- Check email/password in database

### Build Errors
- Delete `.next` folder and rebuild
- Run `npm install` to ensure all dependencies
- Check for TypeScript errors: `npx tsc --noEmit`

## 📞 Support

- **Email**: support@unipast.ac.ug
- **GitHub Issues**: [Report bugs here]
- **Documentation**: [Link to docs]

## 📄 License

This project is proprietary software owned by Uganda Universities Past Papers Portal.

## 👥 Team

- **Project Lead**: Development Team
- **UI/UX**: Design Team
- **Backend**: Backend Development Team
- **DevOps**: Infrastructure Team

---

**Last Updated**: November 2024
**Version**: 1.0.0-beta
