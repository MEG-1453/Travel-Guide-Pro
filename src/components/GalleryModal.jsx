import React, { useState, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import '../css/GalleryModal.css';

const FALLBACK = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="220" viewBox="0 0 300 220"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23e2e8f0"/><stop offset="100%" style="stop-color:%23cbd5e1"/></linearGradient></defs><rect width="300" height="220" fill="url(%23g)"/><text fill="%2394a3b8" font-family="sans-serif" font-size="13" text-anchor="middle" x="150" y="115">Görsel Yüklenemedi</text></svg>`;

// ─── Individual Photo Card ────────────────────────────────────

function PhotoCard({ photo, placeId, onToggleLike, onAddComment, onDeletePhoto, onLightbox, isAdmin }) {
    const { currentUser, isLoggedIn } = useUser();
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isLiked, setIsLiked] = useState(photo.likedBy?.includes(currentUser.id));
    const [likeCount, setLikeCount] = useState(photo.likes || 0);
    const [likeAnim, setLikeAnim] = useState(false);

    const handleLike = async () => {
        const nowLiked = !isLiked;
        setIsLiked(nowLiked);
        setLikeCount(c => nowLiked ? c + 1 : c - 1);
        setLikeAnim(true);
        setTimeout(() => setLikeAnim(false), 600);
        await onToggleLike(placeId, photo.id);
    };

    const handleComment = async e => {
        e.preventDefault();
        if (!commentText.trim()) return;
        if (!isLoggedIn) return; // guard — should not reach this since input is hidden
        await onAddComment(placeId, photo.id, commentText.trim());
        setCommentText('');
    };

    const comments = photo.comments || [];

    return (
        <div className="photo-card">
            {/* Attribution */}
            <div className="photo-card-header">
                <div className="photo-avatar" style={{ backgroundColor: photo.addedColor || '#94a3b8' }}>
                    {(photo.addedBy || 'M')[0].toUpperCase()}
                </div>
                <div className="photo-meta">
                    <span className="photo-author">{photo.addedBy || 'Misafir'}</span>
                    <span className="photo-date">{photo.addedAt}</span>
                </div>
                {/* Admin delete button */}
                {isAdmin && (
                    <button
                        className="btn-photo-delete"
                        onClick={() => onDeletePhoto(placeId, photo.id)}
                        title="Fotoğrafı sil"
                        aria-label="Fotoğrafı sil"
                    >
                        🗑
                    </button>
                )}
            </div>

            {/* Photo */}
            <div className="photo-card-img-wrap" onClick={() => onLightbox(photo.url)}>
                <img
                    src={photo.url}
                    alt={`${photo.addedBy} tarafından eklendi`}
                    onError={e => { e.currentTarget.src = FALLBACK; }}
                    loading="lazy"
                />
                <div className="photo-card-zoom">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="white" strokeWidth="2" strokeLinecap="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                </div>
            </div>

            {/* Actions */}
            <div className="photo-card-actions">
                <button
                    className={`btn-like ${isLiked ? 'btn-like--active' : ''} ${likeAnim ? 'btn-like--pop' : ''}`}
                    onClick={handleLike}
                    aria-label={`Beğen (${likeCount})`}
                >
                    <span className="like-heart">{isLiked ? '♥' : '♡'}</span>
                    <span className="like-count">{likeCount}</span>
                </button>

                <button
                    className={`btn-comment-toggle ${showComments ? 'active' : ''}`}
                    onClick={() => setShowComments(v => !v)}
                    aria-label={`Yorumlar (${comments.length})`}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>{comments.length}</span>
                </button>
            </div>

            {/* Comments section */}
            {showComments && (
                <div className="photo-comments">
                    {comments.length > 0
                        ? comments.map(c => (
                            <div key={c.id} className="comment-item">
                                <span className="comment-author">{c.user}</span>
                                <span className="comment-text">{c.text}</span>
                            </div>
                        ))
                        : <p className="comments-empty">Henüz yorum yok.</p>
                    }

                    {/* Only logged-in users can comment */}
                    {isLoggedIn ? (
                        <form className="comment-form" onSubmit={handleComment}>
                            <input
                                className="comment-input"
                                type="text"
                                placeholder={`${currentUser.name} olarak yorum yap...`}
                                value={commentText}
                                onChange={e => setCommentText(e.target.value)}
                                maxLength={200}
                            />
                            <button type="submit" className="btn-comment-send" disabled={!commentText.trim()}>
                                →
                            </button>
                        </form>
                    ) : (
                        <div className="comment-login-hint">
                            <span>💬</span>
                            <span>Yorum yapmak için <strong>giriş yap</strong></span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Gallery Modal ────────────────────────────────────────────

function GalleryModal({ place, onClose, onAddPhoto, onToggleLike, onAddComment, onDeletePhoto }) {
    const { currentUser, isLoggedIn, isAdmin } = useUser();
    const [photoUrl, setPhotoUrl] = useState('');
    const [inputVisible, setInputVisible] = useState(false);
    const [urlError, setUrlError] = useState(false);
    const fileInputRef = React.useRef(null);
    const [isAdding, setIsAdding] = useState(false);
    const [lightbox, setLightbox] = useState(null);

    const handleClose = useCallback(() => {
        setPhotoUrl(''); setInputVisible(false); setUrlError(false); setLightbox(null);
        onClose();
    }, [onClose]);

    const handleAddPhoto = async e => {
        e.preventDefault();
        if (!photoUrl.trim() || urlError) return;
        setIsAdding(true);
        await onAddPhoto(place.id, photoUrl.trim());
        setPhotoUrl(''); setInputVisible(false); setUrlError(false);
        setIsAdding(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setUrlError(true);
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setPhotoUrl(event.target.result);
            setUrlError(false);
        };
        reader.onerror = () => setUrlError(true);
        reader.readAsDataURL(file);
    };

    const photos = place.photos || [];

    return (
        <>
            <div className="gallery-backdrop" onClick={handleClose}>
                <div className="gallery-modal" onClick={e => e.stopPropagation()}>

                    {/* Sticky header */}
                    <div className="gallery-header">
                        <div className="gallery-title-group">
                            <span className="gallery-icon">📸</span>
                            <div>
                                <h2>{place.title}</h2>
                                <p className="gallery-subtitle">
                                    {photos.length > 0
                                        ? `${photos.length} topluluk fotoğrafı`
                                        : 'İlk fotoğrafı ekle!'}
                                </p>
                            </div>
                        </div>
                        <div className="gallery-header-actions">
                            {/* Anyone (even guest) can add photos */}
                            <button className="btn-add-photo" onClick={() => setInputVisible(v => !v)}>
                                {inputVisible ? '✕ İptal' : '+ Fotoğraf Ekle'}
                            </button>
                            <button className="gallery-close" onClick={handleClose} aria-label="Kapat">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* URL Input form — anyone can add photos */}
                    {inputVisible && (
                        <form className="photo-url-form" onSubmit={handleAddPhoto}>
                            <div className="photo-url-field">
                                <div className="photo-input-group">
                                    <input
                                        type="url"
                                        autoFocus
                                        placeholder="Fotoğraf URL'sini yapıştır (https://...)"
                                        value={photoUrl}
                                        onChange={e => { setUrlError(false); setPhotoUrl(e.target.value); }}
                                    />
                                    <span className="photo-input-or">veya</span>
                                    <button 
                                        type="button" 
                                        className="btn-select-file"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Dosyadan Seç ⬆️
                                    </button>
                                </div>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    ref={fileInputRef} 
                                    style={{ display: 'none' }} 
                                    onChange={handleFileChange}
                                />
                                {photoUrl && (
                                    <img
                                        className="url-preview-thumb"
                                        src={photoUrl}
                                        alt="Önizleme"
                                        onLoad={() => setUrlError(false)}
                                        onError={() => setUrlError(true)}
                                    />
                                )}
                                {urlError && <p className="url-error">⚠️ Geçerli bir görsel URL'si değil.</p>}
                            </div>
                            <button
                                type="submit"
                                className="btn-submit-photo"
                                disabled={isAdding || urlError || !photoUrl}
                            >
                                {isAdding ? 'Ekleniyor...' : 'Galeriye Ekle 📸'}
                            </button>
                        </form>
                    )}

                    {/* Photos grid */}
                    {photos.length > 0 ? (
                        <div className="photos-grid">
                            {photos.map(photo => (
                                <PhotoCard
                                    key={photo.id}
                                    photo={photo}
                                    placeId={place.id}
                                    onToggleLike={onToggleLike}
                                    onAddComment={onAddComment}
                                    onDeletePhoto={onDeletePhoto}
                                    onLightbox={setLightbox}
                                    isAdmin={isAdmin}
                                />
                            ))}
                        </div>
                    ) : (
                        !inputVisible && (
                            <div className="gallery-empty">
                                <div className="gallery-empty-icon">🖼️</div>
                                <p>Henüz fotoğraf eklenmemiş.</p>
                                <button className="btn-add-photo" onClick={() => setInputVisible(true)}>
                                    + İlk fotoğrafı ekle
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
                    <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
                    <img
                        src={lightbox}
                        alt="Tam boyut"
                        className="lightbox-image"
                        onClick={e => e.stopPropagation()}
                        onError={e => { e.currentTarget.src = FALLBACK; }}
                    />
                </div>
            )}
        </>
    );
}

export default GalleryModal;
