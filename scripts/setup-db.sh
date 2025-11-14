#!/bin/bash

echo "🚀 Starting database setup..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env file from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✓ .env file created. Please update DATABASE_URL and other variables."
        echo ""
        exit 1
    else
        echo "❌ .env.example not found. Please create .env manually."
        exit 1
    fi
fi

echo "1️⃣  Generating Prisma Client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi
echo "✓ Prisma Client generated"
echo ""

echo "2️⃣  Running database migrations..."
npx prisma migrate dev --name init
if [ $? -ne 0 ]; then
    echo "❌ Failed to run migrations"
    exit 1
fi
echo "✓ Migrations completed"
echo ""

echo "3️⃣  Seeding database..."
npx prisma db seed
if [ $? -ne 0 ]; then
    echo "❌ Failed to seed database"
    exit 1
fi
echo "✓ Database seeded"
echo ""

echo "✅ Database setup completed successfully!"
echo ""
echo "Default Admin Credentials:"
echo "  Email: admin@inspectex.com"
echo "  Password: admin123"
echo ""
echo "⚠️  Please change the default password after first login!"

