@echo off
echo 🚀 Starting database setup...
echo.

REM Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found!
    echo Creating .env file from .env.example...
    if exist .env.example (
        copy .env.example .env
        echo ✓ .env file created. Please update DATABASE_URL and other variables.
        echo.
        exit /b 1
    ) else (
        echo ❌ .env.example not found. Please create .env manually.
        exit /b 1
    )
)

echo 1️⃣  Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ❌ Failed to generate Prisma Client
    exit /b 1
)
echo ✓ Prisma Client generated
echo.

echo 2️⃣  Running database migrations...
call npx prisma migrate dev --name init
if errorlevel 1 (
    echo ❌ Failed to run migrations
    exit /b 1
)
echo ✓ Migrations completed
echo.

echo 3️⃣  Seeding database...
call npx prisma db seed
if errorlevel 1 (
    echo ❌ Failed to seed database
    exit /b 1
)
echo ✓ Database seeded
echo.

echo ✅ Database setup completed successfully!
echo.
echo Default Admin Credentials:
echo   Email: admin@inspectex.com
echo   Password: admin123
echo.
echo ⚠️  Please change the default password after first login!

