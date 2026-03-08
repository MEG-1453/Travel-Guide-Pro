import React from 'react';
import '../css/Loading.css';

function Loading() {
  return (
    <div className="loading-wrapper" role="status" aria-label="Yükleniyor">
      {/* Background ambient */}
      <div className="loading-bg-blob blob-a" aria-hidden="true" />
      <div className="loading-bg-blob blob-b" aria-hidden="true" />

      {/* Emblem — SVG ring + brand text stacked vertically */}
      <div className="loading-emblem">

        {/* Animated SVG ring — standalone, no text inside */}
        <svg
          className="loading-svg-ring"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Outer static ring */}
          <circle cx="60" cy="60" r="54"
            stroke="rgba(16,185,129,0.15)" strokeWidth="1.5" />
            
          {/* Animated spinning background glow arc */}
          <circle
            className="arc-spin" cx="60" cy="60" r="54"
            stroke="url(#arcGrad)" strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="339.3" strokeDashoffset="254"
            style={{ filter: "drop-shadow(0 0 8px rgba(16,185,129,0.5))" }}
          />

          {/* Minimalist Istanbul Skyline (Mosque, Domes, Minarets) */}
          <g transform="translate(28, 48)">
            <path
              className="skyline-draw"
              d="M0,30 L5,30 L5,20 L10,20 L10,30 
                 L15,30 L15,10 L18,5 L21,10 L21,30 
                 L25,30 
                 A 14 14 0 0 1 53,30 
                 L57,30 L57,10 L60,5 L63,10 L63,30 
                 L68,30 L68,20 L73,20 L73,30 L78,30"
              fill="none"
              stroke="rgba(16,185,129,0.9)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: "drop-shadow(0 0 4px rgba(16,185,129,0.4))" }}
            />
            {/* Center Main Dome Details */}
            <path
              className="skyline-draw-delayed"
              d="M32,30 A 7 7 0 0 1 46,30 M39,16 L39,12 L38,9 L40,9 L39,12"
              fill="none"
              stroke="rgba(16,185,129,0.7)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>

          {/* Pulsing Star/Moon */}
          <g className="star-pulse" transform="translate(80, 26)">
            <circle cx="0" cy="0" r="2.5" fill="rgba(255,255,255,0.9)" 
              style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))" }}/>
          </g>

          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Brand text — outside and below the SVG, never overlapping */}
        <div className="loading-brand">
          <span className="loading-brand-name">MEG</span>
          <div className="loading-brand-sep" />
          <span className="loading-brand-sub">Travel Guide</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="loading-progress-track">
        <div className="loading-progress-fill" />
      </div>

      {/* Label */}
      <p className="loading-label">İstanbul'u Keşfediyoruz...</p>
    </div>
  );
}

export default Loading;