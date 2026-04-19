import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <p className="text-[80px] font-black text-neutral-100 leading-none select-none">404</p>
      <h1 className="text-2xl font-bold text-neutral-900 mb-3 -mt-4">Page not found</h1>
      <p className="text-neutral-500 text-sm mb-8 max-w-xs">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-violet-900 text-white font-semibold px-6 py-3 rounded-full hover:bg-violet-800 transition-colors text-sm"
      >
        Back to Shop
      </Link>
    </div>
  );
}
