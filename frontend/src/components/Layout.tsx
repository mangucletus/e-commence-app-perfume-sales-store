import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Toast from './Toast';

export default function Layout() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Outlet />
      </main>
      <footer className="border-t border-neutral-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-lg font-black tracking-widest text-violet-900 font-serif">PARFUM</span>
              <p className="text-xs text-neutral-400 mt-0.5 tracking-wide">Premium fragrances, delivered.</p>
            </div>
            <p className="text-xs text-neutral-400">
              &copy; {new Date().getFullYear()} Parfum. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      <Toast />
    </div>
  );
}
