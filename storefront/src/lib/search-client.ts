import { MeiliSearch } from "meilisearch"

const SEARCH_ENDPOINT =
  process.env.NEXT_PUBLIC_SEARCH_ENDPOINT || "http://localhost:7700"
const SEARCH_API_KEY = process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || ""
const INDEX_NAME = process.env.NEXT_PUBLIC_INDEX_NAME || "products"

export const searchClient = new MeiliSearch({
  host: SEARCH_ENDPOINT,
  apiKey: SEARCH_API_KEY,
})

export const productsIndex = searchClient.index(INDEX_NAME)

export type MeiliProduct = {
  id: string
  title: string
  description: string | null
  handle: string
  thumbnail: string | null
  variant_sku: string | null
}
