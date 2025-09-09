import iconsData from '../Assets/icons.json';

export interface IconData {
  name: string;
  category: string;
  path: string;
  importPath: string;
  displayName: string;
}

/**
 * Get all available icons
 */
export const getAllIcons = (): IconData[] => {
  return iconsData.allIcons;
};

/**
 * Get icons by category
 */
export const getIconsByCategory = (category: string): IconData[] => {
  if (category === 'all') {
    return iconsData.allIcons;
  }
  return (iconsData.icons as Record<string, IconData[]>)[category] || [];
};

/**
 * Search icons by name or display name
 */
export const searchIcons = (searchTerm: string): IconData[] => {
  const term = searchTerm.toLowerCase();
  return iconsData.allIcons.filter(icon => 
    icon.name.toLowerCase().includes(term) ||
    icon.displayName.toLowerCase().includes(term)
  );
};

/**
 * Get icon by name
 */
export const getIconByName = (name: string): IconData | undefined => {
  return iconsData.allIcons.find(icon => icon.name === name);
};

/**
 * Get all available categories
 */
export const getCategories = (): string[] => {
  return iconsData.categories;
};

/**
 * Get total number of icons
 */
export const getTotalIconCount = (): number => {
  return iconsData.total;
};

/**
 * Filter icons by search term and category
 */
export const filterIcons = (searchTerm: string, category: string = 'all'): IconData[] => {
  let filtered = iconsData.allIcons;
  
  if (category !== 'all') {
    filtered = filtered.filter(icon => icon.category === category);
  }
  
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(icon => 
      icon.name.toLowerCase().includes(term) ||
      icon.displayName.toLowerCase().includes(term)
    );
  }
  
  return filtered;
};

/**
 * Get icon import path for dynamic imports
 */
export const getIconImportPath = (iconName: string): string => {
  const icon = getIconByName(iconName);
  return icon ? icon.importPath : '';
};

/**
 * Get icon display name
 */
export const getIconDisplayName = (iconName: string): string => {
  const icon = getIconByName(iconName);
  return icon ? icon.displayName : iconName;
};
