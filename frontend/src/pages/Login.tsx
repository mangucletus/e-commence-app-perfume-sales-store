import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();
  const { fetchCount } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from ?? '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      setAuth(data.token, data.email, data.firstName, data.lastName);
      await fetchCount();
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-8 min-h-[60vh]">
      <div className="w-full max-w-4xl">

        {/* Mobile branding */}
        <div className="md:hidden text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-0.5">
            <span className="text-3xl font-black tracking-widest text-violet-900 font-serif">PARFUM</span>
            <span className="text-[10px] tracking-[0.35em] text-amber-500 uppercase font-bold">Luxury Fragrances</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">

          {/* Left branding panel — desktop only */}
          <div
            className="hidden md:flex flex-col justify-between p-10 text-white"
            style={{ background: 'linear-gradient(145deg, #2e1065 0%, #6b21a8 100%)' }}
          >
            <div>
              <Link to="/" className="inline-flex flex-col leading-none">
                <span className="text-2xl font-black tracking-widest font-serif">PARFUM</span>
                <span className="text-[10px] tracking-[0.35em] text-amber-400 uppercase font-bold mt-0.5">Luxury Fragrances</span>
              </Link>
            </div>
            <div>
              <blockquote className="text-lg font-light leading-relaxed text-violet-100 italic mb-4">
                &ldquo;A perfume is more than an extract; it is a presence in abstraction.&rdquo;
              </blockquote>
              <p className="text-violet-400 text-xs">— Giorgio Armani</p>
            </div>
            <p className="text-violet-400 text-xs">
              Don&apos;t have an account?{' '}
              <Link to="/register" state={{ from }} className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
                Register here
              </Link>
            </p>
          </div>

          {/* Right form panel */}
          <div className="p-8 sm:p-10 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-neutral-900 mb-1.5">Welcome back</h1>
              <p className="text-neutral-500 text-sm">Sign in to your Parfum account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 pr-11 text-sm bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors p-0.5"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-violet-900 text-white rounded-xl font-semibold hover:bg-violet-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm shadow-sm"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-neutral-500 mt-6">
              Don&apos;t have an account?{' '}
              <Link to="/register" state={{ from }} className="text-violet-900 font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
