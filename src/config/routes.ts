/**
 * Route configuration for page titles
 * This centralizes all route-to-title mappings for easy maintenance
 */

export interface RouteConfig {
  path: string;
  translationKey: string;
  fallbackTitle?: string;
}

export const ROUTE_CONFIG: Record<string, RouteConfig> = {
  '/dashboard': {
    path: '/dashboard',
    translationKey: 'navigation.dashboard',
    fallbackTitle: 'Dashboard'
  },
  '/dm/abandonedcart': {
    path: '/dm/abandonedcart',
    translationKey: 'navigation.abandonedCart',
    fallbackTitle: 'Abandoned Cart'
  },
  '/roles-and-permission': {
    path: '/roles-and-permission',
    translationKey: 'navigation.rolesAndPermissions',
    fallbackTitle: 'Roles and Permissions'
  },
  '/assist-users': {
    path: '/assist-users',
    translationKey: 'navigation.assist-users',
    fallbackTitle: 'Assist Users'
  },
  // Add new routes here as the app grows
  // Example:
  // '/new-feature': {
  //   path: '/new-feature',
  //   translationKey: 'navigation.newFeature',
  //   fallbackTitle: 'New Feature'
  // },
};

/**
 * Get page title for a given route
 * @param pathname - Current route path
 * @param t - Translation function
 * @param fallbackTitle - Fallback title if no translation found
 * @returns Page title string
 */
export const getPageTitle = (
  pathname: string, 
  t: (key: string) => string, 
  fallbackTitle: string = 'Assist'
): string => {
  // Check if we have a specific configuration for this route
  const routeConfig = ROUTE_CONFIG[pathname];
  
  if (routeConfig) {
    const translatedTitle = t(routeConfig.translationKey);
    
    // If translation exists and is different from the key, use it
    if (translatedTitle && translatedTitle !== routeConfig.translationKey) {
      return translatedTitle;
    }
    
    // Use fallback title from config
    return routeConfig.fallbackTitle || fallbackTitle;
  }
  
  // Fallback: Try to get translation from path segments
  const pathSegments = pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  const translationKey = `navigation.${lastSegment}`;
  const translatedTitle = t(translationKey);
  
  // If translation exists and is different from the key, use it
  if (translatedTitle && translatedTitle !== translationKey) {
    return translatedTitle;
  }
  
  // Final fallback
  return fallbackTitle;
};
