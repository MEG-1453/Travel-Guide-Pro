import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useUser } from '../context/UserContext';
import '../css/AdminPanel.css';

const FALLBACK = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect fill="%23f1f5f9" width="120" height="80"/></svg>`;

const CATEGORY_LABELS = { mosque: 'Cami', landmark: 'Tarihi Yer', heritage: 'Miras & Türbe', food: 'Cafe & Restoran', halal_food: 'Helal Cafe & Restoran' };

// ─── Editable Place Card (Admin CRUD) ─────────────────────────

function PlaceAdminCard({ place, onUpdate, onDelete }) {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(place.title);
    const [description, setDescription] = useState(place.description);
    const [link, setLink] = useState(place.link || '');
    const [image, setImage] = useState(place.image || '');
    const [category, setCategory] = useState(place.category);
    const [saving, setSaving] = useState(false);
    const fileInputRef = React.useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Lütfen geçerli bir resim dosyası seçin.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => setImage(event.target.result);
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setSaving(true);
        await onUpdate(place.id, { 
            title: title.trim(), 
            description: description.trim(), 
            link: link.trim(), 
            image: image.trim(),
            category 
        });
        setSaving(false);
        setEditing(false);
    };

    return (
        <div className={`approved-card ${editing ? 'approved-card--editing' : ''}`}>
            <div className="approved-thumb">
                <img
                    src={typeof place.image === 'string' && !place.image.startsWith('data:') ? place.image : FALLBACK}
                    alt={place.title}
                    onError={e => { e.currentTarget.src = FALLBACK; }}
                />
            </div>

            {editing ? (
                <div className="approved-edit-form">
                    <div className="edit-photo-group">
                        <input
                            className="edit-input edit-img-url"
                            value={image}
                            onChange={e => setImage(e.target.value)}
                            placeholder="Görsel URL veya..."
                        />
                        <button 
                            type="button" 
                            className="btn-admin-file" 
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Dosya
                        </button>
                        <input 
                            type="file" 
                            accept="image/*" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            onChange={handleFileChange}
                        />
                    </div>
                    <input
                        className="edit-input"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Başlık"
                    />
                    <textarea
                        className="edit-textarea"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Açıklama"
                    />
                    <input
                        className="edit-input"
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        placeholder="Link (https://...)"
                        type="url"
                    />
                    <select
                        className="edit-select"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    >
                        <option value="mosque">🕌 Cami</option>
                        <option value="landmark">🏛 Tarihi Yer</option>
                        <option value="heritage">🏺 Miras & Türbe</option>
                        <option value="food">🍽️ Cafe & Restoran</option>
                        <option value="halal_food">🥙 Helal Cafe & Restoran</option>
                    </select>
                    <div className="edit-actions">
                        <button className="btn-edit-save" onClick={handleSave} disabled={saving}>
                            {saving ? 'Kaydediliyor...' : '✓ Kaydet'}
                        </button>
                        <button className="btn-edit-cancel" onClick={() => setEditing(false)} disabled={saving}>
                            İptal
                        </button>
                    </div>
                </div>
            ) : (
                <div className="approved-info">
                    <div className="approved-cat">{CATEGORY_LABELS[place.category] || 'Yer'}</div>
                    <h4 className="approved-title">{place.title}</h4>
                    <p className="approved-desc">{place.description}</p>
                    <div className="approved-meta">
                        ⭐ {place.rating || 0} · {place.reviews?.length || 0} yorum · {place.photos?.length || 0} fotoğraf
                    </div>
                </div>
            )}

            {!editing && (
                <div className="approved-actions">
                    <button className="btn-edit-place" onClick={() => setEditing(true)} title="Düzenle">
                        ✎ Düzenle
                    </button>
                    <button
                        className="btn-delete-place"
                        onClick={() => {
                            if (window.confirm(`"${place.title}" silinsin mi? Bu işlem geri alınamaz.`)) {
                                onDelete(place.id);
                            }
                        }}
                        title="Sil"
                    >
                        🗑 Sil
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Admin Panel ──────────────────────────────────────────────

function AdminPanel({ onClose, onApprove, onReject }) {
    const {
        pendingPlaces, placesData,
        handleUpdatePlace, handleDeletePlace,
    } = useAppContext();
    const { isAdmin } = useUser();
    const [tab, setTab] = useState('pending'); // 'pending' | 'approved'

    if (!isAdmin) return null;

    const staticCount = placesData.filter(p => p.id <= 1000).length;
    const communityCount = placesData.filter(p => p.id > 1000).length;

    return (
        <div className="admin-backdrop" onClick={onClose}>
            <aside className="admin-panel" onClick={e => e.stopPropagation()}
                role="complementary" aria-label="Admin Paneli">

                {/* Header */}
                <div className="admin-header">
                    <div className="admin-brand">
                        <span className="admin-brand-icon">⚙️</span>
                        <div>
                            <h2>Admin Paneli</h2>
                            <p>
                                {pendingPlaces.length > 0 && (
                                    <span className="pending-badge-count">{pendingPlaces.length}</span>
                                )}
                                {pendingPlaces.length > 0
                                    ? ` yer onay bekliyor`
                                    : 'Yönetici arayüzü'}
                            </p>
                        </div>
                    </div>
                    <button className="admin-close" onClick={onClose} aria-label="Kapat">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Tab bar */}
                <div className="admin-tab-bar">
                    <button
                        className={`admin-tab ${tab === 'pending' ? 'active' : ''}`}
                        onClick={() => setTab('pending')}
                    >
                        Bekleyenler
                        {pendingPlaces.length > 0 && <span className="tab-badge">{pendingPlaces.length}</span>}
                    </button>
                    <button
                        className={`admin-tab ${tab === 'approved' ? 'active' : ''}`}
                        onClick={() => setTab('approved')}
                    >
                        Tüm Yerler
                        <span className="tab-badge tab-badge--neutral">{placesData.length}</span>
                    </button>
                </div>

                {/* Content */}
                <div className="admin-content">
                    {tab === 'pending' && (
                        pendingPlaces.length === 0 ? (
                            <div className="admin-empty">
                                <div className="admin-empty-icon">✅</div>
                                <strong>Tüm öneriler işlendi!</strong>
                                <span>Yeni öneriler burada görünecek.</span>
                            </div>
                        ) : (
                            <div className="pending-list">
                                {pendingPlaces.map(place => (
                                    <div key={place.id} className="pending-card">
                                        <div className="pending-thumb">
                                            <img
                                                src={place.image || FALLBACK}
                                                alt={place.title}
                                                onError={e => { e.currentTarget.src = FALLBACK; }}
                                            />
                                        </div>
                                        <div className="pending-info">
                                            <div className="pending-badges">
                                                <span className="badge-pending">Beklemede</span>
                                                <span className="pending-date">{place.submittedAt}</span>
                                            </div>
                                            <h4 className="pending-title">{place.title}</h4>
                                            <p className="pending-desc">{place.description}</p>
                                        </div>
                                        <div className="pending-actions">
                                            <button className="btn-approve" onClick={() => onApprove(place.id)}>
                                                ✓ Onayla
                                            </button>
                                            <button className="btn-reject" onClick={() => onReject(place.id)}>
                                                ✕ Reddet
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}

                    {tab === 'approved' && (
                        <div className="approved-list">
                            <p className="approved-list-info">
                                {staticCount} sabit + {communityCount} topluluk yerinden oluşuyor.
                                <br />Silinen sabit yerler yeniden yüklemede geri döner.
                            </p>
                            {placesData.map(place => (
                                <PlaceAdminCard
                                    key={place.id}
                                    place={place}
                                    onUpdate={handleUpdatePlace}
                                    onDelete={handleDeletePlace}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}

export default AdminPanel;
