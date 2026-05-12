import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SESSION_KEY = '_route';

export function useRoutePersist() {
  const location = useLocation();

  useEffect(() => {
    const fullPath = location.pathname + location.search + location.hash;
    sessionStorage.setItem(SESSION_KEY, fullPath);
  }, [location]);
}

export function getSavedRoute(): string {
  return sessionStorage.getItem(SESSION_KEY) ?? '/';
}
