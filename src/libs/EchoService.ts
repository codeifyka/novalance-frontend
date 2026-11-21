import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

(window as any).Pusher = Pusher;

let echoInstance: Echo<'reverb'> | null = null;
let currentToken: string | null = null;

export function getEcho(token: string): Echo<'reverb'> {
    if (echoInstance && currentToken === token) {
        return echoInstance;
    }

    if (echoInstance) {
        try {
            echoInstance.disconnect();
        } catch (_) {}
    }

    currentToken = token;

    const host = import.meta.env.VITE_REVERB_HOST || window.location.hostname || 'localhost';
    const port = Number(import.meta.env.VITE_REVERB_PORT || 8080);
    const key = import.meta.env.VITE_REVERB_APP_KEY || 'x7cyvbtycl4guwhlopka';
    const scheme = import.meta.env.VITE_REVERB_SCHEME || 'http';

    echoInstance = new Echo({
        broadcaster: 'reverb',
        key: key,
        wsHost: host,
        wsPort: port,
        wssPort: port,
        forceTLS: scheme === 'https',
        enabledTransports: ['ws', 'wss'],
        authEndpoint: '/api/broadcasting/auth',
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        },
    });

    return echoInstance;
}

export function disconnectEcho() {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
    }
}
