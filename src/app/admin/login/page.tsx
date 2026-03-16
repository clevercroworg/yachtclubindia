"use client"

import { useState } from "react"
import Image from "next/image"
import { Anchor, ArrowRight, Loader2, Lock, Mail } from "lucide-react"
import { login } from "../actions"
import Link from "next/link"

export default function AdminLoginPage() {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setError("")
        setLoading(true)

        const result = await login(formData)

        // If there's an error, login action returns it. Otherwise it redirects natively.
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#10233D] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/images/pattern-dots.png")', backgroundSize: '24px' }}></div>

            {/* Ambient Gradients - Deepened for auth focus */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/20">
                        <Lock className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                    </div>
                    <Image
                        src="/images/logo-light-highres.png"
                        alt="Yacht Club India"
                        width={200}
                        height={60}
                        className="h-10 w-auto object-contain mb-2"
                        priority
                    />
                    <p className="text-white/60 text-sm tracking-wide uppercase font-medium mt-2">Secure Management Portal</p>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">Admin Email</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-white/40 group-focus-within:text-[#D4AF37] transition-colors" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all font-mono"
                                placeholder="admin@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="password" className="block text-sm font-medium text-white/80">Admin Password</label>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-white/40 group-focus-within:text-[#D4AF37] transition-colors" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all font-mono"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm px-4 py-3 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2">
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:from-[#C5A028] hover:to-[#D4AF37] text-black font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span>Access Dashboard</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-white/10 pt-6">
                    <a href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors">
                        <Anchor className="w-4 h-4" />
                        <span>Return to Main Website</span>
                    </a>
                </div>
            </div>
        </div>
    )
}
