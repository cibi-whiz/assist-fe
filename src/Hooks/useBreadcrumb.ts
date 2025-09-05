import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export interface BreadcrumbItem {
  label: string;
  path: string;
  isLast?: boolean;
}

/**
 * Custom hook to generate breadcrumb items based on the current pathname.
 * @param pathname current location pathname (from react-router)
 */
export const useBreadcrumb = (pathname: string): BreadcrumbItem[] => {
  const { t } = useTranslation('common');

  return useMemo(() => {
    if (!pathname || pathname === '/') return [];

    // split and clean segments
    const segments = pathname.split('/').filter(Boolean);

    return segments.map((segment, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/');

      return {
        label: t(`navigation.${segment}`, segment), // try translation, fallback to segment
        path,
        isLast: index === segments.length - 1,
      };
    });
  }, [pathname, t]);
};
