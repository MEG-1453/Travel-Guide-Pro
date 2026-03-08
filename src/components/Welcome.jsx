import React from 'react';
import '../css/Welcome.css';
import { STATIC_PLACES } from '../data/places';
import KizKulesi from '../images/Kız-kulesi.jpg';

// All real images for the Netflix-style poster grid
const POSTER_PLACES = STATIC_PLACES.filter(
    p => p.image && typeof p.image === 'string' && !p.image.startsWith('data:')
);

// Build multiple rows for the infinite-scroll poster wall to cover massive screens
const ROW1 = [...POSTER_PLACES, ...POSTER_PLACES, ...POSTER_PLACES]; // extra long for seamless loop
const ROW2 = [...POSTER_PLACES.slice(3), ...POSTER_PLACES.slice(0, 3), ...POSTER_PLACES.slice(3), ...POSTER_PLACES.slice(0, 3), ...POSTER_PLACES.slice(3)];
const ROW3 = [...POSTER_PLACES.slice(1), ...POSTER_PLACES.slice(0, 1), ...POSTER_PLACES.slice(1), ...POSTER_PLACES.slice(0, 1), ...POSTER_PLACES.slice(1)];
const ROW4 = [...POSTER_PLACES.reverse(), ...POSTER_PLACES.reverse(), ...POSTER_PLACES.reverse()];
const ROW5 = [...POSTER_PLACES.slice(4), ...POSTER_PLACES.slice(0, 4), ...POSTER_PLACES.slice(4), ...POSTER_PLACES.slice(0, 4), ...POSTER_PLACES.slice(4)];
const ROW6 = [...POSTER_PLACES.slice(2), ...POSTER_PLACES.slice(0, 2), ...POSTER_PLACES.slice(2), ...POSTER_PLACES.slice(0, 2), ...POSTER_PLACES.slice(2)];
const ROW7 = [...POSTER_PLACES, ...POSTER_PLACES, ...POSTER_PLACES].reverse();

function Welcome({ onStart }) {
    return (
        <div className="welcome-wrapper">

            {/* ─── Netflix-Style Tilted Poster Grid ─── */}
            <div className="poster-wall" aria-hidden="true">
                <div className="poster-wall-inner">
                    {/* Row 1 — scrolls left */}
                    <div className="poster-row poster-row--1">
                        {ROW1.map((place, i) => (
                            <div
                                key={`r1-${i}`}
                                className="poster-tile"
                                style={{ backgroundImage: `url(${place.image})` }}
                            />
                        ))}
                    </div>
                    {/* Row 2 — scrolls right (offset) */}
                    <div className="poster-row poster-row--2">
                        {ROW2.map((place, i) => (
                            <div
                                key={`r2-${i}`}
                                className="poster-tile"
                                style={{ backgroundImage: `url(${place.image})` }}
                            />
                        ))}
                    </div>
                    {/* Row 3 — scrolls left again */}
                    <div className="poster-row poster-row--3">
                        {ROW3.map((place, i) => (
                            <div
                                key={`r3-${i}`}
                                className="poster-tile"
                                style={{ backgroundImage: `url(${place.image})` }}
                            />
                        ))}
                    </div>
                    {/* Row 4 — scrolls right */}
                    <div className="poster-row poster-row--4">
                        {ROW4.map((place, i) => (
                            <div
                                key={`r4-${i}`}
                                className="poster-tile"
                                style={{ backgroundImage: `url(${place.image})` }}
                            />
                        ))}
                    </div>
                    {/* Row 5 — scrolls left */}
                    <div className="poster-row poster-row--5">
                        {ROW5.map((place, i) => (
                            <div
                                key={`r5-${i}`}
                                className="poster-tile"
                                style={{ backgroundImage: `url(${place.image})` }}
                            />
                        ))}
                    </div>
                    {/* Row 6 — scrolls right */}
                    <div className="poster-row poster-row--6">
                        {ROW6.map((place, i) => (
                            <div
                                key={`r6-${i}`}
                                className="poster-tile"
                                style={{ backgroundImage: `url(${place.image})` }}
                            />
                        ))}
                    </div>
                    {/* Row 7 — scrolls left */}
                    <div className="poster-row poster-row--7">
                        {ROW7.map((place, i) => (
                            <div
                                key={`r7-${i}`}
                                className="poster-tile"
                                style={{ backgroundImage: `url(${place.image})` }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Dark+gradient overlay across the whole wall */}
            <div className="poster-overlay" aria-hidden="true" />

            {/* ─── Hero Content (centered) ─── */}
            <div className="welcome-hero">
                <div className="badge-pill">
                    <span className="badge-dot" />
                    ÖZEL REHBERİNİZ
                </div>

                <h1 className="hero-title">
                    İstanbul'u<br />
                    <span className="text-gradient">Yeniden Keşfet</span>
                </h1>

                <p className="hero-subtitle">
                    Tarihi dokular, gizli kalmış mekanlar ve eşsiz manzaralar.
                    Topluluk onaylı rotalarla şehri yeniden keşfet.
                </p>

                <div className="hero-stats">
                    <div className="stat-item">
                        <span className="stat-num">14+</span>
                        <span className="stat-label">Rota</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                        <span className="stat-num">3</span>
                        <span className="stat-label">Kategori</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                        <span className="stat-num">∞</span>
                        <span className="stat-label">Anı</span>
                    </div>
                </div>

                <div className="cta-group">
                    <button className="btn-cta" onClick={onStart}>
                        <span>Keşfetmeye Başla</span>
                        <div className="btn-cta-arrow">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2.5"
                                strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </div>
                    </button>
                    <p className="cta-hint">
                        <span className="hint-icon">🛡️</span> Topluluk tarafından doğrulandı
                    </p>
                </div>
            </div>

            {/* Scroll cue */}
            <div className="scroll-cue" aria-hidden="true">
                <div className="scroll-mouse">
                    <div className="scroll-wheel" />
                </div>
                <span>Aşağı kay</span>
            </div>
        </div>
    );
}

export default Welcome;