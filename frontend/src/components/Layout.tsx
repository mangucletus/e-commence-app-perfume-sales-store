import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Toast from './Toast';

export default function Layout() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col">
        <Outlet />
      </main>
      <footer className="border-t border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row gap-10 justify-between">
            <div className="max-w-[240px]">
              <Link to="/" className="inline-flex flex-col leading-none">
                <span className="text-xl font-black tracking-widest text-violet-900 font-serif">PARFUM</span>
                <span className="text-[9px] tracking-[0.3em] text-amber-500 uppercase font-semibold mt-0.5">Luxury Fragrances</span>
              </Link>
              <p className="text-xs text-neutral-400 leading-relaxed mt-3">
                Premium fragrances crafted for those who appreciate the art of luxury perfumery.
              </p>
            </div>

            <div className="flex gap-12 sm:gap-20">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-4">Explore</p>
                <ul className="space-y-2.5">
                  <li><Link to="/" className="text-xs text-neutral-400 hover:text-violet-900 transition-colors">All Fragrances</Link></li>
                  <li><Link to="/cart" className="text-xs text-neutral-400 hover:text-violet-900 transition-colors">Your Cart</Link></li>
                  <li><Link to="/orders" className="text-xs text-neutral-400 hover:text-violet-900 transition-colors">Your Orders</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-4">Account</p>
                <ul className="space-y-2.5">
                  <li><Link to="/login" className="text-xs text-neutral-400 hover:text-violet-900 transition-colors">Sign In</Link></li>
                  <li><Link to="/register" className="text-xs text-neutral-400 hover:text-violet-900 transition-colors">Create Account</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-neutral-400">&copy; {new Date().getFullYear()} Parfum. All rights reserved.</p>
            <p className="text-xs text-neutral-300">Crafted for luxury fragrance lovers.</p>
          </div>
        </div>
      </footer>
      <Toast />
    </div>
  );
}
