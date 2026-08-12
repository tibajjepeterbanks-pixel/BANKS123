# UNIPAST Next.js Implementation Guide

## 📊 Project Overview

This document outlines the complete Next.js implementation of the Uganda Universities Past Papers Portal, with full architecture, features, and deployment instructions.

## ✅ Completed Components

### 1. **Project Structure** ✓
- Full Next.js 14 with App Router
- TypeScript configuration
- Tailwind CSS with dark mode
- Prisma ORM setup
- Environment configuration

### 2. **UI/UX Layer** ✓
- Responsive Navigation bar with theme toggle
- Professional Footer with all sections
- Home page with hero section, stats, and features
- Search bar with autocomplete (mock data)
- College grid display
- Latest papers showcase
- Button component with variants
- Custom CSS animations and styling

### 3. **Authentication System** ✓
- NextAuth integration
- Email/password credentials provider
- Sign-up page with validation
- Sign-in page with remember me
- Secure password hashing (bcryptjs)
- JWT session management
- Role-based access control setup

### 4. **Database Schema** ✓
Complete Prisma schema with:
- User model (Student, Lecturer, Admin roles)
- College, School, Programme, Course hierarchy
- Paper model with metadata
- Payment tracking
- Download history
- Bookmarks system
- Audit logging
- Notifications system

### 5. **API Routes** ✓
- NextAuth provider setup
- User registration endpoint
- Foundation for paper, download, and payment APIs

## 🔧 Next Steps to Complete

### Phase 1: Core Features (Priority 1)

#### 1.1 Papers Management Page
**File**: `app/papers/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function PapersPage() {
  const [papers, setPapers] = useState([]);
  const [filters, setFilters] = useState({
    college: '',
    year: '',
    semester: '',
  });

  // Fetch papers from API
  // Display with filters
  // Show pagination
}
```

#### 1.2 Course Detail Page with PDF Preview
**File**: `app/papers/[courseCode]/page.tsx`

- Display course information
- Show all available papers
- PDF preview modal using PDF.js
- Download button with payment check

#### 1.3 Payment Modal Component
**File**: `components/payments/PaymentModal.tsx`

- Display UGX 200 payment prompt
- Show payment methods (MTN, Airtel)
- Collect payment reference
- Verify payment before download

**API Route**: `app/api/payments/verify`

### Phase 2: User Features (Priority 2)

#### 2.1 Student Dashboard
**File**: `app/dashboard/page.tsx`

- User profile section
- Recent downloads
- Bookmarked papers
- Payment history
- Settings

#### 2.2 Download History
**File**: `app/dashboard/downloads/page.tsx`

- List all user downloads
- Filter by date, course, college
- Export to PDF/Excel
- Redownload capability

#### 2.3 Bookmarks Page
**File**: `app/dashboard/bookmarks/page.tsx`

- Save favorite papers
- Organize by folder
- Quick access to bookmarked papers

### Phase 3: Admin Features (Priority 3)

#### 3.1 Admin Dashboard
**File**: `app/admin/page.tsx`

- Statistics display
- Recent activity
- Quick actions

#### 3.2 Paper Upload
**File**: `app/admin/papers/upload/page.tsx`

- Multi-step upload form
- Drag-and-drop support
- Automatic metadata extraction (PDF.js)
- Progress indicator

#### 3.3 User Management
**File**: `app/admin/users/page.tsx`

- User list with search/filter
- Edit user roles
- View user activity
- Suspend/activate accounts

#### 3.4 Payment Management
**File**: `app/admin/payments/page.tsx`

- List all payments
- Verify payment references
- View payment history
- Export payment reports

## 🔌 Required Dependencies to Add

```bash
npm install bcryptjs next-auth @prisma/client zod
npm install -D @types/bcryptjs prisma
```

## 📊 Database Setup Instructions

### For Local Development (SQLite):

