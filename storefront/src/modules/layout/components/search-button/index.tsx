"use client"

import { useState } from "react"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import SearchModal from "@modules/layout/components/search-modal"

export default function SearchButton() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsSearchOpen(true)}
        className="hover:text-ui-fg-base transition-colors flex items-center gap-2"
        data-testid="nav-search-button"
        aria-label="Search products"
      >
        <MagnifyingGlassIcon className="w-5 h-5" />
        <span className="hidden small:inline">Search</span>
      </button>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  )
}
