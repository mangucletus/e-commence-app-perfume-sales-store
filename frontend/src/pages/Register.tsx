import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();
  const { fetchCount } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from ?? '/';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await register(form.email, form.password, form.firstName, form.lastName);
      setAuth(data.token, data.email, data.firstName, data.lastName);
      await fetchCount();
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
            <h2 className="text-xl font-semibold text-white mb-5">Join our world of luxury</h2>
            <ul className="space-y-3 text-violet-200 text-sm">
              {[
                'Exclusive fragrance collections',
                'Personalized recommendations',
                'Order tracking & history',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="text-amber-400 font-bold text-xs">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-violet-400 text-xs">
            Already have an account?{' '}
            <Link to="/login" state={{ from }} className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-neutral-900 mb-1">Create account</h1>
            <p className="text-neutral-500 text-sm">Start your fragrance journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">First name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                  placeholder="Jane"
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Last name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  autoComplete="family-name"
                  placeholder="Doe"
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Email address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="At least 6 characters"
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-500 mt-6 md:hidden">
            Already have an account?{' '}
            <Link to="/login" state={{ from }} className="text-violet-900 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
