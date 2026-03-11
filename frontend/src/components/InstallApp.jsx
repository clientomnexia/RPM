import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const InstallApp = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            setIsInstallable(true);
        });

        window.addEventListener('appinstalled', () => {
            setIsInstallable(false);
            setDeferredPrompt(null);
            console.log('PWA was installed');
        });
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    if (!isInstallable) return null;

    return (
        <button
            onClick={handleInstall}
            className="login-btn"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--secondary)',
                color: 'var(--dark)',
                border: 'none',
                padding: '0.5rem 1rem',
                fontSize: '0.8rem',
                marginRight: '0.5rem'
            }}
        >
            <Download size={16} /> Download App
        </button>
    );
};

export default InstallApp;
