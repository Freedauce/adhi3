import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) { setError("Please fill in all fields."); return; }
        try {
            const loggedInUser = login(email, password);
            if (loggedInUser.role === "ADMIN") {
                navigate("/admin/overview");
            } else if (loggedInUser.role === "INVESTOR") {
                navigate("/investor/overview");
            } else if (loggedInUser.role === "GOVERNMENT") {
                navigate("/government/overview");
            } else {
                navigate("/franchisee/overview");
            }
        } catch {
            setError("Invalid credentials.");
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left — Branding */}
            <div className="hidden lg:flex w-1/2 bg-adhi-primary relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 border-2 border-white rounded-full" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 border border-white rounded-full" />
                    <div className="absolute top-1/2 left-1/3 w-48 h-48 border border-white/50 rounded-full" />
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
                        Affordable Housing.<br />Engineered Digitally.
                    </h1>
                    <p className="text-white/80 text-lg leading-relaxed">
                        Build in weeks, not months. The digital platform powering Africa's housing revolution.
                    </p>
                </div>
            </div>

            {/* Right — Form */}
            <div className="flex-1 flex items-center justify-center px-8">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome back</h2>
                    <p className="text-gray-500 mb-8">Sign in to your ADHI account</p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
                            {error}
                        </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm mb-6 flex flex-col gap-2">
                        <span className="font-bold flex items-center gap-2"><Eye size={16} /> Test Credentials</span>
                        <div className="flex flex-col gap-1 pl-6">
                            <span><strong>Franchisee:</strong> <span className="font-mono bg-blue-100 px-1 rounded">client@adhi.rw</span></span>
                            <span><strong>Accountant:</strong> <span className="font-mono bg-blue-100 px-1 rounded">accountant@adhi.rw</span></span>
                            <span className="text-gray-500 text-xs mt-1">Password can be anything.</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all"
                                placeholder="you@company.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all pr-12"
                                    placeholder="Enter your password"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input type="checkbox" className="rounded border-gray-300 accent-adhi-primary" />
                                Remember me
                            </label>
                            <Link to="/forgot-password" className="text-sm font-medium text-adhi-primary hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-adhi-primary text-white py-3.5 rounded-xl font-semibold text-[15px] hover:bg-adhi-dark transition-colors"
                        >
                            Sign In
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-8">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-semibold text-adhi-primary hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
