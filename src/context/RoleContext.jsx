import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const ROLES = {
    ADMIN: "ADMIN",
    ACCOUNTANT: "ACCOUNTANT",
    INVESTOR: "INVESTOR",
    GOVERNMENT: "GOVERNMENT",
    FRANCHISEE: "FRANCHISEE",
    ACADEMY: "ACADEMY",
};

export const ROLE_CONFIG = {
    [ROLES.ADMIN]: {
        id: ROLES.ADMIN,
        name: "Admin",
        workspaceTitle: "Admin Workspace",
        subtitle: "Managing global platform operations",
        avatarLetter: "A",
        menuLabel: "ADMIN MENU",
        perspectiveLabel: "ADMIN PERSPECTIVE",
        nav: ["Overview", "Housing", "Procurement", "Academy", "Climate", "Houses", "Rules", "Regions", "Users", "Orders", "Components", "Applications"],
        routesPrefix: "/admin",
    },
    [ROLES.ACCOUNTANT]: {
        id: ROLES.ACCOUNTANT,
        name: "Accountant",
        workspaceTitle: "Accountant Workspace",
        subtitle: "Payment verification & financial oversight",
        avatarLetter: "C",
        menuLabel: "ACCOUNTANT MENU",
        perspectiveLabel: "ACCOUNTANT PERSPECTIVE",
        nav: ["Payments", "History"],
        routesPrefix: "/accountant",
    },
    [ROLES.INVESTOR]: {
        id: ROLES.INVESTOR,
        name: "Investor",
        workspaceTitle: "Investor Workspace",
        subtitle: "Tracking portfolio performance & ESG",
        avatarLetter: "I",
        menuLabel: "INVESTOR MENU",
        perspectiveLabel: "INVESTOR PERSPECTIVE",
        nav: ["Overview", "Housing", "Climate", "Opportunities", "Investments"],
        routesPrefix: "/investor",
    },
    [ROLES.GOVERNMENT]: {
        id: ROLES.GOVERNMENT,
        name: "Government",
        workspaceTitle: "Government Workspace",
        subtitle: "Monitoring housing targets & social impact",
        avatarLetter: "G",
        menuLabel: "GOVERNMENT MENU",
        perspectiveLabel: "GOVERNMENT PERSPECTIVE",
        nav: ["Overview", "Housing", "Climate", "Compliance"],
        routesPrefix: "/government",
    },
    [ROLES.FRANCHISEE]: {
        id: ROLES.FRANCHISEE,
        name: "Franchisee",
        workspaceTitle: "Franchisee Workspace",
        subtitle: "House purchasing & delivery tracking",
        avatarLetter: "F",
        menuLabel: "FRANCHISEE MENU",
        perspectiveLabel: "FRANCHISEE PERSPECTIVE",
        nav: ["Overview", "Catalog", "Orders", "Procurement", "Academy"],
        routesPrefix: "/franchisee",
    },
    [ROLES.ACADEMY]: {
        id: ROLES.ACADEMY,
        name: "Academy",
        workspaceTitle: "Academy Workspace",
        subtitle: "Training & certification management",
        avatarLetter: "Y",
        menuLabel: "ACADEMY MENU",
        perspectiveLabel: "ACADEMY PERSPECTIVE",
        nav: ["Courses", "Trainees", "Certifications"],
        routesPrefix: "/academy",
    },
};

const RoleContext = createContext();

export function RoleProvider({ children }) {
    const [currentRole, setCurrentRole] = useState(ROLES.ADMIN);
    const navigate = useNavigate();
    const location = useLocation();

    const switchRole = (role) => {
        if (ROLE_CONFIG[role]) {
            setCurrentRole(role);
            const firstNav = ROLE_CONFIG[role].nav[0].toLowerCase();
            navigate(`${ROLE_CONFIG[role].routesPrefix}/${firstNav}`);
        }
    };

    // Sync role based on URL if user types it directly
    useEffect(() => {
        const path = location.pathname;
        if (path.startsWith("/admin") && currentRole !== ROLES.ADMIN) setCurrentRole(ROLES.ADMIN);
        else if (path.startsWith("/accountant") && currentRole !== ROLES.ACCOUNTANT) setCurrentRole(ROLES.ACCOUNTANT);
        else if (path.startsWith("/investor") && currentRole !== ROLES.INVESTOR) setCurrentRole(ROLES.INVESTOR);
        else if (path.startsWith("/government") && currentRole !== ROLES.GOVERNMENT) setCurrentRole(ROLES.GOVERNMENT);
        else if (path.startsWith("/franchisee") && currentRole !== ROLES.FRANCHISEE) setCurrentRole(ROLES.FRANCHISEE);
        else if (path.startsWith("/academy") && currentRole !== ROLES.ACADEMY) setCurrentRole(ROLES.ACADEMY);
    }, [location.pathname, currentRole]);

    return (
        <RoleContext.Provider
            value={{
                currentRole,
                roleConfig: ROLE_CONFIG[currentRole],
                switchRole,
                availableRoles: Object.values(ROLE_CONFIG),
            }}
        >
            {children}
        </RoleContext.Provider>
    );
}

export function useRole() {
    const context = useContext(RoleContext);
    if (context === undefined) {
        throw new Error("useRole must be used within a RoleProvider");
    }
    return context;
}
