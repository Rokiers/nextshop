'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function WelcomeToast() {
  useEffect(() => {
    // ignore if screen height is too small
    if (window.innerHeight < 650) return;
    if (!document.cookie.includes('welcome-toast=2')) {
      toast('🛍️ Welcome to Next.js Shop!', {
        id: 'welcome-toast',
        duration: Infinity,
        onDismiss: () => {
          document.cookie = 'welcome-toast=2; max-age=31536000; path=/';
        },
        description: (
          <>
            This is a high-performance, SSR storefront powered by Next.js and your own database.{' '}
            <a
              href="https://nextjs.org/docs"
              className="text-blue-600 hover:underline"
              target="_blank"
            >
              Learn more
            </a>
            .
          </>
        )
      });
    }
  }, []);

  return null;
}