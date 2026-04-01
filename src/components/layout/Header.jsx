import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, LogOut } from "lucide-react";
import { useRole } from "../../context/RoleContext";
import { useNavigate } from "react-router-dom";

export function Header() {
    const { roleConfig, availableRoles, switchRole } = useRole();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10 sticky top-0">
            {/* Left — Workspace info */}
            <div>
                <h1 className="text-[17px] font-bold text-gray-900 tracking-tight leading-none">
                    {roleConfig.workspaceTitle}
                </h1>
                <p className="text-xs text-gray-500 mt-1">{roleConfig.subtitle}</p>
            </div>

            {/* Right — Actions */}
            <div className="flex items-center gap-3">
                {/* Landing Page Link */}
                <button
                    onClick={() => navigate("/")}
                    className="text-[13px] font-medium text-gray-500 hover:text-adhi-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-adhi-surface"
                >
                    View Site
                </button>

                {/* Role Switcher */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2.5 text-[13px] font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 px-2 py-1.5 pr-3 rounded-full cursor-pointer transition-all shadow-sm"
                    >
                        <div className="w-6 h-6 rounded-full bg-adhi-primary text-white flex items-center justify-center text-[11px] font-bold">
                            {roleConfig.avatarLetter}
                        </div>
                        Switch Role
                        <ChevronDown size={14} className="text-gray-500" />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 focus:outline-none">
                            <div className="px-3 py-2 border-b border-gray-50">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                    Select View
                                </p>
                            </div>
                            {availableRoles.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => {
                                        switchRole(role.id);
                                        setDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-sm ${roleConfig.id === role.id
                                        ? "bg-adhi-surface text-adhi-primary font-semibold"
                                        : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${roleConfig.id === role.id ? 'bg-adhi-primary text-white' : 'bg-gray-200 text-gray-600'
                                            }`}>
                                            {role.avatarLetter}
                                        </div>
                                        <span>{role.name}</span>
                                    </div>
                                    {roleConfig.id === role.id && <Check className="w-4 h-4 text-adhi-primary" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
