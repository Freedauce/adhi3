import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { regions } from "../../mock/houseTypes";

export default function RegisterPage() {
    const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "", role: "FRANCHISEE", regionCode: "RW" });
    const [error, setError] = useState("");
    const { register } = useAuth();
    const navigate = useNavigate();

    const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.fullName || !form.email || !form.password) { setError("Please fill in all required fields."); return; }
        if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
        if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
        register(form);
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left — Branding */}
            <div className="hidden lg:flex w-1/2 bg-adhi-dark relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-32 right-32 w-80 h-80 border-2 border-white rounded-full" />
                    <div className="absolute bottom-10 left-10 w-60 h-60 border border-white rounded-full" />
                </div>
                <div className="relative z-10 text-white px-16 max-w-lg">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
                                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-2xl font-extrabold tracking-wide">ADHI</span>
                    </div>
                    <h1 className="text-4xl font-extrabold leading-tight mb-4">
                        Join the Housing<br />Revolution
                    </h1>
                    <p className="text-white/80 text-lg leading-relaxed">
                        As a Franchisee or Investor, you can purchase house kits, track deliveries, and fund Africa's digital construction future.
                    </p>
                </div>
            </div>

            {/* Right — Form */}
            <div className="flex-1 flex items-center justify-center px-8 py-12">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create your account</h2>
                    <p className="text-gray-500 mb-8">Get started with the ADHI platform</p>

                    {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                            <input type="text" value={form.fullName} onChange={e => update("fullName", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary" placeholder="Your full name" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                            <input type="email" value={form.email} onChange={e => update("email", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary" placeholder="you@company.com" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">I am a</label>
                                <select value={form.role} onChange={e => update("role", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary bg-white">
                                    <option value="FRANCHISEE">Franchisee</option>
                                    <option value="INVESTOR">Investor</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Region</label>
                                <select value={form.regionCode} onChange={e => update("regionCode", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary bg-white">
                                    {regions.filter(r => r.active).map(r => <option key={r.code} value={r.code}>{r.label}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                            <input type="password" value={form.password} onChange={e => update("password", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary" placeholder="Min. 8 characters" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                            <input type="password" value={form.confirmPassword} onChange={e => update("confirmPassword", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary" placeholder="Repeat your password" />
                        </div>

                        <button type="submit" className="w-full bg-adhi-primary text-white py-3.5 rounded-xl font-semibold text-[15px] hover:bg-adhi-dark transition-colors mt-2">
                            Create Account
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-8">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-adhi-primary hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
