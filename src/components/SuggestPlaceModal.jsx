import React, { useState, useCallback } from 'react';
import '../css/SuggestModal.css';

const CATEGORIES = [
    { value: 'mosque', label: '🕌 Cami' },
    { value: 'landmark', label: '🏛️ Tarihi Yer' },
    { value: 'heritage', label: '🌙 Miras & Türbe' },
    { value: 'food', label: '🍽️ Cafe & Restoran' },
];

function SuggestPlaceModal({ onClose, onSubmit }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('landmark');
    const [imageError, setImageError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = React.useRef(null);

    const handleClose = useCallback(() => {
        setTitle(''); setDescription(''); setImage('');
        setCategory('landmark'); setImageError(false);
        onClose();
    }, [onClose]);

    const handleSubmit = async e => {
        e.preventDefault();
        if (!title.trim() || !description.trim() || imageError) return;
        setIsSubmitting(true);
        await onSubmit({ title, description, image, category });
        setIsSubmitting(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setImageError(true);
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setImage(event.target.result);
            setImageError(false);
        };
        reader.onerror = () => setImageError(true);
        reader.readAsDataURL(file);
    };

    return (
        <div className="suggest-backdrop" onClick={handleClose}>
            <div className="suggest-modal" role="dialog" aria-modal="true"
                aria-label="Yeni Yer Öner" onClick={e => e.stopPropagation()}>

                <button className="suggest-close" onClick={handleClose} aria-label="Kapat">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                <div className="suggest-header">
                    <div className="suggest-icon-wrap">✦</div>
                    <h2>Yeni Yer Öner</h2>
                    <p>Önerilerin yönetici onayından sonra haritaya eklenir.</p>
                </div>

                <form className="suggest-form" onSubmit={handleSubmit}>
                    {/* Image URL + preview */}
                    <div className="suggest-field">
                        <label>Fotoğraf</label>
                        <div className="suggest-img-group">
                            <input
                                type="url"
                                placeholder="URL yapıştır (https://...)"
                                value={image}
                                onChange={e => { setImageError(false); setImage(e.target.value); }}
                            />
                            <span className="suggest-img-or">veya</span>
                            <button 
                                type="button" 
                                className="btn-suggest-file"
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
                        {image && (
                            <div className="suggest-image-preview">
                                <img
                                    src={image}
                                    alt="Önizleme"
                                    onLoad={() => setImageError(false)}
                                    onError={() => setImageError(true)}
                                />
                                {imageError && <p className="suggest-img-error">⚠️ Geçerli görsel URL'si değil.</p>}
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div className="suggest-field">
                        <label htmlFor="suggest-title">Yer Adı <span aria-hidden>*</span></label>
                        <input
                            id="suggest-title"
                            type="text"
                            placeholder="örn. Süleymaniye Camii"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="suggest-field">
                        <label>Kategori</label>
                        <div className="suggest-categories">
                            {CATEGORIES.map(c => (
                                <label
                                    key={c.value}
                                    className={`suggest-cat-option ${category === c.value ? 'active' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="suggest-category"
                                        value={c.value}
                                        checked={category === c.value}
                                        onChange={() => setCategory(c.value)}
                                    />
                                    {c.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="suggest-field">
                        <label htmlFor="suggest-desc">Açıklama <span aria-hidden>*</span></label>
                        <textarea
                            id="suggest-desc"
                            placeholder="Bu mekan neden özel?"
                            rows={3}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-suggest-submit"
                        disabled={isSubmitting || imageError || !title.trim() || !description.trim()}
                    >
                        {isSubmitting ? 'Gönderiliyor...' : 'Öneriyi Gönder 🚀'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SuggestPlaceModal;
