# Enhanced TiptapEditor Component

A powerful, feature-rich rich text editor built with [Tiptap](https://tiptap.dev/) and React, featuring modern UI, file uploads, syntax highlighting, and much more.

## 🚀 Features

### ✨ Core Features
- **Rich Text Editing**: Bold, italic, underline, strikethrough, highlighting
- **Headers & Structure**: H1, H2, paragraphs, blockquotes
- **Lists**: Bullet lists, numbered lists, task lists with checkboxes (FIXED bullets rendering!)
- **Text Alignment**: Left, center, right alignment
- **Links & Media**: URL links, image uploads, file attachments
- **Tables**: Full table support with row/column management
- **Code**: Inline code and syntax-highlighted code blocks with 24+ languages
- **HTML View**: Toggle between visual and HTML source editing
- **HTML Templates**: Direct HTML template pasting support

### 🎨 Enhanced UI
- **Icon-based Toolbar**: Clean, modern interface with React Icons
- **Dark Mode Support**: Full dark/light theme compatibility
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Grouped Controls**: Logical organization of editing tools
- **Visual Feedback**: Active states, hover effects, and smooth transitions

### 🔧 Advanced Features
- **File Upload Support**: Custom image and file upload handlers
- **Syntax Highlighting**: Code blocks with language-specific highlighting for 24+ languages
- **Language Selector**: Dropdown to choose programming language for code blocks
- **Table Tools**: Context-sensitive table editing controls
- **Task Lists**: Interactive checkboxes for to-do items
- **HTML Template Pasting**: Direct paste support for HTML templates
- **Placeholder Text**: Helpful hints for empty content
- **Fixed List Rendering**: Ordered and unordered list bullets now display correctly
- **Keyboard Shortcuts**: Standard editing shortcuts supported

### 💻 Supported Programming Languages
JavaScript, TypeScript, Python, Java, C++, C#, PHP, Ruby, Go, Rust, Swift, Kotlin, Scala, Dart, SQL, JSON, YAML, HTML/XML, CSS, SCSS, Bash, PowerShell, Dockerfile, and Plain Text.

## 📦 Installation

The enhanced TiptapEditor uses the following packages (already installed):

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-text-style 
npm install @tiptap/extension-color @tiptap/extension-text-align @tiptap/extension-underline
npm install @tiptap/extension-image @tiptap/extension-link @tiptap/extension-code-block-lowlight
npm install @tiptap/extension-highlight @tiptap/extension-table @tiptap/extension-table-row
npm install @tiptap/extension-table-cell @tiptap/extension-table-header @tiptap/extension-task-list
npm install @tiptap/extension-task-item @tiptap/extension-placeholder lowlight react-icons highlight.js
```

## 🔧 Recent Fixes & Improvements

### ✅ Fixed Issues (Latest Update)
1. **List Bullets Rendering**: Fixed ordered and unordered list bullets not displaying
2. **Code Language Selection**: Added dropdown with 24+ programming languages
3. **HTML Template Pasting**: Now supports direct HTML template pasting
4. **Syntax Highlighting**: Enhanced with more languages and better styling
5. **Language Display**: Code blocks now show the selected language in toolbar and corner label

### 🆕 New Features Added
- **Language Selector Dropdown**: Click the code icon with dropdown arrow
- **HTML Template Button**: Dedicated button for pasting HTML templates
- **Current Language Display**: Shows selected language in toolbar when code block is active
- **Improved Code Styling**: Better visual styling for code blocks with language labels
- **Enhanced List Styles**: Fixed CSS for proper bullet and number rendering

## 🔧 Usage

### Basic Usage

```tsx
import React, { useState } from 'react';
import { TiptapEditor } from './components/TiptapEditor';

function MyComponent() {
  const [content, setContent] = useState('<p>Hello world!</p>');

  return (
    <TiptapEditor
      data={content}
      handleEditorChange={setContent}
      darkMode={false}
    />
  );
}
```

### Advanced Usage with File Uploads

```tsx
import React, { useState } from 'react';
import { TiptapEditor } from './components/TiptapEditor';

function AdvancedEditor() {
  const [content, setContent] = useState('<p>Start writing...</p>');
  const [darkMode, setDarkMode] = useState(false);

  const handleImageUpload = async (file: File): Promise<string> => {
    // Upload to your server or cloud storage
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    return data.url;
  };

  const handleFileAttach = async (file: File): Promise<string> => {
    // Upload file and return download URL
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload-file', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    return data.downloadUrl;
  };

  return (
    <TiptapEditor
      data={content}
      handleEditorChange={setContent}
      darkMode={darkMode}
      onImageUpload={handleImageUpload}
      onFileAttach={handleFileAttach}
    />
  );
}
```

## 🎛️ Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `data` | `string` | ✅ | HTML content to display in the editor |
| `handleEditorChange` | `(content: string) => void` | ✅ | Callback when content changes |
| `darkMode` | `boolean` | ❌ | Enable dark mode theme (default: false) |
| `onImageUpload` | `(file: File) => Promise<string>` | ❌ | Custom image upload handler |
| `onFileAttach` | `(file: File) => Promise<string>` | ❌ | Custom file attachment handler |

## 🎨 Styling

The editor includes comprehensive CSS styling in `TiptapEditor.css`:

- Syntax highlighting themes for light and dark modes
- Responsive table layouts
- Beautiful task list checkboxes
- Smooth animations and transitions
- Custom scrollbars
- Professional code block styling

### Dark Mode

Dark mode is fully supported and can be toggled via the `darkMode` prop. All UI elements, including syntax highlighting, adapt to the selected theme.

## 🛠️ Toolbar Features

### Text Formatting
- **Bold** (Ctrl+B): Make text bold
- **Italic** (Ctrl+I): Make text italic
- **Underline** (Ctrl+U): Underline text
- **Strikethrough**: Cross out text
- **Highlight**: Highlight text with yellow background

### Structure
- **H1/H2**: Create headings
- **Paragraph**: Normal paragraph text
- **Quote**: Blockquote formatting

### Lists
- **Bullet List**: Unordered list with bullets
- **Numbered List**: Ordered list with numbers
- **Task List**: Interactive todo list with checkboxes

### Alignment
- **Left/Center/Right**: Text alignment options

### Media & Links
- **Image Upload**: Upload images from device
- **Image URL**: Insert image from URL
- **Link**: Create hyperlinks
- **Attach File**: Upload and link files

### Advanced
- **Table**: Insert and edit tables
- **Inline Code**: Monospace code formatting
- **Code Block**: Multi-line code with syntax highlighting
- **HTML View**: Toggle raw HTML editing
- **Undo/Redo**: Standard editing history

## 📋 Table Editing

When a table is selected, additional tools appear:
- Add/remove columns and rows
- Delete entire table
- Merge and split cells
- Table navigation controls

## 💻 Code Highlighting

Supports syntax highlighting for many languages including:
- JavaScript/TypeScript
- Python
- HTML/CSS
- JSON
- Markdown
- And many more via lowlight

## 🔗 File Upload Integration

### Image Upload
```tsx
const handleImageUpload = async (file: File): Promise<string> => {
  // Your upload logic here
  // Return the URL of the uploaded image
  return 'https://example.com/uploaded-image.jpg';
};
```

### File Attachment
```tsx
const handleFileAttach = async (file: File): Promise<string> => {
  // Your upload logic here
  // Return the download URL for the file
  return 'https://example.com/download/file.pdf';
};
```

## ⌨️ Keyboard Shortcuts

- **Ctrl+B**: Bold
- **Ctrl+I**: Italic
- **Ctrl+U**: Underline
- **Ctrl+Z**: Undo
- **Ctrl+Y**: Redo
- **Tab**: Indent in lists
- **Shift+Tab**: Outdent in lists
- **Enter**: New line/list item
- **Shift+Enter**: Soft break

## 🌟 Example Component

See `TiptapEditorExample.tsx` for a complete implementation example with:
- Image upload handling
- File attachment handling
- Dark mode toggle
- Save functionality
- Feature showcase

## 🔧 Customization

The editor is highly customizable. You can:
- Add custom extensions
- Modify toolbar layout
- Customize styling via CSS
- Add custom upload handlers
- Extend functionality with Tiptap's extension system

## 📱 Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## 🎯 Best Practices

1. **File Uploads**: Always validate file types and sizes on both client and server
2. **Content Sanitization**: Sanitize HTML content before saving to database
3. **Error Handling**: Provide user feedback for upload failures
4. **Performance**: Consider lazy loading for large documents
5. **Accessibility**: Test with screen readers and keyboard navigation

## 🔗 Related Links

- [Tiptap Documentation](https://tiptap.dev/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Lowlight Syntax Highlighting](https://github.com/wooorm/lowlight)
- [TailwindCSS](https://tailwindcss.com/)

## 📄 License

This component is part of the Assist-UI project and follows the same license terms.