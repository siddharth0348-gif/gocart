'use client'
import { Search, ShoppingCart, LogOut, Store, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AuthModal from "./AuthModal";
import api from "@/lib/api";
import toast from "react-hot-toast";

const Navbar = () => {
    const router = useRouter();

    const [search, setSearch] = useState('');
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const cartCount = useSelector(state => state.cart.total);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('gocart_user');
            if (saved) {
                setCurrentUser(JSON.parse(saved));
            }
        } catch (e) {
            console.error(e);
        }
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        router.push(`/shop?search=${encodeURIComponent(search)}`);
    };

    const handleLogout = () => {
        api.setToken(null);
        localStorage.removeItem('gocart_user');
        setCurrentUser(null);
        toast.success("Logged out successfully");
        router.push('/');
    };

    return (
        <nav className="relative bg-white">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">

                    <Link href="/" className="relative text-4xl font-semibold text-slate-700">
                        <span className="text-green-600">go</span>cart<span className="text-green-600 text-5xl leading-0">.</span>
                        <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                            plus
                        </p>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
                        <Link href="/">Home</Link>
                        <Link href="/shop">Shop</Link>
                        <Link href="/#about">About</Link>
                        <Link href="/#contact">Contact</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                            <Search size={18} className="text-slate-600" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-600" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
                            <ShoppingCart size={18} />
                            Cart
                            <span className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full flex items-center justify-center">{cartCount}</span>
                        </Link>

                        {currentUser ? (
                            <div className="flex items-center gap-3">
                                {currentUser.role === 'ROLE_VENDOR' && (
                                    <Link
                                        href="/store"
                                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 transition text-white text-xs font-semibold rounded-full shadow-xs"
                                    >
                                        <Store size={14} />
                                        Vendor Dashboard
                                    </Link>
                                )}
                                {currentUser.role === 'ROLE_ADMIN' && (
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white text-xs font-semibold rounded-full shadow-xs"
                                    >
                                        <ShieldCheck size={14} />
                                        Admin Panel
                                    </Link>
                                )}

                                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                                    <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]" title={currentUser.email}>
                                        {currentUser.name || currentUser.email}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        title="Log Out"
                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                                    >
                                        <LogOut size={16} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setAuthModalOpen(true)}
                                className="px-7 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white text-sm font-medium rounded-full cursor-pointer shadow-xs"
                            >
                                Sign In
                            </button>
                        )}
                    </div>

                    {/* Mobile User Button */}
                    <div className="sm:hidden flex items-center gap-2">
                        {currentUser ? (
                            <button
                                onClick={handleLogout}
                                className="px-4 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-700 text-xs rounded-full transition flex items-center gap-1"
                            >
                                <LogOut size={14} />
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => setAuthModalOpen(true)}
                                className="px-5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-sm transition text-white rounded-full"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <hr className="border-gray-200" />

            <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                onLoginSuccess={(user) => setCurrentUser(user)}
            />
        </nav>
    );
};

export default Navbar;
