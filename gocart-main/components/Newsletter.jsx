import React from 'react'
import Title from './Title'
import toast from 'react-hot-toast'

const Newsletter = () => {
    const handleSubscribe = (event) => {
        event.preventDefault()
        const email = new FormData(event.currentTarget).get('email')?.toString().trim().toLowerCase()

        if (!email) return

        try {
            const subscribers = JSON.parse(localStorage.getItem('gocart-newsletter-subscribers') || '[]')
            if (!Array.isArray(subscribers)) {
                throw new Error('Stored newsletter subscriptions are invalid.')
            }

            if (subscribers.includes(email)) {
                toast.success('You are already subscribed!')
            } else {
                localStorage.setItem('gocart-newsletter-subscribers', JSON.stringify([...subscribers, email]))
                toast.success('Subscribed! Your email has been saved on this device.')
            }
            event.currentTarget.reset()
        } catch (error) {
            console.error('Unable to save newsletter subscription:', error)
            toast.error('Unable to save your subscription. Please try again.')
        }
    }

    return (
        <div className='flex flex-col items-center mx-4 my-36'>
            <Title title="Join Newsletter" description="Subscribe to get exclusive deals, new arrivals, and insider updates delivered straight to your inbox every week." visibleButton={false} />
            <form onSubmit={handleSubscribe} className='flex bg-slate-100 text-sm p-1 rounded-full w-full max-w-xl my-10 border-2 border-white ring ring-slate-200'>
                <input className='flex-1 pl-5 outline-none' type="email" name="email" placeholder='Enter your email address' autoComplete="email" required />
                <button type="submit" className='font-medium bg-green-500 text-white px-7 py-3 rounded-full hover:scale-103 active:scale-95 transition'>Get Updates</button>
            </form>
        </div>
    )
}

export default Newsletter