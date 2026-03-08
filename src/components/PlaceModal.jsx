import React, { useState, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import '../css/PlaceModal.css';

const FALLBACK = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="260" viewBox="0 0 800 260"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23e2e8f0"/><stop offset="100%" style="stop-color:%23cbd5e1"/></linearGradient></defs><rect width="800" height="260" fill="url(%23g)"/><text fill="%2394a3b8" font-family="sans-serif" font-size="16" text-anchor="middle" x="400" y="138">Görsel Yüklenemedi</text></svg>`;

function StarPicker({ value, onChange }) {
    const [hovered, setHovered] = useState(0);
    const labels = ['', 'Berbat', 'Kötü', 'İdare Eder', 'Çok İyi', 'Mükemmel'];

    return (
        <div className="star-picker" role="group" aria-label="Puan seç">
            {[1, 2, 3, 4, 5].map(n => (
                <button
                    key={n}
                    type="button"
                    className={`star-btn ${n <= (hovered || value) ? 'star-btn--active' : ''}`}
                    onClick={() => onChange(n)}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    aria-label={`${n} yıldız`}
                >
                    ★
                </button>
            ))}
            {(hovered || value) > 0 && (
                <span className="star-label">{labels[hovered || value]}</span>
            )}
        </div>
    );
}

function ReviewItem({ review }) {
    return (
        <div className="review-item">
            <div className="review-header">
                <div className="review-avatar">{review.user[0]?.toUpperCase()}</div>
                <div className="review-meta">
                    <span className="review-username">{review.user}</span>
                    <span className="review-date">{review.date}</span>
                </div>
                <div className="review-stars">
                    {[1, 2, 3, 4, 5].map(n => (
                        <span key={n} className={n <= review.score ? 'rstar-filled' : 'rstar-empty'}>★</span>
                    ))}
                </div>
            </div>
            <p className="review-text">"{review.text}"</p>
        </div>
    );
}

function PlaceModal({ place, onClose, onAddReview }) {
    const { currentUser, isLoggedIn, openLoginModal, openRegisterModal } = useUser();
    const [score, setScore] = useState(5);
    const [comment, setComment] = useState('');
    const [userName, setUserName] = useState('');
    const [imgError, setImgError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = useCallback(() => {
        setScore(5); setComment(''); setUserName(''); setImgError(false);
        onClose();
    }, [onClose]);

    const handleSubmit = async e => {
        e.preventDefault();
        const authorName = isLoggedIn ? currentUser.name : userName;
        if (!comment.trim() || !authorName.trim()) return;
        setIsSubmitting(true);
        await onAddReview(place.id, { user: authorName, text: comment, score });
        setScore(5); setComment(''); setUserName('');
        setIsSubmitting(false);
    };

    const avgRating = place.rating ? Number(place.rating).toFixed(1) : '0.0';

    return (
        <div className="modal-backdrop" onClick={handleClose}>
            <div className="modal-dialog" role="dialog" aria-modal="true"
                aria-label={place.title} onClick={e => e.stopPropagation()}>

                <button className="modal-close" onClick={handleClose} aria-label="Kapat">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Hero */}
                <div className="modal-hero">
                    <img
                        className="modal-hero-img"
                        src={imgError ? FALLBACK : (place.image || FALLBACK)}
                        alt={place.title}
                        onError={() => setImgError(true)}
                    />
                    <div className="modal-hero-overlay" />
                    <div className="modal-hero-content">
                        <h2 className="modal-title">{place.title}</h2>
                        <div className="modal-meta">
                            <div className="modal-stars-display">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <span key={n} className={n <= Math.round(place.rating) ? 'rstar-filled' : 'rstar-empty'}>★</span>
                                ))}
                            </div>
                            <span className="modal-avg">{avgRating}</span>
                            <span className="modal-count">({place.reviews?.length || 0} yorum)</span>
                        </div>
                        {place.link && (
                            <a
                                href={place.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="modal-visit-link"
                            >
                                Ziyaret Et
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className="modal-body">
                    {/* Reviews column */}
                    <div className="modal-col reviews-col">
                        <h3 className="col-heading">Ziyaretçi Yorumları</h3>
                        <div className="reviews-list">
                            {place.reviews?.length > 0
                                ? place.reviews.map(r => <ReviewItem key={r.id} review={r} />)
                                : (
                                    <div className="reviews-empty">
                                        <div className="reviews-empty-icon">💬</div>
                                        <p>Henüz yorum yok.</p>
                                        <span>İlk yorumu sen yap!</span>
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    {/* Form column */}
                    <div className="modal-col form-col">
                        <h3 className="col-heading">Deneyimini Paylaş</h3>
                        {isLoggedIn && (
                            <div className="review-author-chip">
                                <div className="review-author-dot" style={{ background: currentUser.color }} />
                                <span>{currentUser.name} olarak yorum yapıyorsun</span>
                            </div>
                        )}
                        <form className="review-form" onSubmit={handleSubmit}>
                            {!isLoggedIn ? (
                                <div className="review-login-prompt">
                                    <div className="review-prompt-icon">🔒</div>
                                    <p>Deneyimini paylaşmak için lütfen giriş yap veya hesap oluştur.</p>
                                    <div className="review-prompt-actions">
                                        <button type="button" className="btn-prompt-login" onClick={openLoginModal}>
                                            Giriş Yap
                                        </button>
                                        <button type="button" className="btn-prompt-register" onClick={openRegisterModal}>
                                            Hesap Oluştur
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <StarPicker value={score} onChange={setScore} />
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Bu mekan hakkında ne düşünüyorsun?"
                                        rows={4}
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="btn-review-submit"
                                        disabled={isSubmitting}>
                                        {isSubmitting ? 'Gönderiliyor...' : 'Yorumu Gönder ✨'}
                                    </button>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlaceModal;