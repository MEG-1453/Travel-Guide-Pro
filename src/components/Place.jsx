import React, { useState } from 'react';
import '../css/PlacesCards.css';

const FALLBACK_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:%23e2e8f0"/>
      <stop offset="100%" style="stop-color:%23cbd5e1"/>
    </linearGradient>
  </defs>
  <rect width="400" height="260" fill="url(%23g)"/>
  <text fill="%2394a3b8" font-family="sans-serif" font-size="13" text-anchor="middle" x="200" y="137">Görsel Hazırlanıyor</text>
</svg>`;

const CATEGORY_MAP = {
    mosque: { label: 'Cami', icon: '🕌' },
    landmark: { label: 'Tarihi Yer', icon: '🏛️' },
    heritage: { label: 'Miras', icon: '🌙' },
    food: { label: 'Cafe & Restoran', icon: '🍽️' },
    halal_food: { label: 'Helal Cafe & Restoran', icon: '🥙' },
};

function Place({ place, isSelected, onToggle, onOpenModal, onOpenMemories, isTopPopular }) {
    const [imgError, setImgError] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const { id, title, image, description, reviews, category, rating } = place;
    const cat = CATEGORY_MAP[category] || CATEGORY_MAP.landmark;
    const noImage = !image || imgError;

    return (
        <article
            className={`place-card ${isSelected ? 'place-card--selected' : ''}`}
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onOpenModal(place)}
            aria-label={title}
        >
            {/* ── Image ──────────────────────────── */}
            <div className="card-media">
                {noImage ? (
                    <div className="card-media-placeholder">
                        <span>{cat.icon}</span>
                    </div>
                ) : (
                    <img
                        src={image}
                        alt={title}
                        className="card-media-img"
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                )}
                <div className="card-media-overlay" />

                {/* Top Tags Container */}
                <div className="card-top-tags">
                    {isTopPopular && (
                        <div className="card-badge-popular card-badge-top">
                            🔥 Popüler
                        </div>
                    )}
                    <div className="card-chip-category">
                        {cat.icon} {cat.label}
                    </div>
                </div>

                {/* Route toggle */}
                <button
                    className={`card-route-btn ${isSelected ? 'active' : ''}`}
                    onClick={e => { e.stopPropagation(); onToggle(id); }}
                    aria-pressed={isSelected}
                    aria-label={isSelected ? 'Rotadan çıkar' : 'Rotaya ekle'}
                >
                    {isSelected ? '✓ Eklendi' : '+ Rotaya Ekle'}
                </button>
            </div>

            {/* ── Body ───────────────────────────── */}
            <div className="card-body">
                <div className="card-title-row">
                    <h4 className="card-title">{title}</h4>
                    <div className="card-rating">
                        <span className="rating-star">★</span>
                        <span className="rating-num">
                            {rating ? Number(rating).toFixed(1) : '—'}
                        </span>
                        {reviews?.length > 0 && (
                            <span className="rating-count">({reviews.length})</span>
                        )}
                    </div>
                </div>

                {/* Description with Read More toggle */}
                <div className={`card-desc-wrapper ${isExpanded ? 'expanded' : ''}`}>
                    <p className={`card-desc ${isExpanded ? 'desc-full' : ''}`}>
                        {description}
                    </p>
                    {description?.length > 80 && (
                        <button 
                            className="btn-read-more" 
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                        >
                            {isExpanded ? 'Daralt' : 'Devamını Oku'}
                        </button>
                    )}
                </div>
            </div>

            {/* ── Actions ────────────────────────── */}
            <div className="card-actions">
                <button
                    className="card-btn card-btn-primary"
                    onClick={() => onOpenModal(place)}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    Detay & Yorum
                </button>

                <button
                    className="card-btn card-btn-secondary"
                    onClick={() => onOpenMemories(place)}
                >
                    <span>🤍</span>
                    Hatıralarımız
                </button>
            </div>
        </article>
    );
}

export default Place;