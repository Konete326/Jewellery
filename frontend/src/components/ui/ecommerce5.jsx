import { ShoppingCart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export const ecommerce5Demo = {
  badge: { label: "Limited Edition", variant: "outline" },
  name: "The Aurelian Signet",
  tagline: "Handcrafted Atelier Masterpiece",
  description:
    "18K Hand-hammered solid gold with raw uncut diamond centerpiece. Forged with artisanal goldsmithing in our Karachi atelier.",
  price: 4200,
  originalPrice: 4800,
  currency: "$",
  image: "/images/banner.jpg",
  rating: 5.0,
  reviewCount: 1,
  features: [
    "Sustainably sourced 22K pure gold",
    "Hand-hammered traditional finish",
    "Conflict-free certified raw centerpiece diamond",
    "Lifetime craftsmanship certificate & bespoke presentation vault",
  ],
  ctaLabel: "Inquire Now",
  ctaHref: "/contact",
  imagePosition: "right",
};

export function Ecommerce5({
  badge,
  name,
  tagline,
  description,
  price,
  originalPrice,
  currency = "$",
  image,
  rating,
  reviewCount,
  features = [],
  ctaLabel = "Add to Cart",
  ctaHref,
  onAddToCart,
  imagePosition = "right",
  className,
}) {
  const discount = originalPrice && price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <section className={cn("py-12 md:py-20 w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div
          className={cn(
            "grid gap-8 items-start lg:grid-cols-2 lg:gap-12",
            imagePosition === "left" && "lg:[&>*:first-child]:order-2",
          )}
        >
          <div>
            {badge && (
              <Badge className="mb-4" variant={badge.variant ?? "secondary"}>
                {badge.label}
              </Badge>
            )}

            {tagline && (
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {tagline}
              </p>
            )}

            {name && (
              <h2 className="mt-2 text-3xl font-semibold md:text-4xl lg:text-5xl font-headline text-[#2d3435]">
                {name}
              </h2>
            )}

            {rating && (
              <div className="mt-4 flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-4",
                        i < Math.floor(rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/30",
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{rating}</span>
                {reviewCount && (
                  <span className="text-sm text-muted-foreground">
                    ({reviewCount} reviews)
                  </span>
                )}
              </div>
            )}

            <div className="mt-4 flex items-center gap-3">
              <span className="text-3xl font-bold font-headline text-[#2d3435]">
                {currency}
                {typeof price === "number" ? price.toLocaleString() : price}
              </span>
              {originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {currency}
                    {typeof originalPrice === "number" ? originalPrice.toLocaleString() : originalPrice}
                  </span>
                  <Badge variant="outline">Save {discount}%</Badge>
                </>
              )}
            </div>

            {description && (
              <p className="mt-6 text-base md:text-lg text-[#5a6061] font-light leading-relaxed">
                {description}
              </p>
            )}

            {features.length > 0 && (
              <ul className="mt-6 space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-[#2d3435]">
                    <span className="size-1.5 rounded-full bg-amber-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 flex gap-3">
              <Button
                size="lg"
                onClick={onAddToCart}
                asChild={!!ctaHref}
                className="bg-[#2d3435] text-white hover:bg-neutral-800 transition-all cursor-pointer h-12 px-8 text-sm tracking-wider uppercase shadow-md"
              >
                {ctaHref ? (
                  <Link to={ctaHref}>
                    <ShoppingCart className="size-4" />
                    {ctaLabel}
                  </Link>
                ) : (
                  <>
                    <ShoppingCart className="size-4" />
                    {ctaLabel}
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted group/ecommerce5 border border-neutral-200/80 shadow-md">
            {image && (
              <img
                src={image}
                width={600}
                height={600}
                alt={name ?? "Product Image"}
                className="size-full object-cover transition-transform duration-500 group-hover/ecommerce5:scale-105 w-full h-full"
              />
            )}
            {discount > 0 && (
              <div className="absolute right-4 top-4 rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white tracking-widest uppercase">
                -{discount}%
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Ecommerce5;
