# Internationalization (i18n) Setup

This project uses `react-i18next` for internationalization support. The setup includes proper namespace organization, language detection, and a language switcher component.

## Structure

```
src/i18n/
├── index.ts                    # Main i18n configuration
├── resources/
│   ├── en/                    # English translations
│   │   ├── common.json        # Common UI elements
│   │   ├── abandonedCart.json # Abandoned cart specific
│   │   ├── dashboard.json     # Dashboard specific
│   │   └── roles.json         # Roles and permissions
│   └── es/                    # Spanish translations
│       ├── common.json
│       └── abandonedCart.json
└── README.md                  # This file
```

## Configuration

The i18n configuration is set up in `src/i18n/index.ts` with the following features:

- **Namespaces**: Organized by feature (common, abandonedCart, dashboard, roles)
- **Fallback Language**: English (en)
- **Language Detection**: Manual with localStorage persistence
- **Interpolation**: React-safe (no escaping needed)

## Usage

### Basic Translation

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation(['common', 'abandonedCart']);
  
  return (
    <div>
      <h1>{t('title', { ns: 'abandonedCart' })}</h1>
      <button>{t('common.buttons.save')}</button>
    </div>
  );
}
```

### With Interpolation

```tsx
// In translation file: "Welcome back, {{name}}!"
const message = t('welcome', { name: user.name });
```

### Language Switching

```tsx
import { useLanguage } from '../Hooks/useLanguage';

function LanguageSwitcher() {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  
  return (
    <select onChange={(e) => changeLanguage(e.target.value)}>
      {availableLanguages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
}
```

## Adding New Languages

1. Create a new language directory in `src/i18n/resources/` (e.g., `fr/` for French)
2. Copy the English JSON files and translate them
3. Update `src/i18n/index.ts` to import and include the new language:

```typescript
import frCommon from './resources/fr/common.json';
import frAbandonedCart from './resources/fr/abandonedCart.json';

const resources = {
  // ... existing languages
  fr: {
    common: frCommon,
    abandonedCart: frAbandonedCart,
    dashboard: enDashboard, // Fallback to English
    roles: enRoles, // Fallback to English
  },
};
```

4. Add the language to the `availableLanguages` array in `src/Hooks/useLanguage.ts`

## Adding New Namespaces

1. Create a new JSON file in each language directory
2. Import it in `src/i18n/index.ts`
3. Add it to the resources object for each language
4. Update the `ns` array in the i18n configuration

## Best Practices

1. **Namespace Organization**: Group translations by feature/page
2. **Key Naming**: Use dot notation for nested keys (e.g., `buttons.save`)
3. **Fallback Strategy**: Always provide English fallbacks for missing translations
4. **Consistent Structure**: Keep the same key structure across all languages
5. **Context**: Use descriptive keys that indicate context (e.g., `table.actions.edit`)

## Language Switcher Component

The `LanguageSwitcher` component is available in `src/components/LanguageSwitcher.tsx` and provides:

- Dropdown with flag icons and language names
- Keyboard navigation support
- Dark mode compatibility
- Automatic language persistence

## Available Languages

Currently supported languages:
- 🇺🇸 English (en) - Default
- 🇪🇸 Spanish (es)

## Language Detection

The system uses the following detection order:
1. localStorage (`i18nextLng`)
2. Default language (English)

Language preference is automatically saved to localStorage when changed.

## Integration with Components

The i18n system is integrated throughout the application:

- **App.tsx**: LanguageProvider wraps the entire app
- **AppBar.tsx**: Language switcher in the header
- **Components**: All text uses translation keys
- **Hooks**: useLanguage hook for language management

## Development

When adding new text to components:

1. Add the translation key to the appropriate namespace JSON file
2. Use the `t()` function with the correct namespace
3. Test with different languages to ensure proper display
4. Update all language files to maintain consistency

## Troubleshooting

- **Missing translations**: Check console for missing key warnings
- **Namespace errors**: Ensure the namespace is included in the `useTranslation` hook
- **Language not switching**: Check localStorage and browser console for errors
- **Fallback issues**: Verify English translations exist for all keys
