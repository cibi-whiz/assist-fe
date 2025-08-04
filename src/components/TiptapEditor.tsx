import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import FontFamily from '@tiptap/extension-font-family';
import { createLowlight, common } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import php from 'highlight.js/lib/languages/php';
import ruby from 'highlight.js/lib/languages/ruby';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import swift from 'highlight.js/lib/languages/swift';
import kotlin from 'highlight.js/lib/languages/kotlin';
import scala from 'highlight.js/lib/languages/scala';
import dart from 'highlight.js/lib/languages/dart';
import sql from 'highlight.js/lib/languages/sql';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import scss from 'highlight.js/lib/languages/scss';
import bash from 'highlight.js/lib/languages/bash';
import powershell from 'highlight.js/lib/languages/powershell';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import './TiptapEditor.css';
import {
  FaBold, FaItalic, FaUnderline, FaStrikethrough, FaImage, FaLink, FaCode, FaListUl, 
  FaListOl, FaAlignLeft, FaAlignCenter, FaAlignRight, FaUndo, FaRedo, FaHighlighter,
  FaTable, FaEye, FaEyeSlash, FaTasks, FaFont, FaTimes, FaCheck,
  FaFileUpload, FaFileCode, FaExternalLinkAlt, FaPaintBrush
} from 'react-icons/fa';
import { 
  MdCode, MdTitle, MdFormatQuote, MdFormatColorText
} from 'react-icons/md';

interface TiptapEditorProps {
  data: string;
  handleEditorChange: (content: string) => void;
  darkMode?: boolean;
  onImageUpload?: (file: File) => Promise<string>;
  onFileAttach?: (file: File) => Promise<string>;
}

// Setup syntax highlighting with comprehensive language support
const lowlight = createLowlight(common);

// Register additional languages
lowlight.register('javascript', javascript);
lowlight.register('typescript', typescript);
lowlight.register('python', python);
lowlight.register('java', java);
lowlight.register('cpp', cpp);
lowlight.register('csharp', csharp);
lowlight.register('php', php);
lowlight.register('ruby', ruby);
lowlight.register('go', go);
lowlight.register('rust', rust);
lowlight.register('swift', swift);
lowlight.register('kotlin', kotlin);
lowlight.register('scala', scala);
lowlight.register('dart', dart);
lowlight.register('sql', sql);
lowlight.register('json', json);
lowlight.register('yaml', yaml);
lowlight.register('xml', xml);
lowlight.register('css', css);
lowlight.register('scss', scss);
lowlight.register('bash', bash);
lowlight.register('powershell', powershell);
lowlight.register('dockerfile', dockerfile);

// Register aliases
lowlight.registerAlias('js', ['javascript']);
lowlight.registerAlias('ts', ['typescript']);
lowlight.registerAlias('py', ['python']);
lowlight.registerAlias('c++', ['cpp']);
lowlight.registerAlias('c#', ['csharp']);
lowlight.registerAlias('rb', ['ruby']);
lowlight.registerAlias('yml', ['yaml']);
lowlight.registerAlias('html', ['xml']);
lowlight.registerAlias('sh', ['bash']);
lowlight.registerAlias('shell', ['bash']);
lowlight.registerAlias('ps1', ['powershell']);

// Available languages for the selector
const AVAILABLE_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'scala', label: 'Scala' },
  { value: 'dart', label: 'Dart' },
  { value: 'sql', label: 'SQL' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'xml', label: 'HTML/XML' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'bash', label: 'Bash' },
  { value: 'powershell', label: 'PowerShell' },
  { value: 'dockerfile', label: 'Dockerfile' },
  { value: 'plaintext', label: 'Plain Text' },
];

// Available font families
const FONT_FAMILIES = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Monaco', label: 'Monaco' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Source Code Pro', label: 'Source Code Pro' },
];

// Common colors for text and background
const COLORS = [
  '#000000', '#1f2937', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6', '#ffffff',
  '#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d', '#16a34a', '#059669', '#0d9488',
  '#0891b2', '#0284c7', '#2563eb', '#4f46e5', '#7c3aed', '#9333ea', '#c026d3', '#db2777',
  '#e11d48', '#f43f5e', '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
  '#d946ef', '#ec4899', '#f43f5e'
];

