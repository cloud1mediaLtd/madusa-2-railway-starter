"use client"

import { useState, useEffect, useRef } from "react"
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { productsIndex, MeiliProduct } from "@lib/search-client"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useParams } from "next/navigation"
import Image from "next/image"

type SearchModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<MeiliProduct[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const params = useParams()
  const countryCode = params.countryCode as string

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        const results = await productsIndex.search<MeiliProduct>(searchQuery, {
          limit: 10,
        })
        setSearchResults(results.hits)
      } catch (error) {
        console.error("Search error:", error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl mx-4 mt-20 bg-white rounded-lg shadow-2xl">
        <div className="p-4 border-b border-ui-border-base">
          <div className="flex items-center gap-3">
            <MagnifyingGlassIcon className="w-6 h-6 text-ui-fg-muted" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-lg outline-none"
            />
            <button
              onClick={onClose}
              className="p-1 hover:bg-ui-bg-subtle rounded-md transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {isSearching && (
            <div className="text-center py-8 text-ui-fg-muted">
              Searching...
            </div>
          )}

          {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
            <div className="text-center py-8 text-ui-fg-muted">
              No products found for &quot;{searchQuery}&quot;
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-ui-fg-muted mb-4">
                Found {searchResults.length} product{searchResults.length !== 1 ? "s" : ""}
              </div>
              {searchResults.map((product) => (
                <LocalizedClientLink
                  key={product.id}
                  href={`/products/${product.handle}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-ui-bg-subtle transition-colors"
                >
                  <div className="relative w-16 h-16 bg-ui-bg-subtle rounded-md overflow-hidden flex-shrink-0">
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ui-fg-muted">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-ui-fg-base truncate">
                      {product.title}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-ui-fg-muted truncate">
                        {product.description}
                      </p>
                    )}
                    {product.variant_sku && (
                      <p className="text-xs text-ui-fg-subtle">
                        SKU: {product.variant_sku}
                      </p>
                    )}
                  </div>
                </LocalizedClientLink>
              ))}
            </div>
          )}

          {searchQuery.length > 0 && searchQuery.length < 2 && (
            <div className="text-center py-8 text-ui-fg-muted">
              Type at least 2 characters to search
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
