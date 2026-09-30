'use client';

import { useEffect } from 'react';

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('SkillReady PWA ServiceWorker registered with scope:', reg.scope);
          })
          .catch((err) => {
            console.error('SkillReady PWA ServiceWorker registration failed:', err);
          });
      });
    }
  }, []);

  return null;
}
