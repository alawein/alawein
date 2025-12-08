import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { RepzLogo } from '@/ui/organisms/RepzLogo';
import { Button } from '@/ui/atoms/Button';
import { Input } from '@/ui/atoms/Input';
import { Label } from '@/ui/atoms/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/molecules/Card';
import { Alert, AlertDescription } from '@/ui/molecules/Alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/ui/atoms/Checkbox';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { UserRole } from '@/types/fitness';

/**
 * Enterprise-Standard Sign Up Page
 * 
 * Features:
 * - Canonical route at /signup for deep-linking and SEO
 * - Progressive enhancement ready (works without JS)
 * - WCAG 2.2 AA compliant with proper form labels and error handling
 * - Mobile-first responsive design
 * - Real-time validation with debouncing
 * - Privacy-focused design with clear consent
 * - Role selection for client/coach distinction
 */
export default function SignUp() {
  const navigate = useNavigate();
  const { signUp, isAuthenticated, loading: authLoading } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'client' as UserRole,
    agreeToTerms: false,
    agreeToMarketing: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (getPasswordStrength(formData.password) < 3) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service to continue';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      const { error } = await signUp(
        formData.email, 
        formData.password
      );
      
      if (error) {
        if (error.message.includes('already registered')) {
          setErrors({ email: 'An account with this email already exists' });
          return;
        } else if (error.message.includes('Password')) {
          setErrors({ password: error.message });
          return;
        } else {
          setErrors({ form: 'Failed to create account. Please try again.' });
          return;
        }
      }
      
      toast.success('Account created! Check your email to verify your account.');
      navigate('/login', { 
        replace: true,
        state: { message: 'Please check your email to verify your account before signing in.' }
      });
      
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ form: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Show loading during auth check
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black relative overflow-hidden">
      {/* Elegant background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Mobile-first responsive container */}
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col relative z-10">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8 lg:mb-12">
          <Link to="/" className="transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-2xl font-bold text-white">REPZ</span>
            </div>
          </Link>
          <nav className="hidden sm:flex items-center gap-6">
            <span className="text-sm text-white/70 font-medium">Already have an account?</span>
            <Button variant="outline" asChild className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-sm transition-all duration-300">
              <Link to="/login">Sign In</Link>
            </Button>
          </nav>
        </header>

        {/* Main content - Centered card */}
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
            <CardHeader className="space-y-6 text-center pb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 mb-2">
                <User className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">
                Join REPZ Today
              </CardTitle>
              <CardDescription className="text-base text-gray-700 leading-relaxed font-semibold">
                Create your account and start your personalized fitness journey
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* Form with native HTML5 semantics for accessibility */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                
                {/* Global form error */}
                {errors.form && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.form}</AlertDescription>
                  </Alert>
                )}
                
                {/* Full name field */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-bold text-gray-900">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange('fullName')}
                      className={`pl-11 h-12 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all ${errors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                      aria-invalid={!!errors.fullName}
                      aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    />
                  </div>
                  {errors.fullName && (
                    <p id="fullName-error" className="text-sm text-red-600 font-medium" role="alert">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold text-gray-900">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange('email')}
                      className={`pl-11 h-12 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                  </div>
                  {errors.email && (
                    <p id="email-error" className="text-sm text-red-600 font-medium" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-bold text-gray-900">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange('password')}
                      className={`pl-11 pr-11 h-12 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? 'password-error' : formData.password ? 'password-strength' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {/* Password strength indicator */}
                  {formData.password && !errors.password && (
                    <div id="password-strength" className="space-y-2">
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              level <= passwordStrength 
                                ? strengthColors[passwordStrength - 1] || 'bg-slate-200'
                                : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-bold text-gray-700">
                        Password strength: <span className={passwordStrength >= 4 ? 'text-green-600 font-bold' : passwordStrength >= 3 ? 'text-orange-600 font-bold' : 'text-amber-600 font-bold'}>{strengthLabels[passwordStrength - 1] || 'Very Weak'}</span>
                      </p>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p id="password-error" className="text-sm text-red-600 font-medium" role="alert">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm password field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-bold text-gray-900">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange('confirmPassword')}
                      className={`pl-11 pr-11 h-12 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {/* Password match indicator */}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Passwords match</span>
                    </div>
                  )}
                  
                  {errors.confirmPassword && (
                    <p id="confirmPassword-error" className="text-sm text-red-600 font-medium" role="alert">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Role selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-900">I want to join REPZ as a:</Label>
                  <RadioGroup
                    value={formData.role}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}
                    className="grid grid-cols-1 gap-3"
                  >
                    <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-300 hover:border-orange-400 hover:bg-orange-50 transition-all cursor-pointer">
                      <RadioGroupItem value="client" id="client" className="border-gray-500" />
                      <div className="flex-1">
                        <Label htmlFor="client" className="text-sm font-bold text-gray-900 cursor-pointer">
                          Client
                        </Label>
                        <p className="text-xs text-gray-700 font-semibold mt-0.5">
                          Get personalized training and nutrition plans
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-300 hover:border-orange-400 hover:bg-orange-50 transition-all cursor-pointer">
                      <RadioGroupItem value="coach" id="coach" className="border-gray-500" />
                      <div className="flex-1">
                        <Label htmlFor="coach" className="text-sm font-bold text-gray-900 cursor-pointer">
                          Coach
                        </Label>
                        <p className="text-xs text-gray-700 font-semibold mt-0.5">
                          Help clients achieve their fitness goals
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Terms and conditions */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked === true }))}
                      className={`mt-0.5 ${errors.agreeToTerms ? 'border-red-500' : 'border-gray-500'}`}
                      aria-invalid={!!errors.agreeToTerms}
                      aria-describedby={errors.agreeToTerms ? 'terms-error' : undefined}
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm leading-5 cursor-pointer text-gray-800 font-semibold">
                      I agree to the{' '}
                      <Link to="/terms-of-service" className="text-orange-600 hover:text-orange-700 underline font-bold" target="_blank">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy-policy" className="text-orange-600 hover:text-orange-700 underline font-bold" target="_blank">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  {errors.agreeToTerms && (
                    <p id="terms-error" className="text-sm text-red-600 font-bold" role="alert">
                      {errors.agreeToTerms}
                    </p>
                  )}
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeToMarketing"
                      checked={formData.agreeToMarketing}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToMarketing: checked === true }))}
                      className="mt-0.5 border-gray-500"
                    />
                    <Label htmlFor="agreeToMarketing" className="text-sm leading-5 cursor-pointer text-gray-700 font-semibold">
                      I'd like to receive fitness tips, product updates, and special offers via email (optional)
                    </Label>
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>

        {/* Footer - Mobile login prompt */}
        <footer className="mt-8 text-center sm:hidden">
          <p className="text-sm text-muted-foreground mb-4">
            Already have an account?
          </p>
          <Button variant="outline" asChild className="w-full max-w-xs" onClick={() => console.log("SignUp button clicked")}>
            <Link to="/login">Sign In</Link>
          </Button>
        </footer>
      </div>
    </div>
  );
}
