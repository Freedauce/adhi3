import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// Mock auth — simulates JWT-based authentication
export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("adhi_user");
        return stored ? JSON.parse(stored) : null;
    });

    const getUsersDB = () => {
        const db = localStorage.getItem("adhi_users_db");
        return db ? JSON.parse(db) : [];
    };

    const login = (email, password) => {
        const db = getUsersDB();
        let foundUser = db.find(u => u.email === email);

        if (!foundUser) {
            // Mock default roles for easy testing without registration if they use the helper emails
            let role = "FRANCHISEE";
            if (email.toLowerCase().includes("admin") || email.toLowerCase().includes("accountant")) role = "ADMIN";
            else if (email.toLowerCase().includes("invest")) role = "INVESTOR";
            else if (email.toLowerCase().includes("gov")) role = "GOVERNMENT";

            foundUser = {
                id: "USR-789",
                email,
                fullName: email.split("@")[0].replace(/\./g, " "),
                role: role,
                regionCode: "RW",
                status: "ACTIVE",
            };
        }

        // Mock password check (accept any password for now to avoid locking people out of the demo)
        localStorage.setItem("adhi_user", JSON.stringify(foundUser));
        setUser(foundUser);
        return foundUser;
    };

    const register = (data) => {
        const db = getUsersDB();
        const newUser = {
            id: `USR-${Date.now()}`,
            email: data.email,
            password: data.password, // storing plain for mock only
            fullName: data.fullName,
            role: data.role || "FRANCHISEE",
            regionCode: data.regionCode || "RW",
            status: "ACTIVE", // changed from PENDING_APPROVAL so they can use the app immediately after registering
        };
        db.push(newUser);
        localStorage.setItem("adhi_users_db", JSON.stringify(db));
        
        // Auto-login after register logic usually happens, but RegisterPage redirects to login.
        // We will just let RegisterPage redirect.
        return newUser;
    };

    const logout = () => {
        localStorage.removeItem("adhi_user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
