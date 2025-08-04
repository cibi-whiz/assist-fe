import React, { useState } from 'react';
import { TiptapEditor } from './TiptapEditor';

/**
 * Example component showing how to use the enhanced TiptapEditor
 * with image upload and file attachment handlers
 */
const TiptapEditorExample: React.FC = () => {
  const [content, setContent] = useState('<p>Start writing your content here...</p>');
  const [darkMode, setDarkMode] = useState(false);

  // Example image upload handler
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      // In a real application, you would upload to your server or cloud storage
      // For this example, we'll create a local object URL
      const url = URL.createObjectURL(file);
      
      // You could also upload to a service like AWS S3, Cloudinary, etc.
      // const formData = new FormData();
      // formData.append('image', file);
      // const response = await fetch('/api/upload-image', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();
      // return data.url;
      
      return url;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw new Error('Failed to upload image');
    }
  };

  // Example file attachment handler
  const handleFileAttach = async (file: File): Promise<string> => {
    try {
      // In a real application, you would upload to your server
      // For this example, we'll create a local object URL
      const url = URL.createObjectURL(file);
      
      // You could also upload to a service and return a download link
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await fetch('/api/upload-file', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();
      // return data.downloadUrl;
      
      return url;
    } catch (error) {
      console.error('File upload failed:', error);
      throw new Error('Failed to upload file');
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    console.log('Content updated:', newContent);
  };

  const handleSave = () => {
    // Save content to your backend
    console.log('Saving content:', content);
    alert('Content saved successfully!');
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Enhanced Tiptap Editor
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Professional rich text editor with modern UI and advanced features
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              flex items-center gap-2 hover:scale-105
              ${darkMode
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
              }
            `}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button
            onClick={handleSave}
            className="
              px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium
              transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25
              border border-blue-500
            "
          >
            💾 Save Content
          </button>
        </div>
      </div>

      <div className={`
        ${darkMode ? 'bg-gray-800/40' : 'bg-white/60'} 
        rounded-xl p-4 backdrop-blur-lg border
        ${darkMode ? 'border-gray-700/50' : 'border-gray-200/60'}
        shadow-lg
      `}>
        <TiptapEditor
          data={content}
          handleEditorChange={handleContentChange}
          darkMode={darkMode}
          onImageUpload={handleImageUpload}
          onFileAttach={handleFileAttach}
        />
      </div>

      <div className={`
        mt-8 p-6 rounded-xl border backdrop-blur-sm
        ${darkMode 
          ? 'bg-gray-800/40 border-gray-700/50' 
          : 'bg-white/60 border-gray-200/60'
        }
      `}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🎨 Enhanced Features
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            'Image Upload', 'File Attachments', '24+ Programming Languages', 'HTML Template Modal',
            'Language Selector', 'Fixed List Bullets', 'Tables with Tools', 'Task Lists',
            'Text & Background Colors', 'Font Family Selection', 'Modern Dark Mode', 'Compact Design',
            'Responsive Design', 'Accessibility', 'Syntax Highlighting', 'Professional Modals',
            'URL Image Modal', 'Enhanced Icons', 'Clean Focus', 'Color Pickers'
          ].map((feature) => (
            <div 
              key={feature}
              className={`
                flex items-center gap-2 p-2 rounded-lg text-sm font-medium
                ${darkMode 
                  ? 'bg-gray-700/30 text-gray-200' 
                  : 'bg-gray-50 text-gray-700'
                }
              `}
            >
              <span className="text-green-500">✅</span>
              {feature}
            </div>
          ))}
        </div>
      </div>

      <div className={`
        mt-6 p-6 rounded-xl border backdrop-blur-sm
        ${darkMode 
          ? 'bg-green-900/20 border-green-800/50' 
          : 'bg-green-50/80 border-green-200/60'
        }
      `}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
          💻 Programming Languages (24+)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {[
            'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#',
            'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
            'Scala', 'Dart', 'SQL', 'JSON', 'YAML', 'HTML/XML',
            'CSS', 'SCSS', 'Bash', 'PowerShell', 'Dockerfile', 'Plain Text'
          ].map((lang) => (
            <div 
              key={lang}
              className={`
                px-2 py-1 rounded-lg text-xs font-medium text-center
                ${darkMode 
                  ? 'bg-green-800/30 text-green-200 border border-green-700/50' 
                  : 'bg-green-100 text-green-800 border border-green-200'
                }
              `}
            >
              {lang}
            </div>
          ))}
        </div>
      </div>

      <div className={`
        mt-6 p-6 rounded-xl border backdrop-blur-sm
        ${darkMode 
          ? 'bg-blue-900/20 border-blue-800/50' 
          : 'bg-blue-50/80 border-blue-200/60'
        }
      `}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
          🚀 Quick Tips
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: '📷', text: 'Upload images from your device or paste URLs using the image buttons' },
            { icon: '📁', text: 'Attach files using the enhanced file upload button' },
            { icon: '🎨', text: 'Change text and background colors with professional color pickers' },
            { icon: '🔤', text: 'Choose from 15+ font families for your text styling' },
            { icon: '💻', text: 'Select from 24+ programming languages for code blocks' },
            { icon: '📝', text: 'Insert HTML templates using the enhanced modal interface' },
            { icon: '📋', text: 'List bullets render properly with nested support' },
            { icon: '👁️', text: 'Toggle between rich text and HTML source view' },
            { icon: '🏗️', text: 'Insert and manage tables with comprehensive tools' },
            { icon: '✅', text: 'Create interactive task lists and checkboxes' }
          ].map((tip, index) => (
            <div 
              key={index}
              className={`
                flex items-start gap-3 p-3 rounded-lg
                ${darkMode 
                  ? 'bg-blue-800/20 text-blue-200' 
                  : 'bg-blue-50 text-blue-800'
                }
              `}
            >
              <span className="text-lg">{tip.icon}</span>
              <span className="text-sm">{tip.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`
        mt-6 p-6 rounded-xl border backdrop-blur-sm
        ${darkMode 
          ? 'bg-yellow-900/20 border-yellow-800/50' 
          : 'bg-yellow-50/80 border-yellow-200/60'
        }
      `}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
          ⚡ Code Block Features
        </h3>
        <div className="space-y-3">
          {[
            'Click the code dropdown to select from 24+ programming languages',
            'Syntax highlighting works automatically based on selected language',
            'Current language is displayed in the toolbar when code block is selected',
            'Language label appears in the top-right corner of code blocks',
            'Supports popular languages: JS, TS, Python, Java, C++, C#, PHP, Ruby, Go, Rust, Swift, and more'
          ].map((feature, index) => (
            <div 
              key={index}
              className={`
                flex items-start gap-3 p-3 rounded-lg
                ${darkMode 
                  ? 'bg-yellow-800/20 text-yellow-200' 
                  : 'bg-yellow-50 text-yellow-800'
                }
              `}
            >
              <span className="text-yellow-500 font-bold">•</span>
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`
        mt-6 p-6 rounded-xl border backdrop-blur-sm
        ${darkMode 
          ? 'bg-purple-900/20 border-purple-800/50' 
          : 'bg-purple-50/80 border-purple-200/60'
        }
      `}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>
          🎨 New Style Features
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: '🎨', title: 'Text Colors', desc: 'Choose from 43+ colors for your text with an intuitive color picker' },
            { icon: '🖌️', title: 'Background Colors', desc: 'Highlight text with background colors using the same color palette' },
            { icon: '📝', title: 'Font Families', desc: 'Select from 15 professional fonts including Google Fonts and system fonts' },
            { icon: '🪟', title: 'Professional Modals', desc: 'Clean, accessible modals for URL input and HTML template insertion' },
            { icon: '🎯', title: 'Enhanced Icons', desc: 'Updated icons for better visual clarity and user experience' },
            { icon: '⚡', title: 'Smart Focus', desc: 'Improved focus management and keyboard navigation throughout the editor' }
          ].map((item, index) => (
            <div 
              key={index}
              className={`
                p-4 rounded-lg border
                ${darkMode 
                  ? 'bg-purple-800/20 text-purple-200 border-purple-700/50' 
                  : 'bg-purple-50 text-purple-800 border-purple-200'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm opacity-90">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TiptapEditorExample;