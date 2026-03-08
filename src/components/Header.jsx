import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useUser } from '../context/UserContext';
import '../css/Header.css';

/* User Avatar Menu (desktop dropdown) */
function UserAvatarMenu({ currentUser, isAdmin, onOpenAdmin, onLogout, onOpenLogin }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handler = e => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const isAnon = currentUser.role === 'anonymous';

    if (isAnon) {
        return (
            <button className="btn-login" onClick={onOpenLogin}>
                <span className="btn-login-icon">✦</span>
                <span className="btn-login-text">Giriş Yap</span>
            </button>
        );
    }

    return (
        <div className="avatar-menu-wrap" ref={menuRef}>
            <button
                className="avatar-btn"
                onClick={() => setOpen(v => !v)}
                aria-expanded={open}
                aria-label="Kullanıcı menüsü"
            >
                <div className="avatar-circle" style={{ backgroundColor: currentUser.color }}>
                    {currentUser.initials}
                </div>
                <span className="avatar-name">{currentUser.displayName}</span>
                <svg
                    className={`avatar-chevron ${open ? 'open' : ''}`}
                    width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {open && (
                <div className="avatar-dropdown">
                    <div className="dropdown-user-info">
                        <div className="dropdown-avatar" style={{ backgroundColor: currentUser.color }}>
                            {currentUser.initials}
                        </div>
                        <div>
                            <p className="dropdown-name">{currentUser.displayName}</p>
                            <p className="dropdown-role">{currentUser.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}</p>
                        </div>
                    </div>
                    <div className="dropdown-divider" />
                    {isAdmin && (
                        <button className="dropdown-item item-admin" onClick={() => { onOpenAdmin(); setOpen(false); }}>
                            <span>⚙️</span> Admin Paneli
                        </button>
                    )}
                    <button className="dropdown-item item-switch" onClick={() => { onOpenLogin(); setOpen(false); }}>
                        <span>🔄</span> Profil Değiştir
                    </button>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item item-logout" onClick={() => { onLogout(); setOpen(false); }}>
                        <span>→</span> Çıkış Yap
                    </button>
                </div>
            )}
        </div>
    );
}

/* Main Header */
function Header() {
    const { setQuery, openSuggestModal, openAdmin, openMemories, openContact } = useAppContext();
    const { currentUser, isAdmin, logout, openLoginModal } = useUser();
    const [searchFocused, setSearchFocused] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Close mobile menu on route/scroll change
    const closeMobile = () => setMobileOpen(false);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    return (
        <>
            <header className="header">
                {/* ── Logo ─────────────────────── */}
                <div className="logo-area">
                    <span className="logo-mark">MEG</span>
                    <span className="logo-sep" aria-hidden="true">|</span>
                    <span className="logo-sub">Travel Guide</span>
                </div>

                {/* ── Search ───────────────────── */}
                <div className={`search-wrap ${searchFocused ? 'focused' : ''}`}>
                    <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        className="search-input"
                        type="search"
                        placeholder="Yer ara..."
                        onChange={e => setQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        aria-label="Yer ara"
                    />
                </div>

                {/* ── Desktop Right Actions ─────── */}
                <div className="header-right header-right--desktop">
                    <button className="btn-nav btn-nav--memories" onClick={() => openMemories(null)}>
                        🤍 Hatıralarımız
                    </button>
                    <button className="btn-nav btn-nav--contact" onClick={openContact}>
                        ✉️ İletişim
                    </button>
                    <button className="btn-suggest" onClick={openSuggestModal}>
                        <span className="btn-suggest-inner">
                            <span>✦</span> <span className="btn-suggest-text">Yer Öner</span>
                        </span>
                    </button>
                    <UserAvatarMenu
                        currentUser={currentUser}
                        isAdmin={isAdmin}
                        onOpenAdmin={openAdmin}
                        onLogout={logout}
                        onOpenLogin={openLoginModal}
                    />
                </div>

                {/* ── Hamburger (Mobile) ─────────── */}
                <button
                    className={`hamburger ${mobileOpen ? 'open' : ''}`}
                    onClick={() => setMobileOpen(v => !v)}
                    aria-label="Menüyü aç/kapat"
                    aria-expanded={mobileOpen}
                >
                    <span className="ham-line" />
                    <span className="ham-line" />
                    <span className="ham-line" />
                </button>
            </header>

            {/* ── Mobile Drawer ────────────────── */}
            {mobileOpen && (
                <div className="mobile-overlay" onClick={closeMobile}>
                    <nav className="mobile-drawer" onClick={e => e.stopPropagation()}>
                        <div className="mobile-drawer-header">
                            <span className="logo-mark">MEG</span>
                            <span className="logo-sep">|</span>
                            <span className="logo-sub">Travel Guide</span>
                            <button className="mobile-close" onClick={closeMobile}>✕</button>
                        </div>

                        <div className="mobile-nav-links">
                            <button className="mobile-nav-item" onClick={() => { openMemories(null); closeMobile(); }}>
                                <span>🤍</span> Hatıralarımız
                            </button>
                            <button className="mobile-nav-item" onClick={() => { openSuggestModal(); closeMobile(); }}>
                                <span>✦</span> Yer Öner
                            </button>
                            <button className="mobile-nav-item" onClick={() => { openContact(); closeMobile(); }}>
                                <span>✉️</span> İletişim
                            </button>
                            {isAdmin && (
                                <button className="mobile-nav-item mobile-nav-admin" onClick={() => { openAdmin(); closeMobile(); }}>
                                    <span>⚙️</span> Admin Paneli
                                </button>
                            )}
                        </div>

                        <div className="mobile-nav-footer">
                            {currentUser.role === 'anonymous' ? (
                                <button className="btn-login mobile-login-btn" onClick={() => { openLoginModal(); closeMobile(); }}>
                                    <span className="btn-login-icon">✦</span>
                                    <span>Giriş Yap</span>
                                </button>
                            ) : (
                                <>
                                    <div className="mobile-user-card">
                                        <div className="avatar-circle" style={{ backgroundColor: currentUser.color }}>
                                            {currentUser.initials}
                                        </div>
                                        <div>
                                            <p className="dropdown-name">{currentUser.displayName}</p>
                                            <p className="dropdown-role">{currentUser.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}</p>
                                        </div>
                                    </div>
                                    <button className="mobile-nav-item" onClick={() => { openLoginModal(); closeMobile(); }}>
                                        <span>🔄</span> Profil Değiştir
                                    </button>
                                    <button className="mobile-nav-item mobile-logout" onClick={() => { logout(); closeMobile(); }}>
                                        <span>→</span> Çıkış Yap
                                    </button>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
}

export default Header;