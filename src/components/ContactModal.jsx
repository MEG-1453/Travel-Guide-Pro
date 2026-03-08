import React, { useState } from 'react';
import '../css/ContactModal.css';
import { useAppContext } from '../context/AppContext';

export default function ContactModal({ onClose }) {
    const { pushToast } = useAppContext();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = e =>
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            pushToast('Mesajınız başarıyla iletildi! En kısa sürede dönüş yapacağız. ✉️');
            onClose();
        }, 1500);
    };

    const isValid = formData.name.trim() && formData.email.trim() && formData.message.trim();

    return (
        <div className="contact-backdrop" onClick={onClose}>
            <div className="contact-modal" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="contact-modal-header">
                    <div className="contact-header-info">
                        <div className="contact-header-icon">✉️</div>
                        <div>
                            <h2 className="contact-title">İletişim</h2>
                            <p className="contact-sub">Sorularınız için bize ulaşın.</p>
                        </div>
                    </div>
                    <button className="contact-close" onClick={onClose} aria-label="Kapat">✕</button>
                </div>

                {/* Quick contact info bar */}
                <div className="contact-info-bar">
                    <a href="tel:+902121234567" className="contact-info-item">
                        <span className="contact-info-icon">📞</span>
                        <div>
                            <span className="contact-info-label">Telefon</span>
                            <span className="contact-info-value">+90 (212) 123 45 67</span>
                        </div>
                    </a>
                    <div className="contact-info-divider" />
                    <a href="mailto:merhaba@istanbulrehber.com" className="contact-info-item">
                        <span className="contact-info-icon">📧</span>
                        <div>
                            <span className="contact-info-label">E-posta</span>
                            <span className="contact-info-value">merhaba@istanbulrehber.com</span>
                        </div>
                    </a>
                </div>

                {/* Form */}
                <form className="contact-form" onSubmit={handleSubmit}>

                    <div className="contact-fields-row">
                        <div className="contact-field">
                            <label className="contact-label">Ad Soyad</label>
                            <input
                                type="text"
                                name="name"
                                className="contact-input"
                                placeholder="Adınız ve soyadınız"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="contact-field">
                            <label className="contact-label">Telefon <span className="contact-optional">(isteğe bağlı)</span></label>
                            <input
                                type="tel"
                                name="phone"
                                className="contact-input"
                                placeholder="+90 5XX XXX XX XX"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="contact-field">
                        <label className="contact-label">E-posta</label>
                        <input
                            type="email"
                            name="email"
                            className="contact-input"
                            placeholder="örnek@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="contact-field">
                        <label className="contact-label">Mesaj</label>
                        <textarea
                            name="message"
                            className="contact-textarea"
                            placeholder="Mesajınızı buraya yazın..."
                            rows={4}
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`contact-submit ${loading ? 'loading' : ''}`}
                        disabled={!isValid || loading}
                    >
                        {loading ? (
                            <>
                                <span className="contact-spinner" />
                                Gönderiliyor...
                            </>
                        ) : (
                            <>✉️ Mesajı Gönder</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
