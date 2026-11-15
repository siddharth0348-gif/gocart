'use client'
import { assets } from "@/assets/assets"
import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

export default function CreateStore() {
    const router = useRouter()
    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    const [storeInfo, setStoreInfo] = useState({
        name: "",
        username: "",
        description: "",
        email: "",
        contact: "",
        address: "",
        image: ""
    })

    const onChangeHandler = (e) => {
        setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
    }

    const fetchSellerStatus = async () => {
        try {
            const savedStore = localStorage.getItem('gocart_vendor_store');
            if (savedStore) {
                const store = JSON.parse(savedStore);
                setAlreadySubmitted(true);
                setStatus(store.status ? store.status.toLowerCase() : "pending");
                setMessage(`Your store "${store.name}" application is currently under review. Admin verification is in progress.`);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const onSubmitHandler = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        if (!storeInfo.username || !storeInfo.name || !storeInfo.email) {
            toast.error("Please fill in the store name, username, and email");
            return;
        }

        try {
            const res = await api.createStore({
                name: storeInfo.name,
                username: storeInfo.username,
                description: storeInfo.description,
                email: storeInfo.email,
                contact: storeInfo.contact,
                address: storeInfo.address,
            });

            localStorage.setItem('gocart_vendor_store', JSON.stringify({
                name: storeInfo.name,
                username: storeInfo.username,
                status: "PENDING"
            }));

            // If user logged in, mark as vendor
            const userStr = localStorage.getItem('gocart_user');
            if (userStr) {
                const user = JSON.parse(userStr);
                user.role = 'ROLE_VENDOR';
                localStorage.setItem('gocart_user', JSON.stringify(user));
            }

            setAlreadySubmitted(true);
            setStatus("pending");
            setMessage(`Store "${storeInfo.name}" submitted successfully! Your vendor application is now pending admin approval.`);
            toast.success("Store submitted for admin verification!");
        } catch (err) {
            toast.error(err.message || "Failed to submit store");
        }
    }

    useEffect(() => {
        fetchSellerStatus()
    }, [])

    return !loading ? (
        <>
            {!alreadySubmitted ? (
                <div className="mx-6 min-h-[70vh] my-16">
                    <form onSubmit={onSubmitHandler} className="max-w-7xl mx-auto flex flex-col items-start gap-3 text-slate-500">
                        {/* Title */}
                        <div>
                            <h1 className="text-3xl ">Add Your <span className="text-slate-800 font-medium">Store</span></h1>
                            <p className="max-w-lg mt-1 text-sm text-slate-500">
                                To become a seller on GoCart, submit your store details for review. Your store will be activated after admin verification.
                            </p>
                        </div>

                        <label className="mt-8 cursor-pointer">
                            <span className="block text-sm font-medium mb-1">Store Logo</span>
                            <Image
                                src={storeInfo.image ? (typeof storeInfo.image === 'string' ? storeInfo.image : URL.createObjectURL(storeInfo.image)) : assets.upload_area}
                                className="rounded-lg mt-2 h-16 w-auto border border-dashed border-slate-300 p-1"
                                alt=""
                                width={150}
                                height={100}
                            />
                            <input type="file" accept="image/*" onChange={(e) => setStoreInfo({ ...storeInfo, image: e.target.files[0] })} hidden />
                        </label>

                        <p className="text-sm font-medium text-slate-700 mt-2">Username Handle</p>
                        <input name="username" required onChange={onChangeHandler} value={storeInfo.username} type="text" placeholder="e.g. techzone" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded text-sm" />

                        <p className="text-sm font-medium text-slate-700 mt-2">Store Name</p>
                        <input name="name" required onChange={onChangeHandler} value={storeInfo.name} type="text" placeholder="e.g. TechZone Electronics" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded text-sm" />

                        <p className="text-sm font-medium text-slate-700 mt-2">Description</p>
                        <textarea name="description" onChange={onChangeHandler} value={storeInfo.description} rows={3} placeholder="Describe the products your store sells..." className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none text-sm" />

                        <p className="text-sm font-medium text-slate-700 mt-2">Official Email</p>
                        <input name="email" required onChange={onChangeHandler} value={storeInfo.email} type="email" placeholder="vendor@example.com" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded text-sm" />

                        <p className="text-sm font-medium text-slate-700 mt-2">Contact Number</p>
                        <input name="contact" onChange={onChangeHandler} value={storeInfo.contact} type="text" placeholder="+1-234-567-8900" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded text-sm" />

                        <p className="text-sm font-medium text-slate-700 mt-2">Business Address</p>
                        <textarea name="address" onChange={onChangeHandler} value={storeInfo.address} rows={3} placeholder="Enter your warehouse or retail address" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none text-sm" />

                        <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-10 py-2.5 rounded-lg mt-6 mb-20 transition shadow-md active:scale-95 cursor-pointer">
                            Submit Store Application
                        </button>
                    </form>
                </div>
            ) : (
                <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
                    <div className="size-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                        ✓
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Application Submitted!</h2>
                    <p className="text-slate-500 max-w-xl text-base">{message}</p>
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={() => router.push('/store')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full text-sm font-medium transition"
                        >
                            Open Vendor Dashboard
                        </button>
                        <button
                            onClick={() => setAlreadySubmitted(false)}
                            className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-2.5 rounded-full text-sm font-medium transition"
                        >
                            Submit Another Store
                        </button>
                    </div>
                </div>
            )}
        </>
    ) : (<Loading />)
}
