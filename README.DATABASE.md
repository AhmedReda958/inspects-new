# Database Setup Instructions

## Prerequisites

1. PostgreSQL installed and running
2. Database created for the application

## Setup Steps

### 1. Configure Database URL

Create a `.env` file in the root directory with the following content:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/inspects_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
ADMIN_EMAIL="admin@inspectex.com"
NEXT_PUBLIC_APP_URL="http://localhost:3008"
NODE_ENV="development"
```

Replace `username`, `password`, and `inspects_db` with your actual PostgreSQL credentials and database name.

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This will create all the necessary tables in your database.

### 4. Seed the Database

```bash
npx prisma db seed
```

This will populate your database with:
- Default admin user (email: admin@inspectex.com, password: admin123)
- Package configurations (basic, premium, vip)
- Property age multipliers
- Inspection purpose multipliers
- Cities and sample neighborhoods
- Area price tiers
- VAT settings (15%)
- Calculation rules

### 5. Verify Setup

You can verify the setup by checking the database:

```bash
npx prisma studio
```

This will open Prisma Studio where you can view and edit your database records.

## Default Admin Credentials

After seeding, you can log in to the admin panel with:

- **Email:** admin@inspectex.com
- **Password:** admin123

**⚠️ IMPORTANT:** Change the default password immediately after first login in production!

## Database Schema Overview

### Core Tables

- **packages** - Inspection packages (basic, premium, vip)
- **area_price_tiers** - Pricing tiers based on covered area
- **cities** - Available cities
- **neighborhoods** - Neighborhoods with level-based multipliers
- **property_age_multipliers** - Age-based pricing multipliers
- **inspection_purpose_multipliers** - Purpose-based pricing multipliers

### Lead Management

- **calculator_submissions** - All form submissions with calculations
- **lead_notifications** - Notification tracking

### Admin & Security

- **admin_users** - Admin user accounts
- **audit_logs** - Track all configuration changes
- **vat_settings** - VAT percentage configuration
- **calculation_rules** - Global calculation rules

## Troubleshooting

### Connection Issues

If you get connection errors, verify:
1. PostgreSQL is running
2. Database exists
3. Credentials in .env are correct
4. Port 5432 is accessible

### Migration Errors

If migrations fail:
1. Check database permissions
2. Ensure no existing tables conflict
3. Try resetting: `npx prisma migrate reset` (⚠️ This will delete all data!)

### Seed Errors

If seeding fails:
1. Ensure migrations have run successfully
2. Check for unique constraint violations
3. Verify all required environment variables are set

