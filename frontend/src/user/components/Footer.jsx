export function Footer() {
  return (
    <footer className="w-full bg-stone-100 dark:bg-stone-900 border-t border-stone-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 md:px-12 py-16 max-w-screen-2xl mx-auto">
        <div className="md:col-span-1">
          <div className="text-xl font-serif text-stone-800 dark:text-stone-200 mb-5 tracking-widest">
            Aurelian Atelier
          </div>
          <p className="text-stone-500 text-xs leading-relaxed mb-6">
            Custodians of traditional goldsmithing. Dedicated to the preservation of craftsmanship and the beauty of gold.
          </p>
          <div className="flex gap-4 text-stone-400">
            <span className="material-symbols-outlined text-lg cursor-pointer hover:text-stone-700">public</span>
            <span className="material-symbols-outlined text-lg cursor-pointer hover:text-stone-700">history</span>
            <span className="material-symbols-outlined text-lg cursor-pointer hover:text-stone-700">mail</span>
          </div>
        </div>
        <div>
          <h4 className="text-xs tracking-widest uppercase text-stone-900 font-semibold mb-5">
            Services
          </h4>
          <ul className="space-y-3 text-xs tracking-widest uppercase text-stone-500">
            <li><a href="#collections" className="hover:text-amber-700 transition-colors">Bespoke Design</a></li>
            <li><a href="#collections" className="hover:text-amber-700 transition-colors">Restoration</a></li>
            <li><a href="#collections" className="hover:text-amber-700 transition-colors">Engraving</a></li>
            <li><a href="#collections" className="hover:text-amber-700 transition-colors">Gifting</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs tracking-widest uppercase text-stone-900 font-semibold mb-5">
            Journal
          </h4>
          <ul className="space-y-3 text-xs tracking-widest uppercase text-stone-500">
            <li><a href="#heritage" className="hover:text-amber-700 transition-colors">Atelier Diaries</a></li>
            <li><a href="#heritage" className="hover:text-amber-700 transition-colors">Gold Ethics</a></li>
            <li><a href="#heritage" className="hover:text-amber-700 transition-colors">History of Pearling</a></li>
            <li><a href="#heritage" className="hover:text-amber-700 transition-colors">Exhibitions</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs tracking-widest uppercase text-stone-900 font-semibold mb-5">
            Inquiries
          </h4>
          <ul className="space-y-3 text-xs tracking-widest uppercase text-stone-500">
            <li><a href="#atelier" className="hover:text-amber-700 transition-colors">Sustainability</a></li>
            <li><a href="#atelier" className="hover:text-amber-700 transition-colors">Shipping</a></li>
            <li><a href="#atelier" className="hover:text-amber-700 transition-colors">Returns</a></li>
            <li><a href="#atelier" className="hover:text-amber-700 transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="px-6 md:px-12 py-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4 text-stone-500 text-xs tracking-widest uppercase">
        <p>© 2026 Lumiere Jewels • Khalil & Sons Atelier</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-stone-800">Instagram</a>
          <a href="#" className="hover:text-stone-800">Pinterest</a>
        </div>
      </div>
    </footer>
  )
}
