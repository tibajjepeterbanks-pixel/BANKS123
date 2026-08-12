# 🚀 Quick Start Guide - UNIPAST Portal

## 📋 Prerequisites

Before you start, ensure you have:
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code recommended

Verify installation:
```bash
node --version    # Should be v18 or higher
npm --version     # Should be 9 or higher
git --version     # Should show version
```

## 🔧 Installation Steps

### Step 1: Navigate to Project Directory
```bash
cd c:\Users\Anonymous\OneDrive\Desktop\try\ me\unipast-nextjs
```

### Step 2: Install Dependencies
```bash
npm install
```
This will download and install all required packages (~500MB).

### Step 3: Setup Environment Variables
```bash
# Copy the example file
copy .env.example .env.local

# Or if using bash/PowerShell:
# cp .env.example .env.local
```

**Edit `.env.local`** with your settings:
```
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key"
```

### Step 4: Initialize Database
```bash
# Generate Prisma Client
npm run prisma:generate

# Create database tables
npm run db:push
```

### Step 5: Start Development Server
```bash
npm run dev
```

Output should show:
```
> unipast-portal@1.0.0 dev
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

### Step 6: Open in Browser
Visit: **http://localhost:3000**

You should see the UNIPAST home page! 🎉

## 🧪 Testing the Application

### Test Sign Up
1. Go to http://localhost:3000/auth/signup
2. Fill in the form:
   - Name: Test Student
   - Email: test@example.com
   - Password: password123
3. Click "Create Account"

### Test Sign In
1. Go to http://localhost:3000/auth/signin
2. Enter credentials:
   - Email: test@example.com
   - Password: password123
3. Click "Sign In"
4. You should see the Dashboard

### Test Dark Mode
- Click the moon/sun icon in the navigation bar
- The site should switch to dark mode

### Test Navigation
- Click on "Browse Papers" (work in progress)
- Click on "Colleges" (work in progress)
- Try the search bar (mock data)

## 📁 Project Structure

```
unipast-nextjs/
├── app/                 # Pages and API routes
├── components/          # Reusable components
├── lib/                 # Utilities and helpers
├── prisma/              # Database schema
├── public/              # Static files
├── .env.local           # Environment variables (local)
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind configuration
└── README.md            # Full documentation
```

## 🔐 Database Management

### View Database Content
```bash
# Open Prisma Studio (interactive GUI)
npm run prisma:studio
```

This opens http://localhost:5555 where you can:
- View all users, papers, payments, etc.
- Add/edit/delete records
- Browse schema

### Reset Database
```bash
# Delete all data and recreate tables
npm run db:push -- --force-reset

# Or manually delete and recreate:
rm prisma/dev.db
npm run db:push
```

## 📝 Common Commands

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Build for production
npm start                      # Run production build
npm run lint                   # Check code quality

# Database
npm run prisma:generate       # Generate Prisma Client
npm run prisma:migrate        # Create migration
npm run db:push               # Sync schema to database
npm run db:seed               # Seed database with sample data
npm run prisma:studio         # Open Prisma Studio GUI

# Troubleshooting
npm install                   # Reinstall all dependencies
npm cache clean --force       # Clear npm cache
```

## 🐛 Troubleshooting

### Issue: "Cannot find module 'next'"
**Solution:**
```bash
npm install
npm run prisma:generate
```

### Issue: Database connection error
**Check `.env.local`:**
```
DATABASE_URL="file:./prisma/dev.db"
```

### Issue: Port 3000 already in use
**Option 1:** Kill the process
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

**Option 2:** Use different port
```bash
npm run dev -- -p 3001
```

### Issue: Styles not loading
**Solution:**
```bash
rm -rf .next
npm run dev
```

### Issue: Authentication not working
**Check:**
- NEXTAUTH_SECRET is set in `.env.local`
- Browser cookies are enabled
- Try clearing browser cache and cookies

## 📚 Available Pages

### Public Pages
- ✅ Home - http://localhost:3000
- ✅ Sign Up - http://localhost:3000/auth/signup
- ✅ Sign In - http://localhost:3000/auth/signin
- ⏳ Forgot Password - http://localhost:3000/auth/forgot-password

### Protected Pages (After Sign In)
- ⏳ Dashboard - http://localhost:3000/dashboard
- ⏳ Browse Papers - http://localhost:3000/papers
- ⏳ Colleges - http://localhost:3000/colleges

### Admin Pages (After Admin Sign In)
- ⏳ Admin Dashboard - http://localhost:3000/admin

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  makerere: {
    maroon: "#8B0000",    // Change this
    gold: "#FFD700",      // Or this
  }
}
```

### Change Site Name
Edit `app/layout.tsx`:
```typescript
export const metadata = {
  title: 'Your New Title',
};
```

### Add Custom Fonts
Edit `tailwind.config.js` and add to `fontFamily`

## 📦 Deploying to Production

### Option 1: Vercel (Recommended)
```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. Import in Vercel
# Go to vercel.com and connect your GitHub repo

# 3. Set environment variables in Vercel dashboard
# DATABASE_URL, NEXTAUTH_SECRET, etc.
```

### Option 2: Manual Deployment
```bash
# Build for production
npm run build

# Test production build
npm start

# Deploy the .next folder to your hosting
```

## 🔗 Useful Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **NextAuth.js**: https://next-auth.js.org
- **TypeScript**: https://www.typescriptlang.org/docs

## 📧 Support

- **Documentation**: See `README.md` in project root
- **Implementation Guide**: See `IMPLEMENTATION_GUIDE.md`
- **Issues**: Check GitHub Issues
- **Email**: support@unipast.ac.ug

## ✅ Next Steps

After getting the app running:

1. **Explore the Code**
   - Check `app/page.tsx` for home page
   - Look at `components/` for UI building blocks
   - Review `lib/auth.ts` for authentication logic

2. **Implement Features**
   - Follow `IMPLEMENTATION_GUIDE.md`
   - Start with papers browsing page
   - Then add payment system

3. **Database Population**
   - Create sample colleges, courses, papers
   - Use Prisma Studio for easier data entry
   - Or write a seed script

4. **Testing**
   - Test all authentication flows
   - Verify database operations
   - Test responsive design on mobile

5. **Deployment**
   - Set up environment variables
   - Configure database for production
   - Deploy to Vercel or your hosting

## 🎯 Development Tips

### Use Prisma Studio
```bash
npm run prisma:studio
```
Great for viewing and managing database data visually.

### Debug Mode
Add this to `.env.local`:
```
DEBUG=next:*
```

### VS Code Extensions
Install these for better experience:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prisma
- Thunder Client (API testing)

### Git Best Practices
```bash
# Create a new branch for features
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "Add feature description"

# Push to GitHub
git push origin feature/my-feature
```

## 📊 Monitor Development

### Check File Size
```bash
npm run build
# Check .next/static for bundle size
```

### Performance
- Use Chrome DevTools Lighthouse
- Monitor database queries with Prisma logs
- Check API response times

## 🎉 You're All Set!

You now have a fully functional Next.js application running locally. Start exploring the code, implementing features, and building the future of academic resource sharing in Uganda!

---

**Last Updated**: November 2024  
**Questions?** Check README.md or IMPLEMENTATION_GUIDE.md
