import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import '../css/LoginModal.css';

function LoginModal({ onClose, onSwitchToRegister }) {
    const { login, continueAsGuest } = useUser();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!username.trim() || !password.trim()) {
            setError('Lütfen tüm alanları doldurun.');
            return;
        }
        
        const res = login(username, password);
        if (res?.error) {
            setError(res.error);
        }
    };

    return (
        <div className="login-backdrop" onClick={onClose}>
            <div className="login-modal login-modal--sleek" onClick={e => e.stopPropagation()}>
                <button className="login-close" onClick={onClose} aria-label="Kapat">✕</button>

                <div className="login-header">
                    <div className="login-logo">
                        <span className="login-logo-mark">MEG</span>
                    </div>
                    <h2>Tekrar Hoşgeldin</h2>
                    <p>Devam etmek için hesabına giriş yap.</p>
                </div>

                <form className="login-form-sleek" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Kullanıcı Adı</label>
                        <input 
                            type="text" 
                            placeholder="Kullanıcı adınız..." 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Şifre</label>
                        <input 
                            type="password" 
                            placeholder="Şifreniz..." 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="login-error-msg">{error}</div>}

                    <button type="submit" className="btn-login-submit">
                        Giriş Yap →
                    </button>
                    
                    <div className="login-divider"><span>veya</span></div>

                    <button type="button" className="btn-guest-login" onClick={continueAsGuest}>
                        Misafir Olarak Devam Et
                    </button>
                </form>

                <div className="login-register-cta">
                    <span>Hesabın yok mu?</span>
                    <button type="button" className="btn-switch-link" onClick={onSwitchToRegister}>
                        Hemen Oluştur
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;
