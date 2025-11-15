# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ database
- VPS/Cloud server (recommended: Ubuntu 20.04+)
- Domain name configured

## Step 1: Server Setup

### Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx (for reverse proxy)
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

### Configure PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE inspects_db;
CREATE USER inspects_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE inspects_db TO inspects_user;
\q
```

## Step 2: Deploy Application

### Clone Repository

```bash
cd /var/www
git clone <your-repository-url> inspects
cd inspects
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

```bash
# Create .env file
nano .env
```

Add the following:

```env
# Database
DATABASE_URL="postgresql://inspects_user:your_secure_password@localhost:5432/inspects_db?schema=public"

# JWT Secret (generate a random string)
JWT_SECRET="use-openssl-rand-base64-32-to-generate-this"

# Admin Email
ADMIN_EMAIL="admin@inspectex.com"

# Application
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"

# Email Configuration (Required for new lead notifications)
# For Plesk servers, use your domain email account:
SMTP_HOST="mail.yourdomain.com"
SMTP_PORT="587"
SMTP_USER="noreply@yourdomain.com"
SMTP_PASSWORD="your-email-account-password"
SMTP_FROM="noreply@yourdomain.com"

# Note: For Plesk email servers:
# - SMTP_HOST is usually "mail.yourdomain.com" or your server hostname
# - SMTP_PORT: 587 (TLS/STARTTLS) or 465 (SSL) or 25 (plain)
# - Create a dedicated email account in Plesk for system notifications
# - Use the full email address as SMTP_USER
```

### Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

### Build Application

```bash
npm run build
```

## Step 3: Configure PM2

Create PM2 ecosystem file:

```bash
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'inspects',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/inspects',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3008
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
```

Start application:

```bash
# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## Step 4: Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/inspects
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3008;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 10M;
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/inspects /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 5: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is setup automatically
# Test renewal:
sudo certbot renew --dry-run
```

## Step 6: Setup Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Step 7: Database Backups

Create backup script:

```bash
sudo nano /usr/local/bin/backup-inspects-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/inspects"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="inspects_db"
DB_USER="inspects_user"

mkdir -p $BACKUP_DIR

# Create backup
PGPASSWORD="your_secure_password" pg_dump -U $DB_USER $DB_NAME > $BACKUP_DIR/backup_$TIMESTAMP.sql

# Compress
gzip $BACKUP_DIR/backup_$TIMESTAMP.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/backup_$TIMESTAMP.sql.gz"
```

Make executable and add to crontab:

```bash
sudo chmod +x /usr/local/bin/backup-inspects-db.sh

# Run daily at 2 AM
sudo crontab -e
```

Add line:

```
0 2 * * * /usr/local/bin/backup-inspects-db.sh
```

## Monitoring & Maintenance

### Check Application Status

```bash
pm2 status
pm2 logs inspects
pm2 monit
```

### View Nginx Logs

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Update Application

```bash
cd /var/www/inspects
git pull
npm install
npm run build
npx prisma migrate deploy
pm2 restart inspects
```

### Database Management

```bash
# Access database
psql -U inspects_user -d inspects_db

# View tables
\dt

# Open Prisma Studio (from local machine with SSH tunnel)
ssh -L 5555:localhost:5555 user@yourserver
npx prisma studio
```

## Security Checklist

- [x] Change default admin password
- [x] Use strong database password
- [x] Setup firewall
- [x] Enable SSL/HTTPS
- [x] Regular backups
- [x] Keep system updated
- [x] Monitor logs regularly
- [x] Use environment variables for secrets
- [x] Rate limiting on API endpoints (consider adding)
- [x] CORS configuration (if needed)

## Performance Optimization

### Enable Gzip Compression in Nginx

Add to nginx configuration:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 10240;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### Database Optimization

```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_submissions_status ON calculator_submissions(status);
CREATE INDEX idx_submissions_created_at ON calculator_submissions(created_at);
CREATE INDEX idx_neighborhoods_city_id ON neighborhoods(city_id);
```

### PM2 Optimization

Consider adjusting number of instances based on server resources:

```bash
pm2 scale inspects <number-of-instances>
```

## Troubleshooting

### Application not starting

```bash
pm2 logs inspects --err
# Check for port conflicts
sudo lsof -i :3008
```

### Database connection issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U inspects_user -d inspects_db -h localhost
```

### Permission issues

```bash
# Fix ownership
sudo chown -R $USER:$USER /var/www/inspects

# Fix node_modules
cd /var/www/inspects
rm -rf node_modules package-lock.json
npm install
```

## Support

For issues or questions:
- Check logs: `pm2 logs inspects`
- Review Nginx logs: `/var/log/nginx/`
- Check database logs: `/var/log/postgresql/`

