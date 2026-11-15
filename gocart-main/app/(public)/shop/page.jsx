'use client'
import { Suspense } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"

 function ShopContent() {

    // get query params ?search=abc
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const sort = searchParams.get('sort')
    const router = useRouter()

    const products = useSelector(state => state.product.list)

    let filteredProducts = products.filter(product => {
        const matchesSearch = !search || product.name.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = !category || product.category.toLowerCase() === category.toLowerCase()
        const matchesDiscount = sort !== 'discount' || product.mrp > product.price
        return matchesSearch && matchesCategory && matchesDiscount
    })

    if (sort === 'popular') {
        filteredProducts = filteredProducts.slice().sort((a, b) => b.rating.length - a.rating.length)
    } else if (sort === 'discount') {
        filteredProducts = filteredProducts.slice().sort((a, b) => (b.mrp - b.price) - (a.mrp - a.price))
    }

    const hasFilters = Boolean(search || category || sort)

    return (
        <div className="min-h-[70vh] mx-6">
            <div className=" max-w-7xl mx-auto">
                <h1 onClick={() => router.push('/shop')} className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer"> {hasFilters && <MoveLeftIcon size={20} />}  All <span className="text-slate-700 font-medium">Products</span></h1>
                {hasFilters && <p className="mb-5 text-slate-500">{category ? `${category} · ` : ''}{search ? `Search: ${search} · ` : ''}{sort === 'discount' ? 'Discounted products' : sort === 'popular' ? 'Popular products' : ''}</p>}
                <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
                    {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
                {filteredProducts.length === 0 && <p className="mb-20 text-center text-slate-500">No products match these filters.</p>}
            </div>
        </div>
    )
}


export default function Shop() {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}