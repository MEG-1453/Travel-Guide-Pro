import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import '../css/LoginModal.css';

function RegisterModal({ onClose, onSwitchToLogin }) {
    const { register } = useUser();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = register({ name, password });
        setLoading(false);
        if (result?.error) setError(result.error);
        // On success UserContext auto-logs in and closes register modal via state
    };

    return (
        <div className="login-backdrop" onClick={onClose}>
            <div className="login-modal" onClick={e => e.stopPropagation()}>
                <button className="login-close" onClick={onClose} aria-label="Kapat">✕</button>

                <div className="login-header">
                    <div className="login-logo">
                        <span className="login-logo-mark">MEG</span>
                        <span className="login-logo-sub">Travel Guide</span>
                    </div>
                    <h2>Hesap Oluştur</h2>
                    <p>Ücretsiz bir hesap oluşturarak yorum yap,<br />fotoğraf ekle ve yer öner.</p>
                </div>

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="register-field">
                        <label htmlFor="reg-name">Kullanıcı Adı</label>
                        <input
                            id="reg-name"
                            type="text"
                            placeholder="örn. Ayşe K."
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="register-field">
                        <label htmlFor="reg-pass">Şifre</label>
                        <input
                            id="reg-pass"
                            type="password"
                            placeholder="En az 4 karakter"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            minLength={4}
                            required
                        />
                    </div>
                    {error && <p className="register-error">⚠️ {error}</p>}
                    <button type="submit" className="btn-register-submit" disabled={loading}>
                        {loading ? 'Oluşturuluyor...' : 'Hesap Oluştur 🚀'}
                    </button>
                </form>

                <p className="login-switch-text">
                    Zaten hesabın var mı?{' '}
                    <button type="button" className="btn-switch-link" onClick={onSwitchToLogin}>
                        Giriş Yap
                    </button>
                </p>

                <p className="login-note">
                    🔒 Veriler yalnızca bu tarayıcıda saklanır — demo uygulaması.
                </p>
            </div>
        </div>
    );
}

export default RegisterModal;
