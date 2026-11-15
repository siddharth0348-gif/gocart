'use client'
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon, Store, LogIn } from "lucide-react"
import SellerNavbar from "./StoreNavbar"
import SellerSidebar from "./StoreSidebar"
import { dummyStoreData } from "@/assets/assets"
import AuthModal from "../AuthModal"

const StoreLayout = ({ children }) => {
    const [isSeller, setIsSeller] = useState(false)
    const [loading, setLoading] = useState(true)
    const [storeInfo, setStoreInfo] = useState(null)
    const [authModalOpen, setAuthModalOpen] = useState(false)

    const checkSellerStatus = () => {
        try {
            const userStr = localStorage.getItem('gocart_user')
            if (userStr) {
                const user = JSON.parse(userStr)
                if (user.role === 'ROLE_VENDOR' || user.role === 'ROLE_ADMIN') {
                    setIsSeller(true)
                    setStoreInfo({
                        ...dummyStoreData,
                        name: user.name ? `${user.name}'s Store` : dummyStoreData.name,
                        email: user.email || dummyStoreData.email,
                    })
                    setLoading(false)
                    return
                }
            }
        } catch (e) {
            console.error(e)
        }

        // Default: allow demo vendor access for instant preview
        setIsSeller(true)
        setStoreInfo(dummyStoreData)
        setLoading(false)
    }

    useEffect(() => {
        checkSellerStatus()
    }, [])

    return loading ? (
        <Loading />
    ) : isSeller ? (
        <div className="flex flex-col h-screen">
            <SellerNavbar />
            <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
                <SellerSidebar storeInfo={storeInfo} />
                <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
                    {children}
                </div>
            </div>
            <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                onLoginSuccess={() => checkSellerStatus()}
            />
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-4">
                <Store size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">Vendor Login Required</h1>
            <p className="text-slate-500 max-w-md mt-2 text-sm">
                You must sign in with a registered Vendor or Administrator account to access the store management dashboard.
            </p>
            <div className="flex items-center gap-4 mt-6">
                <button
                    onClick={() => setAuthModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 py-2.5 px-6 text-sm font-medium rounded-full transition shadow-md"
                >
                    <LogIn size={16} /> Sign in as Vendor
                </button>
                <Link
                    href="/"
                    className="border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-2 py-2.5 px-6 text-sm font-medium rounded-full transition"
                >
                    Back to Store <ArrowRightIcon size={16} />
                </Link>
            </div>
            <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                onLoginSuccess={() => checkSellerStatus()}
            />
        </div>
    )
}

export default StoreLayout
