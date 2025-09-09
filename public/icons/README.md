# Icon System

This directory contains a comprehensive collection of SVG icons organized for easy use in the Assist Module application.

## Structure

- **icons.json**: Contains metadata for all 1,225 available icons
- **SVG files**: Individual icon files in SVG format
- **Categories**: Icons are organized into 20 logical categories

## Available Categories

- **Actions**: add, edit, delete, save, cancel, refresh, search, filter, sort
- **Business**: briefcase, building, office, team, organization, chart
- **Communication**: chat, message, mail, phone, video, call, notification
- **Education**: book, learn, study, school, university, course
- **Entertainment**: game, music, movie, tv, entertainment, fun
- **Files**: file, folder, document, upload, download, attachment
- **Finance**: money, payment, wallet, bank, credit, dollar, euro
- **Health**: heart, medical, health, fitness, sport, exercise
- **Location**: location, map, gps, pin, marker, place
- **Media**: image, video, audio, camera, gallery, play, pause
- **Navigation**: arrow, direction, move, back, forward, up, down, left, right
- **Security**: lock, shield, key, password, secure, privacy
- **Settings**: settings, config, preferences, gear, tool, wrench
- **Shopping**: cart, bag, basket, shop, store, product
- **Social**: facebook, twitter, instagram, linkedin, youtube, github
- **Status**: check, close, warning, error, info, success, pending
- **Technology**: code, programming, database, server, cloud, api
- **Time**: time, clock, calendar, schedule, timer, date
- **UI**: menu, layout, grid, list, view, panel, sidebar, dashboard
- **Other**: Miscellaneous icons that don't fit into specific categories

## Usage

### Using the IconPicker Component

```tsx
import IconPicker from '../components/IconPicker';

const MyComponent = () => {
  const [selectedIcon, setSelectedIcon] = useState('');
  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIconPickerOpen(true)}>
        Choose Icon
      </Button>
      
      <IconPicker
        open={iconPickerOpen}
        onClose={() => setIconPickerOpen(false)}
        onSelect={setSelectedIcon}
        selectedIcon={selectedIcon}
        title="Select an Icon"
      />
    </>
  );
};
```

### Using Icon Utilities

```tsx
import { 
  getAllIcons, 
  getIconsByCategory, 
  searchIcons, 
  getIconByName,
  getCategories 
} from '../utils/iconUtils';

// Get all icons
const allIcons = getAllIcons();

// Get icons by category
const actionIcons = getIconsByCategory('actions');

// Search icons
const searchResults = searchIcons('arrow');

// Get specific icon
const icon = getIconByName('arrow-right-line');

// Get all categories
const categories = getCategories();
```

### Direct Icon Usage

```tsx
import { getIconByName } from '../utils/iconUtils';

const MyIcon = ({ iconName }: { iconName: string }) => {
  const icon = getIconByName(iconName);
  
  if (!icon) return null;
  
  return (
    <img 
      src={icon.path} 
      alt={icon.displayName}
      className="w-6 h-6"
    />
  );
};
```

## Icon Naming Convention

Icons follow a consistent naming pattern:
- **Format**: `{name}-{variant}-{style}.svg`
- **Examples**: 
  - `arrow-right-line.svg` (line style)
  - `arrow-right-fill.svg` (filled style)
  - `menu-line.svg` (line style)
  - `menu-fill.svg` (filled style)

## Integration with Forms

The icon system is already integrated with the Assist Module form in `MenuDrawer.tsx`. The form includes an icon selection field that opens the IconPicker modal.

## Customization

To add new icons:
1. Add the SVG file to this directory
2. Update the `icons.json` file with the new icon metadata
3. Run the icon generation script if available

## Performance Considerations

- Icons are loaded on-demand when the IconPicker is opened
- The icons.json file is imported statically for fast access
- SVG files are served as static assets
- Consider lazy loading for large icon collections

## Browser Support

- All modern browsers support SVG
- Fallback handling is included for missing icons
- Responsive design works across all screen sizes
