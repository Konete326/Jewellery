import { ArrowRight } from 'lucide-react'
import { LuxuryButton } from './LuxuryButton'

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onIncrement,
  onDecrement,
  onRemove
}) {
  if (!isOpen) return null

  const subtotal = items.reduce(
    (sum, item) => sum + (item.numericPrice || 0) * (item.quantity || 1),
    0
  )

  const formattedSubtotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(subtotal)

  return (
    <div className="fixed inset-0 z-50 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out">
        <div className="p-8 border-b border-neutral-200 flex justify-between items-center">
          <h2 className="font-headline italic text-2xl text-neutral-800">Your Bag</h2>
          <button
            onClick={onClose}
            className="text-neutral-800 hover:text-neutral-500 cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-20 text-neutral-400 text-xs tracking-widest uppercase">
              Your bag is empty
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-neutral-100 pb-4">
                <div className="w-20 aspect-square bg-neutral-100 overflow-hidden flex items-center justify-center p-2">
                  <img
                    className="w-full h-full object-contain"
                    src={item.image}
                    alt={item.name}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-800">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    {item.material || 'Handcrafted Jewellery'}
                  </p>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-serif font-medium text-neutral-900">
                      {item.price}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDecrement(item.id)}
                        className="text-xs text-neutral-500 hover:text-black px-1.5 py-0.5 border border-neutral-200 rounded-sm"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono">{item.quantity}</span>
                      <button
                        onClick={() => onIncrement(item.id)}
                        className="text-xs text-neutral-500 hover:text-black px-1.5 py-0.5 border border-neutral-200 rounded-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="text-xs text-rose-500 ml-2 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-neutral-50 border-t border-neutral-200 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase tracking-widest text-neutral-600 font-medium">Subtotal</span>
            <span className="font-headline italic text-xl text-neutral-900">{formattedSubtotal}</span>
          </div>
          <LuxuryButton
            onClick={onClose}
            variant="dark"
            className="w-full"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="size-3.5 text-amber-400" />
          </LuxuryButton>
        </div>
      </div>
    </div>
  )
}
