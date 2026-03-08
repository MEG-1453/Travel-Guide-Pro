import React, { useState } from 'react';
import { UserProvider } from './context/UserContext';
import { AppProvider } from './context/AppContext';
import { useAppContext } from './context/AppContext';
import { useUser } from './context/UserContext';
import Header from './components/Header';
import Place from './components/Place';
import Welcome from './components/Welcome';
import Loading from './components/Loading';
import PlaceModal from './components/PlaceModal';
import MemoriesModal from './components/MemoriesModal';
import SuggestPlaceModal from './components/SuggestPlaceModal';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import ContactModal from './components/ContactModal';
import Toast from './components/Toast';
import './App.css';

function PlacesSlider({ title, places, selectedPlaceIds, toggleSelectPlace, openModal, openMemories }) {
  const rowRef = React.useRef();

  const scroll = (direction) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: direction * 330, behavior: 'smooth' });
    }
  };

  return (
    <div className="section-wrapper">
      <div className="section-header">
        <h3>{title}</h3>
        <div className="slider-nav">
          <button onClick={() => scroll(-1)} className="slider-btn" aria-label="Sola kaydır">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button onClick={() => scroll(1)} className="slider-btn" aria-label="Sağa kaydır">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
      <div className="places-row" ref={rowRef}>
        {places.map(place => (
          <Place key={place.id} place={place}
            isSelected={selectedPlaceIds.includes(place.id)}
            onToggle={() => toggleSelectPlace(place.id)}
            onOpenModal={openModal}
            onOpenMemories={openMemories}
          />
        ))}
      </div>
    </div>
  );
}

