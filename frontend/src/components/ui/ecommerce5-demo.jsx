import Ecommerce5 from "@/components/ui/ecommerce5";

export default function Ecommerce5Demo() {
  return (
    <Ecommerce5
      badge={{ label: "Limited Edition", variant: "outline" }}
      name="Artisan Coffee Table"
      tagline="Handcrafted with care"
      description="A statement piece for your living room. Each table is individually crafted from sustainably sourced walnut, featuring organic curves and a hand-rubbed oil finish that highlights the natural grain."
      price={1299}
      originalPrice={1599}
      currency="$"
      image="https://cdn.21st.dev/assets/mirror/55/55b8dd24049738b421bdde9417b7b4a850fc1a3ddf2e6dafaf85fad310573897.jpg"
      rating={4.9}
      reviewCount={47}
      features={[
        "Sustainably sourced American walnut",
        "Hand-rubbed natural oil finish",
        "Unique grain patterns on every piece",
        "10-year craftsmanship warranty",
      ]}
      ctaLabel="Shop Now"
      ctaHref="/gallery"
      imagePosition="right"
    />
  );
}
