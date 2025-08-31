# Frontend Deployment Guide

## CapRover Deployment

### Prerequisites
- CapRover instance running
- Backend API deployed and accessible
- Domain/subdomain configured in CapRover

### Environment Variables
Set these in CapRover app settings:

```
NODE_ENV=production
VITE_API_URL=https://your-backend-domain.com
```

### Update API URL
Before deploying, update the API URL in your frontend code:

1. **Update JobDetails.tsx** (line ~130):
   ```typescript
   const response = await fetch('https://your-backend-domain.com/api/v1/applications', {
   ```

2. **Update Auth.tsx** (if using API calls):
   ```typescript
   const response = await fetch('https://your-backend-domain.com/api/v1/users/login', {
   ```

### Deployment Steps

1. **Update API URLs**
   - Replace all `http://localhost:5000` with your backend domain
   - Commit changes

2. **Push to Git Repository**
   ```bash
   git add .
   git commit -m "Deploy frontend to CapRover"
   git push origin main
   ```

3. **Deploy via CapRover Dashboard**
   - Go to CapRover dashboard
   - Create new app (e.g., `careers-frontend`)
   - Connect your Git repository
   - Set branch to `main`
   - Deploy

4. **Configure Environment Variables**
   - In app settings, add required environment variables
   - Save and redeploy

5. **Verify Deployment**
   - Check health endpoint: `https://your-frontend-domain.com/health`
   - Should return: `healthy`
   - Test the application functionality

### Health Check
The app includes a health check at `/health` that CapRover uses to monitor the application.

### Features
- **Static File Serving**: Optimized with gzip compression
- **Client-side Routing**: Handles React Router routes
- **Security Headers**: XSS protection, content type validation
- **Caching**: Static assets cached for 1 year
- **API Proxy**: Optional proxy to backend (if needed)

### Troubleshooting
- Check CapRover logs for any build errors
- Verify the API URL is correct and accessible
- Ensure environment variables are set
- Check if the port 80 is accessible
- Verify nginx configuration is working

### Performance Optimizations
- Static assets are cached for 1 year
- Gzip compression enabled
- Security headers configured
- Non-root user for security
