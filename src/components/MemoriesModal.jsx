import React, { useState, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { useAppContext } from '../context/AppContext';
import '../css/Memories.css';

const COMMENTS_PAGE = 5;
const COMMENTS_INIT = 3;

/* Avatar component */
function Avatar({ name, color, size = 38 }) {
    const initials = name?.[0]?.toUpperCase() || '?';
    return (
        <div
            className="mem-avatar"
            style={{ width: size, height: size, background: color, fontSize: size * 0.4 }}
        >
            {initials}
        </div>
    );
}

/* Single memory card */
function MemoryCard({ memory, currentUser, isAdmin, onLike, onDelete, onComment, onOpenLogin }) {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [liked, setLiked] = useState(memory.likedBy?.includes(currentUser?.id));
    // FIX 3: paginated comments — show first 3, then +5 per click
    const [visibleCount, setVisibleCount] = useState(COMMENTS_INIT);

    const isOwn = currentUser?.id === memory.authorId;
    const canDelete = isAdmin || isOwn;
    const engagement = (memory.likes || 0) + (memory.comments?.length || 0);
    const comments = memory.comments || [];
    const visibleComments = comments.slice(0, visibleCount);
    const hasMore = comments.length > visibleCount;

    const handleLike = () => {
        setLiked(l => !l);
        onLike(memory.id);
    };
    const handleComment = () => {
        if (!commentText.trim()) return;
        onComment(memory.id, commentText);
        setCommentText('');
    };

    return (
        <article className="mem-card">
            {/* Header */}
            <div className="mem-card-header">
                <Avatar name={memory.authorName} color={memory.authorColor} size={40} />
                <div className="mem-author-info">
                    <span className="mem-author-name">{memory.authorName}</span>
                    {memory.placeTitle && (
                        <span className="mem-place-tag">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                            {memory.placeTitle}
                        </span>
                    )}
                    <span className="mem-date">{memory.dateStr}</span>
                </div>
                {canDelete && (
                    <button className="mem-delete-btn" onClick={() => onDelete(memory.id)} aria-label="Sil">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                    </button>
                )}
            </div>

            {/* Body */}
            {memory.text && <p className="mem-text">{memory.text}</p>}
            {memory.image && (
                <div className="mem-image-wrap">
                    <img src={memory.image} alt="Hatıra" className="mem-image" loading="lazy" />
                </div>
            )}

            {/* Actions */}
            <div className="mem-actions">
                <button
                    className={`mem-like-btn ${liked ? 'liked' : ''}`}
                    onClick={handleLike}
                >
                    <span className="mem-heart">{liked ? '❤️' : '🤍'}</span>
                    <span>{memory.likes + (liked !== memory.likedBy?.includes(currentUser?.id) ? (liked ? 1 : -1) : 0)}</span>
                </button>
                <button
                    className={`mem-comment-toggle ${showComments ? 'active' : ''}`}
                    onClick={() => setShowComments(s => !s)}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                    {comments.length}
                </button>
                {engagement > 0 && (
                    <span className="mem-engagement">
                        {engagement} etkileşim
                    </span>
                )}
            </div>

            {/* Comments — paginated */}
            {showComments && (
                <div className="mem-comments">
                    {comments.length > 0 ? (
                        <>
                            {visibleComments.map(c => (
                                <div key={c.id} className="mem-comment-item">
                                    <Avatar name={c.authorName} color={c.authorColor} size={28} />
                                    <div className="mem-comment-body">
                                        <span className="mem-comment-author">{c.authorName}</span>
                                        <span className="mem-comment-text">{c.text}</span>
                                    </div>
                                </div>
                            ))}
                            {/* FIX 3: "View more" button instead of infinite growth */}
                            {hasMore && (
                                <button
                                    className="mem-load-more"
                                    onClick={() => setVisibleCount(n => n + COMMENTS_PAGE)}
                                >
                                    Daha fazla görüntüle ({comments.length - visibleCount} yorum daha)
                                </button>
                            )}
                        </>
                    ) : (
                        <p className="mem-comments-empty">Henüz yorum yok.</p>
                    )}

                    {currentUser?.role !== 'anonymous' ? (
                        <div className="mem-comment-form">
                            <input
                                className="mem-comment-input"
                                placeholder="Yorum yaz..."
                                value={commentText}
                                onChange={e => setCommentText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleComment()}
                            />
                            <button className="mem-comment-send" onClick={handleComment} disabled={!commentText.trim()}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                            </button>
                        </div>
                    ) : (
                        /* FIX 1: clickable "giriş yap" link */
                        <p className="mem-login-hint">
                            Yorum yapmak için{' '}
                            <button className="mem-login-link" onClick={onOpenLogin}>giriş yap</button>.
                        </p>
                    )}
                </div>
            )}
        </article>
    );
}

/* Composer: create a new memory */
function Composer({ place, onSubmit, currentUser, onOpenLogin }) {
    const [text, setText] = useState('');
    const [image, setImage] = useState('');
    const [imgPreview, setImgPreview] = useState('');
    const fileRef = useRef();

    const handleFile = e => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => { setImage(ev.target.result); setImgPreview(ev.target.result); };
        reader.readAsDataURL(file);
    };

    const handleSubmit = () => {
        if (!text.trim() && !image.trim()) return;
        onSubmit({
            text,
            image,
            placeId: place?.id || null,
            placeTitle: place?.title || null,
        });
        setText('');
        setImage('');
        setImgPreview('');
    };

    /* FIX 1: guest state — clickable "giriş yap" */
    if (currentUser?.role === 'anonymous') {
        return (
            <div className="mem-composer mem-composer--guest">
                <span>✦</span>
                <p>
                    Hatıranı paylaşmak için{' '}
                    <button className="mem-login-link" onClick={onOpenLogin}>giriş yap</button>.
                </p>
            </div>
        );
    }

    return (
        <div className="mem-composer">
            <Avatar name={currentUser.name} color={currentUser.color} size={40} />
            <div className="mem-composer-body">
                <textarea
                    className="mem-composer-text"
                    placeholder={place ? `${place.title} için bir hatıran var mı?` : 'Bir hatıra yaz...'}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    rows={3}
                />
                {imgPreview && (
                    <div className="mem-composer-preview">
                        <img src={imgPreview} alt="Önizleme" />
                        <button className="mem-composer-remove-img" onClick={() => { setImage(''); setImgPreview(''); }}>✕</button>
                    </div>
                )}
                <div className="mem-composer-actions">
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} hidden />
                    <button className="mem-composer-file-btn" onClick={() => fileRef.current?.click()}>
                        📷 Fotoğraf Ekle
                    </button>
                    <button
                        className="mem-composer-submit"
                        onClick={handleSubmit}
                        disabled={!text.trim() && !image}
                    >
                        Paylaş ✦
                    </button>
                </div>
            </div>
        </div>
    );
}