function AppContent() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isBooting, setIsBooting] = useState(false);

  const {
    placesData, filteredPlaces, selectedPlaceIds, query, activeCategory,
    activeModalPlace, showSuggestModal, showAdmin,
    showMemories, showContact,
    toasts, toggleSelectPlace, createRoute, routeLoading,
    openModal, setQuery, setActiveCategory,
    handleAddReview, handleDeleteReview,
    handleSuggestPlace, handleApprovePlace, handleRejectPlace,
    closeSuggestModal, closeModal, closeAdmin, dismissToast,
    openMemories, closeMemories, closeContact,
  } = useAppContext();

  // Top 5 most engaged places (reviews * 2 + rating bonus)
  const top5PopularIds = React.useMemo(() => {
    return new Set(
      [...placesData]
        .sort((a, b) => {
          const scoreA = (a.reviews?.length || 0) * 2 + (parseFloat(a.rating) || 0);
          const scoreB = (b.reviews?.length || 0) * 2 + (parseFloat(b.rating) || 0);
          return scoreB - scoreA;
        })
        .slice(0, 5)
        .map(p => p.id)
    );
  }, [placesData]);

  const {
    showLoginModal, closeLoginModal, login,
    showRegisterModal, closeRegisterModal, openLoginModal, openRegisterModal,
    isAdmin, isLoggedIn, currentUser, isAuthenticating,
  } = useUser();

  const handleStartApp = () => {
    setShowWelcome(false);
    setIsBooting(true);
    setTimeout(() => setIsBooting(false), 3800);
  };

  if (showWelcome) return <Welcome onStart={handleStartApp} />;
  if (isBooting) return <Loading />;

  return (
    <div className="app-container">
      {isAuthenticating && (
        <div className="auth-overlay">
          <div className="auth-spinner">
            <svg
              className="loading-svg-ring"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              style={{ width: '90px', height: '90px' }}
            >
              <circle cx="60" cy="60" r="54" stroke="rgba(16,185,129,0.15)" strokeWidth="3" />
              <circle
                className="arc-spin" cx="60" cy="60" r="54"
                stroke="url(#arcGradAuth)" strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="339.3" strokeDashoffset="254"
                style={{ filter: "drop-shadow(0 0 8px rgba(16,185,129,0.5))" }}
              />
              <g transform="translate(28, 48)">
                <path
                  className="skyline-draw"
                  d="M0,30 L5,30 L5,20 L10,20 L10,30 L15,30 L15,10 L18,5 L21,10 L21,30 L25,30 A 14 14 0 0 1 53,30 L57,30 L57,10 L60,5 L63,10 L63,30 L68,30 L68,20 L73,20 L73,30 L78,30"
                  fill="none" stroke="rgba(16,185,129,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ filter: "drop-shadow(0 0 4px rgba(16,185,129,0.4))" }}
                />
                <path
                  className="skyline-draw-delayed"
                  d="M32,30 A 7 7 0 0 1 46,30 M39,16 L39,12 L38,9 L40,9 L39,12"
                  fill="none" stroke="rgba(16,185,129,0.7)" strokeWidth="1.2" strokeLinecap="round"
                />
              </g>
              <g className="star-pulse" transform="translate(80, 26)">
                <circle cx="0" cy="0" r="2.5" fill="rgba(255,255,255,0.9)" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))" }} />
              </g>
              <defs>
                <linearGradient id="arcGradAuth" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                  <stop offset="50%" stopColor="#10b981" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
            <div className="auth-status">Bağlantı Kuruluyor...</div>
          </div>
        </div>
      )}
      <Header />

      {/* Hero banner */}
      <div className="hero-banner-container">
        <div className="hero-banner-glass">
          {isLoggedIn ? (
            <div className="hero-banner-content">
              <h2>Hoşgeldin, <span className="hero-user-name">{currentUser.name}</span>! 👋</h2>
              <p>Yeni rotalar keşfetmeye ve unutulmaz deneyimlerini toplulukla paylaşmaya hazır mısın?</p>
            </div>
          ) : (
            <div className="hero-banner-content">
              <h2>İstanbul'u Birlikte Keşfedelim ✨</h2>
              <p>Topluluğa katıl, kendi rotalarını oluştur ve deneyimlerini hemen paylaş.</p>
              <div className="hero-banner-actions">
                <button className="btn-hero-primary" onClick={openRegisterModal}>Hemen Hesap Oluştur</button>
                <button className="btn-hero-secondary" onClick={openLoginModal}>Giriş Yap</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-container">

        {/* Weekly picks */}
        {!query && (
          <PlacesSlider
            title="🌟 Haftanın Tavsiyeleri"
            places={placesData.slice(0, 4)}
            selectedPlaceIds={selectedPlaceIds}
            toggleSelectPlace={toggleSelectPlace}
            openModal={openModal}
            openMemories={openMemories}
          />
        )}

        {/* Most visited */}
        {!query && (
          <PlacesSlider
            title="🔥 En Çok Ziyaret Edilenler"
            places={[...placesData].sort((a, b) => b.reviews.length - a.reviews.length).slice(0, 4)}
            selectedPlaceIds={selectedPlaceIds}
            toggleSelectPlace={toggleSelectPlace}
            openModal={openModal}
            openMemories={openMemories}
          />
        )}

        {/* Explore / search results */}
        <div className="section-wrapper">
          <div className="section-header">
            <h3>{query ? `"${query}" için sonuçlar` : '🗺️ Tüm Rotaları Keşfet'}</h3>
            {query && <span className="result-count">{filteredPlaces.length} yer bulundu</span>}
          </div>

          {!query && (
            <div className="category-filters">
              {[
                { id: 'all', label: 'Tümü', icon: '🌍' },
                { id: 'mosque', label: 'Cami', icon: '🕌' },
                { id: 'landmark', label: 'Tarihi Yer', icon: '🏛️' },
                { id: 'heritage', label: 'Miras', icon: '🌙' },
                { id: 'food', label: 'Cafe & Restoran', icon: '🍽️' },
                { id: 'halal_food', label: 'Helal Cafe & Restoran', icon: '🥙' },
              ].map(cat => (
                <button
                  key={cat.id}
                  className={`filter-chip ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          )}

          <div className="places-grid">
            {filteredPlaces.length > 0
              ? filteredPlaces.map(place => (
                <Place key={place.id} place={place}
                  isSelected={selectedPlaceIds.includes(place.id)}
                  onToggle={() => toggleSelectPlace(place.id)}
                  onOpenModal={openModal}
                  onOpenMemories={openMemories}
                  isTopPopular={top5PopularIds.has(place.id)}
                />
              ))
              : <p className="no-results">Aramanızla eşleşen yer bulunamadı.</p>
            }
          </div>
        </div>
      </div>

      {/* Floating route bar */}
      {selectedPlaceIds.length > 0 && (
        <div className="route-bar">
          <div className="route-info">
            <span className="route-count">{selectedPlaceIds.length}</span> yer seçildi
          </div>
          <button
            onClick={createRoute}
            className={`btn-route ${routeLoading ? 'loading' : ''}`}
            disabled={routeLoading}
          >
            {routeLoading ? (
              <>
                <span className="route-gps-dot" />
                📍 Konum Alınıyor...
              </>
            ) : (
              <>Rotayı Oluştur ✈️</>
            )}
          </button>
        </div>
      )}

      {/* Modals */}
      {activeModalPlace && (
        <PlaceModal
          place={activeModalPlace}
          onClose={closeModal}
          onAddReview={handleAddReview}
          onDeleteReview={handleDeleteReview}
        />
      )}
      {showMemories && (
        <MemoriesModal onClose={closeMemories} />
      )}
      {showSuggestModal && (
        <SuggestPlaceModal onClose={closeSuggestModal} onSubmit={handleSuggestPlace} />
      )}
      {showAdmin && isAdmin && (
        <AdminPanel
          onClose={closeAdmin}
          onApprove={handleApprovePlace}
          onReject={handleRejectPlace}
        />
      )}
      {showLoginModal && (
        <LoginModal
          onClose={closeLoginModal}
          onLogin={login}
          onSwitchToRegister={openRegisterModal}
        />
      )}
      {showRegisterModal && (
        <RegisterModal
          onClose={closeRegisterModal}
          onSwitchToLogin={openLoginModal}
        />
      )}
      {showContact && (
        <ContactModal onClose={closeContact} />
      )}

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </UserProvider>
  );
}

export default App;