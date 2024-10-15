import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import posthog from 'posthog-js';

export default function usePageViews() {
  let location = useLocation();
  useEffect(() => {
    posthog.capture('$pageview');
  }, [location]);
}