/* Main modal */
export default function MemoriesModal({ onClose }) {
    const { currentUser, isAdmin, openLoginModal } = useUser();
    const {
        memoriesData, activeMemoriesPlace,
        handleAddMemory, handleDeleteMemory,
        handleToggleMemoryLike, handleAddMemoryComment,
    } = useAppContext();

    // FIX 2: Strict filter logic
    // - Global feed (activeMemoriesPlace = null): show ALL memories
    // - Place feed: show ONLY memories tagged with that exact placeId (no global posts)
    const feed = [...memoriesData]
        .filter(m => activeMemoriesPlace ? m.placeId === activeMemoriesPlace.id : true)
        .sort((a, b) => {
            const engA = (a.likes || 0) + (a.comments?.length || 0);
            const engB = (b.likes || 0) + (b.comments?.length || 0);
            return engB !== engA ? engB - engA : b.createdAt - a.createdAt;
        });

    const title = activeMemoriesPlace ? `${activeMemoriesPlace.title} — Hatıralar` : 'Hatıralarımız ✦';

    return (
        <div className="mem-backdrop" onClick={onClose}>
            <div className="mem-modal" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="mem-header">
                    <div className="mem-header-info">
                        <span className="mem-header-icon">🤍</span>
                        <div>
                            <h2 className="mem-header-title">{title}</h2>
                            <p className="mem-header-sub">
                                {activeMemoriesPlace ? 'Bu mekana ait anılar' : 'Topluluktan tüm hatıralar'}
                                {' · '}{feed.length} paylaşım
                            </p>
                        </div>
                    </div>
                    <button className="mem-close" onClick={onClose} aria-label="Kapat">✕</button>
                </div>

                {/* Feed */}
                <div className="mem-body">
                    <Composer
                        place={activeMemoriesPlace}
                        onSubmit={handleAddMemory}
                        currentUser={currentUser}
                        onOpenLogin={openLoginModal}
                    />

                    {feed.length === 0 ? (
                        <div className="mem-empty">
                            <div className="mem-empty-icon">📷</div>
                            <p>
                                {activeMemoriesPlace
                                    ? `${activeMemoriesPlace.title} için henüz hatıra yok.`
                                    : 'Henüz bir hatıra paylaşılmamış.'}
                            </p>
                            <span>Bu mekanın ilk hatırasını sen yaz...</span>
                        </div>
                    ) : (
                        <div className="mem-feed">
                            {feed.map(m => (
                                <MemoryCard
                                    key={m.id}
                                    memory={m}
                                    currentUser={currentUser}
                                    isAdmin={isAdmin}
                                    onLike={handleToggleMemoryLike}
                                    onDelete={handleDeleteMemory}
                                    onComment={handleAddMemoryComment}
                                    onOpenLogin={openLoginModal}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
