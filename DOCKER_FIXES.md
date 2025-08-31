# Docker Build Fixes for Frontend

## Issues Fixed

### 1. Nginx Group Creation Error

**Problem**: The Docker build was failing with the error:
```
addgroup: group 'nginx' in use
The command '/bin/sh -c addgroup -g 1001 -S nginx' returned a non-zero code: 1
```

**Root Cause**: The `nginx:alpine` base image already has an `nginx` group, so trying to create it again fails.

**Solution**: Modified the Dockerfile to use the existing nginx group instead of creating a new one.

**Before**:
```dockerfile
RUN addgroup -g 1001 -S nginx
RUN adduser -S nginx -u 1001
```

**After**:
```dockerfile
RUN adduser -S nginx -u 1001 -G nginx
```

### 2. CSS Import Warning

**Problem**: Vite was showing a warning during build:
```
[vite:css] @import must precede all other statements (besides @charset or empty @layer)
```

**Root Cause**: The `@import` statement for Google Fonts was placed after the `@tailwind` directives.

**Solution**: Moved the `@import` statement to the top of the CSS file.

**Before**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

**After**:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Files Modified

1. **`Dockerfile`** - Fixed nginx group creation
2. **`src/index.css`** - Fixed CSS import order
3. **`package.json`** - Added Docker test script
4. **`test-docker-build.sh`** - Created Docker build test script

## Testing

### Local Docker Build Test

Run the Docker build test locally:

```bash
npm run test:docker
```

This script will:
1. Build the Docker image
2. Start a test container
3. Verify the application responds correctly
4. Clean up the test container

### Manual Testing

You can also test manually:

```bash
# Build the image
docker build -t trizen-careers-frontend .

# Run the container
docker run -d --name frontend-test -p 8080:80 trizen-careers-frontend

# Test the application
curl http://localhost:8080

# Clean up
docker stop frontend-test
docker rm frontend-test
```

## Deployment

After these fixes, the frontend should deploy successfully on CapRover. The build process will:

1. ✅ Install dependencies without errors
2. ✅ Build the application without CSS warnings
3. ✅ Create the Docker image successfully
4. ✅ Start nginx with proper user permissions

## Security

The Docker container runs with:
- Non-root user (`nginx`)
- Proper file ownership
- Security headers in nginx configuration
- Minimal attack surface

## Next Steps

1. **Commit and push the changes**:
   ```bash
   git add .
   git commit -m "Fix Docker build issues: nginx group and CSS import order"
   git push origin main
   ```

2. **Redeploy on CapRover** - The build should now complete successfully

3. **Verify deployment** - Check that the frontend is accessible and working correctly

## Troubleshooting

If you encounter any issues:

1. **Check build logs** in CapRover dashboard
2. **Test locally** using the provided test script
3. **Verify nginx configuration** is correct
4. **Check file permissions** in the container

## Expected Results

After deployment, you should see:
- ✅ Successful Docker build
- ✅ Frontend accessible at your domain
- ✅ No CSS warnings in build logs
- ✅ Proper nginx configuration working
