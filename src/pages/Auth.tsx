import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG } from "@/config/api";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [signupSlide, setSignupSlide] = useState<'form' | 'otp'>('form');
  const [otpValue, setOtpValue] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form states
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  // Password validation rules
  const passwordRequirements = {
    minLength: signupForm.password.length >= 6,
    hasUppercase: /[A-Z]/.test(signupForm.password),
    hasLowercase: /[a-z]/.test(signupForm.password),
    hasNumber: /\d/.test(signupForm.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(signupForm.password)
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm({
      ...signupForm,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check password requirements
    if (!isPasswordValid) {
      toast({
        title: "Password Requirements Not Met",
        description: "Please ensure your password meets all the requirements below.",
        variant: "destructive"
      });
      setShowPasswordRequirements(true);
      return;
    }
    
    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.USERS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: signupForm.username,
          email: signupForm.email,
          password: signupForm.password,
          firstName: signupForm.firstName,
          lastName: signupForm.lastName
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Verification Code Sent",
          description: "Please check your email for the verification code.",
        });
        setSignupSlide('otp');
      } else {
        toast({
          title: "Registration Failed",
          description: data.error || "Failed to create account. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server. Please check your internet connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    if (otpValue.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the complete 6-digit verification code.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.USERS.VERIFY_EMAIL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupForm.email,
          code: otpValue
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Email Verified!",
          description: "Your account has been verified. Please log in with your credentials.",
        });
        setSignupForm({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: ""
        });
        setShowPasswordRequirements(false);
        setSignupSlide('form');
        setOtpValue("");
        const loginTab = document.querySelector('[data-value="login"]') as HTMLElement;
        if (loginTab) loginTab.click();
      } else {
        toast({
          title: "Verification Failed",
          description: data.error || "Invalid verification code. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server. Please check your internet connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.USERS.PROFILE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupForm.email
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Code Resent",
          description: "A new verification code has been sent to your email.",
        });
      } else {
        toast({
          title: "Resend Failed",
          description: data.error || "Failed to resend verification code. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server. Please check your internet connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.USERS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Use the auth context to login
        login(data.data.token, data.data.user);
        
        toast({
          title: "Welcome Back!",
          description: "You have been successfully logged in.",
        });
        
        // Redirect to home page
        navigate('/');
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid email or password. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server. Please check your internet connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary via-brand-primary/90 to-brand-primary/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img 
              src="/profile.png" 
              alt="Trizen Logo" 
              className="h-16 w-auto filter brightness-0 invert mx-auto mb-4"
            />
          </Link>
          <h1 className="text-2xl font-bold text-white font-inter">Welcome to Trizen</h1>
          <p className="text-white/80 font-inter">Join our community of innovators</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-brand-primary font-inter text-2xl">Get Started</CardTitle>
            <CardDescription className="font-inter">
              Create your account or sign in to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger value="signup" className="font-inter">Sign Up</TabsTrigger>
                <TabsTrigger value="login" className="font-inter">Login</TabsTrigger>
              </TabsList>

              {/* Signup Form */}
              <TabsContent value="signup" className="space-y-4 mt-6">
                {signupSlide === 'form' ? (
                  <>
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="font-inter">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={signupForm.firstName}
                            onChange={handleSignupChange}
                            required
                            className="font-inter"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="font-inter">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={signupForm.lastName}
                            onChange={handleSignupChange}
                            required
                            className="font-inter"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="username" className="font-inter">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          type="text"
                          value={signupForm.username}
                          onChange={handleSignupChange}
                          required
                          className="font-inter"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-inter">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={signupForm.email}
                          onChange={handleSignupChange}
                          required
                          className="font-inter"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="font-inter">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={signupForm.password}
                            onChange={handleSignupChange}
                            onFocus={() => setShowPasswordRequirements(true)}
                            required
                            className="font-inter pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {showPasswordRequirements && signupForm.password && (
                        <Alert className={`border-2 ${isPasswordValid ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
                          <div className="flex items-start space-x-2">
                            {isPasswordValid ? (
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <AlertDescription className="text-sm font-inter">
                                <div className="font-medium mb-2">
                                  {isPasswordValid ? "Password meets all requirements!" : "Password must meet the following requirements:"}
                                </div>
                                <ul className="space-y-1 text-xs">
                                  <li className={`flex items-center space-x-2 ${passwordRequirements.minLength ? 'text-green-600' : 'text-gray-600'}`}>
                                    <span>{passwordRequirements.minLength ? '✓' : '○'}</span>
                                    <span>At least 6 characters long</span>
                                  </li>
                                  <li className={`flex items-center space-x-2 ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-gray-600'}`}>
                                    <span>{passwordRequirements.hasUppercase ? '✓' : '○'}</span>
                                    <span>Contains at least one uppercase letter (A-Z)</span>
                                  </li>
                                  <li className={`flex items-center space-x-2 ${passwordRequirements.hasLowercase ? 'text-green-600' : 'text-gray-600'}`}>
                                    <span>{passwordRequirements.hasLowercase ? '✓' : '○'}</span>
                                    <span>Contains at least one lowercase letter (a-z)</span>
                                  </li>
                                  <li className={`flex items-center space-x-2 ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-600'}`}>
                                    <span>{passwordRequirements.hasNumber ? '✓' : '○'}</span>
                                    <span>Contains at least one number (0-9)</span>
                                  </li>
                                  <li className={`flex items-center space-x-2 ${passwordRequirements.hasSpecialChar ? 'text-green-600' : 'text-gray-600'}`}>
                                    <span>{passwordRequirements.hasSpecialChar ? '✓' : '○'}</span>
                                    <span>Contains at least one special character (!@#$%^&*)</span>
                                  </li>
                                </ul>
                              </AlertDescription>
                            </div>
                          </div>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="font-inter">Confirm Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={signupForm.confirmPassword}
                            onChange={handleSignupChange}
                            required
                            className="font-inter pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {signupForm.confirmPassword && signupForm.password !== signupForm.confirmPassword && (
                          <p className="text-red-500 text-sm font-inter">Passwords do not match</p>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-brand-primary hover:bg-brand-primary/90 font-inter"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </form>

                    <div className="text-center text-sm text-gray-600 font-inter">
                      Already have an account?{" "}
                      <button 
                        onClick={() => {
                          const loginTab = document.querySelector('[data-value="login"]') as HTMLElement;
                          if (loginTab) loginTab.click();
                        }}
                        className="text-brand-primary hover:underline font-medium"
                      >
                        Sign in here
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-900 font-inter">Verify Your Email</h3>
                        <p className="text-sm text-gray-600 font-inter">
                          We've sent a 6-digit verification code to<br />
                          <span className="font-medium text-gray-900">{signupForm.email}</span>
                        </p>
                      </div>

                      <div className="flex justify-center py-4">
                        <InputOTP 
                          maxLength={6} 
                          value={otpValue}
                          onChange={(value) => setOtpValue(value)}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>

                      <Button 
                        onClick={handleOtpVerify}
                        className="w-full bg-brand-primary hover:bg-brand-primary/90 font-inter"
                        disabled={isLoading || otpValue.length !== 6}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify Email"
                        )}
                      </Button>

                      <div className="space-y-2">
                        <button
                          onClick={handleResendOtp}
                          disabled={isLoading}
                          className="text-sm text-brand-primary hover:underline font-medium font-inter"
                        >
                          Resend Code
                        </button>
                        <div>
                          <button
                            onClick={() => setSignupSlide('form')}
                            className="text-sm text-gray-600 hover:text-gray-900 font-inter"
                          >
                            ← Back to Sign Up
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Login Form */}
              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="loginEmail" className="font-inter">Email</Label>
                    <Input
                      id="loginEmail"
                      name="email"
                      type="email"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      required
                      className="font-inter"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loginPassword" className="font-inter">Password</Label>
                    <div className="relative">
                      <Input
                        id="loginPassword"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={loginForm.password}
                        onChange={handleLoginChange}
                        required
                        className="font-inter pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-brand-primary hover:bg-brand-primary/90 font-inter"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <div className="text-center text-sm text-gray-600 font-inter">
                  Don't have an account?{" "}
                  <button 
                    onClick={() => {
                      const signupTab = document.querySelector('[data-value="signup"]') as HTMLElement;
                      if (signupTab) signupTab.click();
                    }}
                    className="text-brand-primary hover:underline font-medium"
                  >
                    Sign up here
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-white/80 hover:text-white transition-colors font-inter"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
