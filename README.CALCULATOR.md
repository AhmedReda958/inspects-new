# Dynamic Calculator Backend System

A comprehensive, database-driven calculator system for construction inspection cost estimation with a full-featured admin panel.

## 🎯 Overview

This system replaces the hardcoded calculator with a dynamic, configurable solution that allows administrators to:
- Adjust pricing models and multipliers in real-time
- Manage locations (cities and neighborhoods) with level-based pricing
- Track and manage customer leads
- Audit all configuration changes
- Configure VAT and calculation rules without code changes

## ✨ Key Features

### For End Users
- **Dynamic Calculator:** Real-time price calculations based on property details
- **Multi-step Form:** User-friendly 4-step process
- **Transparent Pricing:** Detailed breakdown of calculation steps
- **Mobile Responsive:** Works seamlessly on all devices
- **Automatic Lead Storage:** All submissions saved for follow-up

### For Administrators
- **Full CRUD Operations:** Manage all calculator configurations
- **Lead Management:** Track, filter, and manage customer inquiries
- **Audit Logging:** Complete history of all changes
- **Role-Based Access:** Secure authentication with different permission levels
- **Real-time Updates:** Changes take effect immediately
- **Flexible Configuration:** Adjust formulas, multipliers, and pricing tiers

## 📋 System Requirements

- Node.js 18+
- PostgreSQL 14+
- 2GB RAM minimum
- 20GB storage minimum

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/inspects_db"
JWT_SECRET="your-secret-key"
NEXT_PUBLIC_APP_URL="http://localhost:3008"
```

### 3. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed initial data
npx prisma db seed
```

Or use the automated script:

**Windows:**
```bash
./scripts/setup-db.bat
```

**Linux/Mac:**
```bash
chmod +x ./scripts/setup-db.sh
./scripts/setup-db.sh
```

### 4. Start Development Server

```bash
npm run dev
```

Access the application:
- **Main Site:** http://localhost:3008
- **Calculator:** http://localhost:3008/#calculator
- **Admin Login:** http://localhost:3008/admin/login

### 5. Login to Admin Panel

Default credentials (⚠️ Change immediately!):
- **Email:** admin@inspectex.com
- **Password:** admin123

## 📚 Documentation

- **[API Documentation](README.API.md)** - Complete API reference
- **[Deployment Guide](README.DEPLOYMENT.md)** - Production deployment instructions
- **[Admin Guide](README.ADMIN.md)** - Admin panel user manual
- **[Database Setup](README.DATABASE.md)** - Database configuration details
- **[Changelog](CHANGELOG.md)** - Version history and updates

## 🏗️ Architecture

### Technology Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with HTTP-only cookies
- **UI:** Shadcn UI, Radix UI, Tailwind CSS
- **Validation:** Zod schemas
- **Forms:** React Hook Form

### Database Schema

```
┌─────────────────────────────────────────────────────┐
│                   Core Configuration                │
├─────────────────────────────────────────────────────┤
│ packages                                            │
│ ├─ area_price_tiers                                │
│ cities                                              │
│ ├─ neighborhoods (with level-based multipliers)    │
│ property_age_multipliers                            │
│ inspection_purpose_multipliers                      │
│ calculation_rules                                   │
│ vat_settings                                        │
├─────────────────────────────────────────────────────┤
│                   Lead Management                   │
├─────────────────────────────────────────────────────┤
│ calculator_submissions                              │
│ ├─ lead_notifications                              │
├─────────────────────────────────────────────────────┤
│                   Admin & Security                  │
├─────────────────────────────────────────────────────┤
│ admin_users                                         │
│ audit_logs                                          │
└─────────────────────────────────────────────────────┘
```

### Calculation Flow

```
User Input
    ↓
Step 1: Base Price Calculation
    ├─ Area ≤ 250m²: Fixed package price
    └─ Area > 250m²: Per-sqm pricing by tier
    ↓
Step 2: Apply Property Age Multiplier (0.95-1.15)
    ↓
Step 3: Apply Inspection Purpose Multiplier (0.9-1.1)
    ↓
Step 4: Apply Neighborhood Multiplier (if area > 500m²)
    ├─ Level A (Premium): ×1.15
    ├─ Level B (Above Avg): ×1.10
    ├─ Level C (Average): ×1.00
    └─ Level D (Below Avg): ×0.95
    ↓
Step 5: Add VAT (15% configurable)
    ↓
Final Price + Detailed Breakdown
    ↓
Save to Database as Lead
```

## 🔧 Configuration

