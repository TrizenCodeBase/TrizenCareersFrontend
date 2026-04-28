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
VITE_API_BASE_URL=https://trizencareer-api.llp.trizenventures.com
```

### Update API URL
Before deploying, set `VITE_API_BASE_URL` (above). The app builds API endpoints from `src/config/api.ts`, so you do not need to hardcode URLs in components.

### Deployment Steps

1. **Update API URLs**
   - For production, ensure `VITE_API_BASE_URL` is set in CapRover app settings and redeploy

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
