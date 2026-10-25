import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      onClose()
      setSearchTerm('')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-200">
      <button
        onClick={onClose}
        className="absolute top-8 right-8 md:right-12 text-neutral-800 hover:text-neutral-500 cursor-pointer p-2"
        aria-label="Close search"
      >
        <X className="size-6" />
      </button>
      <form onSubmit={handleSearch} className="w-full max-w-3xl px-8 md:px-12">
        <input
          autoFocus
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-b border-neutral-300 py-6 text-3xl md:text-5xl font-headline italic outline-none focus:border-neutral-800 transition-colors placeholder:text-neutral-300"
          placeholder="Search our collections..."
          type="text"
        />
        <p className="mt-6 text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium">
          Press Enter to search all jewellery
        </p>
      </form>
    </div>
  )
}