### Package Pricing

Each package has:
- **Base Price:** For properties ≤ 250m²
- **Price Tiers:** For larger properties by square meter

Example (Premium Package):
- 0-250m²: 7,430 SAR (fixed)
- 251-500m²: 25 SAR/m²
- 501-1000m²: 22 SAR/m²
- 1001m²+: 20 SAR/m²

### Neighborhood Levels

Categorize neighborhoods by quality/desirability:

| Level | Type | Multiplier | Example |
|-------|------|------------|---------|
| A | Premium | 1.15 | Al Malqa, Al Nargis |
| B | Above Average | 1.10 | Al Rawdah, Al Olaya |
| C | Average | 1.00 | Most neighborhoods |
| D | Below Average | 0.95 | Older districts |

### Multiplier Configuration

Adjust pricing based on:
- **Property Age:** Older properties cost more to inspect (more issues)
- **Inspection Purpose:** Different purposes have different complexity
- **Neighborhood:** Location-based pricing for premium areas

## 🔐 Security

- JWT authentication with 7-day expiration
- HTTP-only secure cookies
- Password hashing with bcrypt (10 rounds)
- SQL injection protection (Prisma ORM)
- XSS protection
- CSRF protection (SameSite cookies)
- Audit logging for all admin actions
- IP address tracking
- Role-based access control

## 📊 Admin Features

### Dashboard
- Real-time statistics
- Quick access to all sections
- Recent activity overview

### Lead Management
- View all calculator submissions
- Filter by status (new, contacted, qualified, converted, rejected)
- Update lead status and add notes
- Assign leads to team members
- Set follow-up dates
- View detailed calculation breakdown

### Configuration Management
- **Packages:** Manage inspection packages and pricing tiers
- **Locations:** Add/edit cities and neighborhoods
- **Multipliers:** Configure age and purpose-based adjustments
- **Settings:** Update VAT and calculation rules
- **Audit Logs:** Track all changes with user accountability

## 🧪 Testing

### Manual Testing Checklist

#### Calculator Frontend
- [ ] Load calculator page successfully
- [ ] All dropdowns populated from database
- [ ] City selection updates neighborhoods
- [ ] Form validation works correctly
- [ ] Price calculation returns correct result
- [ ] Submission saved to database
- [ ] Error handling displays properly

#### Admin Panel
- [ ] Login with credentials
- [ ] Dashboard displays statistics
- [ ] View leads list
- [ ] Filter leads by status
- [ ] Update lead details
- [ ] CRUD operations on packages
- [ ] CRUD operations on cities/neighborhoods
- [ ] CRUD operations on multipliers
- [ ] Update VAT settings
- [ ] View audit logs

#### Security
- [ ] Cannot access admin without login
- [ ] Token expires after 7 days
- [ ] Logout clears session
- [ ] Unauthorized requests blocked
- [ ] Audit logs created for changes

## 🐛 Troubleshooting

### Common Issues

**"DATABASE_URL not found"**
- Ensure `.env` file exists in root directory
- Check DATABASE_URL format is correct

**"Cannot connect to database"**
- Verify PostgreSQL is running
- Check database credentials
- Ensure database exists

**"Module not found" errors**
- Run `npm install` to install dependencies
- Delete `node_modules` and reinstall

**Calculator not loading**
- Check browser console for errors
- Verify API endpoint is accessible
- Check database has seed data

**Admin login fails**
- Verify database is seeded
- Check JWT_SECRET is set
- Try clearing browser cookies

## 📈 Performance Considerations

- Use database indexes on frequently queried columns
- Enable Prisma query logging in development
- Configure PM2 with appropriate number of instances
- Enable Nginx gzip compression
- Use connection pooling
- Cache static assets
- Optimize images

## 🔄 Maintenance

### Regular Tasks

**Daily:**
- Review new leads
- Check error logs
- Monitor system performance

**Weekly:**
- Review audit logs
- Check for updates
- Verify backups

**Monthly:**
- Update dependencies
- Review pricing configurations
- Analyze lead conversion rates

### Database Maintenance

```bash
# View database size
SELECT pg_size_pretty(pg_database_size('inspects_db'));

# Vacuum database
VACUUM ANALYZE;

# Reindex tables
REINDEX DATABASE inspects_db;
```

## 📝 License

Proprietary - Inspectex © 2024

## 🆘 Support

For technical support:
1. Check documentation in `/docs` folder
2. Review error logs
3. Check audit trail for recent changes
4. Contact system administrator

---

**Built with ❤️ for Inspectex**

