'use client'
import { useState } from 'react'
import { X, Lock, Mail, User, Store, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
    const router = useRouter()
    const [isRegister, setIsRegister] = useState(false)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'ROLE_VENDOR', // default to vendor for multi-vendor testing
    })

    if (!isOpen) return null

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleLogin = async (email, password) => {
        setLoading(true)
        try {
            const res = await api.login(email, password)
            toast.success(`Welcome back, ${res.name || 'User'}!`)
            localStorage.setItem('gocart_user', JSON.stringify(res))
            if (onLoginSuccess) onLoginSuccess(res)
            onClose()

            if (res.role === 'ROLE_VENDOR') {
                router.push('/store')
            } else if (res.role === 'ROLE_ADMIN') {
                router.push('/admin')
            } else {
                router.push('/')
            }
        } catch (err) {
            toast.error(err.message || 'Login failed. Please check credentials.')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (isRegister) {
            try {
                await api.register(form.name, form.email, form.password, form.role)
                toast.success('Account registered! Logging in...')
                await handleLogin(form.email, form.password)
            } catch (err) {
                toast.error(err.message || 'Registration failed')
            } finally {
                setLoading(false)
            }
        } else {
            await handleLogin(form.email, form.password)
        }
    }

    const quickLogin = (email, password) => {
        setForm({ ...form, email, password })
        handleLogin(email, password)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">
                        {isRegister ? 'Create Vendor / Customer Account' : 'Sign in to GoCart'}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {isRegister
                            ? 'Register to start selling or shopping on GoCart'
                            : 'Access your storefront, vendor portal, or admin panel'}
                    </p>
                </div>

                {/* Pre-seeded Quick Logins */}
                {!isRegister && (
                    <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                            Quick Demo Logins (Spring Boot Backend):
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => quickLogin('vendor@gocart.com', 'vendor123')}
                                className="flex flex-col items-center justify-center p-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                            >
                                <Store size={14} className="mb-1" />
                                Vendor
                            </button>
                            <button
                                type="button"
                                onClick={() => quickLogin('admin@gocart.com', 'admin123')}
                                className="flex flex-col items-center justify-center p-2 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition"
                            >
                                <ShieldCheck size={14} className="mb-1" />
                                Admin
                            </button>
                            <button
                                type="button"
                                onClick={() => quickLogin('customer@gocart.com', 'customer123')}
                                className="flex flex-col items-center justify-center p-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition"
                            >
                                <User size={14} className="mb-1" />
                                Customer
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegister && (
                        <>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-3 text-slate-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Alex Miller"
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Account Role</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, role: 'ROLE_VENDOR' })}
                                        className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition ${
                                            form.role === 'ROLE_VENDOR'
                                                ? 'bg-green-600 text-white border-green-600 shadow-xs'
                                                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        Vendor / Seller
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, role: 'ROLE_CUSTOMER' })}
                                        className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition ${
                                            form.role === 'ROLE_CUSTOMER'
                                                ? 'bg-green-600 text-white border-green-600 shadow-xs'
                                                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        Customer / Shopper
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type="email"
                                name="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                placeholder="vendor@example.com"
                                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type="password"
                                name="password"
                                required
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-xs text-slate-600 hover:text-green-600 font-medium transition"
                    >
                        {isRegister
                            ? 'Already have an account? Sign in here'
                            : "Don't have a vendor account yet? Register here"}
                    </button>
                </div>
            </div>
        </div>
    )
}

