import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import api from '../services/api';
import type { User } from '../types';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email').max(255),
  password: z.string().min(1, 'Password is required').max(128),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginResponse {
  token: string;
  user: User;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginForm, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const res = await api.post<LoginResponse>('/auth/login', data);
      return res.data;
    },
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate('/', { replace: true });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: 'Invalid email or password. Please try again.',
      });
    },
  });

  const handleChange = (field: keyof LoginForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginForm, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginForm;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    mutation.mutate(result.data);
  };

  return (
    <div className="login-gradient flex min-h-screen items-center justify-center px-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-[420px]">
        {/* Glass card */}
        <div className="login-card rounded-2xl p-8 sm:p-10">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-foreground">Welcome back</h1>
              <p className="mt-1 text-sm text-muted-foreground">Sign in to your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`login-input w-full rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all ${
                  errors.email ? 'ring-2 ring-destructive/50' : ''
                }`}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`login-input w-full rounded-xl px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all ${
                    errors.password ? 'ring-2 ring-destructive/50' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Remember me & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <button type="button" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="login-button flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground/60">
          Protected by enterprise-grade security
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