```bash
# Schema already configured for SQLite in .env.local
# DATABASE_URL="file:./prisma/dev.db"

# Create database and tables
npm run db:push

# (Optional) Seed with sample data
npm run db:seed
```

### For Production (PostgreSQL):

1. Create PostgreSQL database:
```sql
CREATE DATABASE unipast_db;
```

2. Update `.env.production.local`:
```
DATABASE_URL="postgresql://username:password@localhost:5432/unipast_db"
```

3. Push schema:
```bash
npm run db:push
```

## 🔐 Environment Variables Setup

### Development `.env.local`:
```
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-generate-with-openssl-rand-base64-32"
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE=10485760
```

### Production `.env.production.local`:
```
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="<secure-random-string>"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="..."
```

## 📝 API Routes to Implement

### 1. **Papers API**
```
GET    /api/papers                      # List all papers (paginated)
GET    /api/papers?college=CoCIS        # Filter by college
GET    /api/papers?search=CSC2101       # Search
GET    /api/papers/[id]                 # Get single paper
POST   /api/papers                      # Upload paper (admin)
PUT    /api/papers/[id]                 # Update paper (admin)
DELETE /api/papers/[id]                 # Delete paper (admin)
GET    /api/papers/[id]/metadata        # Extract PDF metadata
```

### 2. **Downloads API**
```
GET    /api/downloads                   # Get user's downloads
POST   /api/downloads/[paperId]         # Record download
GET    /api/downloads/analytics         # Analytics (admin)
GET    /api/downloads/report            # Generate report
```

### 3. **Payments API**
```
POST   /api/payments                    # Create payment record
POST   /api/payments/verify             # Verify payment
GET    /api/payments                    # List user payments
GET    /api/payments/analytics          # Revenue analytics
```

### 4. **Search API**
```
GET    /api/search?q=query              # Course/paper search
GET    /api/search/suggestions          # Autocomplete suggestions
GET    /api/search/filters              # Available filters
```

### 5. **Admin Users API**
```
GET    /api/admin/users                 # List users
PUT    /api/admin/users/[id]            # Update user
DELETE /api/admin/users/[id]            # Delete user
GET    /api/admin/users/[id]/activity   # User activity log
```

## 🎨 UI Pages Remaining

### Public Pages:
- ✓ Home (`/`)
- ✓ Sign In (`/auth/signin`)
- ✓ Sign Up (`/auth/signup`)
- ⬜ Forgot Password (`/auth/forgot-password`)
- ⬜ Reset Password (`/auth/reset-password`)
- ⬜ Browse Papers (`/papers`)
- ⬜ Course Detail (`/papers/[courseCode]`)
- ⬜ Colleges (`/colleges`)
- ⬜ College Detail (`/colleges/[collegeId]`)
- ⬜ FAQ (`/faq`)
- ⬜ Contact (`/contact`)
- ⬜ Terms of Service (`/terms`)
- ⬜ Privacy Policy (`/privacy`)

### Student Pages:
- ⬜ Dashboard (`/dashboard`)
- ⬜ My Downloads (`/dashboard/downloads`)
- ⬜ Bookmarks (`/dashboard/bookmarks`)
- ⬜ Profile Settings (`/dashboard/settings`)

### Admin Pages:
- ⬜ Admin Dashboard (`/admin`)
- ⬜ Upload Papers (`/admin/papers/upload`)
- ⬜ Manage Papers (`/admin/papers`)
- ⬜ User Management (`/admin/users`)
- ⬜ Payment Management (`/admin/payments`)
- ⬜ Analytics (`/admin/analytics`)
- ⬜ Activity Logs (`/admin/logs`)

## 🚀 Getting Started

### Step 1: Install Dependencies
```bash
cd unipast-nextjs
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your settings
```

### Step 3: Setup Database
```bash
npm run prisma:generate
npm run db:push
```

### Step 4: Run Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000`

### Step 5: Test Authentication
- Sign up: `http://localhost:3000/auth/signup`
- Sign in: `http://localhost:3000/auth/signin`

