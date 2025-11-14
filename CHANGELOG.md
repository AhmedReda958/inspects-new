# Changelog

All notable changes to the Inspectex Calculator Backend project.

## [1.0.0] - 2024-01-XX

### Added

#### Database & Backend
- PostgreSQL database schema with Prisma ORM
- Complete database migration system
- Seed data with default configuration
- Automatic database backup scripts

#### Authentication System
- JWT-based authentication
- Secure login/logout endpoints
- Session management with HTTP-only cookies
- Role-based access control (admin, superadmin)
- Password hashing with bcrypt

#### Calculator System
- Dynamic calculation engine based on database rules
- Multi-step pricing algorithm:
  - Base price calculation (fixed for ≤250m² or per-sqm for >250m²)
  - Property age multiplier
  - Inspection purpose multiplier
  - Neighborhood multiplier (for properties >500m²)
  - VAT calculation (configurable percentage)
- Automatic lead storage with full submission details
- IP tracking and UTM parameter capture
- Detailed calculation breakdown in response

#### Admin API Endpoints
- **Packages Management:** CRUD operations for inspection packages
- **Cities Management:** CRUD operations for cities
- **Neighborhoods Management:** CRUD operations with level-based multipliers
- **Property Age Multipliers:** CRUD operations for age-based pricing
- **Inspection Purpose Multipliers:** CRUD operations for purpose-based pricing
- **VAT Settings:** Update VAT percentage with history
- **Calculation Rules:** Manage global calculation parameters
- **Leads Management:** View, filter, update, and export submissions
- **Audit Logs:** Track all configuration changes with user accountability

#### Admin Dashboard UI
- Modern responsive admin interface
- Login page with authentication
- Dashboard with statistics:
  - Total leads
  - New leads count
  - Total revenue
  - Active packages
- Lead management interface:
  - List view with filtering
  - Detailed lead view
  - Status updates
  - Notes and assignments
- Quick access to all configuration sections

#### Frontend Integration
- Dynamic calculator configuration fetching
- Real-time dropdown options from database
- City-neighborhood cascading selection
- Enhanced error handling
- Loading states and user feedback
- Fallback to static content if API unavailable

#### Documentation
- Comprehensive API documentation
- Database setup guide
- Deployment instructions
- Admin panel user guide
- Security best practices
- Troubleshooting guides

#### DevOps & Deployment
- PM2 ecosystem configuration
- Nginx reverse proxy setup
- SSL/HTTPS setup with Let's Encrypt
- Database backup automation
- Logging and monitoring setup
- Deployment scripts for Ubuntu/VPS

### Security Features
- JWT token expiration (7 days)
- HTTP-only secure cookies
- CORS configuration
- SQL injection prevention (Prisma ORM)
- XSS protection
- Password complexity requirements
- Audit logging for all admin actions
- IP address logging

### Performance
- Connection pooling for database
- Optimized database queries
- Prisma Client generation
- PM2 cluster mode (2 instances)
- Gzip compression
- Database indexing on frequently queried columns

### Configuration
- Environment-based configuration
- Flexible VAT settings
- Customizable calculation rules
- Dynamic pricing tiers
- Configurable neighborhood multipliers
- Adjustable display ordering

## Future Enhancements

### Planned Features
- Email notifications for new leads
- WhatsApp API integration for notifications
- Export leads to CSV/Excel
- Advanced reporting and analytics
- Multi-language support for admin panel
- Bulk operations for configuration
- API rate limiting
- Two-factor authentication (2FA)
- Advanced audit log filtering
- Custom email templates
- Scheduled reports
- Integration with CRM systems

### Known Limitations
- Admin UI is basic and can be enhanced
- No real-time notifications yet
- Limited reporting capabilities
- No data visualization/charts
- Manual backup restore process

## Migration Notes

If upgrading from the old static system:
1. Export existing data from content.ts
2. Run database migrations
3. Import data using seed script
4. Update frontend to use new API endpoints
5. Test all calculations match previous results
6. Update documentation and user guides

## Contributors

- Development Team
- QA Team
- DevOps Team

## License

Proprietary - Inspectex © 2024

