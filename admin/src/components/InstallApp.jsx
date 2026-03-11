import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const InstallApp = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        });

        window.addEventListener('appinstalled', () => {
            setIsInstallable(false);
            setDeferredPrompt(null);
        });
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    if (!isInstallable) return null;

    return (
        <button
            onClick={handleInstall}
            className="install-btn"
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'rgba(212, 175, 55, 0.1)',
                color: '#d4af37',
                border: '1px solid #d4af37',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '1rem',
                fontSize: '0.9rem',
                fontWeight: '600'
            }}
        >
            <Download size={20} /> Download App
        </button>
    );
};

export default InstallApp;