const TiptapEditor: React.FC<TiptapEditorProps> = ({ 
  data, 
  handleEditorChange, 
  darkMode = false,
  onImageUpload,
  onFileAttach
}) => {
  const [showHtmlView, setShowHtmlView] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showFontSelector, setShowFontSelector] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [showHtmlModal, setShowHtmlModal] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [htmlInput, setHtmlInput] = useState('');
  const [modalType, setModalType] = useState<'image' | 'html'>('image');
  const imageFileRef = useRef<HTMLInputElement>(null);
  const attachmentFileRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        codeBlock: false, // Disable default code block to use syntax highlighting
      }),
      TextStyle,
      Color.configure({ types: [TextStyle.name, 'heading'] }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'plaintext',
        HTMLAttributes: {
          class: 'bg-gray-100 dark:bg-gray-800 rounded-md p-3 font-mono text-sm',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
    ],
    content: data,
    onUpdate: ({ editor }) => {
      handleEditorChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] max-h-[400px] overflow-y-auto p-4 ${
          darkMode 
            ? 'prose-invert bg-gray-800 text-white border-gray-600' 
            : 'bg-white text-gray-900 border-gray-300'
        } border rounded-lg`,
      },
      handlePaste: (view, event, slice) => {
        // Allow pasting HTML content
        return false; // Let the default paste handler work
      },
      transformPastedHTML: (html) => {
        // Allow HTML templates to be pasted
        return html;
      },
    },
  });

  React.useEffect(() => {
    if (editor && data !== editor.getHTML()) {
      editor.commands.setContent(data);
    }
  }, [data, editor]);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setShowLanguageSelector(false);
      setShowFontSelector(false);
      setShowTextColorPicker(false);
      setShowBgColorPicker(false);
    };

    if (showLanguageSelector || showFontSelector || showTextColorPicker || showBgColorPicker) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showLanguageSelector, showFontSelector, showTextColorPicker, showBgColorPicker]);

  if (!editor) {
    return null;
  }

  // Enhanced image handling with file upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageUpload) {
      try {
        const url = await onImageUpload(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Image upload failed. Please try again.');
      }
    } else if (file) {
      // Fallback to URL.createObjectURL for local preview
      const url = URL.createObjectURL(file);
      editor.chain().focus().setImage({ src: url }).run();
    }
    // Reset file input
    if (imageFileRef.current) {
      imageFileRef.current.value = '';
    }
  };

  const addImage = () => {
    imageFileRef.current?.click();
  };

  const addImageByUrl = () => {
    setModalType('image');
    setUrlInput('');
    setShowUrlModal(true);
  };

  const handleFileAttachment = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileAttach) {
      try {
        const url = await onFileAttach(file);
        editor.chain().focus().setLink({ href: url }).run();
      } catch (error) {
        console.error('File attachment failed:', error);
        alert('File attachment failed. Please try again.');
      }
    }
    // Reset file input
    if (attachmentFileRef.current) {
      attachmentFileRef.current.value = '';
    }
  };

  const addAttachment = () => {
    attachmentFileRef.current?.click();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter the URL:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const toggleHtmlView = () => {
    setShowHtmlView(!showHtmlView);
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const insertCodeBlock = (language = 'plaintext') => {
    editor.chain().focus().toggleCodeBlock({ language }).run();
    setShowLanguageSelector(false);
  };

  const setCodeBlockLanguage = (language: string) => {
    if (editor.isActive('codeBlock')) {
      editor.chain().focus().updateAttributes('codeBlock', { language }).run();
    } else {
      insertCodeBlock(language);
    }
    setShowLanguageSelector(false);
  };

  const pasteHtmlTemplate = () => {
    setHtmlInput('');
    setShowHtmlModal(true);
  };

  // Modal component that renders outside the editor using portals
  const Modal = ({ 
    isOpen, 
    onClose, 
    children 
  }: { 
    isOpen: boolean; 
    onClose: () => void; 
    children: React.ReactNode; 
  }) => {
    if (!isOpen) return null;
    
    return createPortal(
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] modal-backdrop"
        onClick={onClose}
      >
        <div onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>,
      document.body
    );
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      if (modalType === 'image') {
        editor.chain().focus().setImage({ src: urlInput.trim() }).run();
      }
      setShowUrlModal(false);
      setUrlInput('');
    }
  };

  const handleHtmlSubmit = () => {
    if (htmlInput.trim()) {
      editor.chain().focus().insertContent(htmlInput.trim()).run();
      setShowHtmlModal(false);
      setHtmlInput('');
    }
  };

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setShowTextColorPicker(false);
  };

  const setFontFamily = (fontFamily: string) => {
    editor.chain().focus().setFontFamily(fontFamily).run();
    setShowFontSelector(false);
  };

  // Background color function (we'll simulate it with highlight)
  const setBackgroundColor = (color: string) => {
    editor.chain().focus().toggleHighlight({ color }).run();
    setShowBgColorPicker(false);
  };

  const getCurrentCodeLanguage = () => {
    if (editor.isActive('codeBlock')) {
      const attrs = editor.getAttributes('codeBlock');
      return attrs.language || 'plaintext';
    }
    return null;
  };

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children,
    variant = 'default'
  }: {
    onClick: (e?: React.MouseEvent) => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    variant?: 'default' | 'primary' | 'danger';
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-2 py-1.5 rounded-md font-medium text-sm transition-all duration-150 
        flex items-center justify-center min-w-[2rem] h-8
        ${isActive
          ? variant === 'primary'
            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
            : variant === 'danger' 
            ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
            : 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
          : darkMode
          ? 'bg-gray-700/40 text-gray-200 hover:bg-gray-600 hover:text-white hover:shadow-sm backdrop-blur-sm'
          : 'bg-white/60 text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm backdrop-blur-sm'
        } 
        ${!isActive && (darkMode ? 'border border-gray-600/40' : 'border border-gray-200/50')}
        disabled:opacity-40 disabled:cursor-not-allowed
        hover:scale-102 active:scale-98
      `}
    >
      <div className="flex items-center gap-1">
        {children}
      </div>
    </button>
  );

  const Separator = () => (
    <div className={`w-px h-4 ${darkMode ? 'bg-gray-600/30' : 'bg-gray-300/50'} mx-1 my-auto rounded-full`}></div>
  );

  const ToolbarGroup = ({ 
    children, 
    label 
  }: { 
    children: React.ReactNode; 
    label?: string;
  }) => (
    <div className={`
      flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg
      ${darkMode ? 'bg-gray-800/20' : 'bg-gray-50/40'}
      border ${darkMode ? 'border-gray-700/30' : 'border-gray-200/40'}
      backdrop-blur-sm
    `}>
      {label && (
        <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-0.5`}>
          {label}
        </span>
      )}
      {children}
    </div>
  );

  const MenuBar = () => (
    <div className={`
      tiptap-toolbar border-b p-2 rounded-t-lg
      ${darkMode 
        ? 'border-gray-700/50 bg-gray-800/60 backdrop-blur-xl' 
        : 'border-gray-200/80 bg-white/80 backdrop-blur-xl'
      }
      shadow-sm
    `}>
      {/* Main Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Text Formatting Group */}
        <ToolbarGroup label="Format">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            disabled={!editor.can().chain().focus().toggleBold().run()}
          >
            <FaBold />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
          >
            <FaItalic />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
          >
            <FaUnderline />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
          >
            <FaStrikethrough />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive('highlight')}
          >
            <FaHighlighter />
          </ToolbarButton>
        </ToolbarGroup>

        <Separator />

        {/* Colors and Fonts */}
        <ToolbarGroup label="Style">
          <div className="relative">
            <ToolbarButton
              onClick={(e) => {
                e?.stopPropagation();
                setShowTextColorPicker(!showTextColorPicker);
              }}
              isActive={showTextColorPicker}
            >
              <MdFormatColorText />
            </ToolbarButton>
            
            {showTextColorPicker && (
              <div className={`
                absolute top-full left-0 mt-2 z-50 p-3 dropdown-content
                ${darkMode ? 'bg-gray-800/95 border-gray-600/50' : 'bg-white/95 border-gray-200/60'} 
                border rounded-xl shadow-2xl backdrop-blur-xl
              `} onClick={(e) => e.stopPropagation()}>
                <div className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Text Color
                </div>
                <div className="color-picker-grid">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setTextColor(color)}
                      className="color-picker-button"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <ToolbarButton
              onClick={(e) => {
                e?.stopPropagation();
                setShowBgColorPicker(!showBgColorPicker);
              }}
              isActive={showBgColorPicker}
            >
              <FaPaintBrush />
            </ToolbarButton>
            
            {showBgColorPicker && (
              <div className={`
                absolute top-full left-0 mt-2 z-50 p-3 dropdown-content
                ${darkMode ? 'bg-gray-800/95 border-gray-600/50' : 'bg-white/95 border-gray-200/60'} 
                border rounded-xl shadow-2xl backdrop-blur-xl
              `} onClick={(e) => e.stopPropagation()}>
                <div className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Background Color
                </div>
                <div className="color-picker-grid">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBackgroundColor(color)}
                      className="color-picker-button"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <ToolbarButton
              onClick={(e) => {
                e?.stopPropagation();
                setShowFontSelector(!showFontSelector);
              }}
              isActive={showFontSelector}
            >
              <FaFont />
            </ToolbarButton>
            
            {showFontSelector && (
              <div className={`
                absolute top-full left-0 mt-2 z-50 w-48 dropdown-content
                ${darkMode ? 'bg-gray-800/95 border-gray-600/50' : 'bg-white/95 border-gray-200/60'} 
                border rounded-xl shadow-2xl backdrop-blur-xl max-h-48 overflow-y-auto
              `} onClick={(e) => e.stopPropagation()}>
                <div className="p-2">
                  {FONT_FAMILIES.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => setFontFamily(font.value)}
                      className={`
                        w-full px-3 py-2 text-left text-sm rounded-lg mb-1 transition-colors
                        ${darkMode 
                          ? 'text-gray-200 hover:bg-gray-700/60 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }
                      `}
                      style={{ fontFamily: font.value }}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ToolbarGroup>

        <Separator />

        {/* Headers and Structure */}
        <ToolbarGroup label="Structure">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
          >
            <MdTitle className="text-lg" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
          >
            <MdTitle className="text-base" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            isActive={editor.isActive('paragraph')}
          >
            <span className="text-sm font-medium">P</span>
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
          >
            <MdFormatQuote />
          </ToolbarButton>
        </ToolbarGroup>

        <Separator />

        {/* Lists */}
        <ToolbarGroup label="Lists">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
          >
            <FaListUl />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
          >
            <FaListOl />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive('taskList')}
          >
            <FaTasks />
          </ToolbarButton>
        </ToolbarGroup>

        <Separator />

        {/* Alignment */}
        <ToolbarGroup label="Align">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
          >
            <FaAlignLeft />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
          >
            <FaAlignCenter />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
          >
            <FaAlignRight />
          </ToolbarButton>
        </ToolbarGroup>

        <Separator />

        {/* Media and Links */}
        <ToolbarGroup label="Media">
          <ToolbarButton
            onClick={addImage}
          >
            <FaImage />
          </ToolbarButton>

          <ToolbarButton
            onClick={addImageByUrl}
          >
            <FaExternalLinkAlt />
          </ToolbarButton>

          <ToolbarButton
            onClick={setLink}
            isActive={editor.isActive('link')}
          >
            <FaLink />
          </ToolbarButton>

          <ToolbarButton
            onClick={addAttachment}
          >
            <FaFileUpload />
          </ToolbarButton>
        </ToolbarGroup>

        <Separator />

        {/* Tables and Code */}
        <ToolbarGroup label="Code">
          <ToolbarButton
            onClick={insertTable}
          >
            <FaTable />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            disabled={!editor.can().chain().focus().toggleCode().run()}
          >
            <FaCode />
          </ToolbarButton>

          <div className="relative">
            <ToolbarButton
              onClick={(e) => {
                e?.stopPropagation();
                setShowLanguageSelector(!showLanguageSelector);
              }}
              isActive={editor.isActive('codeBlock') || showLanguageSelector}
            >
              <MdCode />
              {editor.isActive('codeBlock') && (
                <span className="text-xs ml-1 font-mono">
                  {getCurrentCodeLanguage()}
                </span>
              )}
              <span className="text-xs ml-1">▼</span>
            </ToolbarButton>
            
            {showLanguageSelector && (
              <div 
                className={`
                  absolute top-full left-0 mt-2 z-50 w-64 dropdown-content
                  ${darkMode 
                    ? 'bg-gray-800/95 border-gray-600/50' 
                    : 'bg-white/95 border-gray-200/60'
                  } 
                  border rounded-xl shadow-2xl backdrop-blur-xl
                  max-h-64 overflow-y-auto
                `}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`
                  px-4 py-3 border-b rounded-t-xl
                  ${darkMode 
                    ? 'border-gray-600/50 bg-gray-700/50 text-gray-200' 
                    : 'border-gray-200/60 bg-gray-50/50 text-gray-700'
                  } 
                  text-sm font-semibold
                `}>
                  <div className="flex items-center gap-2">
                    <MdCode className="text-blue-500" />
                    Programming Languages
                  </div>
                </div>
                <div className="p-2 ">
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => setCodeBlockLanguage(lang.value)}
                      className={`
                        w-full px-3 py-2 text-left text-sm rounded-lg mb-1
                        transition-all duration-150 flex items-center gap-2
                        ${darkMode 
                          ? 'text-gray-200 hover:bg-gray-700/60 hover:text-white hover:shadow-md' 
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900 hover:shadow-md'
                        }
                        last:mb-0 group
                      `}
                    >
                      <span className={`
                        w-2 h-2 rounded-full transition-colors
                        ${darkMode ? 'bg-gray-600 group-hover:bg-blue-400' : 'bg-gray-300 group-hover:bg-blue-500'}
                      `}></span>
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <ToolbarButton
            onClick={pasteHtmlTemplate}
          >
            <FaFileCode />
          </ToolbarButton>
        </ToolbarGroup>

        <Separator />

        {/* Actions */}
        <ToolbarGroup label="Actions">
          <ToolbarButton
            onClick={toggleHtmlView}
            isActive={showHtmlView}
          >
            {showHtmlView ? <FaEyeSlash /> : <FaEye />}
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <FaUndo />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <FaRedo />
          </ToolbarButton>
        </ToolbarGroup>
      </div>

      {/* Table Tools (show when table is selected) */}
      {editor.isActive('table') && (
        <div className={`
          border-t pt-3 mt-3
          ${darkMode ? 'border-gray-700/50' : 'border-gray-200/60'}
        `}>
          <div className="flex items-center gap-2 mb-3">
            <FaTable className="text-blue-500" />
            <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Table Tools
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              disabled={!editor.can().addColumnBefore()}
              className={`
                px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-200
                ${darkMode 
                  ? 'bg-gray-700/60 text-gray-200 hover:bg-gray-600 hover:shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                } 
                disabled:opacity-40 disabled:cursor-not-allowed
                border ${darkMode ? 'border-gray-600/50' : 'border-gray-200/60'}
              `}
            >
              + Col Before
            </button>
            <button
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              disabled={!editor.can().addColumnAfter()}
              className={`
                px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-200
                ${darkMode 
                  ? 'bg-gray-700/60 text-gray-200 hover:bg-gray-600 hover:shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                } 
                disabled:opacity-40 disabled:cursor-not-allowed
                border ${darkMode ? 'border-gray-600/50' : 'border-gray-200/60'}
              `}
            >
              + Col After
            </button>
            <button
              onClick={() => editor.chain().focus().deleteColumn().run()}
              disabled={!editor.can().deleteColumn()}
              className={`
                px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-200
                bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25
                disabled:opacity-40 disabled:cursor-not-allowed
                border border-red-400/50
              `}
            >
              Delete Col
            </button>
            <button
              onClick={() => editor.chain().focus().addRowBefore().run()}
              disabled={!editor.can().addRowBefore()}
              className={`
                px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-200
                ${darkMode 
                  ? 'bg-gray-700/60 text-gray-200 hover:bg-gray-600 hover:shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                } 
                disabled:opacity-40 disabled:cursor-not-allowed
                border ${darkMode ? 'border-gray-600/50' : 'border-gray-200/60'}
              `}
            >
              + Row Before
            </button>
            <button
              onClick={() => editor.chain().focus().addRowAfter().run()}
              disabled={!editor.can().addRowAfter()}
              className={`
                px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-200
                ${darkMode 
                  ? 'bg-gray-700/60 text-gray-200 hover:bg-gray-600 hover:shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                } 
                disabled:opacity-40 disabled:cursor-not-allowed
                border ${darkMode ? 'border-gray-600/50' : 'border-gray-200/60'}
              `}
            >
              + Row After
            </button>
            <button
              onClick={() => editor.chain().focus().deleteRow().run()}
              disabled={!editor.can().deleteRow()}
              className={`
                px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-200
                bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25
                disabled:opacity-40 disabled:cursor-not-allowed
                border border-red-400/50
              `}
            >
              Delete Row
            </button>
            <button
              onClick={() => editor.chain().focus().deleteTable().run()}
              disabled={!editor.can().deleteTable()}
              className={`
                px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-200
                bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/25
                disabled:opacity-40 disabled:cursor-not-allowed
                border border-red-500/50
              `}
            >
              Delete Table
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        ref={imageFileRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={attachmentFileRef}
        type="file"
        onChange={handleFileAttachment}
        className="hidden"
      />
    </div>
  );

  return (
    <div className={`
      border rounded-lg overflow-hidden shadow-md 
      ${darkMode 
        ? 'border-gray-700/50 bg-gray-800/40 backdrop-blur-lg' 
        : 'border-gray-200/60 bg-white/80 backdrop-blur-lg'
      }
    `}>
      <MenuBar />
      
      {showHtmlView ? (
        <div className="relative">
          <textarea
            value={editor.getHTML()}
            onChange={(e) => {
              editor.commands.setContent(e.target.value);
              handleEditorChange(e.target.value);
            }}
            className={`
              w-full min-h-[150px] max-h-[350px] p-4 font-mono text-sm 
              border-0 focus:outline-none resize-none
              ${darkMode 
                ? 'bg-gray-900/50 text-gray-100 placeholder-gray-400' 
                : 'bg-gray-50/50 text-gray-900 placeholder-gray-500'
              }
            `}
            placeholder="Enter HTML content..."
          />
          <div className={`
            absolute top-4 right-4 px-3 py-1.5 rounded-lg text-xs font-semibold
            ${darkMode 
              ? 'bg-gray-700/80 text-gray-300 border border-gray-600/50' 
              : 'bg-gray-100/80 text-gray-600 border border-gray-200/60'
            }
            backdrop-blur-sm
          `}>
            HTML Source
          </div>
        </div>
      ) : (
        <div className={`
          ${darkMode ? 'prose-invert' : ''} 
          min-h-[150px] max-h-[350px] overflow-y-auto
        `}>
          <EditorContent editor={editor} />
        </div>
      )}

      {/* URL Modal */}
      <Modal isOpen={showUrlModal} onClose={() => setShowUrlModal(false)}>
        <div className={`
          ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}
          border rounded-xl p-6 w-96 max-w-[90vw] shadow-2xl modal-content
        `}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Add Image URL
          </h3>
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className={`
              w-full px-3 py-2 rounded-lg border text-sm
              ${darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            `}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUrlSubmit();
              if (e.key === 'Escape') setShowUrlModal(false);
            }}
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              className="
                flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                text-sm font-medium
              "
            >
              <FaCheck className="inline mr-2" />
              Add Image
            </button>
            <button
              onClick={() => setShowUrlModal(false)}
              className={`
                px-4 py-2 rounded-lg border text-sm font-medium transition-colors
                ${darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <FaTimes className="inline mr-2" />
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* HTML Modal */}
      <Modal isOpen={showHtmlModal} onClose={() => setShowHtmlModal(false)}>
        <div className={`
          ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}
          border rounded-xl p-6 w-[600px] max-w-[90vw] shadow-2xl modal-content
        `}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Insert HTML Content
          </h3>
          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            placeholder="<div>Your HTML content here...</div>"
            rows={10}
            className={`
              w-full px-3 py-2 rounded-lg border text-sm font-mono
              ${darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              resize-none
            `}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Escape') setShowHtmlModal(false);
            }}
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleHtmlSubmit}
              disabled={!htmlInput.trim()}
              className="
                flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                text-sm font-medium
              "
            >
              <FaCheck className="inline mr-2" />
              Insert HTML
            </button>
            <button
              onClick={() => setShowHtmlModal(false)}
              className={`
                px-4 py-2 rounded-lg border text-sm font-medium transition-colors
                ${darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <FaTimes className="inline mr-2" />
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export { TiptapEditor };