## 🧪 Testing Checklist

- [ ] Database connection works
- [ ] User can register
- [ ] User can sign in
- [ ] User session persists
- [ ] Dark mode toggle works
- [ ] Navigation responsive on mobile
- [ ] Search autocomplete works
- [ ] College cards clickable
- [ ] Responsive design verified

## 📦 File Upload Implementation

### Directory Structure:
```
public/
└── uploads/
    ├── papers/
    │   ├── 2024/
    │   │   └── 2025/
    │   │       └── CSC2101_midterm.pdf
    │   └── backup/
    └── profiles/
        └── avatars/
```

### Upload Handler (to implement):
```typescript
// app/api/upload/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  // Validate file type and size
  // Extract PDF metadata
  // Save to disk or S3
  // Update database
  // Return response
}
```

## 🔄 Payment Integration Roadmap

### Phase 1: Manual Verification (Current)
- User enters payment reference
- Admin verifies payment manually
- Download unlocked

### Phase 2: API Integration
- Integrate MTN Mobile Money API
- Integrate Airtel Money API
- Automatic verification

### Phase 3: Advanced Features
- Instant notifications
- Retry failed payments
- Refund processing
- Payment analytics

## 📈 Performance Optimization

### Implement:
- [ ] Image optimization with Next.js Image component
- [ ] Code splitting for lazy loading
- [ ] Database query optimization
- [ ] Caching strategy (SWR, React Query)
- [ ] CDN for static assets
- [ ] Compression for PDFs

## 🔒 Security Best Practices

- [ ] Environment variables never exposed
- [ ] CSRF protection
- [ ] XSS prevention
- [ ] SQL injection protection (Prisma handles this)
- [ ] Rate limiting on API routes
- [ ] Password requirements enforced
- [ ] File upload validation
- [ ] Admin routes protected

## 📱 Mobile Optimization

- [ ] Touch-friendly buttons (min 44px)
- [ ] Responsive images
- [ ] Mobile navigation menu
- [ ] Viewport optimization
- [ ] Fast load times (<3s)

## 🎯 Success Metrics

Track these KPIs:
- User registrations
- Daily active users
- Paper downloads
- Revenue (UGX 200 per download)
- Average session duration
- Bounce rate
- PDF preview usage

## 📞 Common Issues & Solutions

### Issue: Database connection fails
**Solution**: Check DATABASE_URL, verify PostgreSQL/SQLite is running

### Issue: Authentication not working
**Solution**: Check NEXTAUTH_SECRET is set, clear cookies

### Issue: Styles not loading
**Solution**: Run `npm run build` and check postcss.config.js

### Issue: File uploads fail
**Solution**: Check permissions on public/uploads directory

## 🎓 Learning Resources

For team members:
- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [Prisma ORM Guide](https://www.prisma.io/docs)
- [Tailwind CSS Tutorial](https://tailwindcss.com/docs)
- [NextAuth.js Manual](https://next-auth.js.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 📊 Project Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Setup & Config | 1 week | ✅ Complete |
| Authentication | 1 week | ✅ In Progress |
| Core Features | 2 weeks | ⏳ Pending |
| Payment System | 1 week | ⏳ Pending |
| Admin Panel | 1 week | ⏳ Pending |
| Testing & QA | 1 week | ⏳ Pending |
| Deployment | 1 week | ⏳ Pending |

## 🚀 Deployment Checklist

Before going live:
- [ ] Environment variables configured
- [ ] Database migrated
- [ ] HTTPS enabled
- [ ] Error handling complete
- [ ] Logging configured
- [ ] Backups configured
- [ ] Security audit passed
- [ ] Load testing completed
- [ ] User documentation ready

## 📞 Contact & Support

For issues or questions:
- Check README.md
- Review GitHub Issues
- Contact development team
- Check Slack channel #unipast-dev

---

**Last Updated**: November 2024  
**Version**: 1.0.0-beta  
**Status**: Active Development
