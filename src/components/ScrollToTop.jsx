import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname, hash, state } = useLocation();

    useEffect(() => {
        if (hash || state?.scrollToCarrito) return;
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, [pathname, hash, state]);

    return null;
}
