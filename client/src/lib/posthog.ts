import posthog from 'posthog-js';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Inicializa PostHog y captura eventos básicos automáticamente
export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      autocapture: true,      // captura clics y formularios básicos
      capture_pageview: true, // captura páginas vistas automáticamente
      loaded: (ph) => console.log('PostHog cargado', ph),
    });
  }
};

// Función para enviar eventos personalizados
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties);
  }
};

// Función para identificar usuario
export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    posthog.identify(userId);
    if (properties) posthog.people.set(properties);
  }
};

// Hook para trackear páginas vistas en Next.js
export const usePageTracking = () => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      posthog.capture('$pageview', { path: url });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
};
