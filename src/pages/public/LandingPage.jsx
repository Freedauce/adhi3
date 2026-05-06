import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Home, Package, Truck, Leaf, Users, Recycle, MapPin, ChevronRight, Play, Shield, Zap, Globe2, Award } from "lucide-react";
import { houseTypes, impactStats, regions } from "../../mock/houseTypes";
import HouseDetailModal from "./HouseDetailModal";

// Animated counter hook
function useCountUp(target, duration = 2000) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const num = parseInt(String(target).replace(/[^0-9]/g, "")) || 0;
                const start = performance.now();
                const step = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setCount(Math.floor(num * eased));
                    if (progress < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
            }
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);

    return { count, ref };
}

export default function LandingPage() {
    const [selectedHouse, setSelectedHouse] = useState(null);

    const c1 = useCountUp("3150");
    const c2 = useCountUp("4");
    const c3 = useCountUp("185");
    const c4 = useCountUp("12400");

    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden">
            {/* ═══ NAV ═══ */}
            <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-gray-100/80 z-50">
                <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-adhi-primary rounded-xl flex items-center justify-center shadow-lg shadow-adhi-primary/20">
                            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
                                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="font-extrabold text-xl text-gray-900 tracking-tight">ADHI</span>
                    </div>
                    <div className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-gray-500">
                        <a href="#products" className="hover:text-gray-900 transition-colors">Products</a>
                        <a href="#how-it-works" className="hover:text-gray-900 transition-colors">Process</a>
                        <a href="#impact" className="hover:text-gray-900 transition-colors">Impact</a>
                        <a href="#regions" className="hover:text-gray-900 transition-colors">Regions</a>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link to="/login" className="text-[14px] font-semibold text-gray-600 hover:text-gray-900 transition-colors px-4 py-2.5 rounded-xl hover:bg-gray-50">
                            Sign In
                        </Link>
                        <Link to="/register" className="text-[14px] font-semibold text-white bg-gray-900 hover:bg-gray-800 px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-gray-900/20">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ═══ HERO — Boxabl-inspired full viewport ═══ */}
            <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-[#050A14]">
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-adhi-primary/5 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-24">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] text-white/70 text-[13px] font-medium px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        Now operating across East Africa
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold text-white leading-[1.05] tracking-tight max-w-5xl mx-auto">
                        Housing Meets<br />
                        <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                            Digital Engineering
                        </span>
                    </h1>

                    <p className="text-[clamp(1rem,1.5vw,1.25rem)] text-white/50 mt-6 max-w-2xl mx-auto leading-relaxed font-medium">
                        Every house is a pre-engineered kit — configured digitally, sourced through automated procurement, and assembled on-site in weeks.
                    </p>

                    {/* CTAs */}
                    <div className="flex items-center justify-center gap-4 mt-10">
                        <a href="#products" className="group bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-[15px] hover:shadow-2xl hover:shadow-white/10 transition-all flex items-center gap-2.5">
                            Explore Our Kits
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                        <Link to="/register" className="text-white/70 border border-white/10 px-8 py-4 rounded-2xl font-semibold text-[15px] hover:bg-white/5 hover:text-white hover:border-white/20 transition-all">
                            Apply as Investor
                        </Link>
                    </div>

                    {/* Stats Strip */}
                    <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-1 max-w-4xl mx-auto">
                        {[
                            { ref: c1.ref, value: c1.count.toLocaleString(), suffix: "", label: "Houses Built" },
                            { ref: c2.ref, value: c2.count, suffix: "", label: "Countries Active" },
                            { ref: c3.ref, value: c3.count, suffix: "+", label: "Certified Franchisees" },
                            { ref: c4.ref, value: c4.count.toLocaleString(), suffix: " MT", label: "CO₂ Offset" },
                        ].map((stat, idx) => (
                            <div key={idx} ref={stat.ref} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl py-6 px-4 text-center backdrop-blur-sm">
                                <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                                    {stat.value}{stat.suffix}
                                </p>
                                <p className="text-[13px] text-white/40 mt-1.5 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
                    <span className="text-[11px] font-medium tracking-widest uppercase">Scroll</span>
                    <div className="w-[1px] h-8 bg-gradient-to-b from-white/20 to-transparent" />
                </div>
            </section>

            {/* ═══ PRODUCT SHOWCASE — Boxabl-style cards ═══ */}
            <section id="products" className="py-28 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-xl mb-16">
                        <span className="text-[12px] font-bold text-adhi-primary tracking-[0.2em] uppercase">Our Products</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mt-3 leading-[1.1]">
                            Built for Africa.<br />Designed for Scale.
                        </h2>
                        <p className="text-lg text-gray-500 mt-4 leading-relaxed">
                            From studio apartments to family duplexes — every model is a complete, pre-engineered building system.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {houseTypes.map((house, idx) => (
                            <div
                                key={house.id}
                                className="group relative bg-gray-50 rounded-3xl overflow-hidden cursor-pointer border border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-1"
                                onClick={() => setSelectedHouse(house)}
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={house.imageUrl}
                                        alt={house.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white text-gray-900 text-[11px] px-3 py-1.5 rounded-full font-bold shadow-sm">
                                            {house.tag}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                                            <ArrowRight size={16} className="text-gray-900" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-gray-900 text-lg tracking-tight">{house.name}</h3>
                                    <p className="text-[13px] text-gray-400 mt-1 font-medium">
                                        {house.defaultBedrooms > 0 ? `${house.defaultBedrooms} Bed` : "Studio"} · {house.defaultBathrooms} Bath · {house.defaultFloorAreaM2}m²
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-end justify-between">
                                        <div>
                                            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Starting from</p>
                                            <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                                ${house.basePriceUsd.toLocaleString()}
                                            </p>
                                        </div>
                                        <span className="text-[12px] text-gray-400 font-medium bg-gray-100 px-2.5 py-1 rounded-lg">
                                            {house.assemblyText || `${house.assemblyWeeks} wk build`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ HOW IT WORKS — Horizontal timeline ═══ */}
            <section id="how-it-works" className="py-28 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <span className="text-[12px] font-bold text-adhi-primary tracking-[0.2em] uppercase">The Process</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mt-3">
                            From Screen to Site
                        </h2>
                        <p className="text-lg text-gray-500 mt-4 max-w-xl mx-auto">
                            Three steps. Zero guesswork. Every component calculated by our Rules Engine.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-[52px] left-[16.5%] right-[16.5%] h-[2px] bg-gray-200" />

                        {[
                            { icon: <Home className="w-6 h-6" />, step: "01", title: "Configure", desc: "Select your house model. Customize roof type, finishing grade, bathrooms, and delivery region.", color: "bg-emerald-500" },
                            { icon: <Zap className="w-6 h-6" />, step: "02", title: "Auto-Generate BOQ", desc: "Our Rules Engine calculates every component, quantity, and cost. Zero waste. Instant pricing.", color: "bg-blue-500" },
                            { icon: <Truck className="w-6 h-6" />, step: "03", title: "Procure & Deliver", desc: "Odoo handles procurement automatically. Your complete kit arrives on-site, ready for assembly.", color: "bg-violet-500" },
                        ].map((item, idx) => (
                            <div key={idx} className="text-center px-8 relative">
                                <div className={`w-[104px] h-[104px] ${item.color} rounded-3xl flex items-center justify-center mx-auto mb-8 text-white shadow-lg relative z-10`}>
                                    {item.icon}
                                </div>
                                <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] uppercase">Step {item.step}</span>
                                <h3 className="text-2xl font-extrabold text-gray-900 mt-2 mb-3 tracking-tight">{item.title}</h3>
                                <p className="text-gray-500 text-[15px] leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ IMPACT — Dark section with animated counters ═══ */}
            <section id="impact" className="py-28 px-6 bg-[#050A14] relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-[12px] font-bold text-emerald-400 tracking-[0.2em] uppercase">Platform Impact</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mt-3">
                            Real Numbers. Real Change.
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: <Home className="w-6 h-6" />, value: impactStats.homesDelivered, label: "Homes Delivered", color: "from-emerald-500/20 to-emerald-500/5", iconColor: "text-emerald-400" },
                            { icon: <Globe2 className="w-6 h-6" />, value: String(impactStats.countriesActive), label: "Countries Active", color: "from-blue-500/20 to-blue-500/5", iconColor: "text-blue-400" },
                            { icon: <Users className="w-6 h-6" />, value: impactStats.jobsCreated, label: "Jobs Created", color: "from-violet-500/20 to-violet-500/5", iconColor: "text-violet-400" },
                            { icon: <Leaf className="w-6 h-6" />, value: impactStats.co2Saved, label: "CO₂ Avoided", color: "from-teal-500/20 to-teal-500/5", iconColor: "text-teal-400" },
                        ].map((stat, idx) => (
                            <div key={idx} className={`bg-gradient-to-b ${stat.color} border border-white/[0.06] rounded-3xl p-8 text-center backdrop-blur-sm`}>
                                <div className={`w-14 h-14 bg-white/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-5 ${stat.iconColor}`}>
                                    {stat.icon}
                                </div>
                                <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{stat.value}</p>
                                <p className="text-[13px] text-white/40 mt-2 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Features grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16">
                        {[
                            { icon: <Shield className="w-5 h-5" />, title: "Enterprise Security", desc: "RS256 JWT authentication, role-based access, end-to-end encryption" },
                            { icon: <Zap className="w-5 h-5" />, title: "Instant BOQ Engine", desc: "Automated bill of quantities with BASE/ADJUSTMENT/GUARD rules" },
                            { icon: <Package className="w-5 h-5" />, title: "Odoo Integration", desc: "Automated procurement, inventory tracking, and delivery logistics" },
                        ].map((feat, idx) => (
                            <div key={idx} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 flex items-start gap-4">
                                <div className="w-10 h-10 bg-white/[0.06] rounded-xl flex items-center justify-center text-white/60 flex-shrink-0">
                                    {feat.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-[15px]">{feat.title}</h4>
                                    <p className="text-[13px] text-white/40 mt-1 leading-relaxed">{feat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ REGIONS ═══ */}
            <section id="regions" className="py-28 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-[12px] font-bold text-adhi-primary tracking-[0.2em] uppercase">Where We Operate</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mt-3 leading-[1.1]">
                                Active Across<br />East Africa
                            </h2>
                            <p className="text-lg text-gray-500 mt-4 leading-relaxed">
                                Each region has localized pricing, tax rules, and material specifications — managed automatically by the platform.
                            </p>
                            <div className="mt-8 space-y-3">
                                {regions.filter(r => r.active).map(region => (
                                    <div key={region.code} className="flex items-center justify-between bg-gray-50 rounded-2xl px-6 py-4 hover:bg-adhi-surface transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-sm text-gray-600 group-hover:bg-adhi-primary group-hover:text-white transition-colors shadow-sm">
                                                {region.code}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{region.label}</p>
                                                <p className="text-[12px] text-gray-400">{region.currency}</p>
                                            </div>
                                        </div>
                                        <div className="text-right text-[13px] text-gray-400">
                                            <span>{region.taxLabel} {region.taxRatePct}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Africa Map Placeholder */}
                        <div className="relative bg-gray-50 rounded-3xl aspect-square flex items-center justify-center overflow-hidden border border-gray-100">
                            <div className="text-center">
                                <Globe2 className="w-24 h-24 text-gray-200 mx-auto mb-4" />
                                <p className="text-lg font-bold text-gray-300">East Africa</p>
                                <p className="text-sm text-gray-300">4 Active Regions</p>
                            </div>
                            {/* Region dots */}
                            <div className="absolute top-[35%] right-[30%] w-4 h-4 bg-adhi-primary rounded-full shadow-lg shadow-adhi-primary/30 animate-pulse" title="Rwanda" />
                            <div className="absolute top-[30%] right-[25%] w-4 h-4 bg-adhi-primary rounded-full shadow-lg shadow-adhi-primary/30 animate-pulse delay-150" title="Kenya" />
                            <div className="absolute top-[40%] right-[28%] w-4 h-4 bg-adhi-primary rounded-full shadow-lg shadow-adhi-primary/30 animate-pulse delay-300" title="Tanzania" />
                            <div className="absolute top-[32%] right-[32%] w-4 h-4 bg-adhi-primary rounded-full shadow-lg shadow-adhi-primary/30 animate-pulse delay-500" title="Uganda" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ TRUST BAR ═══ */}
            <section className="py-16 px-6 bg-gray-50 border-y border-gray-100">
                <div className="max-w-5xl mx-auto">
                    <p className="text-center text-[12px] font-bold text-gray-400 tracking-[0.2em] uppercase mb-8">Integrated With</p>
                    <div className="flex items-center justify-center gap-12 flex-wrap">
                        {["Odoo ERP", "Rwanda Housing Authority", "Kenya NHCF", "UNCDF", "ADHI Foundation"].map((partner, idx) => (
                            <div key={idx} className="text-gray-300 font-bold text-lg tracking-tight hover:text-gray-500 transition-colors cursor-default">
                                {partner}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ CTA BANNER ═══ */}
            <section className="py-28 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-[#050A14] rounded-[32px] px-12 py-20 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />
                            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px]" />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                                Ready to Build Africa's<br />Housing Future?
                            </h2>
                            <p className="text-white/50 text-lg mt-4 max-w-lg mx-auto">
                                Join as a Franchisee and purchase house kits, or invest in projects that deliver measurable social and financial returns.
                            </p>
                            <div className="flex items-center justify-center gap-4 mt-10">
                                <Link to="/register" className="group bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-[15px] hover:shadow-2xl hover:shadow-white/10 transition-all flex items-center gap-2.5">
                                    Create Account
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/login" className="text-white/70 border border-white/10 px-8 py-4 rounded-2xl font-semibold text-[15px] hover:bg-white/5 hover:text-white transition-all">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className="bg-[#050A14] text-white pt-20 pb-10 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
                        <div className="col-span-2 md:col-span-2">
                            <div className="flex items-center gap-2.5 mb-5">
                                <div className="w-9 h-9 bg-adhi-primary rounded-xl flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                                        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
                                        <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span className="font-extrabold text-xl tracking-tight">ADHI</span>
                            </div>
                            <p className="text-[14px] text-white/40 leading-relaxed max-w-xs">
                                House in a Kit — The digital platform engineering Africa's affordable housing revolution.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4">Platform</h4>
                            <ul className="space-y-2.5 text-[14px] text-white/50">
                                <li><a href="#products" className="hover:text-white transition-colors">Products</a></li>
                                <li><a href="#how-it-works" className="hover:text-white transition-colors">Process</a></li>
                                <li><a href="#impact" className="hover:text-white transition-colors">Impact</a></li>
                                <li><a href="#regions" className="hover:text-white transition-colors">Regions</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4">Portals</h4>
                            <ul className="space-y-2.5 text-[14px] text-white/50">
                                <li><Link to="/login" className="hover:text-white transition-colors">Franchisee</Link></li>
                                <li><Link to="/login" className="hover:text-white transition-colors">Investor</Link></li>
                                <li><Link to="/login" className="hover:text-white transition-colors">Government</Link></li>
                                <li><Link to="/login" className="hover:text-white transition-colors">Academy</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4">Company</h4>
                            <ul className="space-y-2.5 text-[14px] text-white/50">
                                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-[13px] text-white/30">© 2026 ADHI Platform. All rights reserved.</p>
                        <p className="text-[13px] text-white/30">Building Africa's housing future — one kit at a time.</p>
                    </div>
                </div>
            </footer>

            {/* ═══ MODAL ═══ */}
            {selectedHouse && (
                <HouseDetailModal house={selectedHouse} onClose={() => setSelectedHouse(null)} />
            )}
        </div>
    );
}
