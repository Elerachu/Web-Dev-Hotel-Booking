import { useEffect } from 'react';

// Sets the browser tab title and swaps the favicon for the current page.

export function usePageMeta(title, favicon = '/favicon.svg') {
  useEffect(() => {
    document.title = title ? `${title} | Hotel admin` : 'Hotel admin';

    const link = document.getElementById('favicon');
    if (link) link.setAttribute('href', favicon);
  }, [title, favicon]);
}
