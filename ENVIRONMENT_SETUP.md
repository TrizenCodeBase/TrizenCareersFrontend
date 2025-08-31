# Frontend Environment Setup

## Environment Variables

The frontend application uses environment variables to configure the API endpoints and other settings.

### Production Configuration

The application is configured to use the production backend URL by default:
- **API Base URL**: `https://trizencareersbackend.llp.trizenventures.com`

### Development Configuration

To use localhost for development, create a `.env.development` file in the root directory:

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:5000
```

### Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `VITE_API_BASE_URL` | Backend API base URL | `https://trizencareersbackend.llp.trizenventures.com` |

### API Endpoints

The following endpoints are automatically configured based on the API base URL:

- **Health Check**: `${API_BASE_URL}/api/health`
- **Applications**: `${API_BASE_URL}/api/v1/applications`
- **User Registration**: `${API_BASE_URL}/api/v1/users/register`
- **User Login**: `${API_BASE_URL}/api/v1/users/login`
- **User Profile**: `${API_BASE_URL}/api/v1/users/profile`

### Usage

The API configuration is imported and used throughout the application:

```typescript
import { API_CONFIG } from '@/config/api';

// Use in fetch calls
const response = await fetch(API_CONFIG.ENDPOINTS.USERS.LOGIN, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

### Deployment

For production deployment, the application will automatically use the production backend URL. No additional configuration is needed.

For custom deployments, set the `VITE_API_BASE_URL` environment variable to your backend URL.
