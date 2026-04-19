import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

export default function Navbar() {
  const { token, firstName, logout } = useAuthStore();
  const { count, fetchCount, reset } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (token) fetchCount();
    else reset();
  }, [token]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const handleLogout = () => {
    logout();
    reset();
    navigate('/');
  };

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm transition-all duration-200 ${scrolled ? 'shadow-md' : 'border-b border-neutral-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex flex-col leading-none group shrink-0">
            <span className="text-xl sm:text-2xl font-black tracking-widest text-violet-900 font-serif group-hover:text-violet-700 transition-colors">PARFUM</span>
            <span className="text-[9px] tracking-[0.3em] text-amber-500 uppercase font-semibold">Luxury Fragrances</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-violet-900 border-b-2 border-violet-900 pb-0.5' : 'text-neutral-500 hover:text-violet-900'}`}
            >
              Shop
            </Link>
            {token ? (
              <>
                <Link
                  to="/orders"
                  className={`text-sm font-medium transition-colors ${isActive('/orders') ? 'text-violet-900 border-b-2 border-violet-900 pb-0.5' : 'text-neutral-500 hover:text-violet-900'}`}
                >
                  Orders
                </Link>
                <Link
                  to="/cart"
                  className={`relative p-1 transition-colors ${isActive('/cart') ? 'text-violet-900' : 'text-neutral-500 hover:text-violet-900'}`}
                  aria-label="Cart"
                >
                  <CartIcon />
                  {count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none px-1">
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-neutral-200">
                  <span className="text-sm text-neutral-500 max-w-[100px] truncate">Hi, {firstName}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-neutral-400 hover:text-red-600 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className={`text-sm font-medium transition-colors ${isActive('/login') ? 'text-violet-900' : 'text-neutral-500 hover:text-violet-900'}`}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-violet-900 text-white px-5 py-2 rounded-full hover:bg-violet-800 font-semibold transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile right */}
          <div className="flex items-center gap-2 md:hidden">
            {token && (
              <Link to="/cart" className={`relative p-1.5 transition-colors ${isActive('/cart') ? 'text-violet-900' : 'text-neutral-600 hover:text-violet-900'}`} aria-label="Cart">
                <CartIcon />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none px-1">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white shadow-lg">
          <div className="px-4 py-3 space-y-1">
            <MobileLink to="/" active={isActive('/')}>Shop</MobileLink>
            {token ? (
              <>
                <MobileLink to="/orders" active={isActive('/orders')}>Orders</MobileLink>
                <MobileLink to="/cart" active={isActive('/cart')}>
                  <span className="flex items-center justify-between w-full">
                    Cart
                    {count > 0 && (
                      <span className="bg-amber-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full inline-flex items-center justify-center px-1">
                        {count > 99 ? '99+' : count}
                      </span>
                    )}
                  </span>
                </MobileLink>
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-neutral-100 px-3">
                  <span className="text-sm text-neutral-500 font-medium">Hi, {firstName}</span>
                  <button onClick={handleLogout} className="text-sm text-red-600 font-semibold hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                <MobileLink to="/login" active={isActive('/login')}>Sign in</MobileLink>
                <MobileLink to="/register" active={isActive('/register')}>Register</MobileLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function MobileLink({ to, children, active }: { to: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link
      to={to}
      className={`flex items-center py-2.5 px-3 text-sm font-medium rounded-xl transition-colors ${active ? 'bg-violet-50 text-violet-900' : 'text-neutral-700 hover:bg-neutral-50'}`}
    >
      {children}
    </Link>
  );
}

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}
