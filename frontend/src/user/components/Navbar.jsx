import { Header } from '@/components/header'

export function Navbar({ onOpenSearch, onOpenCart, cartCount = 0 }) {
  return (
    <Header
      onOpenSearch={onOpenSearch}
      onOpenCart={onOpenCart}
      cartCount={cartCount}
    />
  )
}
