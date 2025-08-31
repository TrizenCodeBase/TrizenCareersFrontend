# Authentication Implementation

## Overview

This frontend now includes a complete authentication system with the following features:

- **User Registration & Login** - Toggle between signup and login forms
- **JWT Token Management** - Automatic token storage and retrieval
- **Protected Routes** - Component for protecting pages that require authentication
- **User State Management** - Global authentication context
- **Responsive Design** - Works on desktop and mobile
- **Form Validation** - Client-side validation with error handling

## Features

### 🔐 Authentication Flow

1. **Landing Page** → Click "Sign Up" or "Login" buttons in navbar
2. **Auth Page** → Toggle between Signup/Login forms
3. **Success** → Automatic redirect to home page
4. **Navbar Updates** → Shows user profile dropdown when authenticated

### 📱 User Interface

- **Signup Form**: First Name, Last Name, Username, Email, Password, Confirm Password
- **Login Form**: Username, Password
- **Password Visibility**: Toggle to show/hide passwords
- **Form Validation**: Real-time validation with error messages
- **Loading States**: Spinner during API calls
- **Toast Notifications**: Success/error feedback

### 🎯 User Experience

- **Seamless Navigation**: React Router for smooth page transitions
- **Persistent Login**: Token stored in localStorage
- **Auto-logout**: Token expiration handling
- **Mobile Responsive**: Works on all screen sizes
- **Accessibility**: Proper labels and keyboard navigation

## File Structure

```
src/
├── components/
│   ├── Navbar.tsx          # Updated with auth state
│   └── ProtectedRoute.tsx  # For protecting pages
├── contexts/
│   └── AuthContext.tsx     # Global auth state management
├── pages/
│   └── Auth.tsx           # Signup/Login page
└── App.tsx                # Updated with routes and AuthProvider
```

## API Integration

The frontend connects to the backend API at `http://localhost:5000`:

- **POST** `/api/v1/users/register` - User registration
- **POST** `/api/v1/users/login` - User login

## Usage

### Basic Authentication

```tsx
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (isAuthenticated) {
    return <div>Welcome, {user?.firstName}!</div>;
  }
  
  return <div>Please log in</div>;
};
```

### Protected Routes

```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

// In your App.tsx or route configuration
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Navigation

```tsx
import { Link } from 'react-router-dom';

// Navigate to auth page
<Link to="/auth">Sign Up</Link>
```

## Styling

The authentication system uses the existing design system:

- **Brand Colors**: `brand-primary` (#03045E) and `brand-accent` (#DAF5FB)
- **Typography**: Inter font family
- **Components**: Shadcn/ui components (Button, Input, Card, etc.)
- **Responsive**: Tailwind CSS breakpoints

## Security Features

- **Password Hashing**: Handled by backend (bcrypt)
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Both client and server-side validation
- **CORS Protection**: Configured in backend
- **Rate Limiting**: Backend protection against brute force

## Next Steps

1. **Profile Management**: Add user profile editing
2. **Password Reset**: Implement forgot password functionality
3. **Email Verification**: Add email confirmation
4. **Social Login**: Integrate OAuth providers
5. **Admin Panel**: Role-based access control

## Testing

To test the authentication:

1. Start the backend server: `npm run dev` (in careersbackend)
2. Start the frontend: `npm run dev` (in TrizenCareersFrontend)
3. Navigate to the auth page: `http://localhost:3000/auth`
4. Try creating an account and logging in
5. Check that the navbar updates with user information
6. Test logout functionality

## Troubleshooting

- **CORS Errors**: Ensure backend CORS is configured for `http://localhost:3000`
- **API Connection**: Verify backend is running on port 5000
- **Token Issues**: Check localStorage for stored tokens
- **Styling Issues**: Ensure all UI components are properly imported
