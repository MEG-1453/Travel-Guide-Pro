/**
 * USER CONTEXT — Simulated auth with localStorage-based registration
 * =====================================================================
 * Roles:
 *   anonymous — can add photos, cannot comment; listed as guest
 *   user      — full access; submit reviews, photos, suggest places
 *   admin     — all user permissions + AdminPanel CRUD
 * =====================================================================
 */
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const USER_SESSION_KEY = 'travelguide_session_v4';
const REGISTERED_USERS_KEY = 'travelguide_users_v2';

// Hardcoded system profiles
export const SYSTEM_PROFILES = [
    {
        id: 'guest',
        name: 'Misafir',
        displayName: 'Misafir Kullanıcı',
        role: 'anonymous',
        initials: '?',
        color: '#94a3b8',
        description: 'Fotoğraf ekleyebilirsin, yorum için giriş yap.',
        isSystem: true,
    },
    {
        id: 'admin_meg',
        name: 'meg',
        displayName: 'MEG Admin',
        role: 'admin',
        initials: '⚙',
        color: '#3b82f6',
        description: 'Yönetici — tüm yetkilere sahip.',
        isSystem: true,
    },
];

// --------------- Helpers ---------------
const readRegistered = () => {
    try { return JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]'); }
    catch { return []; }
};
const writeRegistered = users => {
    try { localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users)); } catch { /* */ }
};

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#ef4444', '#14b8a6'];
const pickColor = (id) => COLORS[id.charCodeAt(0) % COLORS.length];

const buildProfile = (user) => ({
    id: user.id,
    name: user.name,
    displayName: user.name,
    role: 'user',
    initials: user.name[0]?.toUpperCase() || 'U',
    color: user.color || pickColor(user.id),
    description: 'Kullanıcı',
    isSystem: false,
});

// --------------- Context ---------------
const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [registeredUsers, setRegisteredUsers] = useState(readRegistered);

    const allProfiles = useMemo(() => [
        SYSTEM_PROFILES[0],             // guest
        ...registeredUsers.map(buildProfile),
        SYSTEM_PROFILES[1],             // admin
    ], [registeredUsers]);

    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem(USER_SESSION_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed;
            }
        } catch { /* */ }
        return SYSTEM_PROFILES[0];
    });

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    // Login with username and password
    const login = useCallback(async (username, password) => {
        setIsAuthenticating(true);
        // Fake network delay for a premium feel
        await new Promise(r => setTimeout(r, 3400));

        const trimmedUser = username.trim();
        
        // Admin check
        if (trimmedUser === 'meg' && password === '1453') {
            const adminProfile = SYSTEM_PROFILES.find(p => p.id === 'admin_meg');
            setCurrentUser(adminProfile);
            try { localStorage.setItem(USER_SESSION_KEY, JSON.stringify(adminProfile)); } catch { /* */ }
            setShowLoginModal(false);
            setIsAuthenticating(false);
            return { success: true };
        }

        const regs = readRegistered();
        const reg = regs.find(u => u.name.toLowerCase() === trimmedUser.toLowerCase() && u.password === password);
        
        if (reg) {
            const profile = buildProfile(reg);
            setCurrentUser(profile);
            try { localStorage.setItem(USER_SESSION_KEY, JSON.stringify(profile)); } catch { /* */ }
            setShowLoginModal(false);
            setIsAuthenticating(false);
            return { success: true };
        }

        setIsAuthenticating(false);
        return { error: 'Geçersiz kullanıcı adı veya şifre.' };
    }, []);

    // Continue as guest
    const continueAsGuest = useCallback(async () => {
        setIsAuthenticating(true);
        await new Promise(r => setTimeout(r, 3200));

        const guestProfile = {
            id: 'guest_' + Math.random().toString(36).substring(2, 9),
            name: 'Ziyaretçi',
            displayName: 'Misafir Kullanıcı',
            role: 'anonymous',
            initials: '?',
            color: '#94a3b8',
            description: 'Fotoğraf ekleyebilirsin, yorum için giriş yap.',
            isSystem: false,
        };
        setCurrentUser(guestProfile);
        try { localStorage.setItem(USER_SESSION_KEY, JSON.stringify(guestProfile)); } catch { /* */ }
        setShowLoginModal(false);
        setIsAuthenticating(false);
    }, []);

    // Register new account
    const register = useCallback(async ({ name, password }) => {
        setIsAuthenticating(true);
        await new Promise(r => setTimeout(r, 3600));

        const trimmed = name.trim();
        if (!trimmed || !password.trim()) {
            setIsAuthenticating(false);
            return { error: 'Tüm alanları doldurun.' };
        }
        const existing = readRegistered();
        if (existing.find(u => u.name.toLowerCase() === trimmed.toLowerCase())) {
            setIsAuthenticating(false);
            return { error: 'Bu kullanıcı adı zaten alınmış.' };
        }
        const newUser = {
            id: `user_${Date.now()}`,
            name: trimmed,
            password, // NOTE: stored in localStorage — demo only, no real security
            color: COLORS[existing.length % COLORS.length],
        };
        const updated = [...existing, newUser];
        writeRegistered(updated);
        setRegisteredUsers(updated);
        // Auto-login after register
        const profile = buildProfile(newUser);
        setCurrentUser(profile);
        try { localStorage.setItem(USER_SESSION_KEY, JSON.stringify(profile)); } catch { /* */ }
        setShowRegisterModal(false);
        setIsAuthenticating(false);
        return { success: true };
    }, []);

    const logout = useCallback(async () => {
        setIsAuthenticating(true);
        await new Promise(r => setTimeout(r, 3000));

        setCurrentUser(SYSTEM_PROFILES[0]);
        try { localStorage.removeItem(USER_SESSION_KEY); } catch { /* */ }
        setIsAuthenticating(false);
    }, []);

    const openLoginModal = useCallback(() => setShowLoginModal(true), []);
    const closeLoginModal = useCallback(() => setShowLoginModal(false), []);
    const openRegisterModal = useCallback(() => { setShowLoginModal(false); setShowRegisterModal(true); }, []);
    const closeRegisterModal = useCallback(() => setShowRegisterModal(false), []);

    const isAdmin = currentUser.role === 'admin';
    const isLoggedIn = currentUser.role !== 'anonymous';

    const value = useMemo(() => ({
        currentUser, isAdmin, isLoggedIn, isAuthenticating,
        allProfiles, registeredUsers,
        showLoginModal, showRegisterModal,
        login, logout, register, continueAsGuest,
        openLoginModal, closeLoginModal,
        openRegisterModal, closeRegisterModal,
    }), [
        currentUser, isAdmin, isLoggedIn, isAuthenticating,
        allProfiles, registeredUsers,
        showLoginModal, showRegisterModal,
        login, logout, register, continueAsGuest,
        openLoginModal, closeLoginModal,
        openRegisterModal, closeRegisterModal,
    ]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('useUser must be inside <UserProvider>');
    return ctx;
}
