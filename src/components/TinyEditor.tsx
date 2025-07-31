import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  FaBold, 
  FaItalic, 
  FaUnderline, 
  FaAlignLeft, 
  FaAlignCenter, 
  FaAlignRight, 
  FaListUl, 
  FaListOl, 
  FaLink, 
  FaImage, 
  FaUpload, 
  FaCode, 
  FaEraser,
  FaTimes,
  FaCheck,
  FaSpinner,
  FaPalette,
  FaFont,
  FaHeading,
  FaQuoteLeft,
  FaTable,
  FaUndo,
  FaRedo,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

const media_url = process.env.REACT_APP_WHIZ_MEDIA_URL;
const ImageUpload = process.env.REACT_APP_ONEADMIN_API;

interface TinyEditorProps {
  data: string;
  handleEditorChange: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

interface ToolbarButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  title: string;
  isActive?: boolean;
  disabled?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ 
  onClick, 
  children, 
  title, 
  isActive = false,
  disabled = false 
}) => (
  <button
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center ${
      isActive 
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 shadow-sm' 
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
  >
    {children}
  </button>
);

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
  confirmText?: string;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ isOpen, onClose, title, children, onConfirm, confirmText = "Insert", isLoading = false, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full ${sizeClasses[size]} transform transition-all duration-300 scale-100`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FaCheck className="w-4 h-4" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const TinyEditor: React.FC<TinyEditorProps> = ({ 
  data, 
  handleEditorChange, 
  placeholder = "Start typing your content...",
  readOnly = false 
}) => {
  const [content, setContent] = useState(data);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [codeContent, setCodeContent] = useState('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isBgColorPickerOpen, setIsBgColorPickerOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedBgColor, setSelectedBgColor] = useState('#ffffff');
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [showPreview, setShowPreview] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update content when data prop changes
  useEffect(() => {
    setContent(data);
  }, [data]);

  // Update parent when content changes
  useEffect(() => {
    handleEditorChange(content);
  }, [content, handleEditorChange]);

  // Track undo/redo state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          if (!readOnly) {
            document.execCommand('undo', false);
            editorRef.current?.focus();
          }
        } else if (e.key === 'z' && e.shiftKey) {
          e.preventDefault();
          if (!readOnly) {
            document.execCommand('redo', false);
            editorRef.current?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [readOnly]);

  const execCommand = useCallback((command: string, value?: string) => {
    if (readOnly) return;
    
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    
    // Update undo/redo state
    setTimeout(() => {
      setCanUndo(document.queryCommandEnabled('undo'));
      setCanRedo(document.queryCommandEnabled('redo'));
    }, 100);
  }, [readOnly]);

  const updateContent = (newContent: string) => {
    setContent(newContent);
  };

  const insertHTML = (html: string) => {
    if (readOnly) return;
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const div = document.createElement('div');
      div.innerHTML = html;
      
      const fragment = document.createDocumentFragment();
      while (div.firstChild) {
        fragment.appendChild(div.firstChild);
      }
      
      range.insertNode(fragment);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    editorRef.current?.focus();
    
    // Update undo/redo state after insertion
    setTimeout(() => {
      setCanUndo(document.queryCommandEnabled('undo'));
      setCanRedo(document.queryCommandEnabled('redo'));
    }, 100);
  };

  const insertList = (type: 'ul' | 'ol') => {
    if (readOnly) return;
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // Check if we're already in a list
      let listItem = range.startContainer;
      while (listItem && listItem.nodeName !== 'LI') {
        listItem = listItem.parentNode as Node;
      }
      
      if (listItem) {
        // We're in a list, just change the type
        const list = listItem.parentNode as HTMLElement;
        if (list && (list.nodeName === 'UL' || list.nodeName === 'OL')) {
          const newList = document.createElement(type);
          while (list.firstChild) {
            newList.appendChild(list.firstChild);
          }
          list.parentNode?.replaceChild(newList, list);
        }
      } else {
        // Create new list
        const listItem = document.createElement('li');
        listItem.textContent = 'List item';
        
        const list = document.createElement(type);
        list.appendChild(listItem);
        
        range.deleteContents();
        range.insertNode(list);
        
        // Focus on the list item for editing
        const newRange = document.createRange();
        newRange.selectNodeContents(listItem);
        newRange.collapse(false);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
    editorRef.current?.focus();
  };

  const insertHeading = (level: number) => {
    if (readOnly) return;
    
    const tag = `h${level}`;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const heading = document.createElement(tag);
      heading.textContent = 'Heading ' + level;
      
      range.deleteContents();
      range.insertNode(heading);
      
      // Focus on the heading for editing
      const newRange = document.createRange();
      newRange.selectNodeContents(heading);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
    editorRef.current?.focus();
  };

  const insertTable = () => {
    if (readOnly) return;
    
    let tableHTML = '<table class="border-collapse border border-gray-300 dark:border-gray-600 w-full my-4">';
    
    for (let i = 0; i < tableRows; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < tableCols; j++) {
        const cellType = i === 0 ? 'th' : 'td';
        tableHTML += `<${cellType} class="border border-gray-300 dark:border-gray-600 p-2 text-left">`;
        tableHTML += i === 0 ? `Header ${j + 1}` : `Cell ${i}-${j}`;
        tableHTML += `</${cellType}>`;
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    
    insertHTML(tableHTML);
    setIsTableModalOpen(false);
  };

  const applyColor = (color: string, isBackground: boolean = false) => {
    const command = isBackground ? 'hiliteColor' : 'foreColor';
    execCommand(command, color);
    if (isBackground) {
      setSelectedBgColor(color);
    } else {
      setSelectedColor(color);
    }
  };

  const image_upload_handler = async (file: File): Promise<{url: string, width: number, height: number}> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', `${ImageUpload}/s3-file-upload`);
        
        xhr.onload = () => {
          if (xhr.status === 403) {
            reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
            return;
          }
          if (xhr.status < 200 || xhr.status >= 300) {
            reject('HTTP Error: ' + xhr.status);
            return;
          }
          const json = JSON.parse(xhr.responseText);
          if (!json || typeof json.url != 'string') {
            reject('Invalid JSON: ' + xhr.responseText);
            return;
          }
          let return_url = media_url + "/website/" + json.url;
          
          // Get image dimensions
          const img = new Image();
          img.onload = () => {
            resolve({
              url: return_url,
              width: img.width,
              height: img.height
            });
          };
          img.onerror = () => {
            resolve({
              url: return_url,
              width: 0,
              height: 0
            });
          };
          img.src = return_url;
        };
        
        xhr.onerror = () => {
          reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
        };
        
        const formData = new FormData();
        formData.append('file', base64);
        formData.append('fs3folderpath', 'website/');
        xhr.send(formData);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const imageData = await image_upload_handler(file);
      const dimensions = imageData.width > 0 && imageData.height > 0 
        ? ` (${imageData.width}×${imageData.height})` 
        : '';
      
      insertHTML(`<img src="${imageData.url}" alt="${file.name}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" title="Image dimensions: ${imageData.width}×${imageData.height}" />`);
      
      // Show dimensions info
      setTimeout(() => {
        alert(`Image uploaded successfully!${dimensions}`);
      }, 100);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLinkInsert = () => {
    if (linkUrl && linkText) {
      insertHTML(`<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${linkText}</a>`);
      setIsLinkModalOpen(false);
      setLinkUrl('');
      setLinkText('');
    }
  };

  const handleCodeInsert = () => {
    if (codeContent) {
      const escapedCode = codeContent
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      
      const highlightedCode = `<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto my-4"><code class="language-${codeLanguage} text-sm">${escapedCode}</code></pre>`;
      insertHTML(highlightedCode);
      setIsCodeModalOpen(false);
      setCodeContent('');
      setCodeLanguage('javascript');
    }
  };

  const handleImageInsert = () => {
    if (imageUrl) {
      insertHTML(`<img src="${imageUrl}" alt="${imageAlt || 'Image'}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />`);
      setIsImageModalOpen(false);
      setImageUrl('');
      setImageAlt('');
    }
  };

  const ColorPicker: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    selectedColor: string;
    onColorChange: (color: string) => void;
    onConfirm: () => void;
  }> = ({ isOpen, onClose, title, selectedColor, onColorChange, onConfirm }) => {
    if (!isOpen) return null;

    const colors = [
      '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
      '#ffa500', '#800080', '#008000', '#ffc0cb', '#a52a2a', '#808080', '#000080', '#800000'
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Custom Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => onColorChange(e.target.value)}
                  className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => onColorChange(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Colors</label>
              <div className="grid grid-cols-8 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => onColorChange(color)}
                    className="w-8 h-8 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 hover:shadow-lg transform hover:scale-105"
            >
              <FaCheck className="w-4 h-4" />
              <span>Apply</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-900">
      {/* Enhanced Toolbar */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-1 items-center">
          {/* History Group */}
          <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            <ToolbarButton 
              onClick={() => execCommand('undo')} 
              title="Undo (Ctrl+Z)"
              disabled={!canUndo}
            >
              <FaUndo className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton 
              onClick={() => execCommand('redo')} 
              title="Redo (Ctrl+Y)"
              disabled={!canRedo}
            >
              <FaRedo className="w-4 h-4" />
            </ToolbarButton>
          </div>

          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-2"></div>

          {/* Text Formatting Group */}
          <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            <ToolbarButton 
              onClick={() => execCommand('bold')} 
              title="Bold (Ctrl+B)"
            >
              <FaBold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton 
              onClick={() => execCommand('italic')} 
              title="Italic (Ctrl+I)"
            >
              <FaItalic className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton 
              onClick={() => execCommand('underline')} 
              title="Underline (Ctrl+U)"
            >
              <FaUnderline className="w-4 h-4" />
            </ToolbarButton>
          </div>

          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-2"></div>

          {/* Color Group */}
          <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            <ToolbarButton 
              onClick={() => setIsColorPickerOpen(true)} 
              title="Text Color"
            >
              <FaFont className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton 
              onClick={() => setIsBgColorPickerOpen(true)} 
              title="Background Color"
            >
              <FaPalette className="w-4 h-4" />
            </ToolbarButton>
          </div>

          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-2"></div>

          {/* Headings Group */}
          <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            <ToolbarButton onClick={() => insertHeading(1)} title="Heading 1">
              <FaHeading className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => insertHeading(2)} title="Heading 2">
              <span className="text-xs font-bold">H2</span>
            </ToolbarButton>
            <ToolbarButton onClick={() => insertHeading(3)} title="Heading 3">
              <span className="text-xs font-bold">H3</span>
            </ToolbarButton>
          </div>

          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-2"></div>

          {/* Alignment Group */}
          <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            <ToolbarButton onClick={() => execCommand('justifyLeft')} title="Align Left">
              <FaAlignLeft className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand('justifyCenter')} title="Align Center">
              <FaAlignCenter className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand('justifyRight')} title="Align Right">
              <FaAlignRight className="w-4 h-4" />
            </ToolbarButton>
          </div>

          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-2"></div>

          {/* Lists Group */}
          <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            <ToolbarButton onClick={() => insertList('ul')} title="Bullet List">
              <FaListUl className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => insertList('ol')} title="Numbered List">
              <FaListOl className="w-4 h-4" />
            </ToolbarButton>
          </div>

          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-2"></div>

          {/* Media Group */}
          <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            <ToolbarButton onClick={() => setIsLinkModalOpen(true)} title="Insert Link">
              <FaLink className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => setIsImageModalOpen(true)} title="Insert Image URL">
              <FaImage className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Upload Image">
              <FaUpload className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => setIsCodeModalOpen(true)} title="Insert Code">
              <FaCode className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => setIsTableModalOpen(true)} title="Insert Table">
              <FaTable className="w-4 h-4" />
            </ToolbarButton>
          </div>

          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-2"></div>

          {/* Block Elements */}
          <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            <ToolbarButton onClick={() => insertHTML('<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic">Quote text here</blockquote>')} title="Insert Quote">
              <FaQuoteLeft className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand('removeFormat')} title="Clear Formatting">
              <FaEraser className="w-4 h-4" />
            </ToolbarButton>
          </div>

          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-2"></div>

          {/* View Toggle */}
          <ToolbarButton 
            onClick={() => setShowPreview(!showPreview)} 
            title={showPreview ? "Edit Mode" : "Preview Mode"}
            isActive={showPreview}
          >
            {showPreview ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
          </ToolbarButton>
        </div>
      </div>

            {/* Enhanced Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable={!readOnly && !showPreview}
          className={`min-h-64 p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 prose prose-sm max-w-none dark:prose-invert ${
            readOnly || showPreview ? 'cursor-default' : ''
          }`}
          dangerouslySetInnerHTML={{ __html: content }}
          onInput={(e) => updateContent(e.currentTarget.innerHTML)}
          onBlur={(e) => updateContent(e.currentTarget.innerHTML)}
          style={{
            lineHeight: '1.6',
            fontSize: '14px'
          }}
        />
        {!content && !readOnly && !showPreview && (
          <div className="absolute top-6 left-6 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Enhanced Link Modal */}
      <Modal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        title="Insert Link"
        onConfirm={handleLinkInsert}
        confirmText="Insert Link"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Link Text</label>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter link text..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL</label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="https://example.com"
            />
          </div>
        </div>
      </Modal>

      {/* Enhanced Code Modal */}
      <Modal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        title="Insert Code Snippet"
        onConfirm={handleCodeInsert}
        confirmText="Insert Code"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Programming Language</label>
            <select
              value={codeLanguage}
              onChange={(e) => setCodeLanguage(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="javascript">JavaScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="csharp">C#</option>
              <option value="php">PHP</option>
              <option value="sql">SQL</option>
              <option value="bash">Bash</option>
              <option value="typescript">TypeScript</option>
              <option value="react">React</option>
              <option value="vue">Vue</option>
              <option value="json">JSON</option>
              <option value="yaml">YAML</option>
              <option value="markdown">Markdown</option>
              <option value="xml">XML</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Code</label>
            <textarea
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              className="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none"
              placeholder="Enter your code here..."
            />
          </div>
        </div>
      </Modal>

      {/* Enhanced Image Modal */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        title="Insert Image"
        onConfirm={handleImageInsert}
        confirmText="Insert Image"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alt Text (for accessibility)</label>
            <input
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Describe the image..."
            />
          </div>
        </div>
      </Modal>

      {/* Table Modal */}
      <Modal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        title="Insert Table"
        onConfirm={insertTable}
        confirmText="Insert Table"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rows</label>
              <input
                type="number"
                min="1"
                max="10"
                value={tableRows}
                onChange={(e) => setTableRows(parseInt(e.target.value) || 3)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Columns</label>
              <input
                type="number"
                min="1"
                max="10"
                value={tableCols}
                onChange={(e) => setTableCols(parseInt(e.target.value) || 3)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Color Pickers */}
      <ColorPicker
        isOpen={isColorPickerOpen}
        onClose={() => setIsColorPickerOpen(false)}
        title="Text Color"
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        onConfirm={() => {
          applyColor(selectedColor, false);
          setIsColorPickerOpen(false);
        }}
      />

      <ColorPicker
        isOpen={isBgColorPickerOpen}
        onClose={() => setIsBgColorPickerOpen(false)}
        title="Background Color"
        selectedColor={selectedBgColor}
        onColorChange={setSelectedBgColor}
        onConfirm={() => {
          applyColor(selectedBgColor, true);
          setIsBgColorPickerOpen(false);
        }}
      />

      {/* Enhanced Upload Progress */}
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl">
            <div className="flex items-center space-x-4">
              <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Uploading Image</h3>
                <p className="text-gray-600 dark:text-gray-400">Please wait while we process your image...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};