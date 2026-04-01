import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, Home, Package, GraduationCap, Leaf, ShieldCheck, FileText, DollarSign, Globe2, Users, ClipboardList, Boxes, BookOpen, UserCheck, Award, TrendingUp, Briefcase, History, FileCheck } from "lucide-react";
import { useRole } from "../../context/RoleContext";
import { cn } from "../../lib/utils";

const iconMap = {
    Overview: LayoutGrid,
    Housing: Home,
    Procurement: Package,
    Academy: GraduationCap,
    Climate: Leaf,
    Houses: Home,
    Rules: FileText,
    Regions: Globe2,
    Users: Users,
    Orders: ClipboardList,
    Components: Boxes,
    Payments: DollarSign,
    History: History,
    Compliance: ShieldCheck,
    Catalog: Package,
    Opportunities: TrendingUp,
    Investments: Briefcase,
    Courses: BookOpen,
    Trainees: UserCheck,
    Certifications: Award,
    Applications: FileCheck,
};

export function Sidebar() {
    const { currentRole, roleConfig } = useRole();
    const navigate = useNavigate();

    // Group admin nav into sections
    const adminDashboardItems = ["Overview", "Housing", "Procurement", "Academy", "Climate"];
    const adminManagementItems = ["Houses", "Rules", "Regions", "Users", "Orders", "Components", "Applications"];
    const isAdmin = currentRole === "ADMIN";

    const renderNavItem = (itemName) => {
        const IconComponent = iconMap[itemName] || LayoutGrid;
        const path = `${roleConfig.routesPrefix}/${itemName.toLowerCase()}`;

        return (
            <NavLink
                key={itemName}
                to={path}
                className={({ isActive }) =>
                    cn(
                        "flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200",
                        isActive
                            ? "bg-adhi-surface text-adhi-primary font-semibold"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    )
                }
            >
                <IconComponent className="w-[18px] h-[18px] flex-shrink-0" />
                <span>{itemName}</span>
            </NavLink>
        );
    };

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-white border-r border-gray-200 flex flex-col z-20">
            {/* Logo */}
            <div className="px-7 py-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                <div className="w-9 h-9 bg-adhi-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
                        <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <span className="font-extrabold text-lg tracking-wide text-adhi-dark">ADHI</span>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-5 mt-1 overflow-y-auto">
                {isAdmin ? (
                    <>
                        <h4 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-3 px-2">
                            DASHBOARDS
                        </h4>
                        <nav className="space-y-0.5 mb-6">
                            {adminDashboardItems.map(renderNavItem)}
                        </nav>
                        <h4 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-3 px-2">
                            MANAGEMENT
                        </h4>
                        <nav className="space-y-0.5">
                            {adminManagementItems.map(renderNavItem)}
                        </nav>
                    </>
                ) : (
                    <>
                        <h4 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-3 px-2">
                            {roleConfig.menuLabel}
                        </h4>
                        <nav className="space-y-0.5">
                            {roleConfig.nav.map(renderNavItem)}
                        </nav>
                    </>
                )}
            </div>

            {/* Bottom — Role Indicator */}
            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-adhi-primary text-white flex items-center justify-center text-xs font-bold">
                        {roleConfig.avatarLetter}
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                            Viewing as
                        </p>
                        <p className="text-sm font-semibold text-gray-800">{roleConfig.name}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
