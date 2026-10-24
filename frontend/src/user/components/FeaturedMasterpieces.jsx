import { LuxuryButton } from './LuxuryButton'

export function FeaturedMasterpieces({ onAddToCart }) {
  const pieces = [
    {
      id: 1,
      name: "The Aurelian Sigil",
      material: "18K Hammered Gold with Raw Diamond",
      price: "$4,200",
      numericPrice: 4200,
      image: "/images/product-thumb-01.jpg",
      badge: "One of One",
      offset: false
    },
    {
      id: 2,
      name: "Tuscan Mist Drops",
      material: "South Sea Pearls, Venetian Gold Wire",
      price: "$2,850",
      numericPrice: 2850,
      image: "/images/product-thumb-02.jpg",
      badge: null,
      offset: true
    },
    {
      id: 3,
      name: "Etruscan Bangle",
      material: "Engraved 22K Solid Gold",
      price: "$6,400",
      numericPrice: 6400,
      image: "/images/product-thumb-03.jpg",
      badge: null,
      offset: false
    }
  ]

  return (
    <section id="collections" className="py-24 px-6 md:px-20 bg-[#f2f4f4]">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="text-[#5f5e5e] tracking-[0.2em] uppercase text-xs mb-2 block font-medium">
              Curated Selection
            </span>
            <h2 className="font-headline text-4xl md:text-5xl text-[#2d3435] font-normal">
              Featured <span className="serif-italic">Masterpieces</span>
            </h2>
          </div>
          <span className="text-[#5a6061] text-xs tracking-widest uppercase">
            Handcrafted in limited editions
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {pieces.map((piece) => (
            <div
              key={piece.id}
              className={`group ${piece.offset ? 'translate-y-0 md:translate-y-12' : ''}`}
            >
              <div className="bg-white aspect-square p-10 flex items-center justify-center relative mb-6 shadow-sm overflow-hidden">
                <img
                  alt={piece.name}
                  className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700"
                  src={piece.image}
                />
                {piece.badge && (
                  <span className="absolute top-6 right-6 bg-[#e4e9ea] px-3 py-1 text-[10px] tracking-widest uppercase font-medium">
                    {piece.badge}
                  </span>
                )}
                <LuxuryButton
                  onClick={() => onAddToCart(piece)}
                  size="sm"
                  variant="dark"
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Add To Bag
                </LuxuryButton>
              </div>
              <h3 className="font-headline text-2xl text-[#2d3435] mb-1 font-normal">
                {piece.name}
              </h3>
              <p className="text-[#5a6061] text-xs mb-3 font-light">
                {piece.material}
              </p>
              <p className="font-headline text-[#5f5e5e] text-xl">
                {piece.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
