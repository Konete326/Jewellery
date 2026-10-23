import { Link } from 'react-router-dom'

export function Navbar({ onOpenSearch, onOpenCart, cartCount = 0 }) {
  return (
    <nav className="fixed top-0 w-full z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200/50">
      <div className="flex justify-between items-center w-full px-6 md:px-12 py-5 max-w-full">
        <div className="flex items-center space-x-8 md:space-x-12">
          <Link
            to="/"
            className="text-2xl font-light tracking-[0.2em] text-neutral-800 dark:text-neutral-100 font-serif"
          >
            LUMIÈRE
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#collections"
              className="text-neutral-900 dark:text-white border-b border-neutral-400 pb-1 text-[11px] tracking-[0.1em] uppercase hover:text-neutral-700 transition-colors"
            >
              Collections
            </a>
            <a
              href="#heritage"
              className="text-neutral-500 dark:text-neutral-400 text-[11px] tracking-[0.1em] uppercase hover:text-neutral-800 transition-colors"
            >
              Heritage
            </a>
            <a
              href="#atelier"
              className="text-neutral-500 dark:text-neutral-400 text-[11px] tracking-[0.1em] uppercase hover:text-neutral-800 transition-colors"
            >
              Atelier
            </a>
            <Link
              to="/admin"
              className="text-[#aa820a] hover:text-[#d4af37] font-semibold text-[11px] tracking-[0.1em] uppercase transition-colors"
            >
              Admin Portal →
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <button
            onClick={onOpenSearch}
            className="material-symbols-outlined text-neutral-600 hover:text-neutral-900 cursor-pointer p-1"
          >
            search
          </button>
          <button
            onClick={onOpenCart}
            className="relative material-symbols-outlined text-neutral-600 hover:text-neutral-900 cursor-pointer p-1"
          >
            shopping_bag
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-sans">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}
