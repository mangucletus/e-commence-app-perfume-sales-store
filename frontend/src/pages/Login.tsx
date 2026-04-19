import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center -mx-4 sm:-mx-6 lg:-mx-8 -my-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">
        <div
          className="hidden md:flex flex-col justify-between p-10 text-white"
          style={{ background: 'linear-gradient(145deg, #2e1065 0%, #6b21a8 100%)' }}
        >
          <div>
            <span className="text-2xl font-black tracking-widest font-serif">PARFUM</span>
            <p className="text-[10px] tracking-[0.35em] text-amber-400 uppercase font-bold mt-0.5">
              Luxury Fragrances
            </p>
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

        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-neutral-900 mb-1">Welcome back</h1>
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
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
              />
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
              className="w-full py-3 bg-violet-900 text-white rounded-xl font-semibold hover:bg-violet-800 disabled:opacity-50 transition-colors text-sm"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-500 mt-6 md:hidden">
            Don&apos;t have an account?{' '}
            <Link to="/register" state={{ from }} className="text-violet-900 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
